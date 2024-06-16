import OpenAI from "openai";

export const openaiEmbeddings = new OpenAI({
  apiKey: process.env.OPENAI_EMBEDDINGS_API_KEY,
  maxRetries: 2,
});
