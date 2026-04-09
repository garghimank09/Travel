import Image from "next/image";
import Link from "next/link";
import type { Place } from "@/lib/api";

type Props = { place: Place };

export function PlaceCard({ place }: Props) {
  const img = place.images[0];
  return (
    <Link
      href={`/places/${place.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {img ? (
          <Image
            src={img}
            alt={place.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            {place.name}
          </h2>
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            From ₹{place.avg_budget.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-sm text-brand-600">{place.location}</p>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {place.description}
        </p>
        <span className="text-sm font-medium text-brand-600 group-hover:underline">
          View details →
        </span>
      </div>
    </Link>
  );
}
