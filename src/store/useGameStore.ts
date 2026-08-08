import { create } from 'zustand';
import { Track } from '@/types';

export const INTERVALS = [1, 2, 4, 7, 11, 16];
export const MAX_GUESSES = 6; // 5 skips + initial = 6 attempts

export type Guess = Track | 'skipped' | null;

export const PLAYLISTS = [
  { id: 'CUSTOM_TIKTOK', name: 'Viral TikTok 2025', genre: 'TikTok Hits', color: 'from-[#25F4EE] to-[#FE2C55]' },
  { id: '5627561402', name: '100% Billie Eilish', genre: 'Billie Eilish', color: 'from-[#00c6ff] to-[#0072ff]' },
  { id: '8749656362', name: '100% NIKI', genre: 'NIKI', color: 'from-[#fbc2eb] to-[#a6c1ee]' },
  { id: '5363150822', name: '100% Kendrick Lamar', genre: 'Kendrick Lamar', color: 'from-[#141E30] to-[#243B55]' },
  { id: '7615950122', name: '100% SZA', genre: 'SZA', color: 'from-[#4facfe] to-[#00f2fe]' },
  { id: '4373500722', name: '100% Bruno Mars', genre: 'Bruno Mars', color: 'from-[#f83600] to-[#f9d423]' },
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
  giveUp: () => void;
  resetGame: () => void;
  backToMenu: () => void;
}

// Normalize strings to handle variations in title/artist (e.g., lowercase, remove special characters)
export const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export const checkIsCorrect = (guessTrack: Track, currentTrack: Track) => {
  const isIdMatch = guessTrack.id === currentTrack.id;
  const guessTitle = normalizeString(guessTrack.title);
  const currentTitle = normalizeString(currentTrack.title);
  const guessArtist = normalizeString(guessTrack.artist.name);
  const currentArtist = normalizeString(currentTrack.artist.name);

  const isTitleMatch = guessTitle.includes(currentTitle) || currentTitle.includes(guessTitle);
  const isArtistMatch = guessArtist.includes(currentArtist) || currentArtist.includes(guessArtist);
  
  return isIdMatch || (isTitleMatch && isArtistMatch);
};

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

    const isCorrect = checkIsCorrect(guessTrack, currentTrack);

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

  giveUp: () => {
    const { currentTrack } = get();
    if (!currentTrack || get().gameStatus !== 'playing') return;
    set({ gameStatus: 'lost' });
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
