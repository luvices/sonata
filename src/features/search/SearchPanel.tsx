"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { searchTracks } from '@/lib/deezer';
import { Track } from '@/types';
import { useGameStore } from '@/store/useGameStore';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/Skeleton';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { submitGuess, gameStatus } = useGameStore();

  useKeyboardShortcut('/', () => {
    inputRef.current?.focus();
  });

  useKeyboardShortcut('Escape', () => {
    if (isFocused) {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  });

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const data = await searchTracks(query);
        // Reverse the results so the most relevant (first from API) is at the bottom, closest to the input
        setResults(data.reverse());
        setLoading(false);
        setSelectedIndex(-1);
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, results, selectedIndex]);

  const handleSelect = (track: Track) => {
    if (gameStatus === 'playing') {
      submitGuess(track);
    }
    setIsFocused(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-40">
      <div
        className={`relative flex items-center w-full transition-all duration-300 ${
          isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        <SearchIcon className="absolute left-4 h-6 w-6 text-neutral-500" />
        <input
          id="main-search"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for songs, artists, or albums..."
          className="h-14 md:h-16 w-full rounded-2xl border border-neutral-700 bg-neutral-900/80 px-12 md:px-14 pr-12 md:pr-[100px] text-base md:text-lg text-white transition-all placeholder:text-neutral-500 hover:border-neutral-500 hover:bg-neutral-800 focus:border-neutral-400 focus:bg-neutral-800 focus:outline-none shadow-lg"
        />
        
        {/* Desktop Explicit Search Button */}
        <div className="absolute right-2 top-2 bottom-2 hidden md:block">
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="h-full px-4 text-neutral-500 hover:text-white transition-colors flex items-center justify-center"
            >
              <X className="h-6 w-6" />
            </button>
          ) : (
            <button 
              onClick={() => inputRef.current?.focus()} 
              className="h-full px-4 md:px-5 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-sm md:text-base"
            >
              Search
            </button>
          )}
        </div>

        {/* Mobile Clear Button */}
        <div className="absolute right-4 top-0 bottom-0 flex items-center md:hidden">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-500 hover:text-white transition-colors flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFocused && (query.length > 1 || results.length > 0) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-sm"
              onClick={() => setIsFocused(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 bottom-full mb-4 max-h-[60vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#0a0a0a] p-2 shadow-2xl"
            >
              {loading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {results.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => handleSelect(track)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors ${
                        selectedIndex === index ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#262626]">
                        {track.album.cover_medium && (
                          <Image
                            src={track.album.cover_medium}
                            alt={track.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-medium text-white">{track.title}</span>
                        <span className="truncate text-sm text-neutral-400">
                          {track.artist.name} &bull; {track.album.title}
                        </span>
                      </div>
                      <div className="ml-auto text-xs text-neutral-500">
                        {Math.floor(track.duration / 60)}:
                        {(track.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500">
                  No results found for "{query}"
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
