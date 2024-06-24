"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHistory = void 0;
const postgres_1 = require("@langchain/community/stores/message/postgres");
const pgvector_object_1 = require("./pgvector.object");
const chatHistory = (sessionId) => {
    const history = new postgres_1.PostgresChatMessageHistory({
        sessionId,
        pool: pgvector_object_1.reusablePool,
        tableName: "chat_history",
    });
    return history;
};
exports.chatHistory = chatHistory;
