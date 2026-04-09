from sqlalchemy.orm import Session

from app.database.models import Place
from app.models.place import PlaceRead, PlaceReadList
from app.services.cache import get_places_cache

_cache = get_places_cache()


def list_places(db: Session) -> list[PlaceReadList]:
    cached = _cache.get("places:all")
    if cached is not None:
        return cached
    rows = db.query(Place).order_by(Place.id).all()
    result = [PlaceReadList.model_validate(r) for r in rows]
    _cache.set("places:all", result)
    return result


def get_place(db: Session, place_id: int) -> PlaceRead | None:
    cached = _cache.get(f"places:{place_id}")
    if cached is not None:
        return cached
    row = db.query(Place).filter(Place.id == place_id).first()
    if row is None:
        return None
    out = PlaceRead.model_validate(row)
    _cache.set(f"places:{place_id}", out)
    return out
