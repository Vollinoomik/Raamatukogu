import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ message }: { message: string }): JSX.Element {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 shadow-sm">
      <AlertCircle className="mt-0.5 h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}
