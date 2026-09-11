from pydantic import BaseModel, ConfigDict
from typing import Optional

# 1.Base 스키마(공통 속성)
class PartnerBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    is_visible: Optional[bool] = True
    sort_order: Optional[int] = 0

# 2.Create 스키마(데이터를 생성할 때 쓰는 입구 필터)
# PartnerBase를 그대로 물려받는다.
class PartnerCreate(PartnerBase):
    pass

# 3.Update 스키마(데이터를 수정할 때 쓰는 입구 필터)
# 일부만 수정할 수 있도록 모든 속성을 Optional로 열어둔다.
class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    is_visible: Optional[bool] = None
    sort_order: Optional[int] = None

# 4.Response 스키마(프론트엔드로 내보낼 때 쓰는 출구 필터)
class PartnerResponse(PartnerBase):
    id: int

    # DB 객체를 Pydantic으로 바꿔주는 마법의 주문!
    model_config = ConfigDict(from_attributes=True)
