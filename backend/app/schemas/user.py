from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import RoleEnum

# 1. Base 스키마
class UserBase(BaseModel):
    email: EmailStr  # pydantic이 이메일 형식(abc@abc.com)인지 자동 검사해준다.
    name: str
    role: RoleEnum = RoleEnum.EDITOR
    is_active: bool = True


# 2. Create 스키마(관리자 생성 시)
class UserCreate(UserBase):
    password: str # 생성할 때는 비밀번호를 받는다. (나중에 서버에서 암호화를 한다.)

# 3. Response 스키마(프론트엔드로 정보를 내보낼 때)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    # 중요: Response 스키마에는 절대로 password 필드가 있으면 안 된다! (해킹 위험)

    model_config = ConfigDict(from_attributes=True) # (이건 일종의 약속이다. 나중에 "우리 이렇게 소통하기로 했어"라고 선언하는 것)

# 4. 로그인 성공 시 발급해 줄 Token 스키마
class Token(BaseModel):
    access_token: str
    token_type: str

# 5. Update 스키마 (최고관리자가 계정 정보를 수정할 때 - 원하는 항목만 보낼 수 있도록 Optional 처리)
class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None  # 비밀번호를 비워두면 기존 비밀번호 유지, 입력하면 새 비밀번호로 덮어쓰기

# 6. 내 비밀번호 변경 스키마 (본인 확인을 위해 현재 비밀번호 + 새 비밀번호 필수)
class UserPasswordChange(BaseModel):
    current_password: str
    new_password: str