"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../lib/prisma");
function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
class ReviewService {
    static async createReview(bookId, input) {
        const book = await prisma_1.prisma.book.findUnique({
            where: { id: bookId }
        });
        if (!book) {
            throw createHttpError(404, "Book not found");
        }
        return prisma_1.prisma.review.create({
            data: {
                bookId,
                reviewerName: input.reviewerName,
                rating: input.rating,
                comment: input.comment
            }
        });
    }
    static async getReviewsByBookId(bookId) {
        const book = await prisma_1.prisma.book.findUnique({
            where: { id: bookId }
        });
        if (!book) {
            throw createHttpError(404, "Book not found");
        }
        return prisma_1.prisma.review.findMany({
            where: { bookId },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
}
exports.ReviewService = ReviewService;
