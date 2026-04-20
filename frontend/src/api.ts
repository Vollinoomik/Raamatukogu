import axios from 'axios';
import type {
  ApiEnvelope,
  AverageRatingData,
  Book,
  BooksListResponse,
  CreateBookPayload,
  CreateReviewPayload,
  GetBooksParams,
  Review,
  UpdateBookPayload,
} from './types';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL is missing');
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getBooks(
  params: GetBooksParams,
  signal?: AbortSignal
): Promise<BooksListResponse> {
  const response = await api.get('/books', { params, signal });

  return {
    data: response.data.data ?? [],
    pagination: response.data.pagination,
  };
}

export async function getBookById(id: string, signal?: AbortSignal): Promise<Book> {
  const response = await api.get<ApiEnvelope<Book>>(`/books/${id}`, { signal });
  return response.data.data;
}

export async function createBook(payload: CreateBookPayload): Promise<Book> {
  const response = await api.post<ApiEnvelope<Book>>('/books', payload);
  return response.data.data;
}

export async function updateBook(id: string, payload: UpdateBookPayload): Promise<Book> {
  const response = await api.put<ApiEnvelope<Book>>(`/books/${id}`, payload);
  return response.data.data;
}

export async function deleteBook(id: string): Promise<void> {
  await api.delete(`/books/${id}`);
}

export async function getBookReviews(bookId: string, signal?: AbortSignal): Promise<Review[]> {
  const response = await api.get<ApiEnvelope<Review[]>>(`/books/${bookId}/reviews`, { signal });
  return response.data.data;
}

export async function createReview(bookId: string, payload: CreateReviewPayload): Promise<Review> {
  const response = await api.post<ApiEnvelope<Review>>(`/books/${bookId}/reviews`, payload);
  return response.data.data;
}

export async function getAverageRating(bookId: string, signal?: AbortSignal): Promise<AverageRatingData> {
  const response = await api.get<ApiEnvelope<AverageRatingData>>(`/books/${bookId}/average-rating`, { signal });
  return response.data.data;
}

/* 👇 ADD THESE 👇 */
export async function getAuthors() {
  const response = await api.get('/books');
  return response.data.data.map((b: any) => b.author);
}

export async function getPublishers() {
  const response = await api.get('/books');
  return response.data.data.map((b: any) => b.publisher);
}

export async function getGenres() {
  const response = await api.get('/books');
  return response.data.data.flatMap((b: any) => b.genres ?? []);
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string; details?: unknown }
      | undefined;

    if (typeof data?.message === 'string' && data.message.trim() !== '') {
      return data.message;
    }

    if (typeof data?.error === 'string' && data.error.trim() !== '') {
      return data.error;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}