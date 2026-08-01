"use client";

import { useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, PlayCircle, History, Clock } from 'lucide-react';

export default function LibraryPage() {
  const { songs, collections, memories } = useMusicStore();
  const [activeTab, setActiveTab] = useState<'songs' | 'collections' | 'memories'>('songs');

  const savedSongs = Object.values(songs).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  const allCollections = Object.values(collections).sort((a, b) => b.updatedAt - a.updatedAt);
  const allMemories = Object.values(memories).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto animate-[fadeIn_0.5s_easeOut_forwards]">
      <Link href="/" className="flex w-fit items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex flex-col gap-4 border-b border-[#262626] pb-8">
        <h1 className="text-4xl font-semibold text-white tracking-tight">Your Library</h1>
        <p className="text-neutral-500">Everything you've saved in Sonata.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-[#262626] pb-1">
        {(['songs', 'collections', 'memories'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className="capitalize">{tab}</span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[50vh]">
        {activeTab === 'songs' && (
          <div className="flex flex-col gap-2">
            {savedSongs.length === 0 ? (
              <div className="py-20 text-center text-neutral-500">No songs saved yet.</div>
            ) : (
              savedSongs.map((song) => (
                <Link key={song.id} href={`/song/${song.id}`}>
                  <div className="group grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_auto] gap-4 items-center p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#262626]">
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
                      <span className="text-sm text-neutral-500 w-12 text-right">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCollections.length === 0 ? (
              <div className="col-span-full py-20 text-center text-neutral-500">No collections created yet.</div>
            ) : (
              allCollections.map((collection) => {
                const firstTrackId = collection.trackIds[0];
                const firstSong = firstTrackId ? songs[firstTrackId] : null;
                const coverImage = firstSong?.album?.cover_medium || firstSong?.album?.cover_xl;

                return (
                  <Link key={collection.id} href={`/collection/${collection.id}`}>
                    <div className="group relative flex flex-col rounded-xl border border-[#262626] bg-black p-6 hover:border-neutral-500 transition-all h-full min-h-[160px] overflow-hidden">
                      {coverImage && (
                        <>
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={coverImage}
                              alt="Collection Cover"
                              fill
                              className="object-cover opacity-20 filter grayscale blur-[2px] group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                              unoptimized
                            />
                          </div>
                          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
                        </>
                      )}
                      
                      <div className="relative z-10 flex flex-col h-full gap-2">
                        <PlayCircle className="h-8 w-8 text-neutral-400 mb-4 group-hover:text-white transition-colors drop-shadow-md" />
                        <div className="mt-auto flex flex-col">
                          <span className="font-medium text-white text-lg drop-shadow-md">{collection.name}</span>
                          <span className="text-sm text-neutral-400 drop-shadow-md">
                            {collection.trackIds.length} {collection.trackIds.length === 1 ? 'song' : 'songs'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'memories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allMemories.length === 0 ? (
              <div className="col-span-full py-20 text-center text-neutral-500">No memories recorded yet.</div>
            ) : (
              allMemories.map((memory) => {
                const song = songs[memory.trackId];
                if (!song) return null;
                return (
                  <Link key={memory.id} href={`/song/${song.id}`}>
                    <div className="group flex flex-col gap-4 rounded-xl border border-[#262626] p-6 transition-all hover:bg-[#1a1a1a] h-full">
                      <History className="h-5 w-5 text-neutral-600 mb-2" />
                      <p className="text-sm font-medium text-neutral-200 leading-relaxed">"{memory.text}"</p>
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#262626]">
                        <div className="relative h-10 w-10 overflow-hidden rounded bg-[#262626] shrink-0">
                          {song.album?.cover_medium && (
                            <Image
                              src={song.album.cover_medium}
                              alt={song.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate text-sm font-medium text-white">{song.title}</span>
                          <span className="truncate text-xs text-neutral-500">{song.artist.name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
