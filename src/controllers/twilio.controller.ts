import { Request, Response } from "express";
import { sendWhatsappMessage } from "../services/twilio.service";
import { twiml } from "twilio";
import { HttpException, catchedAsync, response } from "../utils";
import {
  srvChatToEmbeddings,
  srvInsertarChat,
  srvObtenerChat,
} from "../services/db/chat.service";
import {
  CompletionMessageType,
  completarChat,
  openAICompletion,
  systemContext,
} from "../services/completions.service";
import { embeberDocumento } from "../services/embeddings.service";
import { srvObtenerProductoEmbedding } from "../services/db/productos.service";
import { srvObtenerDocumentos } from "../services/db/documents.service";
import { Role } from "@prisma/client";

//==============================

export const newMessage = catchedAsync(async (req: Request, res: Response) => {
  let {
    WaId: whatsappNumber,
    Body: mensaje,
    ProfileName: profileName,
    MediaContentType0,
    MediaUrl0,
  } = req.body;

  // Convertimos a embeddings el texto del usuario
  const textoUsuarioEmbedding = await embeberDocumento("user-text", [mensaje]);

  //Insertamos chat
  const chat = await srvInsertarChat(
    mensaje,
    whatsappNumber,
    profileName,
    "user"
  );

  // console.log({ chat });

  // Realizamos búsqueda semántica en documentos
  const documentos = await srvObtenerDocumentos(
    textoUsuarioEmbedding.data[0].embedding
  );

  const contexto: string[] = documentos.map((documento) => {
    return documento.descripcion;
  });

  // console.log({ documentos });
  // Validamos el resultado de los documentos
  const aux = documentos.map(({ ref_id, clase, descripcion }) => ({
    ref_id,
    clase,
    descripcion,
  }));

  console.log({ aux });

  // Obtenemos 2 mensajes de conversación relacionados
  const chatEmbeddings = await srvObtenerChat(
    chat.cliente_id,
    textoUsuarioEmbedding.data[0].embedding
  );

  const chatBuscado: CompletionMessageType[] = chatEmbeddings.map((data) => {
    return {
      role: data.role,
      content: data.descripcion,
    };
  });

  console.log({ chatBuscado });

  // Luego de haber buscado las conversaciones relacionadas, registramos el embedding
  const count = await srvChatToEmbeddings({
    cliente_id: chat.cliente_id,
    chat_id: chat.chat_id,
    role: chat.role,
    content: chat.content,
    embedding: textoUsuarioEmbedding.data[0].embedding,
  });

  const chatRespuestaIA = await completarChat(
    whatsappNumber,
    profileName,
    [
      {
        role: "system",
        content: systemContext(contexto),
      },
    ],
    chatBuscado,
    mensaje
  );

  // Registramos el chat en la base de datos
  const chatAssistant = await srvInsertarChat(
    chatRespuestaIA.choices[0].message.content,
    whatsappNumber,
    profileName,
    Role.assistant
  );

  const chatAssistantVector = await embeberDocumento("assistant-text", [
    chatRespuestaIA.choices[0].message.content,
  ]);

  // Registramos los embeddings
  const chatAssistantEmbeddings = await srvChatToEmbeddings({
    cliente_id: chat.cliente_id,
    chat_id: chatAssistant.chat_id,
    role: chatAssistant.role,
    content: chatAssistant.content,
    embedding: chatAssistantVector.data[0].embedding,
  });

  // Enviamos respuesta a Twilio
  await sendWhatsappMessage(
    whatsappNumber,
    chatRespuestaIA.choices[0].message.content
  );

  response(res, 200, { message: "Mensaje enviado" });
});
