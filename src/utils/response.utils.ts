import { Response } from "express";
import { HttpStatusCodes } from "./http.codes.utils";

// Si estamos respondiendo es porque no hubo ningún error
export const response = (
  res: Response,
  statusCode: HttpStatusCodes,
  data: any
) => {
  res.status(statusCode).json({
    error: false,
    data,
  });
};
