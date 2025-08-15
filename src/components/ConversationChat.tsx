import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatMessage from "@/components/ChatMessage";
import ScrollDownButton from "@/components/ScrollDownButton";
import SendMessageInput, {
  SendMessageInputRef,
} from "@/components/SendMessageInput";
import { formatMarkdownHtml } from "@/domain/markdown-service";

import styles from "./ConversationChat.module.scss";

import { useNormalizedParam } from "@/lib/hooks/useNormalizedParam";
import { Role } from "@/domain/constants";
import { getConversation } from "@/domain/conversation";
import { useAuth } from "@/context/AuthContext";
import { User } from "firebase/auth";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";
import { NetworkingError } from "@/types/generic";
import { useMediaQuery } from "react-responsive";

const ConversationChat = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const hasInitialized = useRef(false);

  const conversationUuid = useNormalizedParam("conversationId") as string;

  const lastMessageId = useRef<string | null>(null);

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const userRef = useRef<User | null>(null);

  const sendMessageInput = useRef<SendMessageInputRef | null>(null);

  const { sendMessage, isStreaming, chatMessages, error, loadHistory } =
    useAgentStreamContext();

  const { user } = useAuth();

  const searchParams = useSearchParams();

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  function startUpdateScrollBottomRef() {
    const chatContentValue = chatContentRef.current;
    if (chatContentValue) {
      chatContentValue.onscroll = () => {
        setIsScrolledToBottom(
          chatContentValue.scrollTop + chatContentValue.clientHeight >=
            chatContentValue.scrollHeight - 600
        );
      };
    }
  }

  useEffect(() => {
    const newestMessage = chatMessages.at(-1);
    const id = newestMessage?.id;

    if (!id || id === lastMessageId.current || !isScrolledToBottom) return;

    lastMessageId.current = id;
    scrollToBottom("smooth");
  }, [chatMessages, isScrolledToBottom]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialize = async () => {
      setIsLoading(true);

      try {
        const conversation = await getConversation(conversationUuid);
        if (!conversation) throw new Error("Conversation not found");
        if (conversation instanceof NetworkingError) {
          throw new Error("Not history found");
        }
        loadHistory(conversation.messages);
      } catch {
        try {
          if (!user) throw new Error("User not ready");

          const token = await user.getIdToken();

          await sendMessage(
            {
              thread_id: conversationUuid,
              user_id: user.uid,
              model: "gpt-4o-mini",
              stream_tokens: true,
              message: "",
              agent_id: "hiring-assessment-agent",
              agent_config: {
                require_email:
                  searchParams.get("requireEmail")?.toLowerCase() === "true",
                email: user?.email ?? "",
              },
            },
            token
          );
        } catch (streamError) {
          console.warn("Stream error:", streamError);
        }
      } finally {
        setIsLoading(false);
        setTimeout(() => scrollToBottom("instant"), 0);
        startUpdateScrollBottomRef();
      }
    };

    initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    chatContentRef.current?.scrollTo({
      left: 0,
      top: chatContentRef.current.scrollHeight,
      behavior: behavior,
    });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesWrapper} ref={chatContentRef}>
        <div className={styles.messagesContent}>
          {chatMessages.map((message) => (
            <div key={`${message.id}`} className="w-full flex justify-end">
              <ChatMessage
                role={message.role as Role}
                message={message}
                isStartScreen={false}
                isLoadingArtifact={false}
              >
                <div
                  className="markdown-chat text-white text-lg"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdownHtml(message.content ?? ""),
                  }}
                />
              </ChatMessage>
            </div>
          ))}

          {error && (
            <div className="text-center">
              <input
                className="container"
                type="text"
                placeholder={error}
                aria-invalid
                readOnly
              />
            </div>
          )}
          {isStreaming && (
            <ChatMessage
              role={Role.AI}
              aria-busy={isLoading}
              isStartScreen={false}
              isLoadingArtifact={false}
            />
          )}
        </div>
      </div>

      <div className={styles.inputWrapper}>
        {!isScrolledToBottom && (
          <div className={styles.scrollButtonContainer}>
            <ScrollDownButton onClick={scrollToBottom} />
          </div>
        )}
        {!isMobile && <SendMessageInput ref={sendMessageInput} />}
      </div>
    </div>
  );
};

export default ConversationChat;
