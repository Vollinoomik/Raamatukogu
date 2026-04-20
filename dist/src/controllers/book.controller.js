"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const book_service_1 = require("../services/book.service");
const review_service_1 = require("../services/review.service");
const query_validator_1 = require("../validators/query.validator");
class BookController {
    static async createBook(req, res, next) {
        try {
            const book = await book_service_1.BookService.createBook(req.body);
            res.status(201).json({ data: book });
        }
        catch (error) {
            next(error);
        }
    }
    static async getBooks(req, res, next) {
        try {
            const query = query_validator_1.booksQuerySchema.parse(req.query);
            const result = await book_service_1.BookService.getBooks(query);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getBookById(req, res, next) {
        try {
            const book = await book_service_1.BookService.getBookById(String(req.params.id));
            res.status(200).json({ data: book });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateBook(req, res, next) {
        try {
            const book = await book_service_1.BookService.updateBook(String(req.params.id), req.body);
            res.status(200).json({ data: book });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteBook(req, res, next) {
        try {
            await book_service_1.BookService.deleteBook(String(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    static async createReview(req, res, next) {
        try {
            const review = await review_service_1.ReviewService.createReview(String(req.params.bookId), req.body);
            res.status(201).json({ data: review });
        }
        catch (error) {
            next(error);
        }
    }
    static async getReviews(req, res, next) {
        try {
            const reviews = await review_service_1.ReviewService.getReviewsByBookId(String(req.params.bookId));
            res.status(200).json({ data: reviews });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAverageRating(req, res, next) {
        try {
            const result = await book_service_1.BookService.getAverageRating(String(req.params.id));
            res.status(200).json({ data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BookController = BookController;
