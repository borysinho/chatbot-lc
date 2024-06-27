import {
  PGVectorStore,
  DistanceStrategy,
  PGVectorStoreArgs,
} from "@langchain/community/vectorstores/pgvector";

import pg from "pg";

import { embeddings } from "./embeddings.object";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432");
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_SCHEMA = process.env.DB_SCHEMA;

export const reusablePool = new pg.Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Nombre Productos

const nombreProductosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "productos_nombre",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgProductosNombreVectorStore = new PGVectorStore(
  embeddings,
  nombreProductosConfig
);

// Descripcion Productos

const descripcionProductosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "productos_descripcion",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgProductosDescripcionVectorStore = new PGVectorStore(
  embeddings,
  descripcionProductosConfig
);

// Precios Productos

const precioProductosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "productos_precios",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgProductosPreciosVectorStore = new PGVectorStore(
  embeddings,
  precioProductosConfig
);

// Stock Productos

const stockProductosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "productos_stock",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgProductosStockVectorStore = new PGVectorStore(
  embeddings,
  stockProductosConfig
);

// Nombre Servicios

const nombreServiciosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "servicios_nombre",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgServiciosNombreVectorStore = new PGVectorStore(
  embeddings,
  nombreServiciosConfig
);

// Descripion Servicios

const descripcionServiciosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "servicios_descripcion",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgServiciosDescripcionVectorStore = new PGVectorStore(
  embeddings,
  descripcionServiciosConfig
);

// Precios Servicios

const precioServiciosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "servicios_precios",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgServiciosPreciosVectorStore = new PGVectorStore(
  embeddings,
  precioServiciosConfig
);

// Rerservas Servicios

const reservasServiciosConfig = {
  pool: reusablePool,
  tableName: "Documents",
  collectionName: "servicios_reservas",
  collectionTableName: "collections",
  schema: "public",
  columns: {
    idColumnName: "document_id",
    vectorColumnName: "vector",
    contentColumnName: "pagecontent",
    metadataColumnName: "metadata",
  },
  strategy: "cosine" as DistanceStrategy,
};

export const pgServiciosReservasVectorStore = new PGVectorStore(
  embeddings,
  reservasServiciosConfig
);

// Inicialización en caso que no esté inicializado

PGVectorStore.initialize(embeddings, descripcionProductosConfig);
