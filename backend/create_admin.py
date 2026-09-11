# backend/create_admin.py
from app.database import SessionLocal
from app.models.user import User, RoleEnum
from app.core.security import get_password_hash

def create_superadmin():
    db = SessionLocal()
    
    # 1. 이미 관리자가 있는지 이메일로 검사한다.
    admin = db.query(User).filter(User.email == "admin@garnetit.co.kr").first()
    if admin:
        print("✅ 이미 최고관리자 계정이 존재합니다!")
        db.close()
        return

    # 2. 비밀번호를 암호화 기계에 넣고 돌린다.
    hashed_pw = get_password_hash("Rkspt12#$")

    # 3. 새로운 유저(최고관리자) 객체를 만든다.
    new_admin = User(
        email="admin@garnetit.co.kr",
        password=hashed_pw,
        name="가넷 최고관리자",
        role=RoleEnum.SUPERADMIN,
        is_active=True
    )
    
    # 4. DB에 강제로 저장(Commit)한다.
    db.add(new_admin)
    db.commit()
    db.close()
    
    print("🎉 최고관리자 계정이 성공적으로 생성되었습니다!")
    print("👉 ID: admin@garnetit.co.kr")

if __name__ == "__main__":
    create_superadmin()
