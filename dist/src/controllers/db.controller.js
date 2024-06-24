"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctrlCargarDatos = void 0;
const utils_1 = require("../utils");
const documentos_service_1 = require("../services/documentos.service");
exports.ctrlCargarDatos = (0, utils_1.catchedAsync)(async (req, res) => {
    await (0, documentos_service_1.cargarVectores)();
    (0, utils_1.response)(res, 200, "Datos cargados.");
});
