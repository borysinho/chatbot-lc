import { Prisma } from "@prisma/client";
import { prisma } from "../../objects/prisma.object";

export const srvInsertarDetalleCotizacion = async (
  data: Prisma.DetallesCotizacionesCreateInput
) => {
  const detalleCotizacionCreado = await prisma.detallesCotizaciones.create({
    data: {
      ...data,
    },
  });

  return detalleCotizacionCreado;
};

export const srvObtenerDetallesCotizacion = async () => {
  const detallesCotizacion = await prisma.detallesCotizaciones.findMany();

  return detallesCotizacion;
};

export const srvObtenerDetalleCotizacion = async (
  detalle_cotizacion_id: number
) => {
  const detalleCotizacion = await prisma.detallesCotizaciones.findUnique({
    where: {
      detalle_cotizacion_id,
    },
  });

  return detalleCotizacion;
};

export const srvObtenerDetalleCotizacionDesdeCotizacion = async (
  cotizacion_id: number
) => {
  const detallesCotizacion = await prisma.detallesCotizaciones.findMany({
    where: {
      cotizacion_id,
    },
  });

  return detallesCotizacion;
};

export const srvActualizarDetalleCotizacion = async (
  detalle_cotizacion_id: number,
  detalleCotizacion: any
) => {
  const detalleCotizacionActualizado = await prisma.detallesCotizaciones.update(
    {
      where: {
        detalle_cotizacion_id,
      },
      data: detalleCotizacion,
    }
  );

  return detalleCotizacionActualizado;
};

export const srvEliminarDetalleCotizacion = async (
  detalle_cotizacion_id: number
) => {
  const detalleCotizacionEliminado = await prisma.detallesCotizaciones.delete({
    where: {
      detalle_cotizacion_id,
    },
  });

  return detalleCotizacionEliminado;
};
