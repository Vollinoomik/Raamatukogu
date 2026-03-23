export interface Book {
  id: string;
  title: string;
  isbn: string;
  publishedYear: number;
  language: string;
  genre: string;
  authorId: string;
  publisherId: string;
  pageCount: number;
}