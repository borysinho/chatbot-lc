import { Router } from "express";
import {
  ctrlBusquedaSemanticaProductos,
  ctrlCargarEmbeddings,
  ctrlObtenerDatos,
} from "../controllers/db.controller";

class DBRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/data", ctrlObtenerDatos);
    this.router.post("/load", ctrlCargarEmbeddings);
    this.router.post("/search", ctrlBusquedaSemanticaProductos);
  }
}

export default new DBRoutes().router;
