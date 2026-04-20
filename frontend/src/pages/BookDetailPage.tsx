import { ArrowLeft, Pencil, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createReview, deleteBook, getAverageRating, getBookById, getBookReviews, getErrorMessage } from '../api';
import { ErrorAlert } from '../components/ErrorAlert';
import { Loader } from '../components/Loader';
import { ReviewForm } from '../components/ReviewForm';
import type { AverageRatingData, Book, CreateReviewPayload, Review } from '../types';

export function BookDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<AverageRatingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [reviewError, setReviewError] = useState<string>('');

  useEffect(() => {
    if (!id) {
      return;
    }

    const bookId = id;
    const controller = new AbortController();

    async function loadData(): Promise<void> {
      setLoading(true);
      setError('');
      try {
        const [bookData, reviewsData, ratingData] = await Promise.all([
          getBookById(bookId, controller.signal),
          getBookReviews(bookId, controller.signal),
          getAverageRating(bookId, controller.signal),
        ]);

        setBook(bookData);
        setReviews(reviewsData);
        setAverageRating(ratingData);
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => controller.abort();
  }, [id]);

  async function handleDelete(): Promise<void> {
    if (!id || !book) {
      return;
    }

    const confirmed = window.confirm(`Delete "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteBook(id);
      navigate('/books');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  async function handleAddReview(values: CreateReviewPayload): Promise<void> {
    if (!id) {
      return;
    }

    const bookId = id;
    setReviewError('');
    try {
      const created = await createReview(bookId, values);
      setReviews((current) => [created, ...current]);
      const updatedAverage = await getAverageRating(bookId);
      setAverageRating(updatedAverage);
    } catch (err: unknown) {
      setReviewError(getErrorMessage(err));
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <Loader text="Loading book details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <ErrorAlert message="Book not found." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-6">
        <Link to="/books" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft">
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
        <article className="rounded-[32px] bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">Book details</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{book.title}</h1>
              <p className="mt-2 text-lg text-slate-600">by {book.author.name}</p>
            </div>
            <div className="flex gap-3">
              <Link to={`/books/${book.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
              <button onClick={() => void handleDelete()} type="button" className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Detail label="ISBN" value={book.isbn} />
            <Detail label="Published year" value={String(book.publishedYear)} />
            <Detail label="Page count" value={String(book.pageCount)} />
            <Detail label="Language" value={book.language} />
            <Detail label="Author" value={`${book.author.name} · ${book.author.country}`} />
            <Detail label="Publisher" value={`${book.publisher.name} · ${book.publisher.country}`} />
            <Detail label="Genres" value={book.genres.length > 0 ? book.genres.map((genre) => genre.name).join(', ') : 'No genres'} />
            <Detail label="Existing reviews" value={String(reviews.length)} />
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Average rating</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Star className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{averageRating?.averageRating ?? 'No rating yet'}</p>
                <p className="text-sm text-slate-500">{averageRating?.reviewCount ?? 0} review(s)</p>
              </div>
            </div>
          </div>

          {reviewError ? <ErrorAlert message={reviewError} /> : null}
          <ReviewForm onSubmit={handleAddReview} />
        </aside>
      </section>

      <section className="mt-8 rounded-[32px] bg-white p-8 shadow-soft">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-slate-600">No reviews yet. Be the first to add one.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{review.reviewerName}</h3>
                    <p className="text-sm text-slate-500">{new Date(review.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">Rating: {review.rating}/5</div>
                </div>
                <p className="mt-4 leading-7 text-slate-700">{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-medium text-slate-800">{value}</p>
    </div>
  );
}
