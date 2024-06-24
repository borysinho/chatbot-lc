import pgvector from "pgvector";
import { Document } from "@langchain/core/documents";
// import { ServiciosEmbeddings } from "@prisma/client";
import { prisma } from "../../objects/prisma.object";
import { formatearTiempo } from "../../utils";

export type TServiciosEmbeddings = {
  servicioembedding_id: number;
  servicio_id: number;
  descripcion: string;
  embedding: number[];
};

export const srvInsertarServicio = async (servicio: any) => {
  const servicioCreado = await prisma.servicios.create({
    data: {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      tarifa: servicio.tarifa,
      duracion_en_horas: servicio.duracion,
    },
  });

  return servicioCreado;
};

export const srvObtenerServicios = async () => {
  const servicios = await prisma.servicios.findMany({
    select: {
      servicio_id: true,
      nombre: true,
      descripcion: true,
      tarifa: true,
      moneda: true,
      duracion_en_horas: true,
    },
  });

  return servicios;
};

export const srvObtenerServicio = async (servicio_id: number) => {
  const servicio = await prisma.servicios.findUnique({
    where: {
      servicio_id,
    },
  });

  return servicio;
};

export const srvActualizarServicio = async (
  servicio_id: number,
  servicio: any
) => {
  const servicioActualizado = await prisma.servicios.update({
    where: {
      servicio_id,
    },
    data: {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      tarifa: servicio.tarifa,
      duracion_en_horas: servicio.duracion,
    },
  });

  return servicioActualizado;
};

export const srvEliminarServicio = async (servicio_id: number) => {
  const servicioEliminado = await prisma.servicios.delete({
    where: {
      servicio_id,
    },
  });

  return servicioEliminado;
};

export const srvServiciosNombreToText = async () => {
  const servicios = await srvObtenerServicios();

  const serviciosArray: Document[] = servicios.map((servicio) => {
    return {
      metadata: {
        tipo: "servicio-nombre",
        servicio_id: servicio.servicio_id,
      },
      pageContent: `Servicio: ${servicio.nombre}`,
    };
  });

  return serviciosArray;
};

export const srvServiciosDescToText = async () => {
  const servicios = await srvObtenerServicios();

  const serviciosArray: Document[] = servicios.map((servicio) => {
    return {
      metadata: {
        tipo: "servicio-descripcion",
        servicio_id: servicio.servicio_id,
      },
      pageContent: `Servicio: ${servicio.nombre}, Descripción: ${servicio.descripcion}`,
    };
  });

  return serviciosArray;
};

export const srvServiciosPrecioToText = async () => {
  const servicios = await srvObtenerServicios();

  const serviciosArray: Document[] = servicios.map((servicio, i: number) => {
    return {
      metadata: { tipo: "servicio-precio", servicio_id: servicio.servicio_id },
      pageContent: `Servicio: ${servicio.nombre}, Precio: ${servicio.tarifa} ${
        servicio.moneda
      } por ${formatearTiempo(servicio.duracion_en_horas * 60 * 60)}`,
    };
  });

  return serviciosArray;
};

/**
 * ===============SERVICIOS EMDBEDDINGS================
 */

export const srvInsertarServicioEmbedding = async (
  servicios: {
    servicio_id: number;
    descripcion: string;
    embedding: number[];
  }[]
) => {};

export const srvObtenerServiciosEmbeddings = async (vector: number[]) => {
  const embedding = pgvector.toSql(vector);
  const similitudes: TServiciosEmbeddings[] =
    await prisma.$queryRaw`SELECT servicioembedding_id, servicio_id, descripcion, embedding::text FROM "ServiciosEmbeddings" ORDER BY embedding <-> ${embedding}::vector LIMIT 2`;

  return similitudes;
};

/**
 * ===============SERVICIOS EMDBEDDINGS================
 */
