import { create } from 'zustand';

interface PflichtDialogState {
  isOpen: boolean;
  pflichtId: number | null;
  title?: string;
  open: (pflichtId: number, title?: string) => void;
  close: () => void;
}

export const usePflichtDialogStore = create<PflichtDialogState>((set) => ({
  isOpen: false,
  pflichtId: null,
  title: undefined,
  open: (pflichtId, title) => set({ isOpen: true, pflichtId, title }),
  close: () => set({ isOpen: false, pflichtId: null, title: undefined }),
}));

