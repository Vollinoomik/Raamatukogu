"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const book_routes_1 = __importDefault(require("./express/routes/book.routes"));
const not_found_1 = require("./middleware/not-found");
const error_handler_1 = require("./middleware/error-handler");
const app = (0, express_1.default)();
// Enable CORS for frontend on localhost:5173
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/api/v1", book_routes_1.default);
app.use(not_found_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
exports.default = app;
