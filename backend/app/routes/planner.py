import json

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.models.itinerary import GenerateTripRequest, ItineraryResponse
from app.services import ai_service

router = APIRouter(tags=["planner"])


@router.post("/generate-trip", response_model=ItineraryResponse)
def generate_trip(body: GenerateTripRequest) -> ItineraryResponse:
    try:
        return ai_service.generate_itinerary(body)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI returned invalid JSON: {e}",
        ) from e
    except ValidationError as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI output did not match schema: {e}",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=(
                "Could not generate itinerary. "
                "Set OPENAI_API_KEY or start Ollama with a JSON-capable model. "
                f"Details: {e!s}"
            ),
        ) from e
