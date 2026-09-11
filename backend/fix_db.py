# backend/fix_db.py
from sqlalchemy import text
from app.database import engine

# DB에 직접 연결해서 현재 버전을 강제로 맞춥니다.
with engine.connect() as conn:
    conn.execute(text("UPDATE alembic_version SET version_num = 'c201a6aac772'"))
    conn.commit()
    
print("✨ DB 수술 성공! 알렘빅 버전이 정상화되었습니다.")
