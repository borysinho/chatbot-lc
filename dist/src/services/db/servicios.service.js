"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.srvObtenerServiciosEmbeddings = exports.srvInsertarServicioEmbedding = exports.srvServiciosPrecioToText = exports.srvServiciosDescToText = exports.srvServiciosNombreToText = exports.srvEliminarServicio = exports.srvActualizarServicio = exports.srvObtenerServicio = exports.srvObtenerServicios = exports.srvInsertarServicio = void 0;
const pgvector_1 = __importDefault(require("pgvector"));
// import { ServiciosEmbeddings } from "@prisma/client";
const prisma_object_1 = require("../../objects/prisma.object");
const utils_1 = require("../../utils");
const srvInsertarServicio = async (servicio) => {
    const servicioCreado = await prisma_object_1.prisma.servicios.create({
        data: {
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            tarifa: servicio.tarifa,
            duracion_en_horas: servicio.duracion,
        },
    });
    return servicioCreado;
};
exports.srvInsertarServicio = srvInsertarServicio;
const srvObtenerServicios = async () => {
    const servicios = await prisma_object_1.prisma.servicios.findMany({
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
exports.srvObtenerServicios = srvObtenerServicios;
const srvObtenerServicio = async (servicio_id) => {
    const servicio = await prisma_object_1.prisma.servicios.findUnique({
        where: {
            servicio_id,
        },
    });
    return servicio;
};
exports.srvObtenerServicio = srvObtenerServicio;
const srvActualizarServicio = async (servicio_id, servicio) => {
    const servicioActualizado = await prisma_object_1.prisma.servicios.update({
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
exports.srvActualizarServicio = srvActualizarServicio;
const srvEliminarServicio = async (servicio_id) => {
    const servicioEliminado = await prisma_object_1.prisma.servicios.delete({
        where: {
            servicio_id,
        },
    });
    return servicioEliminado;
};
exports.srvEliminarServicio = srvEliminarServicio;
const srvServiciosNombreToText = async () => {
    const servicios = await (0, exports.srvObtenerServicios)();
    const serviciosArray = servicios.map((servicio) => {
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
exports.srvServiciosNombreToText = srvServiciosNombreToText;
const srvServiciosDescToText = async () => {
    const servicios = await (0, exports.srvObtenerServicios)();
    const serviciosArray = servicios.map((servicio) => {
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
exports.srvServiciosDescToText = srvServiciosDescToText;
const srvServiciosPrecioToText = async () => {
    const servicios = await (0, exports.srvObtenerServicios)();
    const serviciosArray = servicios.map((servicio, i) => {
        return {
            metadata: { tipo: "servicio-precio", servicio_id: servicio.servicio_id },
            pageContent: `Servicio: ${servicio.nombre}, Precio: ${servicio.tarifa} ${servicio.moneda} por ${(0, utils_1.formatearTiempo)(servicio.duracion_en_horas * 60 * 60)}`,
        };
    });
    return serviciosArray;
};
exports.srvServiciosPrecioToText = srvServiciosPrecioToText;
/**
 * ===============SERVICIOS EMDBEDDINGS================
 */
const srvInsertarServicioEmbedding = async (servicios) => { };
exports.srvInsertarServicioEmbedding = srvInsertarServicioEmbedding;
const srvObtenerServiciosEmbeddings = async (vector) => {
    const embedding = pgvector_1.default.toSql(vector);
    const similitudes = await prisma_object_1.prisma.$queryRaw `SELECT servicioembedding_id, servicio_id, descripcion, embedding::text FROM "ServiciosEmbeddings" ORDER BY embedding <-> ${embedding}::vector LIMIT 2`;
    return similitudes;
};
exports.srvObtenerServiciosEmbeddings = srvObtenerServiciosEmbeddings;
/**
 * ===============SERVICIOS EMDBEDDINGS================
 */
