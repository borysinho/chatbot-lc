import pgvector from "pgvector";
import prisma from "../objects/prisma.object";
import {
  writeFileSync,
  readFileSync,
  access,
  mkdirSync,
  readdirSync,
} from "fs";
import { openaiEmbeddings } from "../objects/embeddings.object";
import {
  srvPaqueteDescripcionToEmbeddings,
  srvPaquetePrecioToEmbeddings,
} from "./db/paquetes.service";
import {
  srvObtenerProductoEmbedding,
  srvProdDescrToEmbeddings,
  srvProdPrecioToEmbeddings,
} from "./db/productos.service";
import {
  srvInsertarServicioEmbedding,
  srvObtenerServiciosEmbeddings,
  srvServiciosDescToEmbeddings,
  srvServiciosPrecioToEmbeddings,
} from "./db/servicios.service";
import { srvEliminarDocumentos } from "./db/documents.service";

export const embeberDocumento = async (
  nombreDocumento: string,
  input: string[]
) => {
  console.log(
    `Embebiendo documento "${nombreDocumento}" de ${input.length} párrafos...`
  );
  const vectors = await openaiEmbeddings.embeddings.create({
    model: "text-embedding-3-small",
    input,
    encoding_format: "float",
    dimensions: 500,
  });

  return vectors;
};

const ObjectToFile = (obj: Object, folder: string, filename: string) =>
  writeFileSync(
    `${folder}${filename}.JSON`,
    JSON.stringify(obj, null, 2),
    "utf8"
  );

const FileToObject = async (folder: string, filename: string) => {
  return await JSON.parse(readFileSync(`${folder}${filename}.JSON`, "utf8"));
};

const existenArchivos = (folder: string) => {
  try {
    const fileList = readdirSync(folder);
    return fileList.length > 0;
  } catch (error) {
    return false;
  }
};

const exportarData = async (data: any, folder: string, filename: string) => {
  try {
    access(folder, (err) => {
      if (err) {
        mkdirSync(folder);
      }
    });
    ObjectToFile(data, folder, filename);
  } catch (error) {
    console.error(error);
  }
};

const folder = "./src/data/vectors/";

const insertarEmbeddingsAObjeto = async (
  nombreDocumento: string,
  objArray: any[]
) => {
  // Generamos un arreglo del tipo [string] únicamente con las descripciones
  const descripcionesArray = objArray.map((obj: any) => obj.descripcion);

  // Obtenemos los embeddings de cada descripción
  const descripcionesEmbeddings = await embeberDocumento(
    nombreDocumento,
    descripcionesArray
  );

  // Insertamos los embeddings en el objeto original
  const result = objArray.map((prod: any, i: any) => ({
    ...prod,
    embedding: descripcionesEmbeddings.data[i].embedding,
  }));

  return result;
};

export const parseSQLToVector = async () => {
  try {
    // Obtenemos los datos de la BD
    await srvEliminarDocumentos();
    await srvProdDescrToEmbeddings();
    await srvProdPrecioToEmbeddings();
    await srvServiciosDescToEmbeddings();
    await srvServiciosPrecioToEmbeddings();
    await srvPaqueteDescripcionToEmbeddings();
    await srvPaquetePrecioToEmbeddings();
    console.log("Embeddings cargados.");
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const realizarBusquedaSemantica = async (vector: number[]) => {
  const productos = await srvObtenerProductoEmbedding(vector);
  const servicios = await srvObtenerServiciosEmbeddings(vector);
};

export const realizarBusquedaSemanticaFiltrada = async (vector: number[]) => {
  const productos = await srvObtenerProductoEmbedding(vector);
  const servicios = await srvObtenerServiciosEmbeddings(vector);

  const embedding = pgvector.toSql(vector);

  const similitudes =
    await prisma.$queryRaw`SELECT productoembedding_id, producto_id, descripcion, embedding::text 
    FROM (
      VALUES (${productos[0].descripcion}, ${productos[0].embedding}),
    )
    ORDER BY embedding <-> ${embedding}::vector LIMIT 2`;

  return similitudes;
};
