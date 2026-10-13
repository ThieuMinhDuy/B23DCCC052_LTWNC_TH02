import { create } from 'zustand';

interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],
  togglePin: (id: string) => {
    set((state) => {
      const isPinned = state.pinnedIds.includes(id);
      return {
        pinnedIds: isPinned
          ? state.pinnedIds.filter((pinnedId) => pinnedId !== id)
          : [id, ...state.pinnedIds],
      };
    });
  },
  isPinned: (id: string) => {
    return get().pinnedIds.includes(id);
  },
}));
