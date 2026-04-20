import express from "express";
import cors from "cors";
import bookRoutes from "./express/routes/book.routes";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// Enable CORS for frontend on localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/api/v1", bookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;