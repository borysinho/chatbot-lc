"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.srvEliminarDocumentos = exports.srvBuscarSimilaridad = exports.srvInsertarDocumentos = void 0;
const pgvector_object_1 = require("../objects/pgvector.object");
// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pgvector
const srvInsertarDocumentos = async (documentos) => {
    try {
        // const pgvectorStore = await pgVectorStore();
        // await pgvectorStore.addDocuments(documentos);
        // pgvectorStore.end();
    }
    catch (error) {
        console.error(error);
    }
};
exports.srvInsertarDocumentos = srvInsertarDocumentos;
const srvBuscarSimilaridad = async (texto, cantidad) => {
    const resultado = await pgvector_object_1.pgProductosDescripcionVectorStore.similaritySearch(texto, cantidad);
    console.log(`Similaridad de ${texto}:`, resultado.map((r) => r.metadata));
    pgvector_object_1.pgProductosDescripcionVectorStore.end();
    return resultado;
};
exports.srvBuscarSimilaridad = srvBuscarSimilaridad;
const srvEliminarDocumentos = async () => {
    console.log("Eliminando documentos...");
    try {
        // const pgvectorStore = await pgVectorStore();
        await pgvector_object_1.pgProductosDescripcionVectorStore.delete({
            filter: {},
        });
        // pgvectorStore.end();
    }
    catch (error) {
        console.error(error);
    }
};
exports.srvEliminarDocumentos = srvEliminarDocumentos;
