import { Router } from "express";
import { BookController } from "../../controllers/book.controller";
import { validateBody } from "../../middleware/validate";
import { createBookSchema, updateBookSchema } from "../../validators/book.validator";
import { createReviewSchema } from "../../validators/review.validator";

const router = Router();

router.post("/books", validateBody(createBookSchema), BookController.createBook);
router.get("/books", BookController.getBooks);
router.get("/books/:id", BookController.getBookById);
router.put("/books/:id", validateBody(updateBookSchema), BookController.updateBook);
router.delete("/books/:id", BookController.deleteBook);

router.post(
  "/books/:bookId/reviews",
  validateBody(createReviewSchema),
  BookController.createReview
);

router.get("/books/:bookId/reviews", BookController.getReviews);
router.get("/books/:id/average-rating", BookController.getAverageRating);

export default router;