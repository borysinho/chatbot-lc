"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddings = exports.openaiEmbeddings = void 0;
const openai_1 = require("@langchain/openai");
const openai_2 = __importDefault(require("openai"));
exports.openaiEmbeddings = new openai_2.default({
    apiKey: process.env.OPENAI_EMBEDDINGS_API_KEY,
    maxRetries: 2,
});
exports.embeddings = new openai_1.OpenAIEmbeddings({
    model: "text-embedding-3-small",
    dimensions: 1536,
    apiKey: process.env.OPENAI_API_KEY,
});
