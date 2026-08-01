export interface Track {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
    picture_medium?: string;
  };
  album: {
    id: string;
    title: string;
    cover_medium?: string;
    cover_xl?: string;
  };
  duration: number; // in seconds
  preview: string; // url to audio preview
  release_date?: string;
  savedAt?: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  trackIds: string[];
}

export interface Memory {
  id: string;
  trackId: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  compactMode: boolean;
  reducedMotion: boolean;
  theme: 'dark'; // Only dark mode for now
}

export interface DeezerSearchResponse {
  data: {
    id: number;
    title: string;
    duration: number;
    preview: string;
    artist: {
      id: number;
      name: string;
      picture_medium: string;
    };
    album: {
      id: number;
      title: string;
      cover_medium: string;
      cover_xl: string;
    };
  }[];
  total: number;
  next?: string;
}
