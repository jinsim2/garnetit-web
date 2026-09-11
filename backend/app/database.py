from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# PostgreSQL 접속 URL 
# docker-compose.yml 에 적어둔 아이디, 비밀번호, DB이름이 그대로 들어간다.
# 형식: postgresql://사용자명:비밀번호@주소:포트/DB이름
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# 1. 엔진 생성 (실제 데이터베이스와의 통신 회선을 유지한다.)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 2. 세션 생성기 (데이터를 넣거나 뺄 때마다 이 세션을 꺼내서 사용하게 된다.)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. 모델 베이스 클래스 (앞으로 만들 회원, 게시글, 제품 등의 테이블은 모두 이 클래스를 상속받는다.)
Base = declarative_base()