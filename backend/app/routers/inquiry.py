from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

# DB 의존성 및 인증 검문소
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_active_user

# DB 모델 및 유저 모델
from app.models.inquiry import Inquiry
from app.models.user import User

# Pydantic 스키마
from app.schemas.inquiry import InquiryCreate, InquiryUpdate, InquiryResponse

# 디스코드 알림 함수 import
from app.services.discord import send_discord_inquiry_notification

# 라우터 객체 생성 (prefix: /inquiries)
router = APIRouter(
    prefix="/inquiries",
    tags=["inquiries"],
)


# 💡 [공개 API] 1. 고객 문의 접수 (로그인 불필요, 누구나 가능)
@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_inquiry(
    inquiry_in: InquiryCreate,
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    """
    홈페이지 방문 고객이 온라인 문의 폼을 제출할 때 호출되는 API입니다.
    """
    new_inquiry = Inquiry(
        company_name=inquiry_in.company_name,
        author_name=inquiry_in.author_name,
        phone=inquiry_in.phone,
        email=inquiry_in.email,
        message=inquiry_in.message,
        subject=inquiry_in.subject,
        is_resolved=False  # 신규 문의는 기본적으로 '미처리' 상태
    )
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)

    # 🚀 DB 저장이 완료된 후, 백그라운드에서 디스코드 알림 즉시 발송!
    background_tasks.add_task(send_discord_inquiry_notification, new_inquiry)

    return new_inquiry


# 🔒 [관리자 전용] 2. 문의 내역 전체 목록 조회 (최신순 정렬, 필터링 지원)
@router.get("", response_model=List[InquiryResponse], include_in_schema=False)
@router.get("/", response_model=List[InquiryResponse])
def get_inquiries(
    skip: int = 0,
    limit: int = 100,
    is_resolved: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    관리자 대시보드에서 문의 목록을 최신순으로 조회합니다.
    - is_resolved=false 이면 미처리 문의만 필터링
    - is_resolved=true 이면 처리완료 문의만 필터링
    """
    query = db.query(Inquiry)
    
    # 처리 상태 필터가 들어온 경우 적용
    if is_resolved is not None:
        query = query.filter(Inquiry.is_resolved == is_resolved)
        
    # 최신 등록일순(내림차순) 정렬 및 페이징
    inquiries = query.order_by(desc(Inquiry.created_at)).offset(skip).limit(limit).all()
    return inquiries


# 🔒 [관리자 전용] 3. 문의 단건 상세 조회
@router.get("/{inquiry_id}", response_model=InquiryResponse)
def get_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    특정 문의의 상세 내용을 조회합니다.
    """
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="해당 문의 내역을 찾을 수 없습니다."
        )
    return inquiry


# 🔒 [관리자 전용] 4. 문의 처리 상태 토글 (미처리 ↔ 처리완료)
@router.patch("/{inquiry_id}/resolve", response_model=InquiryResponse)
def toggle_inquiry_resolved(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    관리자가 문의 확인 후 처리 상태를 변경할 때 호출합니다.
    """
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="해당 문의 내역을 찾을 수 없습니다."
        )
    
    # 상태 반전 (False -> True 또는 True -> False)
    inquiry.is_resolved = not inquiry.is_resolved
    db.commit()
    db.refresh(inquiry)
    return inquiry


# 🔒 [관리자 전용] 5. 스팸 또는 불필요한 문의 삭제
@router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    스팸성 광고 문의 등을 영구 삭제합니다.
    """
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="해당 문의 내역을 찾을 수 없습니다."
        )
    
    db.delete(inquiry)
    db.commit()
    return None
