"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_routes_1 = __importDefault(require("./twilio.routes"));
const db_routes_1 = __importDefault(require("./db.routes"));
class Routes {
    constructor(app) {
        app.use("/api/v1", twilio_routes_1.default);
        app.use("/api/v1", db_routes_1.default);
    }
}
exports.default = Routes;
