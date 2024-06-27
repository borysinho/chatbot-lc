import { Prisma } from "@prisma/client";
import { prisma } from "../../objects/prisma.object";

export const srvInsertarCotizacion = async (
  data: Prisma.CotizacionesCreateInput
) => {
  const cotizacionCreado = await prisma.cotizaciones.create({
    data: {
      ...data,
    },
  });

  return cotizacionCreado;
};

export const srvObtenerCotizaciones = async () => {
  const cotizaciones = await prisma.cotizaciones.findMany();

  return cotizaciones;
};

export const srvObtenerCotizacion = async (cotizacion_id: number) => {
  const cotizacion = await prisma.cotizaciones.findUnique({
    where: {
      cotizacion_id,
    },
  });

  return cotizacion;
};

export const srvActualizarCotizacion = async (
  cotizacion_id: number,
  cotizacion: any
) => {
  const cotizacionActualizado = await prisma.cotizaciones.update({
    where: {
      cotizacion_id,
    },
    data: cotizacion,
  });

  return cotizacionActualizado;
};

export const srvEliminarCotizacion = async (cotizacion_id: number) => {
  const cotizacionEliminado = await prisma.cotizaciones.delete({
    where: {
      cotizacion_id,
    },
  });

  return cotizacionEliminado;
};
