"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscribeAudio = exports.uploadAudio = exports.DownloadAudio = exports.ListMessagesFromNumber = exports.sendWhatsappMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const cloudinary = __importStar(require("cloudinary"));
const assemblyai_1 = require("assemblyai");
const twilio_object_1 = __importDefault(require("../objects/twilio.object"));
const sendWhatsappMessage = async (to, body) => {
    const data = {
        from: `whatsapp:+${process.env.TWILIO_FROM_NUMBER}`,
        body,
        to: `whatsapp:+${to}`,
    };
    console.log({ data });
    twilio_object_1.default.messages
        .create(data)
        .then((message) => console.log("Mensaje Enviado. sid:" + message.sid))
        .catch((error) => console.error("Error al enviar mensaje", error))
        .finally(() => console.log("Mensaje enviado por finally"));
};
exports.sendWhatsappMessage = sendWhatsappMessage;
const ListMessagesFromNumber = (number) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    return client.messages
        .list({
        from: `whatsapp:+${number}`,
        limit: 20,
    })
        .then((messages) => {
        let chatContent = [];
        messages.forEach((message) => {
            chatContent.push(message.body);
        });
        return chatContent;
    });
};
exports.ListMessagesFromNumber = ListMessagesFromNumber;
const DownloadAudio = async (audioUrl) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
        throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be defined in environment variables");
    }
    const audioResponse = await axios_1.default.get(audioUrl, {
        auth: {
            username: accountSid,
            password: authToken,
        },
        responseType: "stream",
    });
    const audioFilename = `./audio-${(0, uuid_1.v4)()}.wav`;
    const writer = fs_1.default.createWriteStream(audioFilename);
    audioResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
    console.log(`Archivo de audio descargado`);
    return audioFilename;
};
exports.DownloadAudio = DownloadAudio;
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// SUBIR AUDIO A CLOUDINARY
const uploadAudio = async (filePath) => {
    return new Promise((resolve, reject) => {
        uploadToCloudinary();
        function uploadToCloudinary() {
            if (fs_1.default.existsSync(filePath)) {
                cloudinary.v2.uploader.upload(filePath, { resource_type: "auto", folder: "audiosChat" }, (err, url) => {
                    if (err)
                        return reject(err);
                    return resolve((url === null || url === void 0 ? void 0 : url.secure_url) || "");
                });
            }
            else {
                setTimeout(uploadToCloudinary, 100);
            }
        }
    }).catch((error) => {
        console.error("Error al subir el audio a cloudinary", error);
        throw error;
    });
};
exports.uploadAudio = uploadAudio;
//TRANSCRIBIR AUDIO WITH ASSEMBLY AI
const TranscribeAudio = async (url) => {
    try {
        const apiKey = process.env.ASSEMBLY_AI_API_KEY;
        if (!apiKey) {
            throw new Error("API Key for AssemblyAI is not defined.");
        }
        const client = new assemblyai_1.AssemblyAI({ apiKey });
        const params = {
            audio: url,
            speaker_labels: true,
            language_code: "es",
        };
        const transcript = await client.transcripts.transcribe(params);
        console.log(transcript.text);
        return transcript.text || "";
    }
    catch (error) {
        console.error("Error al subir el audio a ASSEMBLY", error);
        throw error;
    }
};
exports.TranscribeAudio = TranscribeAudio;
