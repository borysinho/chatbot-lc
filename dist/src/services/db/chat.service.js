"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgAddAIMessage = exports.pgAddUserMessage = exports.setChatHistory = exports.getChatHistory = exports.srvRunnableConHistorial = exports.srvObtenerChatDesdeWhatsapp = void 0;
const uuid_1 = require("uuid");
const chat_history_object_1 = require("../../objects/chat.history.object");
const prisma_object_1 = require("../../objects/prisma.object");
const runnables_1 = require("@langchain/core/runnables");
const postgres_1 = require("@langchain/community/stores/message/postgres");
const client_1 = require("@prisma/client");
const pgvector_object_1 = require("../../objects/pgvector.object");
const srvObtenerChatDesdeWhatsapp = async (whatsappNumber) => {
    const historialChat = await prisma_object_1.prisma.chat.findMany({
        where: {
            cliente: {
                whatsappNumber,
            },
        },
    });
    return historialChat;
};
exports.srvObtenerChatDesdeWhatsapp = srvObtenerChatDesdeWhatsapp;
/**
 *
 * @param uuid UUID del chat
 * @returns Retorna un arreglo con los mensajes del usuario y del asistente en el chat con el UUID especificado
 */
const srvObtenerChatDesdeUUID = async (uuid) => {
    // console.log({ UUID: uuid });
    const historialChat = await prisma_object_1.prisma.chat.findMany({
        where: {
            uuid,
        },
        orderBy: {
            role: "asc",
        },
    });
    return historialChat;
};
// export const srvInsertarPostgresChatMessageHistory = async (
//   sessionId: string
// ) => {
//   const chatHistory = new PostgresChatMessageHistory({
//     pool,
//     sessionId,
//     tableName: "chat",
//   });
//   return chatHistory;
// };
// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     "Eres un asistente útil. Responda todas las preguntas lo mejor que pueda.",
//   ],
//   new MessagesPlaceholder("chat"),
//   ["human", "{input}"],
// ]);
// export const srvChainConHistoria = async () => {
//   const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
//   const chainWithHistory = new RunnableWithMessageHistory({
//     runnable: chain,
//     inputMessagesKey: "input",
//     historyMessagesKey: "chat",
//     getMessageHistory: async (sessionId) => {
//       const chatHistory = new PostgresChatMessageHistory({
//         pool,
//         sessionId,
//         tableName: "chat",
//       });
//       return chatHistory;
//     },
//   });
//   return chainWithHistory;
// };
// export const srvChainConHistoria2 = async () => {
//   // const contextualizeQSystemPrompt = `Dado un historial de conversación y la última pregunta del usuario que podría hacer referencia al contexto en el historial de chat, formule una pregunta independiente que pueda entenderse sin el historial de chat. NO debes responder la pregunta, simplemente reformúlela si es necesario y, de lo contrario, devuélvala tal como está.
//   // const contextualizeQSystemPrompt = `Utiliza el historia.
//   // Conversación:
//   // {chat}
//   // Pregunta independiente:`;
//   const historyAwarePrompt = ChatPromptTemplate.fromMessages([
//     new MessagesPlaceholder("chat"),
//     ["user", "{input}"],
//     [
//       "user",
//       "Dada la conversación anterior, genere una consulta de búsqueda para buscar información relevante para la conversación.",
//     ],
//   ]);
//   // Pregunta de seguimiento: {input}
//   //   const contextualizeQSystemPrompt = `Dada la siguiente conversación y una pregunta de seguimiento, reformule la pregunta de seguimiento para que sea una pregunta independiente.
//   // Conversación:
//   // {chat}
//   // Pregunta de seguimiento: {input}
//   // Pregunta independiente:`;
//   // const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
//   //   ["system", contextualizeQSystemPrompt],
//   //   new MessagesPlaceholder("chat"),
//   //   ["human", "{input}"],
//   // ]);
//   const contextualizeQChain = historyAwarePrompt
//     .pipe(chatModel)
//     .pipe(new StringOutputParser());
//   const chainWithHistory = new RunnableWithMessageHistory({
//     runnable: contextualizeQChain,
//     inputMessagesKey: "input",
//     historyMessagesKey: "chat",
//     getMessageHistory: async (sessionId) => {
//       const chatHistory = new PostgresChatMessageHistory({
//         pool,
//         sessionId,
//         tableName: "chat",
//       });
//       return chatHistory;
//     },
//   });
//   return chainWithHistory;
// };
// export const messageHistory = async () => {
//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//       `Dado un historial de chat y a una oración del usuario que podría hacer referencia al contexto en el historial de chat, formule una nueva oración que se pueda entender sin el historial de chat. NO respondas a la oración del usuario, simplemente formula una nueva si es necesario y, en caso contrario, devuélvalo tal como está.`,
//     ],
//     new MessagesPlaceholder("chat_history"),
//     ["human", "{input}"],
//   ]);
//   // Creamos una cadena con el prompt y el modelo de chat
//   const cadenaPomptModelo = prompt
//     .pipe(chatModel)
//     .pipe(new StringOutputParser());
//   const cadenaConHistorial = new RunnableWithMessageHistory({
//     runnable: cadenaPomptModelo,
//     inputMessagesKey: "input",
//     historyMessagesKey: "chat_history",
//     getMessageHistory: async (sessionId) => {
//       const chatHistory = new PostgresChatMessageHistory({
//         pool,
//         sessionId,
//         tableName: "chat",
//       });
//       return chatHistory;
//     },
//     // getMessageHistory: async (sessionId) => {
//     //   const chatHistory = new PostgresChatMessageHistory({
//     //     sessionId,
//     //     pool,
//     //     tableName: "chat",
//     //   });
//     //   return chatHistory;
//     // },
//   });
//   return cadenaConHistorial;
// };
const srvRunnableConHistorial = async (runnable) => {
    const chainWithHistory = new runnables_1.RunnableWithMessageHistory({
        runnable,
        inputMessagesKey: "input",
        historyMessagesKey: "chat_history",
        getMessageHistory: async (sessionId) => {
            const chatHistory = new postgres_1.PostgresChatMessageHistory({
                sessionId,
                pool: pgvector_object_1.reusablePool,
                tableName: "chat_history",
            });
            return chatHistory;
        },
    });
    return chainWithHistory;
};
exports.srvRunnableConHistorial = srvRunnableConHistorial;
/**
 *
 * @param whatsappNumber Número de whatsapp del cliente
 * @param input texto de entrada del cliente
 * @param k Cantidad de elementos a obtener
 * @param cosineMinCriterya Criterio de similitud mínima
 * @returns ChatHistory con los K elementos que cumplan con el criterio de similitud
 */
