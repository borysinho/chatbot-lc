import Grok from "groq-sdk";
import { OpenAI } from "openai";
// import { wrapOpenAI } from "langsmith/wrappers";

export const groq = new Grok({
  apiKey: process.env.GROQ_API_KEY,
});

export const openaiComplettions = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
});
