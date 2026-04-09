"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPlace, getErrorMessage, type Place } from "@/lib/api";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Invalid place id");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPlace(id);
        if (!cancelled) setPlace(data);
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="h-10 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 aspect-video animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to places
        </Link>
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error || "Place not found"}
        </p>
      </div>
    );
  }

  const hero = place.images[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to places
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="relative aspect-[21/9] bg-slate-100">
          {hero ? (
            <Image
              src={hero}
              alt={place.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          ) : null}
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                {place.name}
              </h1>
              <p className="mt-1 text-brand-600">{place.location}</p>
            </div>
            <span className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-800">
              Avg budget ~ ₹{place.avg_budget.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-6 text-base leading-relaxed text-slate-600">{place.description}</p>
          <Link
            href="/planner"
            className="mt-8 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
          >
            Plan with AI
          </Link>
        </div>
      </div>

      {place.images.length > 1 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-slate-900">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {place.images.slice(1).map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={src}
                  alt={`${place.name} ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
