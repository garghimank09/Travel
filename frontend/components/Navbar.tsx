import Link from "next/link";

const links = [
  { href: "/", label: "Places" },
  { href: "/planner", label: "AI Planner" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold text-brand-900">
          Wander<span className="text-brand-600">wise</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-brand-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
