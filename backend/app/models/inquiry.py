from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Inquiry(Base):
    __tablename__ = "inquiries"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)  # 1. [신설] 회사명/기관명(필수)
    author_name = Column(String, nullable=False)   # 2. 담당자 성함(필수)
    email = Column(String, nullable=False)         # 3. 이메일(필수, 형식검증)
    phone = Column(String, nullable=False)         # 4. [변경] 연락처(선택)
    subject = Column(String, nullable=True)        # 5. [변경] 제목(선택, NULL 허용)
    message = Column(Text, nullable=False)         # 6. 문의내용(필수)
    is_resolved = Column(Boolean, default=False)   # 7. 처리 상태(미처리 기본)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
