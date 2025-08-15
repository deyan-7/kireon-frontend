import { ChatHistory, historyHistoryPost } from "@/client";
import { customClient } from "@/lib/api";

import { NetworkingError } from "@/types/generic";

export const getConversation = async (
  uuid: string
): Promise<ChatHistory | NetworkingError> => {
  try {
    const response = await historyHistoryPost({
      client: customClient,
      body: { thread_id: uuid },
    });
    if (!response.data) {
      return new NetworkingError(null, "No conversation returned");
    }
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return new NetworkingError(null, message);
  }
};
