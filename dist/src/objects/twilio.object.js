"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
// console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
exports.default = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
    autoRetry: true,
    lazyLoading: true,
    maxRetries: 2,
});
