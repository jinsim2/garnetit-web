"""upgrade_inquiry_table.py

Revision ID: c6dc629bf927
Revises: 0f92f203ed9b
Create Date: 2026-10-19 00:44:21.604792

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c6dc629bf927'
down_revision: Union[str, Sequence[str], None] = '0f92f203ed9b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. company_name 컬럼 추가 (기존 행을 위해 기본값 빈 문자열 처리)
    op.add_column('inquiries', sa.Column('company_name', sa.String(), nullable=False, server_default=''))
    
    # 2. 혹시 phone에 NULL이 있던 행이 있다면 빈 문자열로 보정 후 NOT NULL로 강화
    op.execute("UPDATE inquiries SET phone = '' WHERE phone IS NULL")
    op.alter_column('inquiries', 'phone', existing_type=sa.String(), nullable=False)
    
    # 3. subject 컬럼을 NULL 허용으로 완화
    op.alter_column('inquiries', 'subject', existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    # 롤백 로직
    op.alter_column('inquiries', 'subject', existing_type=sa.String(), nullable=False)
    op.alter_column('inquiries', 'phone', existing_type=sa.String(), nullable=True)
    op.drop_column('inquiries', 'company_name')

