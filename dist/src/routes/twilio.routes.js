"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twilio_controller_1 = require("../controllers/twilio.controller");
class TwilioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get("/", (req, res) => {
            res.send("Hello World!");
        });
        this.router.post("/ia", twilio_controller_1.newMessage);
        // this.router.post("/ia", (req, res) => {
        //   console.log("ok");
        //   res.send("OK");
        // });
        this.router.get("/statuscallback", (req, res) => {
            console.log({ CallBack: req.body });
            res.status(200).send("Callback OK");
        });
        this.router.post("/testlc", twilio_controller_1.testLC);
    }
}
exports.default = new TwilioRoutes().router;
