import { Product, generatePdf } from "./pdf.service";

import {
  srvActualizarCotizacion,
  srvObtenerCotizacion,
} from "./db/cotizacion.service";
import {
  srvActualizarDetalleCotizacion,
  srvInsertarDetalleCotizacion,
  srvObtenerDetalleCotizacion,
  srvObtenerDetalleCotizacionDesdeCotizacion,
} from "./db/detalles.cotizaciones.service";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { PostgresRecordManager } from "@langchain/community/indexes/postgres";
import { index } from "langchain/indexes";
import { createRetrieverTool } from "langchain/tools/retriever";
import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  createToolCallingAgent,
} from "langchain/agents";

import {
  pgProductosDescripcionVectorStore,
  pgProductosNombreVectorStore,
  pgProductosPreciosVectorStore,
  pgProductosStockVectorStore,
  pgServiciosDescripcionVectorStore,
  pgServiciosNombreVectorStore,
  pgServiciosPreciosVectorStore,
  pgServiciosReservasVectorStore,
  reusablePool,
} from "../objects/pgvector.object";
import { chatModel } from "../objects/completions.object";
import { pull } from "langchain/hub";
import { srvRunnableConHistorial } from "./db/chat.service";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { PoolConfig } from "pg";
import { embeddings } from "../objects/embeddings.object";
import {
  srvActualizarCliente,
  srvActualizarClienteWhatsapp,
} from "./db/clientes.service";
import { srvObtenerProducto } from "./db/productos.service";
import { ProductoServicioPaquete_enum } from "@prisma/client";

