# 이 폴더를 하나의 모델로 묶어주고, main.py가 테이블을 인식할수 있게 해준다.
# 모델을 추가할때마다 이 파일에 추가해줘야 한다.
# 앞에 있는 .user는 파일 이름(user.py)을 뜻하며, 뒤에 있는 User는 그 파일 안에서 꺼내올 클래스 이름을 뜻한다.
from .user import User
from .category import Category
from .product import Product
from .post import Post
from .portfolio import Portfolio
from .inquiry import Inquiry
from .partner import Partner
