import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Chat, Prisma, PrismaClient } from "@prisma/client";
import { embeddings } from "./embeddings.object";

export const prisma = new PrismaClient();

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

export const chatVectorStore = PrismaVectorStore.withModel<Chat>(prisma).create(
  embeddings,
  {
    prisma: Prisma,
    tableName: "Chat",
    vectorColumnName: "vector",
    columns: {
      chat_id: PrismaVectorStore.IdColumn,
      session_id: PrismaVectorStore.IdColumn,
      uuid: PrismaVectorStore.IdColumn,
      message: PrismaVectorStore.ContentColumn,
    },
  }
);
