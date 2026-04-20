import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { ErrorAlert } from '../components/ErrorAlert';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { deleteBook, getBooks, getErrorMessage } from '../api';
import type { Book, BooksListResponse, GetBooksParams } from '../types';

const defaultPagination: BooksListResponse['pagination'] = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 6,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function BooksPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string>('');

  const filters = useMemo<GetBooksParams>(() => {
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '6');
    const publishedYearRaw = searchParams.get('publishedYear');

    return {
      title: searchParams.get('title') ?? '',
      language: searchParams.get('language') ?? '',
      publishedYear: publishedYearRaw ? Number(publishedYearRaw) : undefined,
      sortBy: (searchParams.get('sortBy') as GetBooksParams['sortBy']) ?? 'title',
      sortOrder: (searchParams.get('sortOrder') as GetBooksParams['sortOrder']) ?? 'asc',
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 6 : limit,
    };
  }, [searchParams]);

  const languageOptions = useMemo(() => {
    const uniqueLanguages = Array.from(
      new Set(
        allBooks
          .map((book) => book.language?.trim())
          .filter((language): language is string => Boolean(language))
      )
    );

    return uniqueLanguages.sort((a, b) => a.localeCompare(b));
  }, [allBooks]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks(): Promise<void> {
      setLoading(true);
      setError('');

      try {
        const response = await getBooks(filters, controller.signal);
        setBooks(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination ?? defaultPagination);
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

    void loadBooks();

    return () => controller.abort();
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFilterOptions(): Promise<void> {
      setOptionsLoading(true);

      try {
        const response = await getBooks(
          {
            page: 1,
            limit: 100,
            sortBy: 'title',
            sortOrder: 'asc',
            title: '',
            language: '',
          },
          controller.signal,
        );

        setAllBooks(Array.isArray(response.data) ? response.data : []);
      } catch {
        setAllBooks([]);
      } finally {
        if (!controller.signal.aborted) {
          setOptionsLoading(false);
        }
      }
    }

    void loadFilterOptions();

    return () => controller.abort();
  }, []);

  function updateSearchParam(name: string, value: string): void {
    const next = new URLSearchParams(searchParams);

    if (value.trim() === '') {
      next.delete(name);
    } else {
      next.set(name, value);
    }

    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePageChange(page: number): void {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
  }

  async function handleDelete(book: Book): Promise<void> {
    const confirmed = window.confirm(`Delete "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(book.id);
      await deleteBook(book.id);

      if (books.length === 1 && pagination.currentPage > 1) {
        handlePageChange(pagination.currentPage - 1);
      } else {
        const refreshed = await getBooks(filters);
        setBooks(Array.isArray(refreshed.data) ? refreshed.data : []);
        setPagination(refreshed.pagination ?? defaultPagination);
      }

      const refreshedOptions = await getBooks({
        page: 1,
        limit: 100,
        sortBy: 'title',
        sortOrder: 'asc',
        title: '',
        language: '',
      });

      setAllBooks(Array.isArray(refreshedOptions.data) ? refreshedOptions.data : []);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId('');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section className="mb-8 rounded-[32px] bg-white px-6 py-8 shadow-soft lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
              Library catalog
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              Browse books
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Search by title, year, and language. Sort results and move between pages.
            </p>
          </div>

          <button
            onClick={() => navigate('/books/new')}
            type="button"
            className="rounded-2xl bg-brand-gradient px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20"
          >
            Add Book
          </button>
        </div>
      </section>

      <section className="mb-8 grid gap-4 rounded-[32px] border border-white/70 bg-white p-6 shadow-soft md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
            Title
          </label>
          <input
            id="title"
            value={filters.title ?? ''}
            onChange={(e) => updateSearchParam('title', e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
            placeholder="Search by title"
          />
        </div>

        <div>
          <label htmlFor="publishedYear" className="mb-2 block text-sm font-semibold text-slate-700">
            Published year
          </label>
          <input
            id="publishedYear"
            type="number"
            value={filters.publishedYear ?? ''}
            onChange={(e) => updateSearchParam('publishedYear', e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
            placeholder="2024"
          />
        </div>

        <div>
          <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-700">
            Language
          </label>
          <select
            id="language"
            value={filters.language ?? ''}
            onChange={(e) => updateSearchParam('language', e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
            disabled={optionsLoading}
          >
            <option value="">{optionsLoading ? 'Loading languages...' : 'All languages'}</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="mb-2 block text-sm font-semibold text-slate-700">
            Sort
          </label>
          <div className="grid grid-cols-2 gap-3">
            <select
              id="sortBy"
              value={filters.sortBy ?? 'title'}
              onChange={(e) => updateSearchParam('sortBy', e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
            >
              <option value="title">Title</option>
              <option value="publishedYear">Year</option>
            </select>

            <select
              value={filters.sortOrder ?? 'asc'}
              onChange={(e) => updateSearchParam('sortOrder', e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-fuchsia-400"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      ) : null}

      {deletingId ? (
        <div className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Deleting book...
        </div>
      ) : null}

      {loading ? (
        <Loader text="Loading books..." />
      ) : books.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-soft">
          <h2 className="text-2xl font-bold text-slate-900">No books found</h2>
          <p className="mt-3 text-slate-600">
            Try adjusting the filters or add a new book to get started.
          </p>
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={(selectedBook) => void handleDelete(selectedBook)}
              />
            ))}
          </section>

          <div className="mt-8">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  );
}