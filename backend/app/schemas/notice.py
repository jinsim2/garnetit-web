from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 1. 공지사항 생성 요청 규격 (관리자 작성)
class NoticeCreate(BaseModel):
    title: str
    content: str
    is_pinned: bool = False
    is_published: bool = True

# 2. 공지사항 수정 요청 규격 (관리자 수정)
class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_published: Optional[bool] = None

# 3. 공지사항 응답 규격 (목록 및 상세 조회)
class NoticeResponse(BaseModel):
    id: int
    title: str
    content: str
    is_pinned: bool
    is_published: bool
    view_count: int
    created_at: datetime

    class Config:
        from_attributes = True
