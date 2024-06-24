import { Router } from "express";
import { ctrlCargarDatos } from "../controllers/db.controller";

class DBRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/data", ctrlCargarDatos);
    // this.router.post("/load", ctrlCargarEmbeddings);
    // this.router.post("/search", ctrlBusquedaSemanticaProductos);
  }
}

export default new DBRoutes().router;
