import { create } from 'zustand';

interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'finished';
  checkpoint: [number, number, number];
  setStatus: (status: 'menu' | 'playing' | 'paused' | 'finished') => void;
  setCheckpoint: (pos: [number, number, number]) => void;
  togglePause: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'menu',
  checkpoint: [0, 3, 0],
  setStatus: (status) => set({ status }),
  setCheckpoint: (pos) => set({ checkpoint: pos }),
  togglePause: () => {
    const s = get().status;
    if (s === 'playing') set({ status: 'paused' });
    else if (s === 'paused') set({ status: 'playing' });
  },
  resetGame: () => set({ status: 'playing', checkpoint: [0, 3, 0] }),
}));
