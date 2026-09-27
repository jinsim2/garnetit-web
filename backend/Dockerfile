# 파이썬 3.11 가벼운 버전 사용
FROM python:3.11-slim

WORKDIR /app

# PostgreSQL 연결에 필요한 리눅스 필수 부품 설치
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 패키지 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스코드 전체 복사
COPY . .

# 켜지자마자 alembic으로 DB 테이블부터 만들고, 그 다음 uvicorn 서버를 켜라!
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
