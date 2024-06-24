import { Request, Response } from "express";
import { catchedAsync, response } from "../utils";
import { cargarVectores } from "../services/documentos.service";

export const ctrlCargarDatos = catchedAsync(
  async (req: Request, res: Response) => {
    await cargarVectores();

    response(res, 200, "Datos cargados.");
  }
);
