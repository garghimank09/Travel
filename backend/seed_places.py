"""Create tables (if needed) and seed the `places` table. Run from the `backend` folder:

    python seed_places.py
"""

from __future__ import annotations

from app.database.connection import Base, SessionLocal, engine
from app.database.models import Place
from app.services.cache import get_places_cache

SAMPLE_PLACES: list[dict] = [
    {
        "name": "Manali",
        "location": "Himachal Pradesh, India",
        "description": "Alpine town known for Rohtang Pass, Solang Valley, and riverside cafés — ideal for adventure and mountain views.",
        "images": [
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
            "https://images.unsplash.com/photo-1597074862223-714327f3d1f4?w=800",
        ],
        "avg_budget": 35000,
    },
    {
        "name": "Goa",
        "location": "Goa, India",
        "description": "Coastal state with Portuguese heritage, beaches, seafood, and vibrant nightlife.",
        "images": [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
        ],
        "avg_budget": 28000,
    },
    {
        "name": "Jaipur",
        "location": "Rajasthan, India",
        "description": "The Pink City — Amber Fort, Hawa Mahal, bazaars, and rich Rajput architecture.",
        "images": [
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        ],
        "avg_budget": 22000,
    },
    {
        "name": "Udaipur",
        "location": "Rajasthan, India",
        "description": "City of lakes with palaces, boat rides on Lake Pichola, and romantic old-town lanes.",
        "images": [
            "https://images.unsplash.com/photo-1595658658481-df84320060d5?w=800",
        ],
        "avg_budget": 26000,
    },
    {
        "name": "Kerala Backwaters",
        "location": "Kerala, India",
        "description": "Houseboats, coconut groves, and slow-paced village life along tranquil canals.",
        "images": [
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        ],
        "avg_budget": 30000,
    },
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Place).count()
        if count > 0:
            print(f"Skipping seed: {count} place(s) already exist.")
            return
        for p in SAMPLE_PLACES:
            db.add(Place(**p))
        db.commit()
        print(f"Seeded {len(SAMPLE_PLACES)} places.")
    finally:
        db.close()
    get_places_cache().invalidate_prefix("places:")


if __name__ == "__main__":
    main()
