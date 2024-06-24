import {
  pgProductosDescripcionVectorStore,
  pgProductosNombreVectorStore,
  pgProductosPreciosVectorStore,
  pgServiciosDescripcionVectorStore,
  pgServiciosNombreVectorStore,
  pgServiciosPreciosVectorStore,
} from "../objects/pgvector.object";

import {
  srvProdDescrToText,
  srvProdNombreToText,
  srvProdPrecioToText,
} from "./db/productos.service";

import {
  srvServiciosDescToText,
  srvServiciosNombreToText,
  srvServiciosPrecioToText,
} from "./db/servicios.service";

export const cargarVectores = async () => {
  try {
    await pgProductosDescripcionVectorStore.delete({ filter: {} });
    await pgProductosPreciosVectorStore.delete({ filter: {} });
    await pgServiciosDescripcionVectorStore.delete({ filter: {} });
    await pgServiciosPreciosVectorStore.delete({ filter: {} });

    console.log("Cargando vectores...");

    const prodNombre = await srvProdNombreToText();
    const prodDescr = await srvProdDescrToText();
    const prodPrecio = await srvProdPrecioToText();
    const servNombre = await srvServiciosNombreToText();
    const servDescr = await srvServiciosDescToText();
    const servPrecio = await srvServiciosPrecioToText();
    // const paqDescr = await srvPaqueteDescripcionToText();
    // const paqPrecio = await srvPaquetePrecioToText();

    await pgProductosNombreVectorStore.addDocuments(prodNombre);
    await pgProductosDescripcionVectorStore.addDocuments(prodDescr);
    await pgProductosPreciosVectorStore.addDocuments(prodPrecio);
    await pgServiciosNombreVectorStore.addDocuments(servNombre);
    await pgServiciosDescripcionVectorStore.addDocuments(servDescr);
    await pgServiciosPreciosVectorStore.addDocuments(servPrecio);
    // await pgProductosDescripcionVectorStore.addDocuments(paqDescr);
    // await pgProductosPreciosVectorStore.addDocuments(paqPrecio);
    console.log("Vectores cargados.");

    return "Vectores cargados.";
  } catch (error) {
    console.error(error);
    return error;
  }
};
