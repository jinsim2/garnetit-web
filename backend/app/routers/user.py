from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User, RoleEnum
from app.schemas.user import UserResponse, UserCreate
from app.core.security import get_password_hash

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
