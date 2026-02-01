import uuid
from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    position = Column(Integer, nullable=False, default=0)
    column_id = Column(String(36), ForeignKey("columns.id", ondelete="CASCADE"), nullable=False)

    column = relationship("Column", back_populates="cards")
