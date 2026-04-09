from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.place import PlaceReadList
from app.services.place_service import get_place, list_places

router = APIRouter(prefix="/places", tags=["places"])


@router.get("", response_model=list[PlaceReadList])
def get_places(db: Session = Depends(get_db)) -> list[PlaceReadList]:
    return list_places(db)


@router.get("/{place_id}", response_model=PlaceReadList)
def get_place_by_id(place_id: int, db: Session = Depends(get_db)) -> PlaceReadList:
    place = get_place(db, place_id)
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    return place
