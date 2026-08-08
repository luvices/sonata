import { create } from 'zustand';
import { Track } from '@/types';

export const INTERVALS = [1, 2, 4, 7, 11, 16];
export const MAX_GUESSES = 6; // 5 skips + initial = 6 attempts

export type Guess = Track | 'skipped' | null;

interface GameState {
  currentTrack: Track | null;
  guesses: Guess[];
  gameStatus: 'playing' | 'won' | 'lost';
  currentIntervalIndex: number;
  
  // Actions
  startGame: (track: Track) => void;
  submitGuess: (track: Track) => void;
  skipTurn: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTrack: null,
  guesses: Array(MAX_GUESSES).fill(null),
  gameStatus: 'playing',
  currentIntervalIndex: 0,

  startGame: (track: Track) => set({
    currentTrack: track,
    guesses: Array(MAX_GUESSES).fill(null),
    gameStatus: 'playing',
    currentIntervalIndex: 0,
  }),

  submitGuess: (guessTrack: Track) => {
    const { currentTrack, guesses, currentIntervalIndex } = get();
    if (!currentTrack || get().gameStatus !== 'playing') return;

    const isCorrect = guessTrack.id === currentTrack.id;
    const newGuesses = [...guesses];
    newGuesses[currentIntervalIndex] = guessTrack;

    if (isCorrect) {
      set({ guesses: newGuesses, gameStatus: 'won' });
    } else {
      const nextIndex = currentIntervalIndex + 1;
      if (nextIndex >= MAX_GUESSES) {
        set({ guesses: newGuesses, gameStatus: 'lost' });
      } else {
        set({ guesses: newGuesses, currentIntervalIndex: nextIndex });
      }
    }
  },

  skipTurn: () => {
    const { currentTrack, guesses, currentIntervalIndex } = get();
    if (!currentTrack || get().gameStatus !== 'playing') return;

    const newGuesses = [...guesses];
    newGuesses[currentIntervalIndex] = 'skipped';

    const nextIndex = currentIntervalIndex + 1;
    if (nextIndex >= MAX_GUESSES) {
      set({ guesses: newGuesses, gameStatus: 'lost' });
    } else {
      set({ guesses: newGuesses, currentIntervalIndex: nextIndex });
    }
  },

  resetGame: () => set({
    currentTrack: null,
    guesses: Array(MAX_GUESSES).fill(null),
    gameStatus: 'playing',
    currentIntervalIndex: 0,
  }),
}));
