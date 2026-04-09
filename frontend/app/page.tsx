"use client";

import { useEffect, useState } from "react";
import { PlaceCard } from "@/components/PlaceCard";
import { fetchPlaces, getErrorMessage, type Place } from "@/lib/api";

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPlaces();
        if (!cancelled) setPlaces(data);
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Explore India
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Curated destinations
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Browse hand-picked spots, then open the AI planner to shape a day-wise itinerary
          around your budget and schedule.
        </p>
      </div>

      {loading && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-slate-200/80"
              aria-hidden
            />
          ))}
        </div>
      )}

      {error && (
        <div
          className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && places.length === 0 && (
        <p className="mt-10 text-slate-600">No places yet. Run the backend seed script.</p>
      )}

      {!loading && !error && places.length > 0 && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  );
}
