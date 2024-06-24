"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatearTiempo = exports.getFormatedDate = void 0;
const getFormatedDate = (date) => {
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
exports.getFormatedDate = getFormatedDate;
const formatearTiempo = (segundos) => {
    const dias = Math.floor(segundos / (60 * 60 * 24));
    segundos -= dias * (60 * 60 * 24);
    const horas = Math.floor(segundos / (60 * 60));
    segundos -= horas * (60 * 60);
    const minutos = Math.floor(segundos / 60);
    segundos -= minutos * 60;
    return ((dias > 0 ? `${dias} días ` : "") +
        (horas > 0 ? `${horas} horas ` : "") +
        (minutos > 0 ? `${minutos} minutos ` : "") +
        (segundos > 0 ? `${segundos} segundos` : "")).trim();
};
exports.formatearTiempo = formatearTiempo;
