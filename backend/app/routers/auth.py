from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm  # 로그인 폼 자동 반환
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.schemas.user import Token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

# 로그인 API (프론트엔드에서 폼 데이터로 ID/PW를 쏴주면 여기서 받는다.)
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    # 1. DB에서 이메일(form_data.username)을 유저를 찾는다.
    # (OAuth2 규칙상 이메일 필드 이름이 무조건 'username'으로 고정되어 들어온다.)
    user = db.query(User).filter(User.email == form_data.username).first()

    # 2. 유저가 없거나, 비밀번호가 틀리면 에러를 던진다.
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 틀렸습니다.",
            headers={"WWW-Authenticate": "Bearer"},  # (이건 프론트엔드가 "인증 실패했다!"라는 걸 인식하게 해주는 기술적인 표시이다.)
        )

    # 3. 비밀번호가 맞다면 JWT 토큰을 찍어낸다.
    access_token = create_access_token(data={"sub": user.email})

    # 4. 프론트엔드로 토큰을 넘겨준다.
    return {"access_token": access_token, "token_type": "bearer"}


