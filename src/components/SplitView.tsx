"use client";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useMediaQuery } from "react-responsive";
import ArtifactView from "@/components/ArtifactView";
import { useAgentStreamContext } from "@/context/AgentStreamProvider";
import SendMessageInput from "./SendMessageInput";
import styles from "./SplitView.module.scss";

declare global {
  interface Window {
    mobileLayoutControls?: {
      expandLeftPane: () => void;
      collapseLeftPane: () => void;
      isMobile: boolean;
    };
  }
}

const MIN_WIDTH = 450;
const COMPACT_BREAKPOINT = 570;

type SplitViewContextType = {
  containerWidth: number;
  isCompact: boolean;
};

const SplitViewContext = createContext<SplitViewContextType>({
  containerWidth: 600,
  isCompact: false,
});

export const useSplitViewContext = () => useContext(SplitViewContext);

const SplitViewLayout = ({ children }: { children: React.ReactNode }) => {
  const [leftWidth, setLeftWidth] = useState<number>(600);
  const isCompact = leftWidth < COMPACT_BREAKPOINT;
  const [maxLeftWidth, setMaxLeftWidth] = useState<number>(1000);
  const [isLeftPaneExpanded, setIsLeftPaneExpanded] = useState<boolean>(false);

  const { chatMessages, artifacts } = useAgentStreamContext();

  const lastChatId = useRef<string | null>(null);
  const lastArtifactId = useRef<string | null>(null);

  const startX = useRef(0);
  const startWidth = useRef(0);
  const inputRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    if (!isMobile) {
      const initial = window.innerWidth * 0.3;
      setLeftWidth(Math.max(MIN_WIDTH, initial));
      setMaxLeftWidth(window.innerWidth * 0.7);
    }
  }, [isMobile]);

  const expandLeftPane = useCallback(() => {
    if (isMobile && !isLeftPaneExpanded) {
      setIsLeftPaneExpanded(true);
    }
  }, [isMobile, isLeftPaneExpanded]);

  const collapseLeftPane = useCallback(() => {
    if (isMobile && isLeftPaneExpanded) {
      setIsLeftPaneExpanded(false);
    }
  }, [isMobile, isLeftPaneExpanded]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile) {
        setMaxLeftWidth(window.innerWidth * 0.7);
        setLeftWidth((current) => Math.min(current, window.innerWidth * 0.7));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      const chatContent = document.querySelector(".mobile-chat-content");
      const textarea = chatContent?.querySelector("textarea");
      const sendButton = chatContent?.querySelector("a");

      const handleFocus = () => {
        setIsLeftPaneExpanded(true);
      };

      const handleSendClick = (e: Event) => {
        e.preventDefault();
        setIsLeftPaneExpanded(false);
      };

      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          setIsLeftPaneExpanded(false);
        }
      };

      if (textarea) {
        textarea.addEventListener("focus", handleFocus);
        textarea.addEventListener("keypress", handleKeyPress);
      }

      if (sendButton) {
        sendButton.addEventListener("click", handleSendClick);
      }

      return () => {
        if (textarea) {
          textarea.removeEventListener("focus", handleFocus);
          textarea.removeEventListener("keypress", handleKeyPress);
        }
        if (sendButton) {
          sendButton.removeEventListener("click", handleSendClick);
        }
      };
    }
  }, [isMobile, isLeftPaneExpanded]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    startX.current = e.clientX;
    startWidth.current = leftWidth;
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    const deltaX = e.clientX - startX.current;
    const proposedWidth = startWidth.current + deltaX;

    const minWidth = MIN_WIDTH;

    const newWidth = Math.max(minWidth, Math.min(proposedWidth, maxLeftWidth));
    setLeftWidth(newWidth);
  };

  const stopResize = () => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  };

  const toggleLeftPane = () => {
    setIsLeftPaneExpanded(!isLeftPaneExpanded);
  };

  useEffect(() => {
    if (!isMobile) return;

    const latestChat = chatMessages.at(-1);
    const latestArtifact = artifacts.at(-1);

    const newChatMessage =
      latestChat?.id && latestChat.id !== lastChatId.current;
    const newArtifact =
      latestArtifact?.id && latestArtifact.id !== lastArtifactId.current;

    if (newChatMessage) {
      lastChatId.current = latestChat.id;
      expandLeftPane(); // show chat
    }

    if (newArtifact) {
      lastArtifactId.current = latestArtifact.id;
      collapseLeftPane(); // show artifact
    }
  }, [chatMessages, artifacts, isMobile, expandLeftPane, collapseLeftPane]);

  if (isMobile) {
    return (
      <div className={styles.mobileLayout}>
        <div className={styles.mobileArtifact}>
          <ArtifactView />
        </div>

        <div
          className={`${styles.mobileChatPanel} ${
            isLeftPaneExpanded
              ? styles.mobileChatExpanded
              : styles.mobileChatCollapsed
          }`}
        >
          <button
            onClick={collapseLeftPane}
            className={styles.mobileCloseButton}
            aria-label="Close chat"
          >
            <svg
              className={styles.mobileCloseIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className={`${styles.mobileChatContent} overflow-y-auto h-full`}>
            <div className={styles.mobileMessagesOnly}>{children}</div>
          </div>
        </div>

        <div className={styles.mobileInputFixed} ref={inputRef}>
          <button
            onClick={toggleLeftPane}
            className={styles.mobileToggle}
            aria-label={isLeftPaneExpanded ? "Collapse chat" : "Expand chat"}
          >
            <svg
              className={`${styles.mobileChevron} ${
                isLeftPaneExpanded
                  ? styles.mobileChevronDown
                  : styles.mobileChevronUp
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <div className="ml-6 w-full">
            <SendMessageInput />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen overflow-hidden">
        <div
          className="flex flex-col"
          style={{ width: `${leftWidth}px`, minWidth: `${MIN_WIDTH}px` }}
        >
          <SplitViewContext.Provider
            value={{ containerWidth: leftWidth, isCompact }}
          >
            <main className="flex-grow overflow-hidden">{children}</main>
          </SplitViewContext.Provider>
        </div>
        <div
          className="w-1 bg-gray-200 cursor-col-resize"
          onMouseDown={startResize}
        />

        <div
          className="relative h-screen"
          style={{ width: `calc(100% - ${leftWidth}px)` }}
        >
          <div className="absolute w-full h-full">
            <ArtifactView />
          </div>
        </div>
      </div>
    );
  }
};

export default SplitViewLayout;
