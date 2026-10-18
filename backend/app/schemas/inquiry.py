from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# 1. 고객이 문의를 등록할 때 보내는 데이터 규격(모두 필수!)
class InquiryCreate(BaseModel):
    company_name: str         # 회사명 / 기관명 (필수)
    author_name: str          # 담당자 성함 (필수)
    phone: str                # 연락처 (필수)
    email: EmailStr           # 이메일 (형식 검증)
    message: str              # 문의 내용
    subject: Optional[str] = None  # 글 제목 (선택)

# 2. 관리자가 상태(답변 완료 여부)를 수정할 때 보내는 데이터 규격
class InquiryUpdate(BaseModel):
    is_resolved: Optional[bool] = None

# 3. 서버가 프론트엔드로 응답할 때 내보내는 데이터 규격(DB와 1:1 완벽 일치!)
class InquiryResponse(BaseModel):
    id: int
    company_name: str
    author_name: str
    phone: str
    email: str
    message: str
    subject: Optional[str] = None
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True
