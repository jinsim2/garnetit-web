from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.database import Base

class RoleEnum(str, enum.Enum):
    SUPERADMIN = "SUPERADMIN"
    EDITOR = "EDITOR"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)  # 로그인 아이디로 쓸 이메일
    password = Column(String, nullable=False)  # 암호화된 비밀번호(절대 원본을 저장하지 않는다!)
    name = Column(String, nullable=False)  # 관리자 이름(예: 최고관리자)
    role = Column(Enum(RoleEnum), default=RoleEnum.EDITOR)  # 권한(SUPERADMIN = 모두 수정가능, EDITOR = 콘텐츠 수정만 가능)
    is_active = Column(Boolean, default=True)  # 계정 활성화 여부
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 계정 생성일
