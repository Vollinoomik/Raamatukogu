import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createBook,
  getBookById,
  getBooks,
  getErrorMessage,
  updateBook,
} from '../api';

type OptionItem = {
  id: string;
  name: string;
};

type FormState = {
  title: string;
  isbn: string;
  publishedYear: string;
  language: string;
  pageCount: string;
  authorId: string;
  publisherId: string;
  genre: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function BookFormPage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<FormState>({
    title: '',
    isbn: '',
    publishedYear: '',
    language: '',
    pageCount: '',
    authorId: '',
    publisherId: '',
    genre: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string>('');

  const [authors, setAuthors] = useState<OptionItem[]>([]);
  const [publishers, setPublishers] = useState<OptionItem[]>([]);
  const [genres, setGenres] = useState<OptionItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOptionsAndBook(): Promise<void> {
      try {
        setError('');

        const booksResponse = await getBooks(
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

        const uniqueAuthors = new Map<string, OptionItem>();
        const uniquePublishers = new Map<string, OptionItem>();
        const uniqueGenres = new Map<string, OptionItem>();

        for (const book of booksResponse.data) {
          if (book.author?.id && book.author?.name) {
            uniqueAuthors.set(book.author.id, {
              id: book.author.id,
              name: book.author.name,
            });
          }

          if (book.publisher?.id && book.publisher?.name) {
            uniquePublishers.set(book.publisher.id, {
              id: book.publisher.id,
              name: book.publisher.name,
            });
          }

          for (const genre of book.genres ?? []) {
            if (genre.id && genre.name) {
              uniqueGenres.set(genre.id, {
                id: genre.id,
                name: genre.name,
              });
            }
          }
        }

        setAuthors(Array.from(uniqueAuthors.values()));
        setPublishers(Array.from(uniquePublishers.values()));
        setGenres(Array.from(uniqueGenres.values()));

        if (id) {
          const book = await getBookById(id, controller.signal);

          setForm({
            title: book.title ?? '',
            isbn: book.isbn ?? '',
            publishedYear: String(book.publishedYear ?? ''),
            language: book.language ?? '',
            pageCount: String(book.pageCount ?? ''),
            authorId: book.authorId ?? book.author?.id ?? '',
            publisherId: book.publisherId ?? book.publisher?.id ?? '',
            genre: (book.genres ?? [])[0]?.name ?? '',
          });
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setPageLoading(false);
        }
      }
    }

    void loadOptionsAndBook();

    return () => controller.abort();
  }, [id]);

  const genreOptions = useMemo(() => {
    const sorted = [...genres].sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [genres]);

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]): void {
    let nextValue = value;

    if (field === 'isbn' || field === 'publishedYear' || field === 'pageCount') {
      nextValue = value.replace(/\D/g, '') as FormState[K];
    }

    if (field === 'publishedYear') {
      nextValue = value.replace(/\D/g, '').slice(0, 4) as FormState[K];
    }

    if (field === 'isbn') {
      nextValue = value.replace(/\D/g, '').slice(0, 13) as FormState[K];
    }

    setForm((prev) => ({
      ...prev,
      [field]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  }

  function validateForm(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Pealkiri on kohustuslik.';
    }

    if (!/^\d{10}$|^\d{13}$/.test(form.isbn)) {
      nextErrors.isbn = 'ISBN peab olema täpselt 10 või 13 numbrit.';
    }

    if (!/^\d{4}$/.test(form.publishedYear)) {
      nextErrors.publishedYear = 'Aasta peab olema 4-kohaline number.';
    }

    if (!form.language.trim()) {
      nextErrors.language = 'Keel on kohustuslik.';
    }

    if (!/^\d+$/.test(form.pageCount) || Number(form.pageCount) <= 0) {
      nextErrors.pageCount = 'Lehekülgede arv peab olema positiivne number.';
    }

    if (!form.authorId) {
      nextErrors.authorId = 'Vali autor.';
    }

    if (!form.publisherId) {
      nextErrors.publisherId = 'Vali kirjastus.';
    }

    if (!form.genre) {
      nextErrors.genre = 'Vali žanr.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: form.title.trim(),
        isbn: form.isbn,
        publishedYear: Number(form.publishedYear),
        language: form.language.trim(),
        pageCount: Number(form.pageCount),
        authorId: form.authorId,
        publisherId: form.publisherId,
        genre: form.genre,
      };

      if (id) {
        await updateBook(id, payload);
        navigate(`/books/${id}`);
      } else {
        const createdBook = await createBook(payload);
        navigate(`/books/${createdBook.id}`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="rounded-[32px] bg-white p-10 shadow-soft">
          <p className="text-lg font-semibold text-slate-700">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-600">
            {isEditMode ? 'Edit book' : 'Create book'}
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900">
            {isEditMode ? 'Update book details' : 'Add a new book'}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-white px-6 py-4 text-lg font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5"
        >
          Cancel
        </button>
      </div>

      {error ? (
        <div className="mb-8 rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : null}

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="rounded-[36px] bg-white p-8 shadow-soft lg:p-10"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Title" error={errors.title} className="md:col-span-2">
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter book title"
              className={inputClass(errors.title)}
            />
          </FormField>

          <FormField label="ISBN" error={errors.isbn}>
            <input
              value={form.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
              placeholder="10 or 13 digits"
              inputMode="numeric"
              className={inputClass(errors.isbn)}
            />
          </FormField>

          <FormField label="Published year" error={errors.publishedYear}>
            <input
              value={form.publishedYear}
              onChange={(e) => handleChange('publishedYear', e.target.value)}
              placeholder="2024"
              inputMode="numeric"
              className={inputClass(errors.publishedYear)}
            />
          </FormField>

          <FormField label="Language" error={errors.language}>
            <input
              value={form.language}
              onChange={(e) => handleChange('language', e.target.value)}
              placeholder="English"
              className={inputClass(errors.language)}
            />
          </FormField>

          <FormField label="Page count" error={errors.pageCount}>
            <input
              value={form.pageCount}
              onChange={(e) => handleChange('pageCount', e.target.value)}
              placeholder="350"
              inputMode="numeric"
              className={inputClass(errors.pageCount)}
            />
          </FormField>

          <FormField label="Author" error={errors.authorId}>
            <select
              value={form.authorId}
              onChange={(e) => handleChange('authorId', e.target.value)}
              className={inputClass(errors.authorId)}
            >
              <option value="">Select author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Publisher" error={errors.publisherId}>
            <select
              value={form.publisherId}
              onChange={(e) => handleChange('publisherId', e.target.value)}
              className={inputClass(errors.publisherId)}
            >
              <option value="">Select publisher</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Genre" error={errors.genre} className="md:col-span-2">
            <select
              value={form.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              className={inputClass(errors.genre)}
            >
              <option value="">Select genre</option>
              {genreOptions.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brand-gradient px-8 py-4 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save changes' : 'Create book'}
          </button>
        </div>
      </form>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

function FormField({ label, error, className = '', children }: FormFieldProps): JSX.Element {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

function inputClass(error?: string): string {
  return [
    'w-full rounded-2xl border px-4 py-4 text-lg text-slate-900 outline-none transition',
    'bg-slate-50',
    error
      ? 'border-rose-300 focus:border-rose-400'
      : 'border-slate-200 focus:border-fuchsia-400',
  ].join(' ');
}