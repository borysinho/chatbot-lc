"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
// Si estamos respondiendo es porque no hubo ningún error
const response = (res, statusCode, data) => {
    res.status(statusCode).json({
        error: false,
        data,
    });
};
exports.response = response;
