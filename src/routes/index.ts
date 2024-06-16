import { Application } from "express";
import twilioRouter from "./twilio.routes";
import dbRouter from "./db.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/v1", twilioRouter);
    app.use("/api/v1", dbRouter);
  }
}
