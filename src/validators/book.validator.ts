import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1).max(200),
  isbn: z.string().regex(/^\d{10}(\d{3})?$/, "Invalid ISBN format"),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  language: z.string().min(2).max(50),
  genre: z.string().min(2).max(100),
  authorId: z.string().min(1),
  publisherId: z.string().min(1),
  pageCount: z.number().int().positive()
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;