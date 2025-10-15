"use client";

import { useEffect, useRef } from "react";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useAuth } from "@/context/AuthContext";
import ChatMessage from "@/components/ChatMessage";
import TextInput from "@/components/TextInput";
import { Role } from "@/domain/constants";
import { formatMarkdownHtml } from "@/domain/markdown-service";
import { normalizeToolCalls, formatToolActivity } from "@/lib/tool-parsers";
import styles from "./LawMonitorChatPanel.module.scss";
import { useChatStore } from "@/stores/chatStore";
import { Button } from "@/components/ui/button";

const EMPTY_MESSAGES: any[] = [];

const LawMonitorChatPanel = () => {
  const { sendMessage, clearSession } = useAgentStreamContext();
  const { context, updateContext } = useSidebarStore();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = context?.chatSessionId;
  const ensureSession = useChatStore((s) => s.findOrCreateSession);
  useEffect(() => {
    if (!context) return;
    if (!context.chatSessionId) {
      try {
        const id = ensureSession(context);
        updateContext({ chatSessionId: id });
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.objectId, context?.objectType]);

  const messages = useChatStore((state) => {
    if (!sessionId) return EMPTY_MESSAGES;
    return state.sessions[sessionId]?.messages ?? EMPTY_MESSAGES;
  });
  const isStreaming = useChatStore((state) => {
    if (!sessionId) return false;
    return state.sessions[sessionId]?.isStreaming ?? false;
  });

  const activeSession = useChatStore((state) =>
    sessionId ? state.sessions[sessionId] : undefined
  );

  const handleSendMessage = async (message: string) => {
    if (!user || !context || !message?.trim() || !sessionId || !activeSession) return;
    const token = await user.getIdToken();
    const agentConfig = {
      pflicht_id: context.pflichtId,
      document_id: context.dokumentId,
    };

    console.log("agentConfig", agentConfig);
    await sendMessage(
      {
        thread_id: activeSession.threadId,
        user_id: user.uid,
        message,
        agent_id: "law-monitor-agent",
        stream_tokens: true,
        agent_config: agentConfig,
      },
      token,
      sessionId
    );
  };

  const handleNewChat = () => {
    if (sessionId) {
      clearSession(sessionId);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #e5e7eb", display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={handleNewChat} disabled={isStreaming}>
          Neuer Chat
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || `msg-${index}`}
            role={(msg.role as Role) ?? Role.AI}
            isStartScreen={false}
            isLoadingArtifact={false}
          >
            {/* Tool activity badge: show on streaming draft when tool_calls announced and before tokens */}
            {(() => {
              const toolCallsRaw = (msg as any).meta?.tool_calls || (msg as any).tool_calls;
              const calls = normalizeToolCalls(toolCallsRaw);
              const isDraft = typeof (msg as any).id === 'string' && (msg as any).id.startsWith('streaming_');
              const isLast = messages[messages.length - 1]?.id === msg.id;
              const noTokensYet = !(msg as any).content || (msg as any).content.length === 0;
              const show = isStreaming && isDraft && isLast && noTokensYet;
              if (!show) return null;
              const mapped = calls.map((c) => formatToolActivity(c)).filter(Boolean) as string[];
              const labels = mapped.length ? mapped : ["Denke nach"];
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                  {labels.map((label, i) => (
                    <span key={`${label}-${i}`} className={`${styles.activityBadge} ${styles.active}`}>
                      {label}
                    </span>
                  ))}
                </div>
              );
            })()}

            {Boolean(msg.content) && (
              <div
                className="markdown-chat"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownHtml(msg.content ?? ""),
                }}
              />
            )}
          </ChatMessage>
        ))}
        {(() => {
          const last = messages[messages.length - 1] as any;
          const hasStreamingDraft = last && typeof last.id === 'string' && last.id.startsWith('streaming_');
          const showSpinner = isStreaming && !hasStreamingDraft;
          return showSpinner ? (
          <ChatMessage role={Role.AI} isStartScreen={false} isLoadingArtifact={false} />
          ) : null;
        })()}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
        <TextInput inputEnabled={!isStreaming} onSubmit={handleSendMessage} />
      </div>
    </div>
  );
};

export default LawMonitorChatPanel;
