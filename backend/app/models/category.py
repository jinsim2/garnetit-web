from sqlalchemy import Column, Integer, String, Enum, Boolean
import enum
from app.database import Base

class CategoryTypeEnum(str, enum.Enum):
    PRODUCT = "PRODUCT"
    BOARD = "BOARD"
    PORTFOLIO = "PORTFOLIO"

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(Enum(CategoryTypeEnum), nullable=False)
    soft_order = Column(Integer, default=0)
    slug = Column(String, unique=True, index=True)
    is_visible = Column(Boolean, default=True)
