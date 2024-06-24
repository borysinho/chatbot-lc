"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, request, response, next) => {
    response.status(500).send({
        error: true,
        message: err,
    });
};
exports.errorMiddleware = errorMiddleware;
