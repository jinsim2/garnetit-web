from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User, RoleEnum
from app.schemas.user import UserResponse, UserCreate, UserUpdate, UserPasswordChange
from app.core.security import get_password_hash, verify_password

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

# 1. 내 정보 조회 (프론트엔드에서 로그인 유지 여부 확인 및 환영 메시지 띄울 때 필수!)
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    # 검문소를 무사히 통과한 내 정보(current_user)를 그대로 반환합니다.
    return current_user


# 2. 전체 관리자 목록 조회 (최고관리자 전용)
@router.get("", response_model=List[UserResponse], include_in_schema=False)
@router.get("/", response_model=List[UserResponse])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # 🚨 권한 검사: 에디터(사원)는 다른 사람의 계정 목록을 볼 수 없습니다.
    if current_user.role != RoleEnum.SUPERADMIN:
        raise HTTPException(status_code=403, detail="최고관리자만 접근할 수 있습니다.")
        
    users = db.query(User).offset(skip).limit(limit).all()
    return users


# 3. 새 관리자 계정 생성 (최고관리자 전용)
@router.post("", response_model=UserResponse, include_in_schema=False)
@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # 🚨 권한 검사: 에디터(사원)는 새 계정을 만들 수 없습니다.
    if current_user.role != RoleEnum.SUPERADMIN:
        raise HTTPException(status_code=403, detail="최고관리자만 새 계정을 생성할 수 있습니다.")
        
    # 이메일 중복 검사
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
        
    # 비밀번호 암호화 후 DB 저장
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        password=hashed_password,
        name=user.name,
        role=user.role,
        is_active=user.is_active
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 4. 내 비밀번호 변경 (로그인한 관리자 본인 전용)
@router.put("/me/password")
def change_my_password(
    password_data: UserPasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 1) 현재 비밀번호가 맞는지 검증
    if not verify_password(password_data.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="현재 비밀번호가 일치하지 않습니다.")

    # 2) 새 비밀번호 최소 길이 검사
    if len(password_data.new_password) < 4:
        raise HTTPException(status_code=400, detail="새 비밀번호는 최소 4자 이상이어야 합니다.")

    # 3) 새 비밀번호 해싱 후 저장
    current_user.password = get_password_hash(password_data.new_password)
    db.commit()
    return {"message": "비밀번호가 성공적으로 변경되었습니다."}


# 5. 특정 관리자 계정 정보 수정 (최고관리자 전용)
@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.SUPERADMIN:
        raise HTTPException(status_code=403, detail="최고관리자만 계정을 수정할 수 있습니다.")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="해당 관리자 계정을 찾을 수 없습니다.")

    # 🛡️ 안전장치: 본인 계정의 권한 강등이나 비활성화 방지
    if target_user.id == current_user.id:
        if user_update.role is not None and user_update.role != RoleEnum.SUPERADMIN:
            raise HTTPException(status_code=400, detail="본인 계정의 최고관리자 권한은 해제할 수 없습니다.")
        if user_update.is_active is False:
            raise HTTPException(status_code=400, detail="본인 계정을 스스로 비활성화할 수 없습니다.")

    # 전달된 값만 선택적으로 업데이트
    if user_update.name is not None:
        target_user.name = user_update.name
    if user_update.role is not None:
        target_user.role = user_update.role
    if user_update.is_active is not None:
        target_user.is_active = user_update.is_active
    if user_update.password:  # 빈 문자열이 아닐 때만 새 비밀번호로 해싱하여 변경
        target_user.password = get_password_hash(user_update.password)

    db.commit()
    db.refresh(target_user)
    return target_user


# 6. 관리자 계정 삭제 (최고관리자 전용)
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != RoleEnum.SUPERADMIN:
        raise HTTPException(status_code=403, detail="최고관리자만 계정을 삭제할 수 있습니다.")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="해당 관리자 계정을 찾을 수 없습니다.")

    # 🛡️ 안전장치: 자기 자신 삭제 방지
    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="현재 로그인 중인 본인 계정은 삭제할 수 없습니다.")

    db.delete(target_user)
    db.commit()
    return {"message": "관리자 계정이 삭제되었습니다."}