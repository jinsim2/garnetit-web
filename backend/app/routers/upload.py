from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import shutil
import os
import uuid

from app.dependencies.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["upload"])

# 파일을 저장할 로컬 폴더 (backend/uploads)
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# 보안: 허용된 안전한 파일 확장자 목록(이미지 + 문서 + 압축파일)
ALLOWED_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".hwp", ".hwpx", ".txt",
    ".zip", ".7z", ".tar", ".gz"
}

@router.post("", include_in_schema=False)
@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user) # 로그인한 관리자만 업로드 허용!    
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="파일이 전송되지 않았습니다.")

    # 1. 경로 조직(Path Traversal) 방지를 위해 순수 파일명과 확장자만 추출
    safe_original_name = os.path.basename(file.filename)
    _, ext = os.path.splitext(safe_original_name)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"허용되지 않는 파일 형식({ext})입니다."
        )

    # 2. 파일 이름이 겹치지 않도록 UUID(난수)를 붙여준다. (예: 123e4567_logo.png)
    unique_filename = f"{uuid.uuid4()}_{safe_original_name}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 3. 파일을 로컬 폴더에 쓴다.
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. 프론트엔드가 이 파일을 열어볼 수 있는 URL을 반환한다.
    file_url = f"/uploads/{unique_filename}"

    return {"url": file_url}