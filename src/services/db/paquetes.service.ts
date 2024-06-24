import pgvector from "pgvector";
import { Document } from "@langchain/core/documents";
import { prisma } from "../../objects/prisma.object";

export type TPaquetesEmbeddings = {
  paqueteembedding_id: number;
  paquete_id: number;
  descripcion: string;
  embedding: number[];
};

export const srvInsertarPaquete = async (paquete: any) => {
  const paqueteCreado = await prisma.paquetes.create({
    data: {
      nombre: paquete.nombre,
      descripcion: paquete.descripcion,
      precio: paquete.precio,
    },
  });

  return paqueteCreado;
};

export const srvObtenerPaquetes = async () => {
  const paquetes = await prisma.paquetes.findMany();

  return paquetes;
};

export const srvObtenerPaquete = async (paquete_id: number) => {
  const paquete = await prisma.paquetes.findUnique({
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
  const paqueteActualizado = await prisma.paquetes.update({
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
  const paqueteEliminado = await prisma.paquetes.delete({
    where: {
      paquete_id,
    },
  });

  return paqueteEliminado;
};

export const srvObtenerFullPaquete = async () => {
  const paquetes = await prisma.paquetes.findMany({
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

export const srvPaqueteDescripcionToText = async () => {
  const paquetes = await srvObtenerFullPaquete();

  const paquetesStringArray = paquetes.map((paquete) => {
    const elementos = paquete.elementospaquetes.map((elemento) => {
      return elemento.tipo_elemento === "Producto"
        ? `${elemento.cantidad}x ${elemento.productos?.nombre}`
        : `${elemento.cantidad}x ${elemento.servicios?.nombre}`;
    });

    return `${paquete.nombre}. Consta de ${elementos.join(", ")}.`;
  });

  const paquetesDesc: Document[] = paquetes.map((paquete, i: number) => {
    return {
      metadata: { tipo: "paquete-descripcion", paquete_id: paquete.paquete_id },
      pageContent: paquetesStringArray[i],
    };
  });

  return paquetesDesc;
};

export const srvPaquetePrecioToText = async () => {
  const paquetes = await srvObtenerFullPaquete();

  const paquetesPrecio: Document[] = paquetes.map((paquete) => {
    return {
      metadata: { tipo: "paquete-precio", paquete_id: paquete.paquete_id },
      pageContent: `${paquete.nombre}. Precio: ${paquete.precio} ${paquete.moneda}`,
    };
  });

  return paquetesPrecio;
};
