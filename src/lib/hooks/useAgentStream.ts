// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback, useRef, useState } from "react";
import { useLocale } from "./useLocale";
import { useTaskContext } from "@/context/TaskContext";
import { ChatHistory, ChatMessage } from "@/client";

export interface StreamOptions {
  agent_id?: string;
  message?: string;
  model?: string;
  thread_id: string;
  user_id: string;
  agent_config?: Record<string, unknown>;
  stream_tokens?: boolean;
  run_id?: string;
}

export interface Artifact {
  id: string;
  node?: string;
  type?: string;
  title?: string;
  content: any;
  status?: string;
  meta?: Record<string, unknown>;
}

type ExtendedChatMessage = ChatMessage & {
  id: string;
  role?: string;
  meta?: ChatMessage["custom_data"];
} & Omit<ChatMessage, "type">;

function getParsedArtifactContent(artifact: Artifact): any {
  try {
    if (
      typeof artifact?.content === "string" &&
      !artifact.id.startsWith("streaming_")
    ) {
      const trimmed = artifact.content.trim();
      const isLikelyJson =
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"));
      if (isLikelyJson) {
        return JSON.parse(trimmed);
      }
    }

    return artifact?.content ?? {};
  } catch (err) {
    console.warn("Failed to parse artifact content:", artifact?.content, err);
    return artifact?.content ?? {};
  }
}

