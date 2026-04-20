"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
exports.createBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    isbn: zod_1.z.string().regex(/^\d{10}(\d{3})?$/, "Invalid ISBN format"),
    publishedYear: zod_1.z.number().int().min(1000).max(new Date().getFullYear()),
    language: zod_1.z.string().min(2).max(50),
    genre: zod_1.z.string().min(2).max(100),
    authorId: zod_1.z.string().min(1),
    publisherId: zod_1.z.string().min(1),
    pageCount: zod_1.z.number().int().positive()
});
exports.updateBookSchema = exports.createBookSchema.partial();
