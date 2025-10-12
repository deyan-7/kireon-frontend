import { create } from 'zustand';
import type { Beleg } from '@/types/pflicht';

export type SidebarView = 'chat' | 'details' | 'edit' | 'history' | 'sources' | 'dokument' | null;

export interface SidebarContext {
  pflichtId?: number;
  dokumentId?: string;
  objectType?: 'pflicht' | 'dokument';
  objectId?: number | string;
  belege?: Beleg[];
  title?: string;
  refreshKey?: number;
  chatSessionId?: string;
}

interface SidebarState {
  view: SidebarView;
  context: SidebarContext | null;
  open: (view: SidebarView, context: SidebarContext) => void;
  close: () => void;
  updateContext: (partial: Partial<SidebarContext>) => void;
  // Edit view save wiring
  setEditSaveHandler: (fn: (() => void) | null) => void;
  triggerEditSave: () => void;
  _editSaveHandler: (() => void) | null;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  view: null,
  context: null,
  open: (view, context) => set({ view, context }),
  close: () => set({ view: null, context: null, _editSaveHandler: null }),
  updateContext: (partial) => set((state) => ({ context: { ...(state.context || {}), ...partial } })),
  setEditSaveHandler: (fn) => set({ _editSaveHandler: fn }),
  triggerEditSave: () => set((state) => {
    state._editSaveHandler?.();
    return {} as any;
  }),
  _editSaveHandler: null,
}));
