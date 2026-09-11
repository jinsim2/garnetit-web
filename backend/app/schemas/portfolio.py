from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

# 1. Base 스키마(공통 속성)
# 쓰기(Create), 수정(Update), 읽기(Response) 모두에서 공통으로 쓰는 뼈대이다.
class PortfolioBase(BaseModel):
    title: str
    category_id: Optional[int] = None
    client_name: Optional[str] = None
    completion_date: Optional[date] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    
# 2. Create 스키마(데이터를 생성할 때 쓰는 입구 필터)
# portfolioBase의 모든 속성을 그대로 물려받는다.(상속)
# 생성할 때는 id값이 아직 없으므로 Base를 그대로 쓴다.
class PortfolioCreate(PortfolioBase):
    pass

# 3. Update 스키마(데이터를 수정할 때 쓰는 입구 필터)
# 수정할 때는 제목만 바꿀 수도 있고, 이미지만 바꿀 수도 있으므로 모든 속성이 Optional이어야 한다.
class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[int] = None
    client_name: Optional[str] = None
    completion_date: Optional[date] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None

# 4. Response 스키마(프론트엔드로 내보낼 때 쓰는 출구 필터)
# Base의 속성들에 추가로 DB가 자동으로 만들어준 'id'를 포함해서 내보낸다.
class PortfolioResponse(PortfolioBase):
    id: int

    # SQLAlchemy 모델(DB 객체)을 Pydantic 모델로 변환할 수 있게 허락해주는 필수 설정이다.
    model_config = ConfigDict(from_attributes=True)


