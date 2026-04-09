import axios, { AxiosError } from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 120_000,
});

export type Place = {
  id: number;
  name: string;
  location: string;
  description: string;
  images: string[];
  avg_budget: number;
};

export type ItineraryActivity = {
  time: string;
  title: string;
  description: string;
};

export type ItineraryDay = {
  day: number;
  activities: ItineraryActivity[];
};

export type Itinerary = {
  destination: string;
  summary: string;
  days: ItineraryDay[];
};

export async function fetchPlaces(): Promise<Place[]> {
  const { data } = await api.get<Place[]>("/places");
  return data;
}

export async function fetchPlace(id: number): Promise<Place> {
  const { data } = await api.get<Place>(`/places/${id}`);
  return data;
}

export type GenerateTripBody = {
  destination: string;
  budget: number;
  days: number;
};

export async function generateTrip(body: GenerateTripBody): Promise<Itinerary> {
  const { data } = await api.post<Itinerary>("/generate-trip", body);
  return data;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ detail?: string | { msg: string }[] }>;
    const d = ax.response?.data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && d[0]?.msg) return d.map((x) => x.msg).join("; ");
    return ax.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
