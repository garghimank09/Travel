from pydantic import BaseModel, ConfigDict, Field


class PlaceReadList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    location: str
    description: str
    images: list[str] = Field(default_factory=list)
    avg_budget: int


class PlaceRead(PlaceReadList):
    pass


class PlaceCreate(BaseModel):
    name: str
    location: str
    description: str
    images: list[str] = Field(default_factory=list)
    avg_budget: int
