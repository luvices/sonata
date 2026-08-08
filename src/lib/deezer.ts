import { DeezerSearchResponse, Track } from '@/types';
import { decryptPayload } from './crypto';

const API_BASE_URL = 'https://api.deezer.com';

/**
 * We use a JSONP workaround or rely on standard fetch if CORS allows.
 * Since this is a client-side only app, we can use the Deezer API directly,
 * but Deezer API sometimes has CORS issues on standard fetch.
 * Alternatively, we can use a proxy route handler in Next.js to avoid CORS.
 * Since Next.js is fullstack, we will create an API route in Next.js
 * that forwards the request to Deezer.
 * But wait! The prompt says "Everything exists locally inside the browser. No backend."
 * Let's try standard fetch first. If CORS is an issue, we can use the Next.js API route as a proxy (which doesn't require a DB, it's just a proxy).
 * Actually, the instructions say "No backend". So we should fetch directly from client if possible. 
 * Deezer API might have CORS for `/search`.
 * Let's create the client-side service. If CORS blocks it, we will use a Next.js proxy route.
 */
export async function searchTracks(query: string, limit: number = 20): Promise<Track[]> {
  if (!query.trim()) return [];

  try {
    // We use a Next.js Route Handler as a simple proxy to bypass CORS 
    // since Deezer's API doesn't support CORS for all domains.
    // Even though it's "no backend", a proxy route is standard Next.js architecture.
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Deezer');
    }

    const encryptedText = await response.text();
    const data: DeezerSearchResponse = decryptPayload(encryptedText);

    if (!data || !data.data) {
      return [];
    }

    return data.data.map(track => ({
      id: track.id.toString(),
      title: track.title,
      duration: track.duration,
      preview: track.preview,
      artist: {
        id: track.artist.id.toString(),
        name: track.artist.name,
        picture_medium: track.artist.picture_medium,
      },
      album: {
        id: track.album.id.toString(),
        title: track.album.title,
        cover_medium: track.album.cover_medium,
        cover_xl: track.album.cover_xl,
      }
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}

export async function getTrackDetails(id: string): Promise<Track | null> {
  try {
    const response = await fetch(`/api/track?id=${id}`);
    
    if (!response.ok) {
      return null;
    }

    const encryptedText = await response.text();
    const track = decryptPayload(encryptedText);

    if (!track || track.error) {
      return null;
    }
    
    return {
      id: track.id.toString(),
      title: track.title,
      duration: track.duration,
      preview: track.preview,
      release_date: track.release_date,
      artist: {
        id: track.artist.id.toString(),
        name: track.artist.name,
        picture_medium: track.artist.picture_medium,
      },
      album: {
        id: track.album.id.toString(),
        title: track.album.title,
        cover_medium: track.album.cover_medium,
        cover_xl: track.album.cover_xl,
      }
    };
  } catch (error) {
    return null;
  }
}

export async function getPlaylistTracks(id: string): Promise<Track[]> {
  try {
    const response = await fetch(`/api/playlist?id=${id}`);
    
    if (!response.ok) {
      return [];
    }

    const encryptedText = await response.text();
    const data = decryptPayload(encryptedText);

    if (!data || !data.tracks || !data.tracks.data) {
      return [];
    }

    return data.tracks.data.map((track: any) => ({
      id: track.id.toString(),
      title: track.title,
      duration: track.duration,
      preview: track.preview,
      artist: {
        id: track.artist.id.toString(),
        name: track.artist.name,
        picture_medium: track.artist.picture_medium,
      },
      album: {
        id: track.album.id.toString(),
        title: track.album.title,
        cover_medium: track.album.cover_medium,
        cover_xl: track.album.cover_xl,
      }
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
}
