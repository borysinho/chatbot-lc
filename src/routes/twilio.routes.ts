import { Router } from "express";
import {
  indexDataSource,
  newMessage,
  testLC,
} from "../controllers/twilio.controller";

class TwilioRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.router.post("/ia", newMessage);
    // this.router.post("/ia", (req, res) => {
    //   console.log("ok");
    //   res.send("OK");
    // });

    this.router.get("/statuscallback", (req, res) => {
      console.log({ CallBack: req.body });
      res.status(200).send("Callback OK");
    });

    this.router.post("/testlc", testLC);
    this.router.post("/index", indexDataSource);
  }
}

export default new TwilioRoutes().router;
