"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatVectorStore = exports.prisma = void 0;
const prisma_1 = require("@langchain/community/vectorstores/prisma");
const client_1 = require("@prisma/client");
const embeddings_object_1 = require("./embeddings.object");
exports.prisma = new client_1.PrismaClient();
// export const vectorStore = PrismaVectorStore.withModel<Documents>(
//   prisma
// ).create(embeddings, {
//   prisma: Prisma,
//   tableName: "Documents",
//   vectorColumnName: "vector",
//   columns: {
//     document_id: PrismaVectorStore.IdColumn,
//     descripcion: PrismaVectorStore.ContentColumn,
//   },
// });
exports.chatVectorStore = prisma_1.PrismaVectorStore.withModel(exports.prisma).create(embeddings_object_1.embeddings, {
    prisma: client_1.Prisma,
    tableName: "Chat",
    vectorColumnName: "vector",
    columns: {
        chat_id: prisma_1.PrismaVectorStore.IdColumn,
        session_id: prisma_1.PrismaVectorStore.IdColumn,
        uuid: prisma_1.PrismaVectorStore.IdColumn,
        message: prisma_1.PrismaVectorStore.ContentColumn,
    },
});
