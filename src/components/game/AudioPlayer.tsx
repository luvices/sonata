import { useState, useRef, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AudioPlayerProps {
  url: string;
  durationLimitMs: number;
}

export function AudioPlayer({ url, durationLimitMs }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);

  // Stop playback when the limit is reached
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentMs = audio.currentTime * 1000;
      setProgressMs(currentMs);

      if (currentMs >= durationLimitMs) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgressMs(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [durationLimitMs]);

  // Handle URL change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgressMs(0);
    }
  }, [url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setProgressMs(0);
    } else {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing audio", e));
      setIsPlaying(true);
    }
  };

  // 16s is the max duration for our game (INTERVALS[5] = 16)
  const maxGameDurationMs = 16000; 
  
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto my-8">
      <audio ref={audioRef} src={url} preload="auto" />
      
      {/* Progress Bar Area */}
      <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden relative border border-neutral-700">
        {/* The limit indicator */}
        <div 
          className="absolute top-0 bottom-0 left-0 bg-neutral-600 transition-all duration-300 ease-linear"
          style={{ width: `${(durationLimitMs / maxGameDurationMs) * 100}%` }}
        />
        {/* The actual progress */}
        <div 
          className="absolute top-0 bottom-0 left-0 bg-white"
          style={{ width: `${(progressMs / maxGameDurationMs) * 100}%` }}
        />
        
        {/* Markers for intervals */}
        {[1, 2, 4, 7, 11, 16].map((interval) => (
          <div 
            key={interval}
            className="absolute top-0 bottom-0 w-px bg-neutral-900 z-10"
            style={{ left: `${(interval * 1000 / maxGameDurationMs) * 100}%` }}
          />
        ))}
      </div>

      <Button
        onClick={togglePlay}
        variant="default"
        size="lg"
        className="h-16 w-16 rounded-full flex items-center justify-center p-0 transition-transform active:scale-95"
      >
        {isPlaying ? (
          <Square className="h-6 w-6 fill-current text-black" />
        ) : (
          <Play className="h-7 w-7 fill-current text-black ml-1" />
        )}
      </Button>
    </div>
  );
}
