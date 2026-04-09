from pydantic import BaseModel, Field


class GenerateTripRequest(BaseModel):
    destination: str = Field(..., min_length=1, max_length=200)
    budget: int = Field(..., ge=0)
    days: int = Field(..., ge=1, le=30)


class ItineraryActivity(BaseModel):
    time: str
    title: str
    description: str


class ItineraryDay(BaseModel):
    day: int
    activities: list[ItineraryActivity]


class ItineraryResponse(BaseModel):
    destination: str
    summary: str
    days: list[ItineraryDay]