export function useAgentStream(endpoint: string) {
  const [chatMessages, setChatMessages] = useState<ExtendedChatMessage[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Record<string, string>>({});
  const artifactRef = useRef<Record<string, string>>({});
  const localUserMessages = useRef<ExtendedChatMessage[]>([]);
  const messageBufferRef = useRef("");

  const locale = useLocale();
  const { updateTasks } = useTaskContext();

  const reset = () => {
    chatRef.current = {};
    artifactRef.current = {};
    localUserMessages.current = [];
    messageBufferRef.current = "";
    setChatMessages([]);
    setArtifacts([]);
  };

  const sendUserMessage = (text: string) => {
    const message = {
      id: `human_${Date.now()}`,
      role: "human",
      content: text,
    } as ExtendedChatMessage;
    localUserMessages.current.push(message);
    setChatMessages((prev) => [...prev, message]);
  };

  const loadHistory = (messages: ChatHistory["messages"]) => {
    const loadedMessagesMap: Record<string, ExtendedChatMessage> = {};
    const loadedArtifactsMap: Record<string, Artifact> = {};

    for (const [index, message] of messages.entries()) {
      if (!message.content?.trim()) continue;

      if (message.type === "tool") {
        try {
          let toolData: any;
          const isJson =
            message.content.trim().startsWith("{") ||
            message.content.trim().startsWith("[");

          if (isJson) {
            toolData = JSON.parse(message.content);
          } else {
            toolData = {
              artifact_type: "markdown",
              artifact_title: "Task Instructions",
              artifact_content: message.content,
            };
          }

          const artifactContent =
            toolData.artifact_content?.trim?.() ||
            toolData.task_content?.content?.trim?.();

          if (artifactContent) {
            const id = message.tool_call_id ?? `history_tool_${index}`;
            loadedArtifactsMap[id] = {
              id,
              type: toolData.artifact_type ?? toolData.task_type ?? "unknown",
              title:
                toolData.artifact_title ?? toolData.task_title ?? "Untitled",
              content: toolData,
              status: toolData.status,
            };
          }
        } catch (err) {
          console.warn(
            "Failed to parse or use tool message from history:",
            message.content,
            err
          );
        }
        continue;
      }

      const id = (message.custom_data?.run_id as string) ?? `history_${index}`;
      const role = message.type === "human" ? "human" : "ai";
      const isChat = message.custom_data?.metadata?.type === "chat";

      if (isChat || role === "human") {
        const chat: ExtendedChatMessage = {
          id,
          role,
          content: message.content,
          meta: message.custom_data ?? {},
        };

        loadedMessagesMap[id] = chat;
        if (role === "human") localUserMessages.current.push(chat);
      }
    }

    const lastAiWithTasks = Object.values(loadedMessagesMap)
      .reverse()
      .find((m) => m.role === "ai" && m.meta?.all_tasks_summary);

    if (lastAiWithTasks) {
      updateTasks(
        lastAiWithTasks?.meta?.all_tasks_summary,
        lastAiWithTasks.meta.current_task_index_at_response ?? 0
      );
    }

    setChatMessages(Object.values(loadedMessagesMap));
    setArtifacts(Object.values(loadedArtifactsMap));
  };

  const clearArtifacts = () => {
    setArtifacts([]);
  };

  const stream = useCallback(
    async (options: StreamOptions, token?: string) => {
      setIsStreaming(true);
      setError(null);
      chatRef.current = {};
      artifactRef.current = {};
      messageBufferRef.current = "";

      if (options.message) sendUserMessage(options.message);

      try {
        const res = await fetch(
          endpoint + `?agent_id=${options.agent_id ?? ""}`,
          {
            method: "POST",
            headers: {
              Accept: "text/event-stream",
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              user_input: {
                ...options,
                agent_config: { ...options?.agent_config, language: locale },
              },
            }),
          }
        );

        if (!res.ok || !res.body)
          throw new Error(`Stream error: ${res.statusText}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") {
              setIsStreaming(false);
              return;
            }

            try {
              const payload = JSON.parse(raw);

              if (payload.type === "token") {
                const node = payload.langgraph_node;
                const isChat = node === "controller_llm";
                const isChatMessage =
                  payload.custom_data?.metadata?.type === "chat";

                if (isChat && isChatMessage) {
                  // ————— unchanged chat logic —————
                  chatRef.current[node] =
                    (chatRef.current[node] || "") + payload.content;
                  const draft = {
                    id: "streaming_" + node,
                    role: "ai",
                    content: chatRef.current[node],
                  } as ExtendedChatMessage;
                  setChatMessages((prev) => [
                    ...prev.filter(
                      (m) => m.id !== draft.id && !m.id.startsWith("streaming_")
                    ),
                    draft,
                  ]);
                } else {
                  // ————— new: tool-artifact streaming draft —————
                  const meta = payload.custom_data?.metadata ?? {};
                  const artifactType = meta.artifact_type as string | undefined;

                  artifactRef.current[node] =
                    (artifactRef.current[node] || "") + payload.content;

                  const draft: Artifact = {
                    id: "streaming_" + node,
                    node,
                    type: artifactType,
                    title: undefined,
                    content: artifactRef.current[node],
                    status: "streaming",
                    meta,
                  };

                  setArtifacts((prev) => {
                    const draftExists = prev.some((a) => a.id === draftId);
                    if (draftExists) {
                      // If a streaming draft exists, map and update it.
                      return prev.map((a) => (a.id === draftId ? complete : a));
                    } else {
                      // Otherwise, add the new complete artifact to the array.
                      return [...prev, complete];
                    }
                  });
                }
              }

              if (payload.type === "message") {
                handleFinalMessage(payload.content, payload.custom_data);
              }
            } catch {
              messageBufferRef.current += raw;
              try {
                const payload = JSON.parse(messageBufferRef.current);
                handleFinalMessage(payload.content, payload.custom_data);
                messageBufferRef.current = "";
              } catch {
                // still incomplete
              }
            }
          }
        }
      } catch (err: any) {
        setIsStreaming(false);
        setError(err.message ?? "Unknown error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, locale, updateTasks]
  );

  const handleFinalMessage = (final: any, sseMeta: any) => {
    const role = final.type === "ai" ? "ai" : final.type;

    if (role === "ai") {
      if (
        final?.custom_data?.metadata?.type !== "chat" ||
        !final.content?.trim()
      ) {
        console.debug("Skipped non-chat or empty AI message", final);
        return;
      }

      const finalChat: ExtendedChatMessage = {
        id: final.run_id,
        role,
        content: final.content,
        meta: final.custom_data,
      };

      if (final?.custom_data?.all_tasks_summary) {
        updateTasks(
          final.custom_data.all_tasks_summary,
          final.custom_data.current_task_index_at_response ?? 0
        );
      }

      setChatMessages((prev) => {
        const filtered = prev.filter(
          (m) => m.id !== final.run_id && !m.id.startsWith("streaming_")
        );
        return [...filtered, finalChat];
      });

      delete chatRef.current["controller_llm"];
    } else if (role === "tool") {
      try {
        const isJson =
          typeof final.content === "string" &&
          (final.content.trim().startsWith("{") ||
            final.content.trim().startsWith("["));
        const toolData = isJson
          ? JSON.parse(final.content)
          : {
              artifact_type: "markdown",
              artifact_title: "Tool Output",
              artifact_content: final.content,
            };
  
        const isForm = toolData.artifact_type === "json_form";
        const artifactCompleteContent = isForm
          ? toolData
          : toolData.artifact_content?.trim?.() ||
            toolData.task_content?.content?.trim?.();
  
        if (!artifactCompleteContent) {
          console.debug("Skipped empty tool artifact", toolData);
          return;
        }
  
        const node = sseMeta.node ?? sseMeta.langgraph_node;
        const draftId = `streaming_${node}`;
        const finalId = final.tool_call_id || draftId;
  
        const complete: Artifact = {
          id: finalId,
          node,
          type: toolData.artifact_type ?? toolData.task_type ?? "unknown",
          title: toolData.artifact_title ?? toolData.task_title ?? "Untitled",
          content: artifactCompleteContent,
          status: "complete",
          meta: toolData,
        };
  
        setArtifacts((prev) => {
          const draftExists = prev.some((a) => a.id === draftId);
          if (draftExists) {
            // If a streaming draft exists, map and update it.
            return prev.map((a) => (a.id === draftId ? complete : a));
          } else {
            // Otherwise, add the new complete artifact to the array.
            return [...prev, complete];
          }
        });
        delete artifactRef.current[node];
      } catch (err) {
        console.warn("Failed to finalize tool artifact:", final, err);
      }
    }
  };

  return {
    chatMessages,
    artifacts,
    isStreaming,
    error,
    sendMessage: stream,
    reset,
    loadHistory,
    getParsedArtifactContent,
    clearArtifacts,
  };
}
