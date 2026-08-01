"use client";

import { useMusicStore } from "@/store/useMusicStore";
import { SearchPanel } from "@/features/search/SearchPanel";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Library, History } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { songs, collections, memories } = useMusicStore();
  
  const savedSongs = Object.values(songs).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0)).slice(0, 10);
  const recentMemories = Object.values(memories).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
  const recentCollections = Object.values(collections).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);

  return (
    <div className="flex flex-col items-center min-h-[80vh]">
      {/* Header / Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 md:mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-light tracking-widest text-white mb-2">
          SONATA
        </h1>
        <p className="text-neutral-500 text-sm tracking-wide">
          A personal music archive.
        </p>
      </motion.div>

      {/* Main Search Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="w-full mb-12 md:mb-20"
      >
        <SearchPanel />
      </motion.div>

      {/* Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16"
      >
        
        {/* Recently Saved Songs */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div className="flex items-center gap-3">
              <Library className="h-5 w-5 text-neutral-400" />
              <h2 className="text-lg font-medium tracking-wide text-white">Recently Saved</h2>
            </div>
            <Link href="/library" className="text-sm text-neutral-500 hover:text-white transition-colors">
              View All
            </Link>
          </div>
          {savedSongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedSongs.slice(0, 6).map((song) => (
                <Link key={song.id} href={`/song/${song.id}`}>
                  <div className="group flex items-center gap-4 rounded-xl p-3 hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#333]">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-[#262626]">
                      {song.album?.cover_medium && (
                        <Image
                          src={song.album.cover_medium}
                          alt={song.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate font-medium text-white group-hover:text-neutral-200">{song.title}</span>
                      <span className="truncate text-xs text-neutral-500">
                        {song.artist.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-neutral-500 border border-dashed border-[#262626] rounded-xl">
              No songs saved yet. Search above to start your collection.
            </div>
          )}
        </section>

        {/* Collections */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-neutral-400" />
              <h2 className="text-lg font-medium tracking-wide text-white">Collections</h2>
            </div>
            <Link href="/library" className="text-sm text-neutral-500 hover:text-white transition-colors">
              View All
            </Link>
          </div>
          {recentCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentCollections.map((collection) => (
                <Link key={collection.id} href={`/collection/${collection.id}`}>
                  <div className="group flex flex-col gap-2 rounded-xl border border-[#262626] bg-[#0a0a0a] p-5 hover:border-neutral-500 transition-colors">
                    <span className="font-medium text-white">{collection.name}</span>
                    <span className="text-sm text-neutral-500">
                      {collection.trackIds.length} {collection.trackIds.length === 1 ? 'song' : 'songs'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-neutral-500 border border-dashed border-[#262626] rounded-xl flex flex-col items-center gap-3">
              <span>No collections yet.</span>
              <Link href="/collection/new" className="text-white hover:underline">Create Collection</Link>
            </div>
          )}
        </section>

        {/* Recent Memories */}
        <section className="flex flex-col gap-6 md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-neutral-400" />
              <h2 className="text-lg font-medium tracking-wide text-white">Recent Memories</h2>
            </div>
            <Link href="/library" className="text-sm text-neutral-500 hover:text-white transition-colors">
              View All
            </Link>
          </div>
          {recentMemories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentMemories.map((memory) => {
                const song = songs[memory.trackId];
                if (!song) return null;
                return (
                  <Link key={memory.id} href={`/song/${song.id}`}>
                    <div className="group flex flex-col gap-4 rounded-xl border border-[#262626] p-5 transition-colors hover:bg-[#1a1a1a] h-full">
                      <p className="text-sm font-medium text-neutral-200 leading-relaxed line-clamp-3">"{memory.text}"</p>
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#262626]">
                        <div className="relative h-8 w-8 overflow-hidden rounded bg-[#262626] shrink-0">
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
                          <span className="truncate text-xs font-medium text-white">{song.title}</span>
                          <span className="truncate text-[10px] text-neutral-500">{song.artist.name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-neutral-500 border border-dashed border-[#262626] rounded-xl">
              No memories recorded. Save a song and add a personal note to see it here.
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
