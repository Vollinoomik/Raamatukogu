"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
function validateBody(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
function validateQuery(schema) {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse(req.query);
            Object.assign(req.query, parsed);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
