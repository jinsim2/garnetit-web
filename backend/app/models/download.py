from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Download(Base):
    __tablename__ = "downloads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)              # 자료 제목 (예: 2026 통합 보안 솔루션 카탈로그)
    category = Column(String, nullable=False)           # 자료 분류 (카탈로그, 매뉴얼, 소프트웨어, 드라이버, 기술문서 등)
    description = Column(Text, nullable=True)           # 자료 상세 설명 (선택)
    file_url = Column(String, nullable=False)           # 실제 파일 경로 (/uploads/xxxx_file.pdf)
    file_name = Column(String, nullable=False)          # 고객에게 보여질 원본 파일명 (catalog.pdf)
    file_size = Column(String, nullable=False)          # 파일 용량 표시 (예: 15.2 MB)
    file_ext = Column(String, nullable=False)           # 확장자 뱃지 (PDF, ZIP, EXE 등)
    download_count = Column(Integer, default=0)         # 다운로드 횟수
    is_published = Column(Boolean, default=True)        # 공개 여부
    created_at = Column(DateTime(timezone=True), server_default=func.now())
