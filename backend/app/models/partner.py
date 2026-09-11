from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Partner(Base):
    __tablename__ = 'partners'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # 파트너사 이름(예: Axgate)
    logo_url = Column(String, nullable=True)  # 로고 이미지 경로
    website_url = Column(String)  # 이동할 웹사이트 주소(옵션)
    is_visible = Column(Boolean, default=True)  # 화면에 보여줄지 말지 스위치!
    sort_order = Column(Integer, default=0)  # 정렬 순서(먼저 보여주고 싶은 로고)    
