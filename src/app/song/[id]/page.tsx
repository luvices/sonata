"use client";

import { useEffect, useState, use } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { getTrackDetails } from '@/lib/deezer';
import { Track } from '@/types';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Bookmark, BookmarkCheck, Plus, Check, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { songs, saveTrack, removeTrack, memories, saveMemory, addRecentTrack, collections, addTrackToCollection, removeTrackFromCollection } = useMusicStore();
  const [track, setTrack] = useState<Track | null>(songs[id] || null);
  const [loading, setLoading] = useState(!songs[id]);
  const [isSaved, setIsSaved] = useState(!!songs[id]);
  const [showCollections, setShowCollections] = useState(false);
  
  const memory = Object.values(memories).find(m => m.trackId === id);
  const [memoryText, setMemoryText] = useState(memory?.text || '');
  const [isEditingMemory, setIsEditingMemory] = useState(!memory);

  useEffect(() => {
    async function fetchTrack() {
      if (!songs[id]) {
        const data = await getTrackDetails(id);
        if (data) {
          setTrack(data);
        }
      }
      setLoading(false);
      addRecentTrack(id);
    }
    fetchTrack();
  }, [id, songs, addRecentTrack]);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeTrack(id);
      setIsSaved(false);
      toast.success('Removed from saved songs');
    } else if (track) {
      saveTrack(track);
      setIsSaved(true);
      toast.success('Saved to your songs');
    }
  };

  const handleMemorySave = () => {
    if (memoryText.trim()) {
      // Must save the track first if not saved
      if (!isSaved && track) {
        saveTrack(track);
        setIsSaved(true);
      }
      saveMemory(id, memoryText.trim());
      setIsEditingMemory(false);
      toast.success('Memory saved successfully');
    } else {
      toast.error('Memory cannot be empty');
    }
  };

  const toggleCollection = (collectionId: string, hasTrack: boolean) => {
    if (!isSaved && track) {
      saveTrack(track);
      setIsSaved(true);
    }
    const collectionName = collections[collectionId]?.name || 'Collection';
    if (hasTrack) {
      removeTrackFromCollection(collectionId, id);
      toast.success(`Removed from ${collectionName}`);
    } else {
      addTrackToCollection(collectionId, id);
      toast.success(`Added to ${collectionName}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-12">
        <Link href="/" className="flex w-fit items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex flex-col md:flex-row gap-12">
          <Skeleton className="w-full md:w-[400px] aspect-square rounded-sm" />
          <div className="flex flex-col gap-4 flex-1">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3 mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-2xl font-medium mb-4">Song not found</h1>
        <p className="text-neutral-500 mb-8">The track you are looking for does not exist or couldn't be loaded.</p>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 md:gap-20 animate-[fadeIn_0.5s_easeOut_forwards]">
      <Link href="/" className="flex w-fit items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex flex-col md:flex-row gap-8 md:gap-20">
        {/* Artwork */}
        <div className="w-2/3 max-w-[280px] md:max-w-none md:w-[400px] shrink-0 mx-auto md:mx-0">
          <div className="relative aspect-square w-full overflow-hidden bg-[#1a1a1a] shadow-xl md:shadow-2xl rounded-md md:rounded-sm">
            {track.album?.cover_xl ? (
              <Image
                src={track.album.cover_xl}
                alt={track.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : track.album?.cover_medium ? (
               <Image
                src={track.album.cover_medium}
                alt={track.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 py-0 md:py-4">
          <div className="flex flex-col gap-1 md:gap-2 mb-6 md:mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
              {track.title}
            </h1>
            <h2 className="text-lg md:text-2xl text-neutral-400 font-light">
              {track.artist.name} &bull; {track.album.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-8 md:mb-12 text-xs md:text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
            </div>
            {track.release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {track.release_date.substring(0, 4)}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-10 border-b border-[#262626] pb-8 relative w-full">
            <div className="flex w-full md:w-auto gap-3">
              <Button 
                variant={isSaved ? "secondary" : "default"} 
                className="flex-1 md:w-40 gap-2 h-11"
                onClick={handleSaveToggle}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {isSaved ? 'Saved' : 'Save Song'}
              </Button>
              
              <div className="relative flex-1 md:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 h-11"
                  onClick={() => setShowCollections(!showCollections)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to Collection</span>
                  <span className="sm:hidden">Collection</span>
                </Button>
              
              {showCollections && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setShowCollections(false)} />
                  <div className="absolute top-full mt-2 left-0 w-64 bg-[#0a0a0a] border border-[#262626] rounded-xl shadow-2xl overflow-hidden z-10 p-2 flex flex-col gap-1">
                    {Object.values(collections).length === 0 ? (
                      <div className="p-3 text-sm text-neutral-500 text-center">No collections yet</div>
                    ) : (
                      Object.values(collections).map(c => {
                        const hasTrack = c.trackIds.includes(id);
                        return (
                          <button 
                            key={c.id}
                            onClick={() => toggleCollection(c.id, hasTrack)}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-[#1a1a1a] transition-colors text-sm text-left"
                          >
                            <span className="truncate pr-2">{c.name}</span>
                            {hasTrack && <Check className="h-4 w-4 text-white shrink-0" />}
                          </button>
                        );
                      })
                    )}
                    <Link href="/collection/new" className="mt-2 pt-2 border-t border-[#262626]" onClick={() => setShowCollections(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-400 hover:text-white">
                        <Plus className="h-4 w-4 mr-2" /> New Collection
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
            </div>
            
            {track.preview && (
              <audio controls src={track.preview} className="h-11 w-full max-w-[280px] opacity-80 filter invert contrast-200 mt-2 md:mt-0 md:ml-4">
                Your browser does not support the audio element.
              </audio>
            )}
          </div>

          {/* Memory Section */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <h3 className="text-lg font-medium text-white flex items-center gap-3">
              Memory
              {!isEditingMemory && memory && (
                <button 
                  onClick={() => setIsEditingMemory(true)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </h3>
            
            {isEditingMemory ? (
              <>
                <p className="text-sm text-neutral-500 mb-2">
                  Attach a personal note or memory to this song. What does it remind you of?
                </p>
                <textarea
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  placeholder="e.g. Late night coding session building my first app..."
                  className="w-full min-h-[120px] rounded-lg border border-[#262626] bg-transparent p-4 text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none transition-colors resize-y"
                  autoFocus={!!memory}
                />
                <div className="flex justify-end mt-2 gap-3">
                  {memory && (
                    <Button variant="ghost" onClick={() => {
                      setMemoryText(memory.text);
                      setIsEditingMemory(false);
                    }}>
                      Cancel
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleMemorySave} disabled={!memoryText.trim()}>
                    Save Memory
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
                <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap font-medium">
                  "{memoryText}"
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
