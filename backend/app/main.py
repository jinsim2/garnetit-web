# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware    # CORS 설정을 위한 도구 불러오기
from fastapi.staticfiles import StaticFiles
import os
from app.database import engine, Base
from app.models import *  # __init__.py 덕분에 폴더 안의 모든 모델을 한 번에 불러온다.

# 각각의 파일(category) 대신, 대장 라우터(api_router)를 불러온다.
from app.routers import api_router

# DB에 테이블을 쾅! 찍어내는 명령어
# Base.metadata.create_all(bind=engine)

# FastAPI 앱 객체 생성
app = FastAPI(
    title="가넷정보기술 API",
    description="가넷정보기술 홈페이지 리뉴얼을 위한 벡엔드 API입니다.",
    version="1.0.0"
)

# CORS(Cross-Origin Resource Sharing) 설정
# 현재는 (Next.js) 프론트엔드(localhost:3000)와 (FastAPI) 백엔드(localhost:8000)가 
# 서로 다른 주소에서 통신하기 때문에 보안 정책상 차단된다.
# 이 설정을 통해 프론트엔드에서 백엔드로 요청을 보내는 것을 허용한다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 허용할 프론트엔드 주소
    allow_credentials=True,                  # 인증정보(쿠키, 토큰) 허용
    allow_methods=["*"],                   # GET, POST, PUT, DELETE 등 모든 메소드 허용
    allow_headers=["*"],                   # Content-Type, Authorization 등 헤더 허용
)

# 업로드된 파일을 외부(프론트엔드)에서 접근할 수 있도록 폴더를 개방
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# URL 경로 "/uploads"로 요쳥이 오면, 실제 로컬의 "uploads" 폴더를 뒤져서 파일을 내어준다.
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 대장 라우터 하나만 찰칵! 연결하면 끝난다.
app.include_router(api_router)

# 루트 URL 접속 시 인사말 반환
@app.get("/")
def read_root():
    return {"message": "가넷정보기술 백엔드 API 서버가 정상동작 중 입니다!"}