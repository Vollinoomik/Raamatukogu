import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface AppError extends Error {
  statusCode?: number;
  details?: Array<{ field: string; message: string }>;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.issues.map((issue) => ({
        field: issue.path.join(".") || "unknown",
        message: issue.message
      }))
    });
    return;
  }

  if (error instanceof Error) {
    const appError = error as AppError;
    res.status(appError.statusCode ?? 500).json({
      error: appError.message || "Internal server error",
      details: appError.details
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error"
  });
}