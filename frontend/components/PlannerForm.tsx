"use client";

import { useState } from "react";
import type { GenerateTripBody } from "@/lib/api";

type Props = {
  onSubmit: (body: GenerateTripBody) => Promise<void>;
  loading: boolean;
};

export function PlannerForm({ onSubmit, loading }: Props) {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(25000);
  const [days, setDays] = useState(3);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      destination: destination.trim(),
      budget: Number(budget),
      days: Number(days),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-8"
    >
      <h2 className="font-display text-xl font-semibold text-slate-900">
        Plan your trip
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        We will generate a day-wise itinerary as structured JSON from the API.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="destination" className="block text-sm font-medium text-slate-700">
            Destination
          </label>
          <input
            id="destination"
            name="destination"
            required
            placeholder="e.g. Manali, Goa, Jaipur"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none ring-brand-500/20 transition focus:border-brand-500 focus:ring-4"
          />
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-700">
            Budget (₹)
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min={0}
            required
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none ring-brand-500/20 transition focus:border-brand-500 focus:ring-4"
          />
        </div>
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-slate-700">
            Days
          </label>
          <input
            id="days"
            name="days"
            type="number"
            min={1}
            max={30}
            required
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none ring-brand-500/20 transition focus:border-brand-500 focus:ring-4"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate itinerary"}
      </button>
    </form>
  );
}
