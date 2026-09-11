from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

import sys
import os

# 1. 파이썬이 backend 폴더를 기준점으로 잡도록 경로를 강제 추가한다.
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# 2. 만든 6개의 모델(설계도)과 DB 비밀번호(환경변수)를 불러온다.
from app.database import Base
from app.models import *
from app.config import settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# 3. alembic.ini 안에 비어 있는 DB 주소를 안전한 주소로 덮어씌운다.
# (configparser가 %기호를 특수명령어로 오해하지 않도록 %%로 바꿔서 전달한다!)
safe_url = settings.DATABASE_URL.replace("%", "%%")
config.set_main_option("sqlalchemy.url", safe_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 4. Alembic이 만든 모델(Base)을 밤낮으로 감시하게 만든다.
# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
