from pydantic import BaseModel
from typing import Optional
from app.models.category import CategoryTypeEnum

# 1. 카테고리를 '생성(Create)'할 때 프론트엔드가 꼭 보내줘야 하는 데이터
class CategoryCreate(BaseModel):
    name: str
    type: CategoryTypeEnum
    soft_order: Optional[int] = 0
    slug: Optional[str] = None
    is_visible: Optional[bool] = True

# 2. 백엔드가 프론트엔드에게 '응답(Read)'해 줄 때 내보내는 데이터 모양
class CategoryResponse(CategoryCreate):
    id: int

    class Config:
        from_attributes = True # ORM 모델을 JSON으로 자동 변환해 줍니다!
