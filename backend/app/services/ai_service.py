import json
import re

import httpx
from openai import OpenAI

from app.config import Settings, get_settings
from app.models.itinerary import GenerateTripRequest, ItineraryResponse

SYSTEM_PROMPT = """You are a travel planning assistant. Generate a day-wise travel itinerary.
Return ONLY valid JSON matching this shape (no markdown, no code fences):
{
  "destination": string (echo the destination),
  "summary": string (2-4 sentences),
  "days": [
    {
      "day": integer (1-based),
      "activities": [
        { "time": string (e.g. "09:00"), "title": string, "description": string }
      ]
    }
  ]
}
Include 2-5 activities per day. Respect the user's budget and trip length."""


def _build_user_message(req: GenerateTripRequest) -> str:
    return (
        f"Destination: {req.destination}\n"
        f"Total budget (INR or local currency unit as a number): {req.budget}\n"
        f"Number of days: {req.days}\n"
        "Generate the itinerary as JSON."
    )


def _parse_json_payload(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


def _use_openai(settings: Settings) -> bool:
    key = (settings.openai_api_key or "").strip()
    if settings.ai_provider == "openai":
        return True
    if settings.ai_provider == "ollama":
        return False
    return bool(key)


def _generate_with_openai(settings: Settings, user_msg: str) -> ItineraryResponse:
    key = (settings.openai_api_key or "").strip()
    if not key:
        raise ValueError("OPENAI_API_KEY is required when AI_PROVIDER=openai or auto with no Ollama path")
    client = OpenAI(api_key=key)
    completion = client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    raw = completion.choices[0].message.content or "{}"
    data = _parse_json_payload(raw)
    return ItineraryResponse.model_validate(data)


def _generate_with_ollama(settings: Settings, user_msg: str) -> ItineraryResponse:
    url = f"{settings.ollama_base_url.rstrip('/')}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "format": "json",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg + "\nRespond with JSON only."},
        ],
    }
    with httpx.Client(timeout=120.0) as http:
        r = http.post(url, json=payload)
        r.raise_for_status()
        body = r.json()
    message = body.get("message") or {}
    content = message.get("content") or "{}"
    data = _parse_json_payload(content)
    return ItineraryResponse.model_validate(data)


def generate_itinerary(req: GenerateTripRequest) -> ItineraryResponse:
    settings = get_settings()
    user_msg = _build_user_message(req)

    if _use_openai(settings):
        return _generate_with_openai(settings, user_msg)
    return _generate_with_ollama(settings, user_msg)
