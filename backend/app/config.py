from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql://postgres:postgres@localhost:5432/Travel"
    cors_origins: str = "http://localhost:3000"
    # ollama | openai | auto (auto: OpenAI if OPENAI_API_KEY is set, else Ollama)
    ai_provider: Literal["ollama", "openai", "auto"] = "auto"
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"
    cache_ttl_seconds: int = 60

    @field_validator("ai_provider", mode="before")
    @classmethod
    def normalize_ai_provider(cls, v: object) -> str:
        if v is None:
            return "auto"
        s = str(v).strip().lower()
        if s in ("ollama", "openai", "auto"):
            return s
        return "auto"


@lru_cache
def get_settings() -> Settings:
    return Settings()
