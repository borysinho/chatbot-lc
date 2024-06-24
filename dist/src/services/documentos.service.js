"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarVectores = void 0;
const pgvector_object_1 = require("../objects/pgvector.object");
const productos_service_1 = require("./db/productos.service");
const servicios_service_1 = require("./db/servicios.service");
const cargarVectores = async () => {
    try {
        await pgvector_object_1.pgProductosDescripcionVectorStore.delete({ filter: {} });
        await pgvector_object_1.pgProductosPreciosVectorStore.delete({ filter: {} });
        await pgvector_object_1.pgServiciosDescripcionVectorStore.delete({ filter: {} });
        await pgvector_object_1.pgServiciosPreciosVectorStore.delete({ filter: {} });
        console.log("Cargando vectores...");
        const prodNombre = await (0, productos_service_1.srvProdNombreToText)();
        const prodDescr = await (0, productos_service_1.srvProdDescrToText)();
        const prodPrecio = await (0, productos_service_1.srvProdPrecioToText)();
        const servNombre = await (0, servicios_service_1.srvServiciosNombreToText)();
        const servDescr = await (0, servicios_service_1.srvServiciosDescToText)();
        const servPrecio = await (0, servicios_service_1.srvServiciosPrecioToText)();
        // const paqDescr = await srvPaqueteDescripcionToText();
        // const paqPrecio = await srvPaquetePrecioToText();
        await pgvector_object_1.pgProductosNombreVectorStore.addDocuments(prodNombre);
        await pgvector_object_1.pgProductosDescripcionVectorStore.addDocuments(prodDescr);
        await pgvector_object_1.pgProductosPreciosVectorStore.addDocuments(prodPrecio);
        await pgvector_object_1.pgServiciosNombreVectorStore.addDocuments(servNombre);
        await pgvector_object_1.pgServiciosDescripcionVectorStore.addDocuments(servDescr);
        await pgvector_object_1.pgServiciosPreciosVectorStore.addDocuments(servPrecio);
        // await pgProductosDescripcionVectorStore.addDocuments(paqDescr);
        // await pgProductosPreciosVectorStore.addDocuments(paqPrecio);
        console.log("Vectores cargados.");
        return "Vectores cargados.";
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.cargarVectores = cargarVectores;
