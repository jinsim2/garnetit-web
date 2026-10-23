from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_active_user
from app.models.notice import Notice
from app.models.user import User
from app.schemas.notice import NoticeCreate, NoticeUpdate, NoticeResponse

router = APIRouter(
    prefix="/notices",
    tags=["notices"],
)


# 💡 [공개 API] 1. 공지사항 목록 조회 (상단고정 우선 -> 최신순 정렬)
# 지난번 슬래시 이슈 방지를 위해 ""와 "/" 모두 등록!
@router.get("", response_model=List[NoticeResponse], include_in_schema=False)
@router.get("/", response_model=List[NoticeResponse])
def get_notices(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    공지사항 목록을 조회합니다.
    - is_pinned(상단 고정)가 True인 공지가 맨 위에 먼저 오고, 그 다음 최신 등록순으로 정렬됩니다.
    - search 파라미터가 있으면 제목이나 내용에서 검색합니다.
    """
    query = db.query(Notice).filter(Notice.is_published == True)

    if search:
        query = query.filter(
            (Notice.title.ilike(f"%{search}%")) | (Notice.content.ilike(f"%{search}%"))
        )

    # 상단고정(내림차순 True 먼저) -> 등록일(최신순 내림차순)
    notices = query.order_by(desc(Notice.is_pinned), desc(Notice.created_at)).offset(skip).limit(limit).all()
    return notices


# 💡 [공개 API] 2. 공지사항 단건 상세 조회 (조회할 때마다 조회수 view_count + 1)
@router.get("/{notice_id}", response_model=NoticeResponse)
def get_notice(
    notice_id: int,
    db: Session = Depends(get_db)
):
    notice = db.query(Notice).filter(Notice.id == notice_id, Notice.is_published == True).first()
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 공지사항을 찾을 수 없습니다."
        )

    # 조회수 1 증가
    notice.view_count += 1
    db.commit()
    db.refresh(notice)
    return notice


# 🔒 [관리자 전용] 3. 새 공지사항 등록
@router.post("", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
def create_notice(
    notice_in: NoticeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    new_notice = Notice(
        title=notice_in.title,
        content=notice_in.content,
        is_pinned=notice_in.is_pinned,
        is_published=notice_in.is_published,
    )
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    return new_notice


# 🔒 [관리자 전용] 4. 공지사항 수정
@router.put("/{notice_id}", response_model=NoticeResponse)
def update_notice(
    notice_id: int,
    notice_in: NoticeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="수정할 공지사항을 찾을 수 없습니다."
        )

    # 전달된 필드만 업데이트
    update_data = notice_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notice, field, value)

    db.commit()
    db.refresh(notice)
    return notice


# 🔒 [관리자 전용] 5. 공지사항 삭제
@router.delete("/{notice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notice(
    notice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="삭제할 공지사항을 찾을 수 없습니다."
        )

    db.delete(notice)
    db.commit()
    return None