export const buildAgent = async () => {
  try {
    // Producto Nombre
    const retrieverProductoNombre = pgProductosNombreVectorStore.asRetriever();

    const retrieverProductoNombreTool = createRetrieverTool(
      retrieverProductoNombre,
      {
        name: "nombre_productos",
        description: `Debes utilizar esta herramienta en las siguientes circunstancias:
1. En caso que el cliente consulte que productos tenemos a la venta.
2. En caso que pregunte qué productos similares tenemos a la venta.`,
      }
    );

    // Producto Descripción
    const retrieverProductoDescripcion =
      pgProductosDescripcionVectorStore.asRetriever(1);

    const retrieverProductoDescripcionTool = createRetrieverTool(
      retrieverProductoDescripcion,
      {
        name: "descripcion_productos",
        description: `Debes utilizar esta herramienta en las siguientes circunstancias: 
1. En caso que el cliente le interese algún producto en específico.
2. En caso que el cliente solicite más detalles sobre algún producto en específico.`,
      }
    );

    // Producto Precio
    const retrieverProductoPrecio =
      pgProductosPreciosVectorStore.asRetriever(1);

    const retrieverProductoPrecioTool = createRetrieverTool(
      retrieverProductoPrecio,
      {
        name: "precios_productos",
        description:
          "Debes utilizar esta herramienta para brindar el precio de algún producto en específico",
      }
    );

    // Producto Stock
    const retrieverProductoStock = pgProductosStockVectorStore.asRetriever();

    const retrieverProductoStockTool = createRetrieverTool(
      retrieverProductoStock,
      {
        name: "stock_productos",
        description:
          "Debes utilizar esta herramienta si el cliente desea conocer la disponibilidad de algún producto en específico",
      }
    );

    // Servicio Nombre
    const retrieverServicioNombre = pgServiciosNombreVectorStore.asRetriever();

    const retrieverServicioNombreTool = createRetrieverTool(
      retrieverServicioNombre,
      {
        name: "nombre_servicios",
        description: `Debes utilizar esta herramienta en las siguientes circunstancias:
1. En caso que el cliente consulte que servicios tenemos para ofrecer.
2. En caso que pregunte qué servicios similares tenemos para ofrecer.`,
      }
    );

    // Servicio Descripcion
    const retrieverServicioDescripcion =
      pgServiciosDescripcionVectorStore.asRetriever(1);

    const retrieverServicioDescripcionTool = createRetrieverTool(
      retrieverServicioDescripcion,
      {
        name: "descripcion_servicios",
        description: `Debes utilizar esta herramienta en las siguientes circunstancias: 
1. En caso que el cliente le interese algún servicio en específico.
2. En caso que el cliente solicite más detalles sobre algún servicio en específico.`,
      }
    );

    // Servicio Precio
    const retrieverServicioPrecio =
      pgServiciosPreciosVectorStore.asRetriever(1);

    const retrieverServicioPrecioTool = createRetrieverTool(
      retrieverServicioPrecio,
      {
        name: "precios_servicios",
        description:
          "Debes utilizar esta herramienta para brindar el precio de algún servicio en específico",
      }
    );

    // Servicio Reservas
    const retrieverServicioReservas =
      pgServiciosReservasVectorStore.asRetriever();

    const retrieverServicioReservasTool = createRetrieverTool(
      retrieverServicioReservas,
      {
        name: "reservas_servicios",
        description:
          "Debes utilizar esta herramienta si el cliente desea conocer las reservas de algún servicio en específico en un rango de tiempo determinado",
      }
    );

    // Esquema de productos

    const productosSchema = z.object({
      nombreCliente: z.string().describe("El nombre del cliente"),
      productos: z.array(
        z.object({
          nombreProducto: z.string().describe("El nombre del producto"),
          cantidad: z.number().describe("La cantidad de productos"),
        })
      ),
    });

    const clienteListaProductosTool = tool(
      async ({ nombreCliente, productos }) => {
        try {
          // productos.forEach(async (producto) => {
          let detalleCotizacion = null;
          let total = 0;

          let pdfProduct: Product[] = [];

          for (const producto of productos) {
            const productoMasSimilar =
              await pgProductosNombreVectorStore.similaritySearch(
                producto.nombreProducto,
                1
              );

            const productoFiltrado = await srvObtenerProducto(
              productoMasSimilar[0].metadata.producto_id
            );

            if (productoFiltrado === null) {
              throw new Error(
                `El producto ${producto.nombreProducto} no se encuentra en la base de datos`
              );
            }

            pdfProduct.push({
              name: `${producto.cantidad} - ${productoFiltrado.nombre}`,
              price: productoFiltrado.precio,
            });

            total += productoFiltrado.precio * producto.cantidad;
          }
          // Generamos el PDF
          const pdfUrl = await generatePdf(total, nombreCliente, pdfProduct);

          return `Se genera la proforma correctamente. Puede ver los detalles desde el siguiente enlace: ${pdfUrl}`;
        } catch (error: any) {
          console.error(error);
          return error.message;
        }
      },
      {
        name: "nombre_cliente",
        description: `Debes utilizar esta herramienta para elaborar proformas de productos`,

        schema: productosSchema,
      }
    );

    // Juntamos las herramientas

    const tools = [
      retrieverProductoNombreTool,
      retrieverProductoDescripcionTool,
      retrieverProductoPrecioTool,
      retrieverProductoStockTool,
      // productosProformas,
      retrieverServicioNombreTool,
      retrieverServicioDescripcionTool,
      retrieverServicioPrecioTool,
      retrieverServicioReservasTool,

      clienteListaProductosTool,
    ];

    // chatHistory;

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `Eres un asistente virtual y tu nombre es MIa.
1. Brindas información sobre productos y servicios al igual que generas proformas.
2. Puedes generar respuestas con listas de ser necesario.
3. Para adicionar un servicio en una proforma, el usuario debe proporcionar la fecha, hora y duración en horas del servicio.
4. Antes de crear una proforma, debes verificar si el cliente ha proporcionado su nombre. Si no lo ha hecho, debes solicitarlo.
5. Antes de agregar un producto a una proforma, debes verificar que esté disponible en stock.
6. Si los datos para elaborar una respuesta coherente no se encuentran en el contexto, debes responder que no tienes la información disponible en este momento. NO genere información falsa.`,
      ],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);
    // 3. Si la fecha proporcionada por el usuario para la elaboración de una proforma es inválida, debes responder que la fecha es inválida.
    // 4. Las fechas proporcionadas en el contexto para la elaboración de proformas que incluyen servicios, corresponden a fechas que NO están disponibles, todas las demás fechas son válidas.

    // 8. Luego de que la elaboración de la proforma haya finalizado, debes solicitar confirmación al cliente para enviarle el detalle de la proforma.

    const agent = await createOpenAIFunctionsAgent({
      llm: chatModel,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    const agenteConHistorial = await srvRunnableConHistorial(agentExecutor);

    return agenteConHistorial;
  } catch (error) {
    console.error(error);
    return error;
  }
};
