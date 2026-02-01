import uuid
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from app.database import Base


class Board(Base):
    __tablename__ = "boards"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)

    columns = relationship("Column", back_populates="board", order_by="Column.position", cascade="all, delete-orphan")
