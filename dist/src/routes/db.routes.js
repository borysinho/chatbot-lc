"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_controller_1 = require("../controllers/db.controller");
class DBRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post("/data", db_controller_1.ctrlCargarDatos);
        // this.router.post("/load", ctrlCargarEmbeddings);
        // this.router.post("/search", ctrlBusquedaSemanticaProductos);
    }
}
exports.default = new DBRoutes().router;
