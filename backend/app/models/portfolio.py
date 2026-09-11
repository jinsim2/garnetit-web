from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from app.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    title = Column(String, nullable=False)
    client_name = Column(String)
    completion_date = Column(Date)
    description = Column(Text)
    thumbnail_url = Column(String)
