import type { Itinerary } from "@/lib/api";

type Props = { itinerary: Itinerary };

export function ItineraryCard({ itinerary }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-card sm:p-8">
      <div className="border-b border-slate-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Your itinerary
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
          {itinerary.destination}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{itinerary.summary}</p>
      </div>
      <ul className="mt-6 space-y-6">
        {itinerary.days.map((d) => (
          <li
            key={d.day}
            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <h3 className="font-display text-lg font-semibold text-brand-900">
              Day {d.day}
            </h3>
            <ul className="mt-3 space-y-4">
              {d.activities.map((a, i) => (
                <li key={i} className="flex gap-3 border-l-2 border-brand-200 pl-4">
                  <span className="shrink-0 text-xs font-semibold text-brand-600">
                    {a.time}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{a.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{a.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
