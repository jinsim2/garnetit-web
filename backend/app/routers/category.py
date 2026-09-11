from fastapi import HTTPException 
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models
from app.schemas import category as schemas

# 폴더구조로 바뀌었으므로 명확하게 경로를 적어줍니다.
from app.dependencies.db import get_db 

# 인증 검문소(get_current_user)를 불러온다.
from app.dependencies.auth import get_current_active_user
from app.models.user import User  # 유저 타입 힌트용

router = APIRouter(prefix="/categories", tags=["Categories"])

# 1. 카테고리 생성
@router.post("/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# 2. 모든 카테고리 목록 가져오기 (Read All)
# response_model에 List를 씌워서 "여러 개가 나갈 거다!" 라고 명시한다.
@router.get("/", response_model=List[schemas.CategoryResponse])
def read_categories(is_visible: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.Category)

    # 프론트엔드가 주소창에 ?is_visible=true 조건을 달아서 보내면 필터를 작동시킨다.
    # (조건이 없으면 관리자용이라고 판단하고 전부 다 보내준다.)
    if is_visible is not None:
        query = query.filter(models.Category.is_visible == is_visible)

    # DB에서 카테고리들을 꺼낼 때, soft_order 번호 순서대로 예쁘게 정렬해서 꺼낸다.
    categories = query.order_by(models.Category.soft_order.asc()).all()
    return categories

#3. 특정 카테고리 딱 1개만 가져오기 (Read One)
# URL에 /categories/1 처럼 번호가 들어오면, 그 번호(category_id)를 변수로 받는다.
@router.get("/{category_id}", response_model=schemas.CategoryResponse)
def read_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()

    # 만약 100번째처럼 없는 카테고리를 찾으면 404 에러를 던져준다.
    if category is None:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
    return category

# 4. 카테고리 수정하기(Update)
# 관리자가 체크박스를 끄거나, 이름을 바꿀 때 이 주소로 돌아온다.
@router.put("/{category_id}", response_model=schemas.CategoryResponse)
def update_category(category_id: int, category_update: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")

    # 프론트가 보낸 수정 데이터로 덮어씌운다.
    db_category.name = category_update.name
    db_category.type = category_update.type
    db_category.soft_order = category_update.soft_order
    db_category.slug = category_update.slug
    db_category.is_visible = category_update.is_visible  # 체크박시 제어용

    # DB에 저장하고 결과를 반환한다.
    db.commit()
    db.refresh(db_category)
    return db_category

# 5. 카테고리 완전 삭제하기(Hard Delete)
# 진짜로 DB에서 날려보리고 싶을 때 사용한다.
@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")

    db.delete(db_category)
    db.commit()
    return {"message": "카테고리가 성공적으로 삭제되었습니다."}