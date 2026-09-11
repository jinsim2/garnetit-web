from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str

    # 보안 관련 설정
    SECRET_KEY: str  #JWT 만들 때 쓰는 비밀 열쇠
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 토큰 유효기간 (하루)

    class Config:
        env_file = ".env"

# 설정값을 담은 객체 생성 (앞으로 다른 파일에서 이 settings를 불러다 씁니다)
settings = Settings()
