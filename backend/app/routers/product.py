from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.schemas import product as schemas
from app.dependencies.db import get_db

# 인증 검문소(get_current_user)를 불러온다.
from app.dependencies.auth import get_current_active_user
from app.models.user import User  # 유저 타입 힌트용

router = APIRouter(prefix="/products", tags=["products"])

# 1. 제품 생성
@router.post("/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# 2. 제품 목록 다중 필터 조회
@router.get("/", response_model=List[schemas.ProductResponse])
def read_products(
    category_id: Optional[int] = None,
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # [수정] 무조건 "삭제되지 않은(is_deleted == False)" 데이터만 긁어온다.
    query = db.query(models.Product).filter(models.Product.is_deleted == False)

    # 1단계 필터: 특정 카테고리를 눌렀을 때
    if category_id is not None:
        query = query.filter(models.Product.category_id == category_id)

    # 2단계 필터: 검색어를 입력했을 때 (이름이나 모델명에 포함되어 있으면 다 찾아줌)
    if keyword:
        # ilike는 대소문자 구별 없이 포함된 글자를 다 찾아주는 마법의 키워드이다.
        query = query.filter(
            (models.Product.name.ilike(f"%{keyword}%")) | 
            (models.Product.model_number.ilike(f"%{keyword}%"))
        )

    # [추가됨] 3단계 정렬: 1순위(display_order 오름차순), 2순위(최신순 내림차순)
    query = query.order_by(
        models.Product.display_order.asc(),
        models.Product.id.desc()
    )
    
    return query.all()

# 3. 특정 제품 딱 1개를 상세 조회(상세 페이지용)
@router.get("/{product_id}", response_model=schemas.ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    
    # [수정] 특정 제품을 찾을 때도 "삭제되지 않은 것" 중에서만 찾는다.
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.is_deleted == False
    ).first()
    
    if product is None:
        raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")
    
    return product

# 4. 제품 수정하기
@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.is_deleted == False
    ).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")

    # Pydantic 테이터를 편하게 DB 모델에 덮어씌우는 파이썬 꿀팁
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product

# 5. 제품 삭제하기
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")

    # [수정] 레코드를 날려버리는 db.delete(db_product) 대신, 숨김 처리 스위치를 켜고 저장한다.
    db_product.is_deleted = True
    db.commit()
    return {"message": "제품이 성공적으로 삭제되었습니다."}