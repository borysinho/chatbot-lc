import { Role } from "@prisma/client";
import pgvector from "pgvector";
import prisma from "../../objects/prisma.object";

export type TChatEmbeddings = {
  chat_id?: number;
  cliente_id: number;
  descripcion: string;
  role: Role;
  embedding: number[];
};

export const srvInsertarChat = async (
  content: string,
  whatsappNumber: string,
  profileName: string,
  role: Role
) => {
  const chat = await prisma.chat.create({
    data: {
      content,
      role,
      cliente: {
        connectOrCreate: {
          where: {
            whatsappNumber,
          },
          create: {
            whatsappNumber,
            profileName,
          },
        },
      },
    },
  });

  return chat;
};

export const srvObtenerChatDesdeWhatsapp = async (whatsappNumber: string) => {
  const historialChat = await prisma.chat.findMany({
    where: {
      cliente: {
        whatsappNumber,
      },
    },
  });

  return historialChat;
};

/**
 * =================CHAT EMBEDDINGS=================
 */

export const srvChatToEmbeddings = async (chat: {
  chat_id: number;
  cliente_id: number;
  content: string;
  role: Role;
  embedding: number[];
}) => {
  const embedding = pgvector.toSql(chat.embedding);
  try {
    const count =
      await prisma.$executeRaw`INSERT INTO "ChatEmbeddings" (cliente_id, chat_id, descripcion, role,  embedding) VALUES (${chat.cliente_id}, ${chat.chat_id}, ${chat.content}, ${chat.role}::"Role", ${embedding}::vector)`;

    return count;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const limit: number = parseInt(process.env.CHAT_SEARCH_LIMIT || "2");

export const srvObtenerChat = async (
  cliente_id: number,
  chatEmbedding: number[]
) => {
  try {
    const embedding = pgvector.toSql(chatEmbedding);
    const similitudesUser: TChatEmbeddings[] =
      await prisma.$queryRaw`SELECT cliente_id, chat_id, role, descripcion, embedding::text FROM "ChatEmbeddings" WHERE cliente_id=${cliente_id} AND  role=${Role.user}::"Role" ORDER BY embedding <-> ${embedding}::vector LIMIT ${limit}`;

    const similitudesAssistant: TChatEmbeddings[] =
      await prisma.$queryRaw`SELECT cliente_id, chat_id, role, descripcion, embedding::text FROM "ChatEmbeddings" WHERE cliente_id=${cliente_id} AND  role=${Role.assistant}::"Role" ORDER BY embedding <-> ${embedding}::vector LIMIT ${limit}`;

    return [...similitudesUser, ...similitudesAssistant];
  } catch (error) {
    console.error(error);
    return [];
  }
};
