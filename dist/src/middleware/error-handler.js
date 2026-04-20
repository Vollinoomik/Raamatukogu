"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(error, _req, res, _next) {
    if (error instanceof zod_1.ZodError) {
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
        const appError = error;
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
