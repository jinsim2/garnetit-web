from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 1. 새 자료 등록 요청 규격 (관리자용)
class DownloadCreate(BaseModel):
    title: str
    category: str                               # 카탈로그, 매뉴얼, 소프트웨어, 드라이버, 기술문서 등
    description: Optional[str] = None
    file_url: str                               # 업로드된 파일 경로 (/uploads/xxxx.pdf)
    file_name: str                              # 원본 파일명 (axgate_catalog.pdf)
    file_size: str                              # 파일 용량 표시 (15.2 MB)
    file_ext: str                               # 확장자 대문자 (PDF, ZIP, EXE 등)
    is_published: bool = True

# 2. 자료 정보 수정 요청 규격 (관리자용)
class DownloadUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[str] = None
    file_ext: Optional[str] = None
    is_published: Optional[bool] = None

# 3. 자료 응답 규격 (목록 및 상세 조회용)
class DownloadResponse(BaseModel):
    id: int
    title: str
    category: str
    description: Optional[str] = None
    file_url: str
    file_name: str
    file_size: str
    file_ext: str
    download_count: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True
