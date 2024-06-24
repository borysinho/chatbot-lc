"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = exports.openaiComplettions = void 0;
// import Grok from "groq-sdk";
const openai_1 = require("openai");
const openai_2 = require("@langchain/openai");
// import { wrapOpenAI } from "langsmith/wrappers";
// export const groq = new Grok({
//   apiKey: process.env.GROQ_API_KEY,
// });
exports.openaiComplettions = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 2,
});
exports.chatModel = new openai_2.ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0,
});
