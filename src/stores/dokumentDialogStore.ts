import { create } from 'zustand';

interface DokumentDialogState {
  isOpen: boolean;
  dokumentId: string | null;
  title?: string;
  open: (dokumentId: string, title?: string) => void;
  close: () => void;
}

export const useDokumentDialogStore = create<DokumentDialogState>((set) => ({
  isOpen: false,
  dokumentId: null,
  title: undefined,
  open: (dokumentId, title) => set({ isOpen: true, dokumentId, title }),
  close: () => set({ isOpen: false, dokumentId: null, title: undefined }),
}));

