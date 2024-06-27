import { Request, Response } from "express";
import { buildAgent } from "../services/agents.service";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
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
  console.log(req.body);
  let {
    WaId: whatsappNumber,
    Body: texto,
    ProfileName: profileName,
    // MediaContentType0,
    // MediaUrl0,
  } = await req.body;

  const cliente = await srvObtenerClienteWhatsapp(whatsappNumber);

  // console.log({ cliente });
  if (!cliente) {
    await srvInsertarCliente({ whatsappNumber, profileName });
  }

  console.log({ whatsappNumber, profileName, texto });

  const agent: any = await buildAgent();

  const result = await agent.invoke(
    {
      input: texto,
    },
    {
      configurable: {
        sessionId: whatsappNumber,
      },
    }
  );

  const message = await sendWhatsappMessage(whatsappNumber, result.output);

  console.log({ output: result.output });

  response(res, 200, result.output as string);
});

export const indexDataSource = catchedAsync(
  async (req: Request, res: Response) => {}
);
