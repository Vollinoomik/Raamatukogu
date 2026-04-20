"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const prisma_1 = require("../lib/prisma");
function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
class BookService {
    static async createBook(input) {
        const [author, publisher, existingBook] = await Promise.all([
            prisma_1.prisma.author.findUnique({ where: { id: input.authorId } }),
            prisma_1.prisma.publisher.findUnique({ where: { id: input.publisherId } }),
            prisma_1.prisma.book.findUnique({ where: { isbn: input.isbn } })
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
        return prisma_1.prisma.book.create({
            data: {
                title: input.title,
                isbn: input.isbn,
                publishedYear: input.publishedYear,
                language: input.language,
                pageCount: input.pageCount,
                authorId: input.authorId,
                publisherId: input.publisherId
            },
            include: {
                author: true,
                publisher: true,
                genres: true
            }
        });
    }
    static async getBooks(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            ...(query.title
                ? {
                    title: {
                        contains: query.title,
                        mode: "insensitive"
                    }
                }
                : {}),
            ...(query.language
                ? {
                    language: {
                        equals: query.language,
                        mode: "insensitive"
                    }
                }
                : {}),
            ...(query.authorId ? { authorId: query.authorId } : {}),
            ...(query.publishedYear !== undefined ? { publishedYear: query.publishedYear } : {}),
            ...(query.genre
                ? {
                    genres: {
                        some: {
                            name: {
                                equals: query.genre,
                                mode: "insensitive"
                            }
                        }
                    }
                }
                : {})
        };
        const orderBy = query.sortBy === "publishedYear"
            ? { publishedYear: query.sortOrder ?? "asc" }
            : { title: query.sortOrder ?? "asc" };
        const [items, totalItems] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.book.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    author: true,
                    publisher: true,
                    genres: true
                }
            }),
            prisma_1.prisma.book.count({ where })
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
                hasPreviousPage: page > 1
            }
        };
    }
    static async getBookById(id) {
        const book = await prisma_1.prisma.book.findUnique({
            where: { id },
            include: {
                author: true,
                publisher: true,
                genres: true,
                reviews: true
            }
        });
        if (!book) {
            throw createHttpError(404, "Book not found");
        }
        return book;
    }
    static async updateBook(id, input) {
        const existingBook = await prisma_1.prisma.book.findUnique({
            where: { id }
        });
        if (!existingBook) {
            throw createHttpError(404, "Book not found");
        }
        if (input.authorId) {
            const author = await prisma_1.prisma.author.findUnique({
                where: { id: input.authorId }
            });
            if (!author) {
                throw createHttpError(400, "Author does not exist");
            }
        }
        if (input.publisherId) {
            const publisher = await prisma_1.prisma.publisher.findUnique({
                where: { id: input.publisherId }
            });
            if (!publisher) {
                throw createHttpError(400, "Publisher does not exist");
            }
        }
        if (input.isbn) {
            const bookWithSameIsbn = await prisma_1.prisma.book.findFirst({
                where: {
                    isbn: input.isbn,
                    NOT: { id }
                }
            });
            if (bookWithSameIsbn) {
                throw createHttpError(409, "Book with this ISBN already exists");
            }
        }
        return prisma_1.prisma.book.update({
            where: { id },
            data: input,
            include: {
                author: true,
                publisher: true,
                genres: true
            }
        });
    }
    static async deleteBook(id) {
        const existingBook = await prisma_1.prisma.book.findUnique({
            where: { id }
        });
        if (!existingBook) {
            throw createHttpError(404, "Book not found");
        }
        await prisma_1.prisma.book.delete({
            where: { id }
        });
    }
    static async getAverageRating(id) {
        const book = await prisma_1.prisma.book.findUnique({
            where: { id }
        });
        if (!book) {
            throw createHttpError(404, "Book not found");
        }
        const result = await prisma_1.prisma.review.aggregate({
            where: { bookId: id },
            _avg: { rating: true },
            _count: { rating: true }
        });
        return {
            bookId: id,
            averageRating: result._avg.rating !== null ? Number(result._avg.rating.toFixed(2)) : null,
            reviewCount: result._count.rating
        };
    }
}
exports.BookService = BookService;
