from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_active_user
from app.models.download import Download
from app.models.user import User
from app.schemas.download import DownloadCreate, DownloadUpdate, DownloadResponse

router = APIRouter(
    prefix="/downloads",
    tags=["downloads"],
)


# 💡 [공개 API] 1. 자료실 목록 조회 (카테고리 필터 + 검색 + 최신순 정렬)
@router.get("", response_model=List[DownloadResponse], include_in_schema=False)
@router.get("/", response_model=List[DownloadResponse])
def get_downloads(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    자료실 목록을 조회합니다.
    - 공개 상태(is_published == True)인 자료만 노출됩니다.
    - category 필터(카탈로그, 매뉴얼 등) 및 검색어(search)를 지원합니다.
    """
    query = db.query(Download).filter(Download.is_published == True)

    # 카테고리 필터 (전체 선택이 아닌 특정 카테고리일 때)
    if category and category != "전체":
        query = query.filter(Download.category == category)

    # 검색어 필터 (제목 또는 설명)
    if search:
        query = query.filter(
            (Download.title.ilike(f"%{search}%")) | (Download.description.ilike(f"%{search}%"))
        )

    # 최신 등록순 정렬
    downloads = query.order_by(desc(Download.created_at)).offset(skip).limit(limit).all()
    return downloads


# 💡 [공개 API] 2. 자료 단건 상세 조회
@router.get("/{download_id}", response_model=DownloadResponse)
def get_download(
    download_id: int,
    db: Session = Depends(get_db)
):
    download = db.query(Download).filter(Download.id == download_id, Download.is_published == True).first()
    if not download:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 자료를 찾을 수 없습니다."
        )
    return download


# 💡 [공개 API] 3. 다운로드 수 카운트 증가 API (고객이 파일 다운로드 클릭 시 호출)
@router.post("/{download_id}/download", response_model=DownloadResponse)
def increase_download_count(
    download_id: int,
    db: Session = Depends(get_db)
):
    download = db.query(Download).filter(Download.id == download_id).first()
    if not download:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 자료를 찾을 수 없습니다."
        )

    download.download_count += 1
    db.commit()
    db.refresh(download)
    return download


# 🔒 [관리자 전용] 4. 새 자료 등록
@router.post("", response_model=DownloadResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=DownloadResponse, status_code=status.HTTP_201_CREATED)
def create_download(
    download_in: DownloadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    new_download = Download(
        title=download_in.title,
        category=download_in.category,
        description=download_in.description,
        file_url=download_in.file_url,
        file_name=download_in.file_name,
        file_size=download_in.file_size,
        file_ext=download_in.file_ext,
        is_published=download_in.is_published,
    )
    db.add(new_download)
    db.commit()
    db.refresh(new_download)
    return new_download


# 🔒 [관리자 전용] 5. 자료 정보 수정
@router.put("/{download_id}", response_model=DownloadResponse)
def update_download(
    download_id: int,
    download_in: DownloadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    download = db.query(Download).filter(Download.id == download_id).first()
    if not download:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="수정할 자료를 찾을 수 없습니다."
        )

    update_data = download_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(download, field, value)

    db.commit()
    db.refresh(download)
    return download


# 🔒 [관리자 전용] 6. 자료 삭제
@router.delete("/{download_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_download(
    download_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    download = db.query(Download).filter(Download.id == download_id).first()
    if not download:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="삭제할 자료를 찾을 수 없습니다."
        )

    db.delete(download)
    db.commit()
    return None
