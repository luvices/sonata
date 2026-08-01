import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Track, Collection, Memory, Settings } from '@/types';

interface MusicStore {
  // State
  songs: Record<string, Track>;
  collections: Record<string, Collection>;
  memories: Record<string, Memory>;
  history: {
    searches: string[];
    recentTracks: string[]; // Track IDs
  };
  settings: Settings;

  // Actions
  saveTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  
  createCollection: (name: string, description?: string) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addTrackToCollection: (collectionId: string, trackId: string) => void;
  removeTrackFromCollection: (collectionId: string, trackId: string) => void;

  saveMemory: (trackId: string, text: string) => void;
  deleteMemory: (memoryId: string) => void;

  addSearchHistory: (query: string) => void;
  addRecentTrack: (trackId: string) => void;
  clearHistory: () => void;

  updateSettings: (updates: Partial<Settings>) => void;
  
  // Data Import/Export (handled externally, but we need a way to restore)
  restoreStore: (state: Partial<MusicStore>) => void;
}

const initialState = {
  songs: {},
  collections: {},
  memories: {},
  history: {
    searches: [],
    recentTracks: [],
  },
  settings: {
    compactMode: false,
    reducedMotion: false,
    theme: 'dark' as const,
  },
};

export const useMusicStore = create<MusicStore>()(
  persist(
    (set) => ({
      ...initialState,

      saveTrack: (track) => set((state) => ({
        songs: {
          ...state.songs,
          [track.id]: { ...track, savedAt: Date.now() }
        }
      })),

      removeTrack: (trackId) => set((state) => {
        const { [trackId]: removed, ...restSongs } = state.songs;
        
        // Also remove from all collections
        const updatedCollections = { ...state.collections };
        Object.keys(updatedCollections).forEach(cId => {
          updatedCollections[cId] = {
            ...updatedCollections[cId],
            trackIds: updatedCollections[cId].trackIds.filter(id => id !== trackId)
          };
        });

        return { songs: restSongs, collections: updatedCollections };
      }),

      createCollection: (name, description) => set((state) => {
        const id = crypto.randomUUID();
        return {
          collections: {
            ...state.collections,
            [id]: {
              id,
              name,
              description,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              trackIds: []
            }
          }
        };
      }),

      updateCollection: (id, updates) => set((state) => {
        if (!state.collections[id]) return state;
        return {
          collections: {
            ...state.collections,
            [id]: {
              ...state.collections[id],
              ...updates,
              updatedAt: Date.now()
            }
          }
        };
      }),

      deleteCollection: (id) => set((state) => {
        const { [id]: removed, ...restCollections } = state.collections;
        return { collections: restCollections };
      }),

      addTrackToCollection: (collectionId, trackId) => set((state) => {
        const collection = state.collections[collectionId];
        if (!collection || collection.trackIds.includes(trackId)) return state;
        
        return {
          collections: {
            ...state.collections,
            [collectionId]: {
              ...collection,
              trackIds: [...collection.trackIds, trackId],
              updatedAt: Date.now()
            }
          }
        };
      }),

      removeTrackFromCollection: (collectionId, trackId) => set((state) => {
        const collection = state.collections[collectionId];
        if (!collection) return state;
        
        return {
          collections: {
            ...state.collections,
            [collectionId]: {
              ...collection,
              trackIds: collection.trackIds.filter(id => id !== trackId),
              updatedAt: Date.now()
            }
          }
        };
      }),

      saveMemory: (trackId, text) => set((state) => {
        // Find existing memory for this track, or create a new one
        const existingMemoryId = Object.values(state.memories).find(m => m.trackId === trackId)?.id;
        const id = existingMemoryId || crypto.randomUUID();
        
        return {
          memories: {
            ...state.memories,
            [id]: {
              id,
              trackId,
              text,
              createdAt: existingMemoryId ? state.memories[id].createdAt : Date.now(),
              updatedAt: Date.now()
            }
          }
        };
      }),

      deleteMemory: (memoryId) => set((state) => {
        const { [memoryId]: removed, ...restMemories } = state.memories;
        return { memories: restMemories };
      }),

      addSearchHistory: (query) => set((state) => {
        const searches = [query, ...state.history.searches.filter(q => q !== query)].slice(0, 10);
        return { history: { ...state.history, searches } };
      }),

      addRecentTrack: (trackId) => set((state) => {
        const recentTracks = [trackId, ...state.history.recentTracks.filter(id => id !== trackId)].slice(0, 20);
        return { history: { ...state.history, recentTracks } };
      }),

      clearHistory: () => set((state) => ({
        history: { searches: [], recentTracks: [] }
      })),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      restoreStore: (newState) => set((state) => ({
        ...state,
        ...newState
      })),
    }),
    {
      name: 'sonata-storage', // key in local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
