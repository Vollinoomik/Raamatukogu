import { useState } from 'react';
import type { CreateBookPayload, UpdateBookPayload } from '../types';

interface BookFormProps {
  initialValues?: Partial<CreateBookPayload>;
  onSubmit: (values: CreateBookPayload | UpdateBookPayload) => Promise<void>;
  submitLabel: string;
}

const defaultValues: CreateBookPayload = {
  title: '',
  isbn: '',
  publishedYear: new Date().getFullYear(),
  language: '',
  genre: '',
  authorId: '',
  publisherId: '',
  pageCount: 1,
};

export function BookForm({ initialValues, onSubmit, submitLabel }: BookFormProps): JSX.Element {
  const [form, setForm] = useState<CreateBookPayload>({ ...defaultValues, ...initialValues });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function updateField<K extends keyof CreateBookPayload>(key: K, value: CreateBookPayload[K]): void {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[32px] border border-white/80 bg-white p-6 shadow-soft md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
        <input id="title" value={form.title} onChange={(e) => updateField('title', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div>
        <label htmlFor="isbn" className="mb-2 block text-sm font-semibold text-slate-700">ISBN</label>
        <input id="isbn" value={form.isbn} onChange={(e) => updateField('isbn', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div>
        <label htmlFor="publishedYear" className="mb-2 block text-sm font-semibold text-slate-700">Published year</label>
        <input id="publishedYear" type="number" value={form.publishedYear} onChange={(e) => updateField('publishedYear', Number(e.target.value))} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div>
        <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-700">Language</label>
        <input id="language" value={form.language} onChange={(e) => updateField('language', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div>
        <label htmlFor="pageCount" className="mb-2 block text-sm font-semibold text-slate-700">Page count</label>
        <input id="pageCount" type="number" min={1} value={form.pageCount} onChange={(e) => updateField('pageCount', Number(e.target.value))} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div>
        <label htmlFor="authorId" className="mb-2 block text-sm font-semibold text-slate-700">Author ID</label>
        <input id="authorId" value={form.authorId} onChange={(e) => updateField('authorId', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div>
        <label htmlFor="publisherId" className="mb-2 block text-sm font-semibold text-slate-700">Publisher ID</label>
        <input id="publisherId" value={form.publisherId} onChange={(e) => updateField('publisherId', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="genre" className="mb-2 block text-sm font-semibold text-slate-700">Genre</label>
        <input id="genre" value={form.genre} onChange={(e) => updateField('genre', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400" />
        <p className="mt-2 text-xs text-slate-500">Your current backend validator requires a genre string, even though the service does not yet persist genre relations.</p>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-brand-gradient px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/20 disabled:opacity-70">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
