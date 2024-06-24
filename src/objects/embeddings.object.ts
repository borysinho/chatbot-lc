import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

export const openaiEmbeddings = new OpenAI({
  apiKey: process.env.OPENAI_EMBEDDINGS_API_KEY,
  maxRetries: 2,
});

export const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  dimensions: 1536,
  apiKey: process.env.OPENAI_API_KEY,
});
