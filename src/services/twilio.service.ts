import axios from "axios";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import * as cloudinary from "cloudinary";
import { AssemblyAI } from "assemblyai";

import twilioClient from "../objects/twilio.object";

export const sendWhatsappMessage = async (to: string, body: string) => {
  const data = {
    from: `whatsapp:+${process.env.TWILIO_FROM_NUMBER}`,
    body,
    to: `whatsapp:+${to}`,
  };
  console.log({ data });

  twilioClient.messages
    .create(data)
    .then((message) => console.log("Mensaje Enviado. sid:" + message.sid));
};

export const ListMessagesFromNumber = (number: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  return client.messages
    .list({
      from: `whatsapp:+${number}`,
      limit: 20,
    })
    .then((messages: any) => {
      let chatContent: any[] = [];
      messages.forEach((message: any) => {
        chatContent.push(message.body);
      });
      return chatContent;
    });
};

export const DownloadAudio = async (audioUrl: string): Promise<string> => {
  const accountSid: string = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken: string = process.env.TWILIO_AUTH_TOKEN as string;

  if (!accountSid || !authToken) {
    throw new Error(
      "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be defined in environment variables"
    );
  }

  const audioResponse = await axios.get(audioUrl, {
    auth: {
      username: accountSid,
      password: authToken,
    },
    responseType: "stream",
  });

  const audioFilename = `./audio-${uuidv4()}.wav`;
  const writer = fs.createWriteStream(audioFilename);

  audioResponse.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  console.log(`Archivo de audio descargado`);
  return audioFilename;
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// SUBIR AUDIO A CLOUDINARY
export const uploadAudio = async (filePath: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    uploadToCloudinary();

    function uploadToCloudinary() {
      if (fs.existsSync(filePath)) {
        cloudinary.v2.uploader.upload(
          filePath,
          { resource_type: "auto", folder: "audiosChat" },
          (err, url) => {
            if (err) return reject(err);

            return resolve(url?.secure_url || "");
          }
        );
      } else {
        setTimeout(uploadToCloudinary, 100);
      }
    }
  }).catch((error) => {
    console.error("Error al subir el audio a cloudinary", error);
    throw error;
  });
};

//TRANSCRIBIR AUDIO WITH ASSEMBLY AI
export const TranscribeAudio = async (url: string) => {
  try {
    const apiKey = process.env.ASSEMBLY_AI_API_KEY;

    if (!apiKey) {
      throw new Error("API Key for AssemblyAI is not defined.");
    }

    const client = new AssemblyAI({ apiKey });

    const params = {
      audio: url,
      speaker_labels: true,
      language_code: "es",
    };

    const transcript = await client.transcripts.transcribe(params);
    console.log(transcript.text);

    return transcript.text || "";
  } catch (error) {
    console.error("Error al subir el audio a ASSEMBLY", error);
    throw error;
  }
};
