from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Boolean, DateTime
from sqlalchemy.sql import func # DB 자체의 시간을 가져오기 위해 추가
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String, nullable=False)
    model_number = Column(String)
    certification = Column(String)
    procurement_code = Column(String)
    description = Column(Text)
    specs = Column(JSON) # JSON으로 뺀 유연한 데이터!
    features = Column(JSON) # 핵심 특징 3~4줄 (배열 형태)
    image_url = Column(String)
    catalog_url = Column(String) # 카탈로그 PDF 경로
    is_visible = Column(Boolean, default=True) # 이 제품을 웹에 노출할지 말지 결정(T/F)

    # [추가됨] 프론트 화면 노출 정렬 순서(숫자가 클수록, 혹은 작을수록 우선순위)
    display_order = Column(Integer, default=0)

    # [시간 관리 필드 추가]
    # 데이터가 처음 생길 때 현재 시간을 자동 기록
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 논리적 삭제를 위한 스위치 (기본값은 False, 빠른 검색을 위해 index=True)
    is_deleted = Column(Boolean, default=False, index=True)

    # 데이터가 수정될 때마다 현재 시간을 자동 기록
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())    
    
    category = relationship("Category")
