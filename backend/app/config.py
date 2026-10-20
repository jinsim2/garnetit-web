from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str

    # 보안 관련 설정
    SECRET_KEY: str  #JWT 만들 때 쓰는 비밀 열쇠
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 토큰 유효기간 (하루)

    # 디스코드 웹훅 URL (설정하지 않아도 서버가 죽지 않도록 Optional[str] = None 처리)
    DISCORD_WEBHOOK_URL: Optional[str] = None

    class Config:
        env_file = ".env"

# 설정값을 담은 객체 생성 (앞으로 다른 파일에서 이 settings를 불러다 씁니다)
settings = Settings()
