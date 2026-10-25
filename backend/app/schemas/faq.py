from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 1. 새 FAQ 등록 요청 규격 (관리자용)
class FaqCreate(BaseModel):
    category: str = "기타"
    question: str
    answer: str
    sort_order: int = 0
    is_published: bool = True

# 2. FAQ 수정 요청 규격 (관리자용)
class FaqUpdate(BaseModel):
    category: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None

# 3. FAQ 응답 규격 (목록 및 상세 조회용)
class FaqResponse(BaseModel):
    id: int
    category: str
    question: str
    answer: str
    sort_order: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True
