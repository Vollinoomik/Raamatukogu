import { prisma } from "../lib/prisma";
import { CreateBookInput, UpdateBookInput } from "../validators/book.validator";
import { BooksQueryInput } from "../validators/query.validator";

function createHttpError(
  statusCode: number,
  message: string
): Error & { statusCode: number } {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
}

export class BookService {
  static async createBook(input: CreateBookInput) {
    const [author, publisher, existingBook] = await Promise.all([
      prisma.author.findUnique({ where: { id: input.authorId } }),
      prisma.publisher.findUnique({ where: { id: input.publisherId } }),
      prisma.book.findUnique({ where: { isbn: input.isbn } }),
    ]);

    if (!author) {
      throw createHttpError(400, "Author does not exist");
    }

    if (!publisher) {
      throw createHttpError(400, "Publisher does not exist");
    }

    if (existingBook) {
      throw createHttpError(409, "Book with this ISBN already exists");
    }

    const existingGenre = await prisma.genre.findFirst({
      where: {
        name: {
          equals: input.genre,
          mode: "insensitive",
        },
      },
    });

    const genreRecord =
      existingGenre ??
      (await prisma.genre.create({
        data: {
          name: input.genre,
        },
      }));

    return prisma.book.create({
      data: {
        title: input.title,
        isbn: input.isbn,
        publishedYear: input.publishedYear,
        language: input.language,
        pageCount: input.pageCount,
        authorId: input.authorId,
        publisherId: input.publisherId,
        genres: {
          connect: [{ id: genreRecord.id }],
        },
      },
      include: {
        author: true,
        publisher: true,
        genres: true,
      },
    });
  }

  static async getBooks(query: BooksQueryInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.title
        ? {
            title: {
              contains: query.title,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(query.language
        ? {
            language: {
              equals: query.language,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(query.authorId ? { authorId: query.authorId } : {}),
      ...(query.publishedYear !== undefined
        ? { publishedYear: query.publishedYear }
        : {}),
      ...(query.genre
        ? {
            genres: {
              some: {
                name: {
                  equals: query.genre,
                  mode: "insensitive" as const,
                },
              },
            },
          }
        : {}),
    };

    const orderBy =
      query.sortBy === "publishedYear"
        ? { publishedYear: query.sortOrder ?? "asc" }
        : { title: query.sortOrder ?? "asc" };

    const [items, totalItems] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: true,
          publisher: true,
          genres: true,
        },
      }),
      prisma.book.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {
      data: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getBookById(id: string) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        publisher: true,
        genres: true,
        reviews: true,
      },
    });

    if (!book) {
      throw createHttpError(404, "Book not found");
    }

    return book;
  }

  static async updateBook(id: string, input: UpdateBookInput) {
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      throw createHttpError(404, "Book not found");
    }

    if (input.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: input.authorId },
      });

      if (!author) {
        throw createHttpError(400, "Author does not exist");
      }
    }

    if (input.publisherId) {
      const publisher = await prisma.publisher.findUnique({
        where: { id: input.publisherId },
      });

      if (!publisher) {
        throw createHttpError(400, "Publisher does not exist");
      }
    }

    if (input.isbn) {
      const bookWithSameIsbn = await prisma.book.findFirst({
        where: {
          isbn: input.isbn,
          NOT: { id },
        },
      });

      if (bookWithSameIsbn) {
        throw createHttpError(409, "Book with this ISBN already exists");
      }
    }

    let genreUpdate = {};

    if (input.genre) {
      const existingGenre = await prisma.genre.findFirst({
        where: {
          name: {
            equals: input.genre,
            mode: "insensitive",
          },
        },
      });

      const genreRecord =
        existingGenre ??
        (await prisma.genre.create({
          data: {
            name: input.genre,
          },
        }));

      genreUpdate = {
        genres: {
          set: [{ id: genreRecord.id }],
        },
      };
    }

    return prisma.book.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.isbn !== undefined ? { isbn: input.isbn } : {}),
        ...(input.publishedYear !== undefined
          ? { publishedYear: input.publishedYear }
          : {}),
        ...(input.language !== undefined ? { language: input.language } : {}),
        ...(input.pageCount !== undefined ? { pageCount: input.pageCount } : {}),
        ...(input.authorId !== undefined ? { authorId: input.authorId } : {}),
        ...(input.publisherId !== undefined
          ? { publisherId: input.publisherId }
          : {}),
        ...genreUpdate,
      },
      include: {
        author: true,
        publisher: true,
        genres: true,
      },
    });
  }

  static async deleteBook(id: string): Promise<void> {
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      throw createHttpError(404, "Book not found");
    }

    await prisma.book.delete({
      where: { id },
    });
  }

  static async getAverageRating(id: string) {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw createHttpError(404, "Book not found");
    }

    const result = await prisma.review.aggregate({
      where: { bookId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      bookId: id,
      averageRating:
        result._avg.rating !== null
          ? Number(result._avg.rating.toFixed(2))
          : null,
      reviewCount: result._count.rating,
    };
  }
}