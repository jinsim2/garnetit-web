from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_active_user
from app.models.faq import Faq
from app.models.user import User
from app.schemas.faq import FaqCreate, FaqUpdate, FaqResponse

router = APIRouter(
    prefix="/faqs",
    tags=["faqs"],
)


# 💡 [공개 API] 1. FAQ 목록 조회 (정렬순서 우선 -> 최신순 정렬)
@router.get("", response_model=List[FaqResponse], include_in_schema=False)
@router.get("/", response_model=List[FaqResponse])
def get_faqs(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    include_unpublished: bool = False,
    db: Session = Depends(get_db)
):
    """
    FAQ 목록을 조회합니다.
    - 기본적으로 공개 상태(is_published == True)인 항목만 노출됩니다.
    - sort_order(오름차순) 우선, 그 다음 id(내림차순)으로 정렬됩니다.
    - category(제품/기술, 도입/견적 등) 및 search(질문/답변 검색어)를 지원합니다.
    - include_unpublished가 True이면 비공개 항목도 포함하여 반환합니다(관리자용).
    """
    query = db.query(Faq)

    # 공개 항목만 필터 (관리자가 전체 조회를 요청하지 않은 경우)
    if not include_unpublished:
        query = query.filter(Faq.is_published == True)

    # 카테고리 필터
    if category and category != "전체":
        query = query.filter(Faq.category == category)

    # 검색어 필터 (질문 또는 답변)
    if search:
        query = query.filter(
            (Faq.question.ilike(f"%{search}%")) | (Faq.answer.ilike(f"%{search}%"))
        )

    # 정렬: sort_order(낮은 번호 우선) -> id(최신 등록 우선)
    faqs = query.order_by(Faq.sort_order.asc(), desc(Faq.id)).offset(skip).limit(limit).all()
    return faqs


# 💡 [공개 API] 2. FAQ 단건 상세 조회
@router.get("/{faq_id}", response_model=FaqResponse)
def get_faq(
    faq_id: int,
    db: Session = Depends(get_db)
):
    faq = db.query(Faq).filter(Faq.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 FAQ 항목을 찾을 수 없습니다."
        )
    return faq


# 🔒 [관리자 전용] 3. 새 FAQ 등록
@router.post("", response_model=FaqResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=FaqResponse, status_code=status.HTTP_201_CREATED)
def create_faq(
    faq_in: FaqCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    new_faq = Faq(
        category=faq_in.category,
        question=faq_in.question,
        answer=faq_in.answer,
        sort_order=faq_in.sort_order,
        is_published=faq_in.is_published,
    )
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq


# 🔒 [관리자 전용] 4. FAQ 수정
@router.put("/{faq_id}", response_model=FaqResponse)
def update_faq(
    faq_id: int,
    faq_in: FaqUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    faq = db.query(Faq).filter(Faq.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="수정할 FAQ 항목을 찾을 수 없습니다."
        )

    update_data = faq_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faq, field, value)

    db.commit()
    db.refresh(faq)
    return faq


# 🔒 [관리자 전용] 5. FAQ 삭제
@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    faq = db.query(Faq).filter(Faq.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="삭제할 FAQ 항목을 찾을 수 없습니다."
        )

    db.delete(faq)
    db.commit()
    return None
