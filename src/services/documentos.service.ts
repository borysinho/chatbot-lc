import {
  pgProductosDescripcionVectorStore,
  pgProductosNombreVectorStore,
  pgProductosPreciosVectorStore,
  pgProductosStockVectorStore,
  pgServiciosDescripcionVectorStore,
  pgServiciosNombreVectorStore,
  pgServiciosPreciosVectorStore,
  pgServiciosReservasVectorStore,
} from "../objects/pgvector.object";

import {
  srvProdDescrToText,
  srvProdNombreToText,
  srvProdPrecioToText,
  srvProdStockToText,
} from "./db/productos.service";

import {
  srvServiciosDescToText,
  srvServiciosNombreToText,
  srvServiciosPrecioToText,
} from "./db/servicios.service";

import { srvServiciosReservasToText } from "./db/reservas.service";

export const cargarVectores = async () => {
  try {
    await pgProductosDescripcionVectorStore.delete({ filter: {} });
    await pgProductosPreciosVectorStore.delete({ filter: {} });
    await pgProductosPreciosVectorStore.delete({ filter: {} });
    await pgProductosStockVectorStore.delete({ filter: {} });
    await pgServiciosDescripcionVectorStore.delete({ filter: {} });
    await pgServiciosPreciosVectorStore.delete({ filter: {} });
    await pgServiciosReservasVectorStore.delete({ filter: {} });
    await pgServiciosReservasVectorStore.delete({ filter: {} });

    console.log("Cargando vectores...");

    const prodNombre = await srvProdNombreToText();
    const prodDescr = await srvProdDescrToText();
    const prodPrecio = await srvProdPrecioToText();
    const prodStock = await srvProdStockToText();
    const servNombre = await srvServiciosNombreToText();
    const servDescr = await srvServiciosDescToText();
    const servPrecio = await srvServiciosPrecioToText();
    const servReservas = await srvServiciosReservasToText();

    // const paqDescr = await srvPaqueteDescripcionToText();
    // const paqPrecio = await srvPaquetePrecioToText();

    await pgProductosNombreVectorStore.addDocuments(prodNombre);
    await pgProductosDescripcionVectorStore.addDocuments(prodDescr);
    await pgProductosPreciosVectorStore.addDocuments(prodPrecio);
    await pgProductosStockVectorStore.addDocuments(prodStock);
    await pgServiciosNombreVectorStore.addDocuments(servNombre);
    await pgServiciosDescripcionVectorStore.addDocuments(servDescr);
    await pgServiciosPreciosVectorStore.addDocuments(servPrecio);
    await pgServiciosReservasVectorStore.addDocuments(servReservas);

    // await pgProductosDescripcionVectorStore.addDocuments(paqDescr);
    // await pgProductosPreciosVectorStore.addDocuments(paqPrecio);
    console.log("Vectores cargados.");

    return "Vectores cargados.";
  } catch (error) {
    console.error(error);
    return error;
  }
};
