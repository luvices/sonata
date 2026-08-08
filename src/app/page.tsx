"use client";

import { useEffect, useState } from "react";
import { useGameStore, INTERVALS, MAX_GUESSES } from "@/store/useGameStore";
import { getPlaylistTracks } from "@/lib/deezer";
import { Track } from "@/types";
import { SearchPanel } from "@/features/search/SearchPanel";
import { AudioPlayer } from "@/components/game/AudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Top Hits Playlist from Deezer
const PLAYLIST_ID = "3155776842";

export default function Home() {
  const { currentTrack, guesses, gameStatus, currentIntervalIndex, startGame, skipTurn, resetGame } = useGameStore();
  const [loading, setLoading] = useState(true);

  const fetchRandomTrack = async () => {
    setLoading(true);
    const tracks = await getPlaylistTracks(PLAYLIST_ID);
    if (tracks.length > 0) {
      // Find tracks that actually have a preview
      const validTracks = tracks.filter(t => t.preview);
      if (validTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * validTracks.length);
        startGame(validTracks[randomIndex]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!currentTrack) {
      fetchRandomTrack();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    fetchRandomTrack();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-neutral-500">Failed to load game. Please refresh.</p>
      </div>
    );
  }

  const durationLimitMs = gameStatus === 'playing' 
    ? INTERVALS[currentIntervalIndex] * 1000 
    : 30000; // Full 30s preview on win/loss

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full max-w-2xl mx-auto pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-light tracking-widest text-white mb-2">
          SONATA
        </h1>
        <p className="text-neutral-500 text-sm tracking-wide">
          Guess the song from the intro.
        </p>
      </motion.div>

      {/* Guesses Board */}
      <div className="w-full flex flex-col gap-2 mb-8">
        {guesses.map((guess, index) => {
          let bgColor = "bg-neutral-900/50 border-neutral-800";
          let content = null;

          if (guess === 'skipped') {
            bgColor = "bg-neutral-800 border-neutral-700";
            content = <span className="text-neutral-500 text-sm font-medium">SKIPPED</span>;
          } else if (guess) {
            const isCorrect = guess.id === currentTrack.id;
            bgColor = isCorrect ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50";
            content = (
              <div className="flex items-center gap-3 w-full">
                <span className="truncate text-sm font-medium flex-1">
                  {guess.title} - {guess.artist.name}
                </span>
              </div>
            );
          } else if (index === currentIntervalIndex && gameStatus === 'playing') {
            bgColor = "bg-neutral-900 border-neutral-600 animate-pulse";
          }

          return (
            <div 
              key={index} 
              className={`h-12 w-full rounded-md border flex items-center px-4 transition-colors ${bgColor}`}
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* Audio Player Area */}
      <AudioPlayer url={currentTrack.preview} durationLimitMs={durationLimitMs} />

      {/* Search / Game Controls */}
      <div className="w-full mt-4">
        {gameStatus === 'playing' ? (
          <div className="flex flex-col gap-4">
            <SearchPanel />
            <div className="flex justify-between items-center mt-2 px-2">
              <span className="text-xs text-neutral-500 font-medium">
                Attempt {currentIntervalIndex + 1} of {MAX_GUESSES}
              </span>
              <Button 
                variant="outline" 
                onClick={skipTurn}
                className="text-neutral-400 hover:text-white"
              >
                Skip (+{currentIntervalIndex + 1 < MAX_GUESSES ? INTERVALS[currentIntervalIndex + 1] - INTERVALS[currentIntervalIndex] : 0}s)
              </Button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8 w-full p-6 md:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm"
            >
              <div className="text-center">
                <h2 className={`text-2xl font-bold mb-2 ${gameStatus === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                  {gameStatus === 'won' ? 'You got it!' : 'Game Over'}
                </h2>
                <p className="text-neutral-400">The song was:</p>
              </div>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative h-48 w-48 rounded-xl overflow-hidden shadow-2xl">
                  {currentTrack.album.cover_xl ? (
                    <Image src={currentTrack.album.cover_xl} alt={currentTrack.title} fill className="object-cover" unoptimized />
                  ) : currentTrack.album.cover_medium && (
                    <Image src={currentTrack.album.cover_medium} alt={currentTrack.title} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{currentTrack.title}</h3>
                  <p className="text-neutral-400">{currentTrack.artist.name}</p>
                </div>
              </div>

              <Button onClick={handlePlayAgain} size="lg" className="w-full sm:w-auto px-12 font-bold text-base h-14 bg-white text-black hover:bg-neutral-200">
                Play Next
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
