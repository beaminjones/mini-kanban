from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.card import CardCreate, CardUpdate, CardResponse, CardMove
from app.services.card_service import CardService

router = APIRouter(tags=["cards"])


@router.post("/columns/{column_id}/cards", response_model=CardResponse)
def create_card(column_id: str, data: CardCreate, db: Session = Depends(get_db)):
    service = CardService(db)
    card = service.create_card(column_id, data)
    if not card:
        raise HTTPException(status_code=404, detail="Column not found")
    return card


@router.put("/cards/{card_id}", response_model=CardResponse)
def update_card(card_id: str, data: CardUpdate, db: Session = Depends(get_db)):
    service = CardService(db)
    card = service.update_card(card_id, data)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: str, db: Session = Depends(get_db)):
    service = CardService(db)
    if not service.delete_card(card_id):
        raise HTTPException(status_code=404, detail="Card not found")


@router.patch("/cards/{card_id}/move", response_model=CardResponse)
def move_card(card_id: str, data: CardMove, db: Session = Depends(get_db)):
    service = CardService(db)
    card = service.move_card(card_id, data)
    if not card:
        raise HTTPException(status_code=404, detail="Card or column not found, or invalid move")
    return card
