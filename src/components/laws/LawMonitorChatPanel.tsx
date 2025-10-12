"use client";

import { useEffect, useRef, useMemo } from "react";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";
import { useRightPanelStore } from "@/stores/rightPanelStore";
import { useAuth } from "@/context/AuthContext";
import ChatMessage from "@/components/ChatMessage";
import TextInput from "@/components/TextInput";
import { Role } from "@/domain/constants";
import { formatMarkdownHtml } from "@/domain/markdown-service";
import { v4 as uuidv4 } from "uuid";

const LawMonitorChatPanel = () => {
  const { chatMessages, isStreaming, sendMessage } = useAgentStreamContext();
  const { context } = useRightPanelStore();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threadId = useMemo(() => {
    // return a random uuid
    return uuidv4();
  }, [context]);

  const handleSendMessage = async (message: string) => {
    if (!user || !context || !message?.trim()) return;
    const token = await user.getIdToken();
    const agentConfig = {
      pflicht_id: context.pflichtId,
      document_id: context.documentId,
    };

    console.log("agentConfig", agentConfig);
    await sendMessage(
      {
        thread_id: threadId,
        user_id: user.uid,
        message,
        agent_id: "law-monitor-agent",
        stream_tokens: true,
        agent_config: agentConfig,
      },
      token
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isStreaming]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {chatMessages.map((msg, index) => (
          <ChatMessage
            key={msg.id || `msg-${index}`}
            role={(msg.role as Role) ?? Role.AI}
            isStartScreen={false}
            isLoadingArtifact={false}
          >
            <div
              className="markdown-chat"
              dangerouslySetInnerHTML={{
                __html: formatMarkdownHtml(msg.content ?? ""),
              }}
            />
          </ChatMessage>
        ))}
        {isStreaming && chatMessages[chatMessages.length - 1]?.role !== "ai" && (
          <ChatMessage role={Role.AI} isStartScreen={false} isLoadingArtifact={false} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
        <TextInput inputEnabled={!isStreaming} onSubmit={handleSendMessage} />
      </div>
    </div>
  );
};

export default LawMonitorChatPanel;
