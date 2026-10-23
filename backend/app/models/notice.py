from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)          # 공지사항 제목
    content = Column(Text, nullable=False)          # 공지사항 본문 내용
    is_pinned = Column(Boolean, default=False)      # 중요 공지 상단 고정 여부
    is_published = Column(Boolean, default=True)    # 공개/비공개 여부(기본 공개)
    view_count = Column(Integer, default=0)         # 조회수
    created_at = Column(DateTime(timezone=True), server_default=func.now())