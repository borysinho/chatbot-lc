import pgvector from "pgvector";
// import { ServiciosEmbeddings } from "@prisma/client";
import prisma from "../../objects/prisma.object";
import { embeberDocumento } from "../embeddings.service";
import { TDocuments, srvInsertarDocumento } from "./documents.service";
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

export const srvServiciosDescToEmbeddings = async () => {
  const servicios = await srvObtenerServicios();
  const embeddings = await embeberDocumento(
    "servicio-descripcion",
    servicios.map((servicio) => `${servicio.nombre}. ${servicio.descripcion}`)
  );

  const serviciosArray: TDocuments[] = servicios.map((servicio, i: number) => {
    return {
      ref_id: servicio.servicio_id,
      clase: "servicio-descripcion",
      descripcion: `${servicio.nombre}. ${servicio.descripcion}`,
      embedding: embeddings.data[i].embedding,
    };
  });

  await srvInsertarDocumento(serviciosArray);

  return serviciosArray;
};

export const srvServiciosPrecioToEmbeddings = async () => {
  const servicios = await srvObtenerServicios();
  const embeddings = await embeberDocumento(
    "servicio-precio",
    servicios.map(
      (servicio) =>
        `${servicio.nombre}. Costo: ${servicio.tarifa} ${
          servicio.moneda
        } por ${formatearTiempo(servicio.duracion_en_horas * 60 * 60)}`
    )
  );

  const serviciosArray: TDocuments[] = servicios.map((servicio, i: number) => {
    return {
      ref_id: servicio.servicio_id,
      clase: "servicio-precio",
      descripcion: `${servicio.nombre}. Costo: ${servicio.tarifa} ${
        servicio.moneda
      } por ${formatearTiempo(servicio.duracion_en_horas * 60 * 60)}`,
      embedding: embeddings.data[i].embedding,
    };
  });

  await srvInsertarDocumento(serviciosArray);

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
