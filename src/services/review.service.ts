import { prisma } from "../lib/prisma";
import { CreateReviewInput } from "../validators/review.validator";

function createHttpError(
  statusCode: number,
  message: string
): Error & { statusCode: number } {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
}

export class ReviewService {
  static async createReview(bookId: string, input: CreateReviewInput) {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      throw createHttpError(404, "Book not found");
    }

    return prisma.review.create({
      data: {
        bookId,
        reviewerName: input.reviewerName,
        rating: input.rating,
        comment: input.comment
      }
    });
  }

  static async getReviewsByBookId(bookId: string) {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      throw createHttpError(404, "Book not found");
    }

    return prisma.review.findMany({
      where: { bookId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}