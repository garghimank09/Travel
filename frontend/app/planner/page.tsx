"use client";

import { useState } from "react";
import { ItineraryCard } from "@/components/ItineraryCard";
import { PlannerForm } from "@/components/PlannerForm";
import {
  generateTrip,
  getErrorMessage,
  type GenerateTripBody,
  type Itinerary,
} from "@/lib/api";

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlan(body: GenerateTripBody) {
    setLoading(true);
    setError(null);
    try {
      const data = await generateTrip(body);
      setItinerary(data);
    } catch (e) {
      setItinerary(null);
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          AI planner
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-slate-900">
          Build a day-wise itinerary
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Use <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm">AI_PROVIDER=ollama</code> in the backend <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm">.env</code> for a local <strong>Ollama</strong> model (see <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm">OLLAMA_MODEL</code>). For OpenAI instead, use <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm">AI_PROVIDER=openai</code> and set <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm">OPENAI_API_KEY</code>.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-2">
          <PlannerForm onSubmit={handlePlan} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          {error && (
            <div
              className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              role="alert"
            >
              {error}
            </div>
          )}
          {!error && !itinerary && !loading && (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center text-sm text-slate-500">
              Your itinerary will appear here after you generate a trip.
            </p>
          )}
          {loading && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
              <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
              <div className="mt-8 h-40 animate-pulse rounded-xl bg-slate-100" />
            </div>
          )}
          {itinerary && !loading && <ItineraryCard itinerary={itinerary} />}
        </div>
      </div>
    </div>
  );
}
