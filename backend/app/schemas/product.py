from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class ProductBase(BaseModel):
    category_id: int
    name: str
    model_number: Optional[str] = None
    certification: Optional[str] = None
    procurement_code: Optional[str] = None
    description: Optional[str] = None
    specs: Optional[List[Dict[str, str]]] = None  # "라벨과 값이 들어간 딕셔너리의 배열"을 허용!
    features: Optional[List[Dict[str, str]]] = None  # "아이콘, 제목, 설명이 들어간 딕셔너리의 배열"을 허용!
    image_url: Optional[str] = None
    catalog_url: Optional[str] = None
    is_visible: Optional[bool] = True

    # [추가됨] 관리자 맘대로 정할 수 있는 우선순위 번호!
    display_order: Optional[int] = 0
    
class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None    

    class Config:
        from_attributes = True