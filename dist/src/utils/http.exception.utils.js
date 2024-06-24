"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
    /**
     * getAttr
     */
    getAttr() {
        return {
            error: true,
            message: this.message,
        };
    }
}
exports.HttpException = HttpException;
