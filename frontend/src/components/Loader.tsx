export function Loader({ text = 'Loading...' }: { text?: string }): JSX.Element {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-soft">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-fuchsia-500" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}
