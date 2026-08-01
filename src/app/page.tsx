"use client";

import { useMusicStore } from "@/store/useMusicStore";
import { SearchPanel } from "@/features/search/SearchPanel";
import Image from "next/image";
import Link from "next/link";
import { History } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { songs, memories } = useMusicStore();
  
  const recentMemories = Object.values(memories).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);

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

      {/* Content Stack */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-3xl flex flex-col gap-8"
      >
        {/* Recent Memories */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-neutral-400" />
              <h2 className="text-lg font-medium tracking-wide text-white">Recent Memories</h2>
            </div>
            <Link href="/library" className="text-sm text-neutral-500 hover:text-white transition-colors">
              Library
            </Link>
          </div>
          {recentMemories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentMemories.map((memory) => {
                const song = songs[memory.trackId];
                if (!song) return null;
                return (
                  <Link key={memory.id} href={`/song/${song.id}`}>
                    <div className="group flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-[#262626] p-5 transition-colors hover:bg-[#1a1a1a] hover:border-[#404040]">
                      {/* Song Info */}
                      <div className="flex items-center gap-4 min-w-[200px] shrink-0">
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-[#262626] shrink-0">
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
                        <div className="flex flex-col overflow-hidden pr-4">
                          <span className="truncate text-sm font-medium text-white">{song.title}</span>
                          <span className="truncate text-xs text-neutral-500">{song.artist.name}</span>
                        </div>
                      </div>
                      
                      {/* Memory Text */}
                      <div className="md:border-l border-[#262626] pt-3 mt-1 md:pt-0 md:mt-0 md:pl-5 md:flex-1">
                        <p className="text-sm font-medium text-neutral-200 leading-relaxed line-clamp-2">
                          "{memory.text}"
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-neutral-500 border border-dashed border-[#262626] rounded-xl">
              No memories recorded. Search and save a song to start your journal.
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
