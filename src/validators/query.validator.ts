import { z } from "zod";

export const booksQuerySchema = z.object({
  title: z.string().optional(),
  language: z.string().optional(),
  genre: z.string().optional(),
  authorId: z.string().optional(),
  publishedYear: z.coerce.number().int().optional(),
  sortBy: z.enum(["title", "publishedYear"]).optional().default("title"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
});

export type BooksQueryInput = z.infer<typeof booksQuerySchema>;