from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.models.partner import Partner
from app.schemas.partner import PartnerCreate, PartnerUpdate, PartnerResponse

# 인증 검문소(get_current_user)를 불러온다.
from app.dependencies.auth import get_current_active_user
from app.models.user import User  # 유저 타입 힌트용

router = APIRouter(
    prefix="/partners",
    tags=["partners"],
)

# [C] Create 생성
@router.post("/", response_model=PartnerResponse)
def create_partner(partner: PartnerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_partner = Partner(**partner.model_dump())
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    return db_partner

# [R] 젠체 목록 조회(정렬 순서 적용)
@router.get("/", response_model=List[PartnerResponse])
def read_partners(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # 프론트엔드 띠 배너에서 보여질 때를 대비해 sort_order 기준으로 정렬해서 보낸다.
    return db.query(Partner).order_by(Partner.sort_order).offset(skip).limit(limit).all()

# [R] 단일 상세 조회
@router.get("/{partner_id}", response_model=PartnerResponse)
def read_partner(partner_id: int, db: Session = Depends(get_db)):
    db_partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if db_partner is None:
        raise HTTPException(status_code=404, detail="파트너를 찾을 수 없습니다.")
    return db_partner

# [U] 수정
@router.put("/{partner_id}", response_model=PartnerResponse)
def update_partner(partner_id: int, partner: PartnerUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if db_partner is None:
        raise HTTPException(status_code=404, detail="수정할 파트너사를 찾을 수 없습니다.")
    
    update_data = partner.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_partner, key, value)
    db.commit()
    db.refresh(db_partner)
    return db_partner

# [D] 삭제
@router.delete("/{partner_id}")
def delete_partner(partner_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if db_partner is None:
        raise HTTPException(status_code=404, detail="삭제할 파트너사를 찾을 수 없습니다.")
    db.delete(db_partner)
    db.commit()
    return {"message": "파트너사가 성공적으로 삭제되었습니다."}

       


