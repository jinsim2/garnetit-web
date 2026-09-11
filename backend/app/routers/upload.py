from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid

router = APIRouter(prefix="/upload", tags=["upload"])

# 파일을 저장할 로컬 폴더 (backend/uploads)
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="파일이 전송되지 않았습니다.")

    # 파일 이름이 겹치지 않도록 UUID(난수)를 붙여준다. (예: 123e4567_logo.png)
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 1. 파일을 로컬 폴더에 쓴다.
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. 프론트엔드가 이 파일을 열어볼 수 있는 URL을 반환한다.
    file_url = f"http://localhost:8000/uploads/{unique_filename}"

    return {"url": file_url}