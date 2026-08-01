"use client";

import { use, useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Clock, MoreHorizontal, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { collections, songs, removeTrackFromCollection, deleteCollection } = useMusicStore();
  
  const collection = collections[id];
  const [isEditing, setIsEditing] = useState(false);

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-2xl font-medium mb-4">Collection not found</h1>
        <p className="text-neutral-500 mb-8">This collection might have been deleted.</p>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  const collectionSongs = collection.trackIds.map(trackId => songs[trackId]).filter(Boolean);
  const totalDuration = collectionSongs.reduce((acc, song) => acc + song.duration, 0);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
      router.push('/');
    }
  };

  const handleRemoveTrack = (e: React.MouseEvent, trackId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeTrackFromCollection(id, trackId);
  };

  return (
    <div className="flex flex-col gap-12 animate-[fadeIn_0.5s_easeOut_forwards]">
      <Link href="/" className="flex w-fit items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-end border-b border-[#262626] pb-12">
        <div className="flex flex-col gap-4 flex-1">
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-neutral-400 text-lg max-w-2xl">{collection.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-neutral-500 mt-2">
            <span>{collectionSongs.length} songs</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.floor(totalDuration / 60)} min
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Song List */}
      <div className="flex flex-col w-full">
        {collectionSongs.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p>No songs in this collection yet.</p>
            <p className="text-sm mt-2">Search for songs and add them here.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_auto] gap-4 p-4 text-xs font-medium uppercase tracking-wider text-neutral-500 border-b border-[#262626]">
              <div>Title</div>
              <div className="hidden md:block">Album</div>
              <div className="text-right">Duration</div>
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              {collectionSongs.map((song) => (
                <Link key={song.id} href={`/song/${song.id}`}>
                  <div className="group grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_auto] gap-4 items-center p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#262626]">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-12 w-12 shrink-0 rounded bg-[#262626] overflow-hidden">
                        {song.album?.cover_medium && (
                          <Image
                            src={song.album.cover_medium}
                            alt={song.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium text-white group-hover:text-neutral-200">{song.title}</span>
                        <span className="truncate text-sm text-neutral-500">{song.artist.name}</span>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center min-w-0">
                      <span className="truncate text-sm text-neutral-400">{song.album.title}</span>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={(e) => handleRemoveTrack(e, song.id)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all p-2"
                        title="Remove from collection"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-neutral-500 w-12 text-right">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
