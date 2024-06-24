"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAgent = void 0;
const retriever_1 = require("langchain/tools/retriever");
const agents_1 = require("langchain/agents");
const pgvector_object_1 = require("../objects/pgvector.object");
const completions_object_1 = require("../objects/completions.object");
const hub_1 = require("langchain/hub");
const chat_history_object_1 = require("../objects/chat.history.object");
const chat_service_1 = require("./db/chat.service");
const buildAgent = async (inputText, whatsappNumber) => {
    try {
        // Producto Nombre
        const retrieverProductoNombre = pgvector_object_1.pgProductosNombreVectorStore.asRetriever();
        const retrieverProductoNombreTool = (0, retriever_1.createRetrieverTool)(retrieverProductoNombre, {
            name: "nombre_productos",
            description: `Debes utilizar esta herramienta en las siguientes circunstancias:
1. En caso que el cliente consulte que productos tenemos a la venta.
2. En caso que pregunte qué productos similares tenemos a la venta.`,
        });
        // Producto Descripción
        const retrieverProductoDescripcion = pgvector_object_1.pgProductosDescripcionVectorStore.asRetriever(1);
        const retrieverProductoDescripcionTool = (0, retriever_1.createRetrieverTool)(retrieverProductoDescripcion, {
            name: "descripcion_productos",
            description: `Debes utilizar esta herramienta en las siguientes circunstancias: 
1. En caso que el cliente le interese algún producto en específico.
2. En caso que el cliente solicite más detalles sobre algún producto en específico.`,
        });
        // Producto Precio
        const retrieverProductoPrecio = pgvector_object_1.pgProductosPreciosVectorStore.asRetriever(1);
        const retrieverProductoPrecioTool = (0, retriever_1.createRetrieverTool)(retrieverProductoPrecio, {
            name: "precios_productos",
            description: "Debes utilizar esta herramienta para brindar el precio de algún producto en específico",
        });
        // Servicio Nombre
        const retrieverServicioNombre = pgvector_object_1.pgServiciosNombreVectorStore.asRetriever();
        const retrieverServicioNombreTool = (0, retriever_1.createRetrieverTool)(retrieverServicioNombre, {
            name: "nombre_servicios",
            description: `Debes utilizar esta herramienta en las siguientes circunstancias:
1. En caso que el cliente consulte que servicios tenemos para ofrecer.
2. En caso que pregunte qué servicios similares tenemos para ofrecer.`,
        });
        // Servicio Descripcion
        const retrieverServicioDescripcion = pgvector_object_1.pgServiciosDescripcionVectorStore.asRetriever(1);
        const retrieverServicioDescripcionTool = (0, retriever_1.createRetrieverTool)(retrieverServicioDescripcion, {
            name: "descripcion_servicios",
            description: `Debes utilizar esta herramienta en las siguientes circunstancias: 
1. En caso que el cliente le interese algún servicio en específico.
2. En caso que el cliente solicite más detalles sobre algún servicio en específico.`,
        });
        // Servicio Precio
        const retrieverServicioPrecio = pgvector_object_1.pgServiciosPreciosVectorStore.asRetriever(1);
        const retrieverServicioPrecioTool = (0, retriever_1.createRetrieverTool)(retrieverServicioPrecio, {
            name: "precios_servicios",
            description: "Debes utilizar esta herramienta para brindar el precio de algún servicio en específico",
        });
        const tools = [
            retrieverProductoNombreTool,
            retrieverProductoDescripcionTool,
            retrieverProductoPrecioTool,
            retrieverServicioNombreTool,
            retrieverServicioDescripcionTool,
            retrieverServicioPrecioTool,
        ];
        chat_history_object_1.chatHistory;
        // Creamos el agente
        const prompt = await (0, hub_1.pull)("hwchase17/openai-functions-agent");
        const agent = await (0, agents_1.createOpenAIFunctionsAgent)({
            llm: completions_object_1.chatModel,
            tools,
            prompt,
        });
        const agentExecutor = new agents_1.AgentExecutor({
            agent,
            tools,
        });
        const agenteConHistorial = await (0, chat_service_1.srvRunnableConHistorial)(agentExecutor);
        const result1 = await agenteConHistorial.invoke({
            input: inputText,
        }, { configurable: { sessionId: whatsappNumber } });
        console.log({ result1 });
        return result1;
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.buildAgent = buildAgent;
