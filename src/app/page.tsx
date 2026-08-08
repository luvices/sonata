"use client";

import { useEffect, useState } from "react";
import { useGameStore, INTERVALS, MAX_GUESSES, PLAYLISTS, checkIsCorrect } from "@/store/useGameStore";
import { getPlaylistTracks, getTrackDetails } from "@/lib/deezer";
import { SearchPanel } from "@/features/search/SearchPanel";
import { AudioPlayer } from "@/components/game/AudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Loader2, Music, PlayCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { 
    currentTrack, 
    guesses, 
    gameStatus, 
    currentIntervalIndex, 
    selectedPlaylistId,
    selectPlaylist,
    startGame, 
    skipTurn, 
    giveUp,
    resetGame,
    backToMenu
  } = useGameStore();
  
  const [loading, setLoading] = useState(false);

  const fetchRandomTrack = async (playlistId: string) => {
    setLoading(true);
    
    if (playlistId === 'CUSTOM_TIKTOK') {
      const customIds = [
        3047560351, 2801558062, 2801558052, 3050380851, 3782823042, 2959869831, 
        3064010361, 2783963122, 3152680421, 3194407481, 3198801881, 111774706, 
        2426063, 7764688, 2982137201, 2934056311, 2982137141, 3106586641, 
        3124823321, 3631973792, 3047461891, 3122902751, 903771402, 3471926681, 
        2815968782
      ];
      const randomId = customIds[Math.floor(Math.random() * customIds.length)];
      const track = await getTrackDetails(randomId.toString());
      if (track && track.preview) {
        startGame(track);
      }
    } else {
      const tracks = await getPlaylistTracks(playlistId);
      if (tracks.length > 0) {
        const validTracks = tracks.filter(t => t.preview);
        if (validTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * validTracks.length);
          startGame(validTracks[randomIndex]);
        }
      }
    }
    
    setLoading(false);
  };

  const handlePlaylistSelect = (id: string) => {
    selectPlaylist(id);
    fetchRandomTrack(id);
  };

  const handlePlayAgain = () => {
    if (selectedPlaylistId) {
      resetGame();
      fetchRandomTrack(selectedPlaylistId);
    }
  };

  if (gameStatus === 'menu') {
    return (
      <div className="flex flex-col items-center min-h-[80vh] w-full max-w-4xl mx-auto pb-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-white mb-4">
            SONATA
          </h1>
          <p className="text-neutral-400 text-base md:text-lg tracking-wide max-w-md mx-auto">
            Select a genre to play. All modes feature top hits from famous artists and bands.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4"
        >
          {PLAYLISTS.map((playlist, index) => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistSelect(playlist.id)}
              className="group relative flex flex-col items-start justify-end w-full h-40 p-6 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-500 transition-all text-left shadow-lg cursor-pointer"
            >
              <div className={`absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${playlist.color}`} />
              <div className="relative z-10 w-full flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 origin-left transition-transform">{playlist.genre}</h3>
                  <p className="text-sm text-neutral-400 font-medium">{playlist.name}</p>
                </div>
                <PlayCircle className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all" />
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500 mb-4" />
        <p className="text-neutral-500 animate-pulse">Loading famous artists...</p>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-neutral-500 mb-6">Failed to load game. Please refresh.</p>
        <Button onClick={backToMenu} variant="outline">Back to Menu</Button>
      </div>
    );
  }

  const durationLimitMs = gameStatus === 'playing' 
    ? INTERVALS[currentIntervalIndex] * 1000 
    : 30000; 

  const activePlaylist = PLAYLISTS.find(p => p.id === selectedPlaylistId);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full max-w-2xl mx-auto pb-20">
      
      <div className="w-full flex justify-between items-center mb-8 px-2">
        <button 
          onClick={backToMenu}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Menu
        </button>
        {activePlaylist && (
          <span className="text-xs font-medium px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400">
            Playing: {activePlaylist.genre}
          </span>
        )}
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
            const isCorrect = checkIsCorrect(guess, currentTrack);
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
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={giveUp}
                  className="text-red-400 hover:text-red-300 border-red-900/30 hover:border-red-800/50 hover:bg-red-950/20"
                >
                  Give Up
                </Button>
                <Button 
                  variant="outline" 
                  onClick={skipTurn}
                  className="text-neutral-400 hover:text-white"
                >
                  Hear More (+{currentIntervalIndex + 1 < MAX_GUESSES ? INTERVALS[currentIntervalIndex + 1] - INTERVALS[currentIntervalIndex] : 0}s)
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8 w-full p-6 md:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm shadow-2xl"
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

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                <Button onClick={backToMenu} variant="outline" size="lg" className="h-14 px-8 font-medium">
                  Menu
                </Button>
                <Button onClick={handlePlayAgain} size="lg" className="h-14 px-12 font-bold text-base bg-white text-black hover:bg-neutral-200">
                  Play Next
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
