import { create } from 'zustand';

interface ChatContext {
  documentId?: string;
  pflichtId?: number;
}

interface RightPanelState {
  isOpen: boolean;
  context: ChatContext | null;
  openPanel: (context: ChatContext) => void;
  closePanel: () => void;
}

export const useRightPanelStore = create<RightPanelState>((set) => ({
  isOpen: false,
  context: null,
  openPanel: (context) => set({ isOpen: true, context }),
  closePanel: () => set({ isOpen: false, context: null }),
}));
