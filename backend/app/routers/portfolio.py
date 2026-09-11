from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse

# 인증 검문소(get_current_user)를 불러온다.
from app.dependencies.auth import get_current_active_user
from app.models.user import User  # 유저 타입 힌트용

# 1. 라우터 객체 생성(이 파일의 대장이다.)
# prefix를 "/portfolios"로 주면 아래 함수들은 전부 자동으로 /portfolios/~ 로 시작하게 된다.
router = APIRouter(
    prefix="/portfolios",
    tags=["portfolios"],
)

# [C] 1. 생성(Create)
# 현재 로그인한 사용자(current_user)가 누구인지도 파라미터로 받아오므로 이 API는 로그인해서 토큰을 가진 사람만 쓸 수 있다.
@router.post("/", response_model=PortfolioResponse)
def create_portfolio(portfolio: PortfolioCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # 프론트가 보낸 Pydantic 스키마(portfolio)를 딕셔너리로 푼 뒤(model_dump),
    # 다시 DB 모델(Portfolio)에 쏙 집어넣는다. (**기호가 그 역할을 한다)
    db_portfolio = Portfolio(**portfolio.model_dump())
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

# [R] 2. 전체 목록 조회(Read All)
@router.get("/", response_model=List[PortfolioResponse])
def read_portfolios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Portfolio).offset(skip).limit(limit).all()

# [R] 3. 단일 상세 조회(Read One)
@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def read_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    db_portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="포트폴리오를 찾을 수 없습니다.")
    return db_portfolio


# [U] 4. 수정(Update)
@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(portfolio_id: int, portfolio: PortfolioUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="포트폴리오를 찾을 수 없습니다.")

    # exclude_unset = True
    # 사용자가 제목만 바꾸만 싶어서 제목만 보냈을 때, 나머지 값들이 None으로 덮어씌워지는 대참사를 막는다.
    # 딱 '사용자가 명시적으로 보낸 값'만 추려낸다.
    update_data = portfolio.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        # db_portfolio.title = value 처럼 하나씩 강제로 씌워넣는다.
        setattr(db_portfolio, key, value)

    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

# [D] 5. 삭제(Delete)
@router.delete("/{portfolio_id}")
def delete_portfolio(portfolio_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="포트폴리오를 찾을 수 없습니다.")

    db.delete(db_portfolio)
    db.commit()
    return {"message": "Portfolio deleted successfully"}
    

