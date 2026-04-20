"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksQuerySchema = void 0;
const zod_1 = require("zod");
exports.booksQuerySchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    authorId: zod_1.z.string().optional(),
    publishedYear: zod_1.z.coerce.number().int().optional(),
    sortBy: zod_1.z.enum(["title", "publishedYear"]).optional().default("title"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("asc"),
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(10)
});
