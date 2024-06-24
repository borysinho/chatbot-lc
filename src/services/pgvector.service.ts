import { OpenAIEmbeddings } from "@langchain/openai";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { PoolConfig } from "pg";
import { pgProductosDescripcionVectorStore } from "../objects/pgvector.object";
import { Document } from "@langchain/core/documents";
import { embeddings } from "../objects/embeddings.object";

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pgvector

export const srvInsertarDocumentos = async (documentos: Document[]) => {
  try {
    // const pgvectorStore = await pgVectorStore();
    // await pgvectorStore.addDocuments(documentos);
    // pgvectorStore.end();
  } catch (error) {
    console.error(error);
  }
};

export const srvBuscarSimilaridad = async (texto: string, cantidad: number) => {
  const resultado = await pgProductosDescripcionVectorStore.similaritySearch(
    texto,
    cantidad
  );
  console.log(
    `Similaridad de ${texto}:`,
    resultado.map((r) => r.metadata)
  );
  pgProductosDescripcionVectorStore.end();
  return resultado;
};

export const srvEliminarDocumentos = async () => {
  console.log("Eliminando documentos...");
  try {
    // const pgvectorStore = await pgVectorStore();
    await pgProductosDescripcionVectorStore.delete({
      filter: {},
    });
    // pgvectorStore.end();
  } catch (error) {
    console.error(error);
  }
};
