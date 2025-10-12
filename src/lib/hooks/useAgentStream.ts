// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback, useRef, useState } from "react";
import { useObjectRefreshStore } from "@/stores/objectRefreshStore";
import { normalizeToolCalls } from "@/lib/tool-parsers";
import { useLocale } from "./useLocale";
import { useTaskContext } from "@/context/TaskContext";
import { ChatHistory, ChatMessage } from "@/client";
import { useChatStore } from "@/stores/chatStore";

export interface StreamOptions {
  agent_id?: string;
  message?: string;
  model?: string;
  thread_id: string;
  user_id: string;
  agent_config?: Record<string, unknown>;
  stream_tokens?: boolean;
  run_id?: string;
  // Optional context payload for agent-specific metadata
  context?: { document_id?: string; obligation_id?: number };
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
    async (options: StreamOptions, token?: string, sessionId?: string) => {
      setIsStreaming(true);
      setError(null);
      chatRef.current = {};
      artifactRef.current = {};
      messageBufferRef.current = "";

      if (options.message) {
        // Keep local panel state for existing consumers
        sendUserMessage(options.message);
        // Also add to session store if provided
        if (sessionId) {
          try {
            const add = useChatStore.getState().addMessage;
            const setStatus = useChatStore.getState().setStreamingStatus;
            const touchDraft = useChatStore.getState().updateStreamingMessage;
            add(sessionId, {
              id: `human_${Date.now()}`,
              role: "human",
              content: options.message,
              type: "human",
            } as any);
            // Immediately set streaming true and create an empty draft so UI can show spinner
            setStatus(sessionId, true);
            touchDraft(sessionId, "");
          } catch {}
        }
      }

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
                agent_config: {
                  ...options?.agent_config,
                  language: locale,
                },
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
                const node = payload.langgraph_node || "default";
                // Append token content to a draft assistant message regardless of metadata
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
                // Mirror into chat store if session context provided
                if (sessionId) {
                  try {
                    const update = useChatStore.getState().updateStreamingMessage;
                    const setStatus = useChatStore.getState().setStreamingStatus;
                    setStatus(sessionId, true);
                    update(sessionId, payload.content);
                  } catch {}
                }
              }

              if (payload.type === "message") {
                handleFinalMessage(payload.content, payload.custom_data, sessionId);
              }
            } catch {
              messageBufferRef.current += raw;
              try {
                const payload = JSON.parse(messageBufferRef.current);
                handleFinalMessage(payload.content, payload.custom_data, sessionId);
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
        if (sessionId) {
          try {
            const setStatus = useChatStore.getState().setStreamingStatus;
            setStatus(sessionId, false);
          } catch {}
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, locale, updateTasks]
  );

  const handleFinalMessage = (final: any, sseMeta: any, sessionId?: string) => {
    const role = final.type === "ai" ? "ai" : final.type;

    if (role === "ai") {
      const finalChat: ExtendedChatMessage = {
        id: final.run_id,
        role,
        content: final.content ?? "",
        // Prefer SSE meta (payload.custom_data), fallback to message-embedded custom_data
        meta: sseMeta ?? final.custom_data,
      };
      const finishReason =
        sseMeta?.response_metadata?.finish_reason || final.response_metadata?.finish_reason;

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

      // Mirror into chat store session with special handling for tool_calls stage
      if (sessionId) {
        try {
          const toolCalls = (sseMeta?.custom_data?.tool_calls) || (final.custom_data?.tool_calls) || final.tool_calls;
          const setDraftMeta = useChatStore.getState().setStreamingDraftMeta;
          const setStatus = useChatStore.getState().setStreamingStatus;
          // If model announces tool calls (pre-token), show badge on draft and keep streaming
          if (finishReason === 'tool_calls' || (toolCalls && !finalChat.content)) {
            setStatus(sessionId, true);
            setDraftMeta(sessionId, { tool_calls: toolCalls });
          } else {
            useChatStore.setState((state) => {
              const session = state.sessions[sessionId];
              if (!session) return state as any;
              const filtered = session.messages.filter(
                (m) => !(typeof m.id === 'string' && (m.id.startsWith('streaming_') || m.id === final.run_id))
              );
              return {
                sessions: {
                  ...state.sessions,
                  [sessionId]: {
                    ...session,
                    messages: [...filtered, { ...finalChat, type: 'ai' as any }],
                  },
                },
              } as any;
            });
            setStatus(sessionId, false);
          }
        } catch {}
      }

      // Detect updates from tool calls and schedule refresh bumps
      try {
        const toolCallsRaw = (sseMeta?.custom_data?.tool_calls) || (final.custom_data?.tool_calls) || final.tool_calls;
        const calls = normalizeToolCalls(toolCallsRaw);
        const bumps: { object_type: 'pflicht' | 'dokument'; object_id: string | number }[] = [];
        for (const c of calls) {
          if (c.name === 'update_object') {
            const ot = (c.args?.object_type || '').toLowerCase();
            const oid = c.args?.object_id;
            if ((ot === 'pflicht' || ot === 'dokument') && (oid !== undefined && oid !== null)) {
              bumps.push({ object_type: ot, object_id: oid });
            }
          }
        }
        if (bumps.length) {
          const bump = useObjectRefreshStore.getState().bump;
          // Small delay to allow backend to persist change
          setTimeout(() => {
            for (const b of bumps) bump(b.object_type, b.object_id);
          }, 1200);
        }
      } catch {}

      // Clear any streaming buffer for this node if present
      const node = sseMeta?.node ?? sseMeta?.langgraph_node ?? "default";
      delete chatRef.current[node];
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
    // expose chat store helpers for session-based chat usage
    findOrCreateSession: useChatStore.getState().findOrCreateSession,
    clearSession: useChatStore.getState().clearSession,
  };
}
