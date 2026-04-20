import { useState } from 'react';
import type { CreateReviewPayload } from '../types';

interface ReviewFormProps {
  onSubmit: (values: CreateReviewPayload) => Promise<void>;
}

const initialState: CreateReviewPayload = {
  reviewerName: '',
  rating: 5,
  comment: '',
};

export function ReviewForm({ onSubmit }: ReviewFormProps): JSX.Element {
  const [form, setForm] = useState<CreateReviewPayload>(initialState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialState);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-white/80 bg-white p-6 shadow-soft">
      <div>
        <label htmlFor="reviewerName" className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
        <input
          id="reviewerName"
          value={form.reviewerName}
          onChange={(event) => setForm((current) => ({ ...current, reviewerName: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
          required
        />
      </div>

      <div>
        <label htmlFor="rating" className="mb-2 block text-sm font-semibold text-slate-700">Rating (1–5)</label>
        <select
          id="rating"
          value={form.rating}
          onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-slate-700">Comment</label>
        <textarea
          id="comment"
          value={form.comment}
          onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand-gradient px-4 py-3 font-semibold text-white disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting review...' : 'Add Review'}
      </button>
    </form>
  );
}
