"""add PORTFOLIO enum to category

Revision ID: fa69688e213b
Revises: c201a6aac772
Create Date: 2026-08-17 00:27:13.401933

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fa69688e213b'
down_revision: Union[str, Sequence[str], None] = 'c201a6aac772'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE categorytypeenum ADD VALUE 'PORTFOLIO'")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
