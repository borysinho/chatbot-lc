import { NextFunction, Request, Response } from "express";
export const errorMiddleware = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(500).send({
    error: true,
    message: err,
  });
};
