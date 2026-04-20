export function Logo({ className = 'h-12 w-12' }: { className?: string }): JSX.Element {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <span className="absolute left-0 top-1/2 h-7 w-6 -translate-y-1/2 rounded-sm border border-emerald-500 bg-gradient-to-b from-lime-300 to-emerald-500 shadow-sm" />
      <span className="absolute left-2 top-1/2 h-8 w-6 -translate-y-1/2 rounded-sm border border-pink-500 bg-gradient-to-b from-fuchsia-300 to-pink-500 shadow-sm" />
      <span className="absolute left-4 top-1/2 h-9 w-6 -translate-y-1/2 rounded-sm border border-sky-500 bg-gradient-to-b from-cyan-300 to-sky-500 shadow-sm" />
      <span className="absolute left-1 top-[72%] h-1 w-10 rounded-full bg-slate-300/80" />
    </div>
  );
}
