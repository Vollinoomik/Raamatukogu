import { BookOpenText, CalendarDays, Globe2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onDelete: (book: Book) => void;
}

export function BookCard({ book, onDelete }: BookCardProps): JSX.Element {
  const genres = Array.isArray(book.genres) ? book.genres : [];

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-white/80 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
            <BookOpenText className="h-4 w-4" />
            {book.author?.name ?? 'Unknown author'}
          </div>

          <h3 className="text-xl font-bold text-slate-900">{book.title}</h3>
        </div>

        <button
          type="button"
          onClick={() => onDelete(book)}
          className="rounded-xl border border-rose-200 p-2 text-rose-500 hover:bg-rose-50"
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Published: {book.publishedYear}
        </p>

        <p className="flex items-center gap-2">
          <Globe2 className="h-4 w-4" />
          Language: {book.language}
        </p>

        <p>
          Publisher:{' '}
          <span className="font-medium text-slate-800">
            {book.publisher?.name ?? 'Unknown publisher'}
          </span>
        </p>

        <p>
          Genres:{' '}
          <span className="font-medium text-slate-800">
            {genres.length > 0 ? genres.map((genre) => genre.name).join(', ') : 'No genres'}
          </span>
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/books/${book.id}`}
          className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
        >
          View
        </Link>

        <Link
          to={`/books/${book.id}/edit`}
          className="flex-1 rounded-xl bg-brand-gradient px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-95"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}