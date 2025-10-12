import { create } from 'zustand';

type Key = string; // `${objectType}:${objectId}`

interface ObjectRefreshState {
  timestamps: Record<Key, number>;
  bump: (objectType: 'pflicht' | 'dokument', objectId: number | string) => void;
  get: (objectType: 'pflicht' | 'dokument', objectId: number | string) => number | undefined;
}

export const objectKey = (objectType: 'pflicht' | 'dokument', objectId: number | string) => `${objectType}:${objectId}`;

export const useObjectRefreshStore = create<ObjectRefreshState>((set, get) => ({
  timestamps: {},
  bump: (objectType, objectId) => set((state) => ({
    timestamps: { ...state.timestamps, [objectKey(objectType, objectId)]: Date.now() },
  })),
  get: (objectType, objectId) => get().timestamps[objectKey(objectType, objectId)],
}));

