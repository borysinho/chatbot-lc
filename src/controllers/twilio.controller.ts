import { Request, Response } from "express";
import { buildAgent } from "../services/agents.service";
import {
  srvInsertarCliente,
  srvObtenerCliente,
  srvObtenerClienteWhatsapp,
} from "../services/db/clientes.service";
import { sendWhatsappMessage } from "../services/twilio.service";
import { Document } from "langchain/document";
import { twiml } from "twilio";
import { HttpException, catchedAsync, response } from "../utils";
import { srvObtenerChatDesdeWhatsapp } from "../services/db/chat.service";

import { srvObtenerProductoEmbedding } from "../services/db/productos.service";

import { pgProductosDescripcionVectorStore } from "../objects/pgvector.object";
import { srvBuscarSimilaridad } from "../services/pgvector.service";
//==============================

export const newMessage = catchedAsync(async (req: Request, res: Response) => {
  let {
    WaId: whatsappNumber,
    Body: mensaje,
    ProfileName: profileName,
    MediaContentType0,
    MediaUrl0,
  } = req.body;
});

export const testLC = catchedAsync(async (req: Request, res: Response) => {
  // const { whatsappNumber, profileName, texto } = req.body;
  let {
    WaId: whatsappNumber,
    Body: texto,
    ProfileName: profileName,
    MediaContentType0,
    MediaUrl0,
  } = req.body;

  // let cliente = await srvObtenerClienteWhatsapp(whatsappNumber);

  // if (!cliente) {
  //   cliente = await srvInsertarCliente({ whatsappNumber, profileName });
  // }

  console.log({ whatsappNumber, profileName, texto });

  const result: any = await buildAgent(texto, whatsappNumber);

  // // console.log({ IAAnser: result.output });

  const message = await sendWhatsappMessage(whatsappNumber, result.output);

  response(res, 200, result.output as string);

  // const result = await ofrecerProductosYServicios(
  //   texto,
  //   whatsappNumber,
  //   profileName
  // );
  // const result = await buildAgent(texto);

  // response(res, 200, message);

  // const chats = await srvObtenerChatDesdeWhatsapp(whatsappNumber);

  // const result = await test14(texto, whatsappNumber, profileName);

  // response(res, 200, result);

  // const vectorStore = await pgVectorStore();

  // const filter = (vectorStore.filter = {
  //   profileName,
  // });

  // console.log({ filter });

  // return response(res, 200, "OK");

  // const result = await chatearConMemoria(texto, profileName, whatsappNumber);
  // const result = await test2(texto, whatsappNumber);
  // const chatHistory = await test4(texto, whatsappNumber);
  // const result = await chatHistory.invoke(
  //   {
  //     input: texto,
  //   },
  //   { configurable: { sessionId: whatsappNumber } }
  // );

  // console.log({ result });

  // return response(res, 200, result);

  // console.log({ cliente });

  //==============================================
  // const chatHistory = await srvChainConHistoria2();
  // const chatContextualizado = await chatHistory.invoke(
  //   {
  //     input: texto,
  //   },
  //   { configurable: { sessionId: whatsappNumber } }
  // );

  // console.log({ chatContextualizado });
  // response(res, 200, chatContextualizado);
  //==============================================

  // const similitud = await srvBuscarSimilaridad(chatContextualizado, 5);
  // console.log({ chatContextualizado, similitud });

  // const pageContent = similitud.map((s) => s.pageContent).join("\n");

  // const document = new Document({
  //   pageContent,
  // });

  // console.log({ document });

  // console.log({ chatContextualizado });
  // const retrievalChain = await test13();

  // const result = await retrievalChain.invoke({
  //   input: chatContextualizado,
  // });
  // const result = await retrievalChain.invoke({
  //   input: chatContextualizado,
  //   context: similitud,
  // });

  // console.log({ answer: retrievalChain });

  // // console.log({ result });
  // response(res, 200, result.answer);
});
