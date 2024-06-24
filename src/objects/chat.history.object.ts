import { ConversationSummaryBufferMemory } from "langchain/memory";
import pg from "pg";
import { chatModel } from "./completions.object";
import { ZepClient } from "@getzep/zep-js";
import {
  PostgresChatMessageHistory,
  PostgresChatMessageHistoryInput,
  StoredPostgresMessageData,
} from "@langchain/community/stores/message/postgres";
import { reusablePool } from "./pgvector.object";

export const chatHistory = (sessionId: string) => {
  const history = new PostgresChatMessageHistory({
    sessionId,
    pool: reusablePool,
    tableName: "chat_history",
  });

  return history;
};



