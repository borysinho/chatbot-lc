import pgvector from "pgvector";
import prisma from "../../objects/prisma.object";
// import { PaquetesEmbeddings } from "@prisma/client";
import client from "../../objects/prisma.object";
import { TDocuments, srvInsertarDocumento } from "./documents.service";
import { embeberDocumento } from "../embeddings.service";

export type TPaquetesEmbeddings = {
  paqueteembedding_id: number;
  paquete_id: number;
  descripcion: string;
  embedding: number[];
};

export const srvInsertarPaquete = async (paquete: any) => {
  const paqueteCreado = await client.paquetes.create({
    data: {
      nombre: paquete.nombre,
      descripcion: paquete.descripcion,
      precio: paquete.precio,
    },
  });

  return paqueteCreado;
};

export const srvObtenerPaquetes = async () => {
  const paquetes = await client.paquetes.findMany();

  return paquetes;
};

export const srvObtenerPaquete = async (paquete_id: number) => {
  const paquete = await client.paquetes.findUnique({
    where: {
      paquete_id,
    },
  });

  return paquete;
};

export const srvActualizarPaquete = async (
  paquete_id: number,
  paquete: any
) => {
  const paqueteActualizado = await client.paquetes.update({
    where: {
      paquete_id,
    },
    data: {
      nombre: paquete.nombre,
      descripcion: paquete.descripcion,
      precio: paquete.precio,
    },
  });

  return paqueteActualizado;
};

export const srvEliminarPaquete = async (paquete_id: number) => {
  const paqueteEliminado = await client.paquetes.delete({
    where: {
      paquete_id,
    },
  });

  return paqueteEliminado;
};

export const srvObtenerFullPaquete = async () => {
  const paquetes = await client.paquetes.findMany({
    select: {
      paquete_id: true,
      nombre: true,
      descripcion: true,
      precio: true,
      moneda: true,
      elementospaquetes: {
        select: {
          cantidad: true,
          tipo_elemento: true,
          productos: {
            select: {
              nombre: true,
              descripcion: true,
              precio: true,
              moneda: true,
            },
          },
          servicios: {
            select: {
              nombre: true,
              descripcion: true,
              tarifa: true,
              moneda: true,
              duracion_en_horas: true,
            },
          },
        },
      },
    },
  });

  return paquetes;
};

export const srvPaqueteDescripcionToEmbeddings = async () => {
  const paquetes = await srvObtenerFullPaquete();
  const paquetesStringArray = paquetes.map((paquete) => {
    const elementos = paquete.elementospaquetes.map((elemento) => {
      return elemento.tipo_elemento === "Producto"
        ? `${elemento.cantidad}x ${elemento.productos?.nombre}`
        : `${elemento.cantidad}x ${elemento.servicios?.nombre}`;
    });

    return `${paquete.nombre}. Consta de ${elementos.join(", ")}.`;
  });

  const embeddings = await embeberDocumento(
    "paquete-descripcion",
    paquetesStringArray
  );

  const paquetesDesc: TDocuments[] = paquetes.map((paquete, i: number) => {
    return {
      ref_id: paquete.paquete_id,
      clase: "paquete-descripcion",
      descripcion: paquetesStringArray[i],
      embedding: embeddings.data[i].embedding,
    };
  });

  await srvInsertarDocumento(paquetesDesc);

  return paquetesDesc;
};

export const srvPaquetePrecioToEmbeddings = async () => {
  const paquetes = await srvObtenerFullPaquete();
  const embeddings = await embeberDocumento(
    "paquete-precio",
    paquetes.map(
      (paquete) =>
        `${paquete.nombre}. Precio: ${paquete.precio} ${paquete.moneda}`
    )
  );

  const paquetesPrecio: TDocuments[] = paquetes.map((paquete, i: number) => {
    return {
      ref_id: paquete.paquete_id,
      clase: "paquete-precio",
      descripcion: `${paquete.nombre}. Precio: ${paquete.precio} ${paquete.moneda}`,
      embedding: embeddings.data[i].embedding,
    };
  });

  await srvInsertarDocumento(paquetesPrecio);

  return paquetesPrecio;
};
