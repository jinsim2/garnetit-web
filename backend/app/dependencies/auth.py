from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.config import settings
from app.models.user import User

# 이 코드가 바로 Swagger UI 우측 상단에 '자물쇠(Authorize)' 버튼을 만들어주는 마법의 선언이다!
# tokenurl은 우리가 방금 만든 로그인 API의 주소를 적어준다. (사용자가 로그인하여 토큰을 받아오는 API 주소)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# API 검문소 함수(프론트엔드가 토큰을 들고오면 여기서 뺏어서 검사한다.)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="토큰이 유효하지 않거나 만료되었ㅅ브니다. 다시 로그인 해 주세요.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 1. 뺏어온 토큰을 우리가 가진 SECRET_KEY로 풀어본다. (도큰 디코딩, 암호 해독)
        # security.py에서 만든 비밀키와 알고리즘으로 토큰을 푼다.
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        # 2. 토큰 안에 숨겨뒀던 이메일(sub)을 꺼낸다.
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

    except jwt.ExpiredSignatureError:
        # 토큰 유효기간(하루)이 지났을 때 던지는 에러
        raise credentials_exception

    except jwt.InvalidTokenError:
        # 토큰이 위조되었거나(변조), 서명이 일치하지 않을 때(가짜 토큰)
        raise credentials_exception


    # 3. 토큰에서 꺼낸 이메일로 DB에서 진짜 유저가 맞는지 한 번 더 확인한다.
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    # 4. 검사 통과! 누군지 확인한 유저 객체를 반환한다.
    return user

# 현재 사용자가 활성(is_active=True) 상태인지 확인
# 탈퇴한 회원이 토큰만 가지고 접근하는 것을 막음
def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="삭제된(비활성) 사용자입니다.")
    return current_user