import { create } from 'zustand';
import { Track } from '@/types';

export const INTERVALS = [1, 2, 4, 7, 11, 16];
export const MAX_GUESSES = 6; // 5 skips + initial = 6 attempts

export type Guess = Track | 'skipped' | null;

export const PLAYLISTS = [
  { id: '3155776842', name: 'Global Top Hits', genre: 'Random / Hits', color: 'from-fuchsia-600 to-purple-600' },
  { id: '1313621735', name: 'Pop Essentials', genre: 'Pop', color: 'from-pink-500 to-rose-500' },
  { id: '1306931615', name: 'Rock Classics', genre: 'Rock', color: 'from-orange-600 to-red-600' },
  { id: '1116190041', name: 'Hip Hop Hits', genre: 'Hip Hop', color: 'from-emerald-500 to-teal-600' },
  { id: '1362529715', name: 'R&B Grooves', genre: 'R&B', color: 'from-blue-600 to-indigo-600' },
  { id: '1282483245', name: 'Indie & Alt', genre: 'Alternative', color: 'from-yellow-600 to-orange-500' },
];

interface GameState {
  currentTrack: Track | null;
  guesses: Guess[];
  gameStatus: 'menu' | 'playing' | 'won' | 'lost';
  currentIntervalIndex: number;
  selectedPlaylistId: string | null;
  
  // Actions
  selectPlaylist: (id: string) => void;
  startGame: (track: Track) => void;
  submitGuess: (track: Track) => void;
  skipTurn: () => void;
  resetGame: () => void;
  backToMenu: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTrack: null,
  guesses: Array(MAX_GUESSES).fill(null),
  gameStatus: 'menu',
  currentIntervalIndex: 0,
  selectedPlaylistId: null,

  selectPlaylist: (id: string) => set({
    selectedPlaylistId: id,
  }),

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

  backToMenu: () => set({
    currentTrack: null,
    guesses: Array(MAX_GUESSES).fill(null),
    gameStatus: 'menu',
    currentIntervalIndex: 0,
    selectedPlaylistId: null,
  }),
}));
