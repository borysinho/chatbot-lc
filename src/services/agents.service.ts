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
  pgServiciosDescripcionVectorStore,
  pgServiciosNombreVectorStore,
  pgServiciosPreciosVectorStore,
  reusablePool,
} from "../objects/pgvector.object";
import { chatModel } from "../objects/completions.object";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { chatHistory } from "../objects/chat.history.object";
import { srvRunnableConHistorial } from "./db/chat.service";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { PoolConfig } from "pg";
import { embeddings } from "../objects/embeddings.object";

export const buildAgent = async (inputText: string, whatsappNumber: string) => {
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

    const tools = [
      retrieverProductoNombreTool,
      retrieverProductoDescripcionTool,
      retrieverProductoPrecioTool,
      retrieverServicioNombreTool,
      retrieverServicioDescripcionTool,
      retrieverServicioPrecioTool,
    ];

    chatHistory;

    // Creamos el agente

    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/openai-functions-agent"
    );

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

    const result1 = await agenteConHistorial.invoke(
      {
        input: inputText,
      },
      { configurable: { sessionId: whatsappNumber } }
    );

    console.log({ result1 });

    return result1;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const textDBIndex = async () => {
  const config = {
    postgresConnectionOptions: {
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "chatbot",
    } as PoolConfig,
    tableName: "Documents",
    columns: {
      idColumnName: "document_id",
      vectorColumnName: "vector",
      contentColumnName: "pagecontent",
      metadataColumnName: "metadata",
    },
  };

  const vectorStore = await PGVectorStore.initialize(embeddings, config);

  // Create a new record manager
  const recordManagerConfig = {
    postgresConnectionOptions: {
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "chatbot",
    } as PoolConfig,
    tableName: "upsertion_records",
  };
  const recordManager = new PostgresRecordManager(
    "test_namespace",
    recordManagerConfig
  );

  // Create the schema if it doesn't exist
  await recordManager.createSchema();

  const doc1 = {
    pageContent: "kitty",
    metadata: { source: "kitty.txt" },
  };

  const doc2 = {
    pageContent: "doggy",
    metadata: { source: "doggy.txt" },
  };

  /**
   * Hacky helper method to clear content. See the `full` mode section to to understand why it works.
   */
  async function clear() {
    await index({
      docsSource: [],
      recordManager,
      vectorStore,
      options: {
        cleanup: "full",
        sourceIdKey: "source",
      },
    });
  }

  // No cleanup
  await clear();
  // This mode does not do automatic clean up of old versions of content; however, it still takes care of content de-duplication.

  console.log(
    await index({
      docsSource: [doc1, doc1, doc1, doc1, doc1, doc1],
      recordManager,
      vectorStore,
      options: {
        cleanup: undefined,
        sourceIdKey: "source",
      },
    })
  );

  await clear();

  console.log(
    await index({
      docsSource: [doc1, doc2],
      recordManager,
      vectorStore,
      options: {
        cleanup: undefined,
        sourceIdKey: "source",
      },
    })
  );

  const doc1Updated = {
    pageContent: "kitty updated",
    metadata: { source: "kitty.txt" },
  };

  console.log(
    await index({
      docsSource: [doc1Updated, doc2],
      recordManager,
      vectorStore,
      options: {
        cleanup: undefined,
        sourceIdKey: "source",
      },
    })
  );
};
