from fastapi import APIRouter
from . import category
from . import product
from . import portfolio
from . import partner
from . import auth
from . import user
from . import upload

# 1. 모든 라우터를 하나로 묶을 '거대한 대장 라우터'를 하나 만든다 
# 나중에 api/v1/categories 처럼 버전 관리를 하기 위해 /api/v1을 붙여두면 좋다.
api_router = APIRouter(prefix="/api/v1")

# 2. 대장 라우터 밑에 부하 라우터(카테고리 등) 들을 전부 소속시킨다.
api_router.include_router(category.router)
api_router.include_router(product.router)
api_router.include_router(portfolio.router)
api_router.include_router(partner.router)
api_router.include_router(auth.router)
api_router.include_router(user.router)
api_router.include_router(upload.router)