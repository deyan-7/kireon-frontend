import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { SidebarContext } from './sidebarStore';
import type { ChatMessage } from '@/client';

export interface ExtendedChatMessage extends ChatMessage {
  id: string;
  role?: 'human' | 'ai' | 'tool' | 'system' | 'custom';
  meta?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  threadId: string;
  messages: ExtendedChatMessage[];
  isStreaming: boolean;
  context: SidebarContext;
}

interface ChatStoreState {
  sessions: Record<string, ChatSession>;
  setActiveSession: (sessionId: string) => void;
  findOrCreateSession: (context: SidebarContext) => string;
  addMessage: (sessionId: string, message: ExtendedChatMessage) => void;
  updateStreamingMessage: (sessionId: string, chunk: string) => void;
  setStreamingDraftMeta: (sessionId: string, meta: Record<string, any>) => void;
  setStreamingStatus: (sessionId: string, isStreaming: boolean) => void;
  clearSession: (sessionId: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  sessions: {},

  findOrCreateSession: (context) => {
    const sessions = get().sessions;
    const existingSession = Object.values(sessions).find(
      (s) => s.context.objectId === context.objectId && s.context.objectType === context.objectType
    );

    if (existingSession) {
      return existingSession.id;
    }

    const newSessionId = uuidv4();
    const newSession: ChatSession = {
      id: newSessionId,
      threadId: uuidv4(),
      messages: [],
      isStreaming: false,
      context,
    };

    set((state) => ({
      sessions: {
        ...state.sessions,
        [newSessionId]: newSession,
      },
    }));

    return newSessionId;
  },

  setActiveSession: (sessionId: string) => {
    // Placeholder for future use. The active session is derived from sidebar context for now.
    void sessionId;
  },

  addMessage: (sessionId, message) => {
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;

      const exists = session.messages.some((m) => m.id === message.id);
      if (exists) return state;

      return {
        sessions: {
          ...state.sessions,
          [sessionId]: { ...session, messages: [...session.messages, message] },
        },
      };
    });
  },

  updateStreamingMessage: (sessionId, chunk) => {
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;

      const last = session.messages[session.messages.length - 1];
      if (last && typeof last.id === 'string' && last.id.startsWith('streaming_')) {
        const updated = { ...last, content: (last.content || '') + chunk };
        const newMessages = [...session.messages.slice(0, -1), updated];
        return {
          sessions: { ...state.sessions, [sessionId]: { ...session, messages: newMessages } },
        };
      } else {
        const newMessage: ExtendedChatMessage = {
          id: `streaming_${sessionId}`,
          role: 'ai',
          content: chunk,
          type: 'ai',
        };
        return {
          sessions: {
            ...state.sessions,
            [sessionId]: { ...session, messages: [...session.messages, newMessage] },
          },
        };
      }
    });
  },

  setStreamingDraftMeta: (sessionId, meta) => {
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const last = session.messages[session.messages.length - 1];
      if (last && typeof last.id === 'string' && last.id.startsWith('streaming_')) {
        const updated = { ...last, meta: { ...(last.meta || {}), ...meta } } as ExtendedChatMessage;
        const newMessages = [...session.messages.slice(0, -1), updated];
        return { sessions: { ...state.sessions, [sessionId]: { ...session, messages: newMessages } } };
      } else {
        const draft: ExtendedChatMessage = {
          id: `streaming_${sessionId}`,
          role: 'ai',
          content: '',
          type: 'ai',
          meta,
        };
        return {
          sessions: { ...state.sessions, [sessionId]: { ...session, messages: [...session.messages, draft] } },
        };
      }
    });
  },

  setStreamingStatus: (sessionId, isStreaming) => {
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      return {
        sessions: { ...state.sessions, [sessionId]: { ...session, isStreaming } },
      };
    });
  },

  clearSession: (sessionId) => {
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      return {
        sessions: {
          ...state.sessions,
          [sessionId]: { ...session, messages: [], threadId: uuidv4() },
        },
      };
    });
  },

  reset: () => set({ sessions: {} }),
}));
