import express from "express";
import bookRoutes from "./express/routes/book.routes";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(express.json());

app.use("/api/v1", bookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;