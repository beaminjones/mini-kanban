import uuid
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Column(Base):
    __tablename__ = "columns"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    position = Column(Integer, nullable=False, default=0)
    board_id = Column(String(36), ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)

    board = relationship("Board", back_populates="columns")
    cards = relationship("Card", back_populates="column", order_by="Card.position")
