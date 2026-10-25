from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Faq(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, default="기타") # 제품/기술, 도입/견적, 유지보수, 구매/계약, 기타
    question = Column(String, nullable=False)                 # 질문 내용
    answer = Column(Text, nullable=False)                     # 답변 내용 (줄바꿈 지원)
    sort_order = Column(Integer, default=0)                   # 노출 순서 (낮을수록 상단 노출)
    is_published = Column(Boolean, default=True)              # 공개 여부
    created_at = Column(DateTime(timezone=True), server_default=func.now())
