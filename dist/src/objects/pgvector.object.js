"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgServiciosPreciosVectorStore = exports.pgProductosPreciosVectorStore = exports.pgServiciosDescripcionVectorStore = exports.pgServiciosNombreVectorStore = exports.pgProductosDescripcionVectorStore = exports.pgProductosNombreVectorStore = exports.reusablePool = void 0;
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
const pg_1 = __importDefault(require("pg"));
const embeddings_object_1 = require("./embeddings.object");
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432");
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_SCHEMA = process.env.DB_SCHEMA;
exports.reusablePool = new pg_1.default.Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});
// Nombre Productos
const nombreProductosConfig = {
    pool: exports.reusablePool,
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
    strategy: "cosine",
};
exports.pgProductosNombreVectorStore = new pgvector_1.PGVectorStore(embeddings_object_1.embeddings, nombreProductosConfig);
// Descripcion Productos
const descripcionProductosConfig = {
    pool: exports.reusablePool,
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
    strategy: "cosine",
};
exports.pgProductosDescripcionVectorStore = new pgvector_1.PGVectorStore(embeddings_object_1.embeddings, descripcionProductosConfig);
// Nombre Servicios
const nombreServiciosConfig = {
    pool: exports.reusablePool,
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
    strategy: "cosine",
};
exports.pgServiciosNombreVectorStore = new pgvector_1.PGVectorStore(embeddings_object_1.embeddings, nombreServiciosConfig);
// Descripion Servicios
const descripcionServiciosConfig = {
    pool: exports.reusablePool,
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
    strategy: "cosine",
};
exports.pgServiciosDescripcionVectorStore = new pgvector_1.PGVectorStore(embeddings_object_1.embeddings, descripcionServiciosConfig);
// Precios Productos
const precioProductosConfig = {
    pool: exports.reusablePool,
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
    strategy: "cosine",
};
exports.pgProductosPreciosVectorStore = new pgvector_1.PGVectorStore(embeddings_object_1.embeddings, precioProductosConfig);
// Precios Servicios
const precioServiciosConfig = {
    pool: exports.reusablePool,
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
    strategy: "cosine",
};
exports.pgServiciosPreciosVectorStore = new pgvector_1.PGVectorStore(embeddings_object_1.embeddings, precioServiciosConfig);
// Inicialización en caso que no esté inicializado
pgvector_1.PGVectorStore.initialize(embeddings_object_1.embeddings, descripcionProductosConfig);
