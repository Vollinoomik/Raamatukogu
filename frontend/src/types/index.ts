export type Id = string;

export interface Author {
  id: Id;
  name: string;
  birthYear: number;
  country: string;
}

export interface Publisher {
  id: Id;
  name: string;
  country: string;
  foundedYear: number;
}

export interface Genre {
  id: Id;
  name: string;
}

export interface Review {
  id: Id;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookId: Id;
}

export interface Book {
  id: Id;
  title: string;
  isbn: string;
  publishedYear: number;
  language: string;
  pageCount: number;
  authorId: Id;
  publisherId: Id;
  author: Author;
  publisher: Publisher;
  genres: Genre[];
  reviews?: Review[];
}

export interface ApiEnvelope<T> {
  data: T;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BooksListResponse {
  data: Book[];
  pagination: PaginationInfo;
}

export interface AverageRatingData {
  bookId: Id;
  averageRating: number | null;
  reviewCount: number;
}

export interface GetBooksParams {
  title?: string;
  language?: string;
  genre?: string;
  authorId?: string;
  publishedYear?: number;
  sortBy?: 'title' | 'publishedYear';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateBookPayload {
  title: string;
  isbn: string;
  publishedYear: number;
  language: string;
  genre: string;
  authorId: string;
  publisherId: string;
  pageCount: number;
}

export type UpdateBookPayload = Partial<CreateBookPayload>;

export interface CreateReviewPayload {
  reviewerName: string;
  rating: number;
  comment: string;
}
