import { prisma } from "../../objects/prisma.object";
import { Document } from "@langchain/core/documents";
import {
  formatearTiempo,
  getFormatedDate,
  getFormatedHour,
} from "../../utils/dates.utils";

export const srvServiciosReservasToText = async () => {
  const servicios = await prisma.servicios.findMany({
    include: {
      reservasservicios: true,
    },
  });

  let reservasArray: Document[] = [];
  for (const servicio of servicios) {
    const reservas = servicio.reservasservicios;

    if (reservas.length === 0) {
      reservasArray.push({
        metadata: {
          tipo: "servicio-reservas",
        },
        pageContent: `El servicio ${servicio.nombre} está disponible para cualquier fecha.`,
      });
    } else {
      reservasArray.push(
        ...reservas.map((reserva) => {
          return {
            metadata: {
              tipo: "servicio-reservas",
              reserva_id: reserva.reserva_id,
            },
            pageContent: `El servicio ${
              servicio.nombre
            } ya se encuentra reservado para el ${getFormatedDate(
              reserva.fecha
            )} a las ${getFormatedHour(reserva.hora)} durante ${formatearTiempo(
              reserva.duracion_en_horas * 60 * 60
            )}, por lo que no puede reservarse en este periodo de tiempo`,
          };
        })
      );
    }
  }

  return reservasArray;
};
