from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt  # PyJMT 라이브러리
from passlib.context import CryptContext
from app.config import settings

# 1. 비밀번호 암호화 알고리즘 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. 비밀번호 확인 함수(로그인할 때: 사용자가 입력한 비밀번호와 DB의 암호화된 비밀번호를 비교)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 3. 비밀번호 해싱 함수(회원가입할 때: 입력받은 비밀번호를 암호화)
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)  # 비밀번호를 해시(암호화)하여 변환

# 4. 출입증(JWT 토큰) 발급 함수 (로그인 성공 시)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()

    # 토큰의 만료 시간(유효 기간을) 설정한다.
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta  # datetime.utcnow()는 구버전
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    # 토큰 데이터에 'exp'(만료시간) 항목을 몰래 끼워넣는다.
    to_encode.update({"exp": expire})

    # 비밀키를 가지고 HS256 알고리즘으로 데이터를 암호화(인코딩)하여 도장을 쾅! 찍어낸다.
    # SECRET_KEY로 서명하여 위변조를 방지한다.
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