const getChatHistory = async (whatsappNumber, input, k, cosineMinCriterya = 0.5) => {
    // Obtenemos el historial de chat a través de la similitud de vectores
    try {
        const chatHistory = await prisma_object_1.chatVectorStore.similaritySearchWithScore(input, k, {
            session_id: {
                equals: whatsappNumber,
            },
        });
        // Obtenemos los K primeros que tengan el criterio del coseno mayor al especificado en cosineCriterya
        let ac = 0;
        // const result: string[] = [];
        let result = [];
        for (const chat of chatHistory) {
            const { metadata } = chat[0];
            const similarity = chat[1];
            // console.log(JSON.stringify(chat, null, 2));
            // console.log({ chat });
            // Si aún no hemos llegado a los K elementos y la similitud obtenida es mayor al criterio especificado
            if (ac < k && similarity > cosineMinCriterya) {
                // Obtenemos el mensaje del usuario y del asistente del historial de chat
                const qaChat = await srvObtenerChatDesdeUUID(metadata.uuid);
                // console.log({ ParPreguntaRespuesta: qaChat });
                // Acumulamos la cantidad de elementos obtenidos
                ac += (qaChat === null || qaChat === void 0 ? void 0 : qaChat.length) || 0;
                // Si el historial de chat no es nulo, lo agregamos al resultado
                if (qaChat !== null) {
                    // Filtramos los elementos repetidos
                    const existe = result.some((element) => {
                        return (element.message === qaChat[0].message &&
                            element.role === qaChat[0].role);
                    });
                    if (!existe) {
                        result = [...result, ...qaChat];
                    }
                }
            }
        }
        return result;
    }
    catch (error) {
        console.error(error);
        return [];
    }
};
exports.getChatHistory = getChatHistory;
/**
 *
 * @param input Vector que contiene amos mensajes, el del usuario y el del asistente separados por una coma respectivamente
 * @param whatsappNumber El número de whatsapp del cliente
 * @param profileName El nombre del perfil de Whatsapp del cliente
 */
const setChatHistory = async (input, whatsappNumber, profileName) => {
    // El primer registro es del usuario y el segundo del asistente
    const uuid = (0, uuid_1.v4)();
    const result = await prisma_object_1.chatVectorStore.addModels(await prisma_object_1.prisma.$transaction(input.map((content, index) => prisma_object_1.prisma.chat.create({
        data: {
            message: content,
            role: index === 0 ? client_1.Chatmedatada_enum.user : client_1.Chatmedatada_enum.ia,
            uuid,
            cliente: {
                connectOrCreate: {
                    where: {
                        whatsappNumber,
                    },
                    create: {
                        profileName,
                        whatsappNumber,
                    },
                },
            },
        },
    }))));
};
exports.setChatHistory = setChatHistory;
// export const parseHistoryChatToPromptTemplate = (
//   data: {
//     chat_id: number;
//     session_id: string;
//     role: $Enums.Chatmedatada_enum;
//     uuid: string;
//     message: string;
//   }[]
// ) => {
//   const result: BaseMessage[] = data.map((chat) => {
//     const message: BaseMessage = {
//     }
//   });
//   return result;
// };
const pgAddUserMessage = async (whatsappNumber, input) => {
    const message = await (0, chat_history_object_1.chatHistory)(whatsappNumber).addUserMessage(input);
    return message;
};
exports.pgAddUserMessage = pgAddUserMessage;
const pgAddAIMessage = async (whatsappNumber, input) => {
    const message = await (0, chat_history_object_1.chatHistory)(whatsappNumber).addAIMessage(input);
    return message;
};
exports.pgAddAIMessage = pgAddAIMessage;
