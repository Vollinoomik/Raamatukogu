import { NextFunction, Request, Response } from "express";
import { BookService } from "../services/book.service";
import { ReviewService } from "../services/review.service";
import { booksQuerySchema } from "../validators/query.validator";
import { CreateBookInput, UpdateBookInput } from "../validators/book.validator";
import { CreateReviewInput } from "../validators/review.validator";

export class BookController {
  static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await BookService.createBook(req.body as CreateBookInput);
      res.status(201).json({ data: book });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = booksQuerySchema.parse(req.query);
      const result = await BookService.getBooks(query);
      res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await BookService.getBookById(String(req.params.id));
      res.status(200).json({ data: book });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await BookService.updateBook(
        String(req.params.id),
        req.body as UpdateBookInput
      );
      res.status(200).json({ data: book });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await BookService.deleteBook(String(req.params.id));
      res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  }

  static async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await ReviewService.createReview(
        String(req.params.bookId),
        req.body as CreateReviewInput
      );
      res.status(201).json({ data: review });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviews = await ReviewService.getReviewsByBookId(String(req.params.bookId));
      res.status(200).json({ data: reviews });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getAverageRating(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await BookService.getAverageRating(String(req.params.id));
      res.status(200).json({ data: result });
    } catch (error: unknown) {
      next(error);
    }
  }
  
}