"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface AudioCtx {
  playing: boolean;
  toggle: () => void;
}

const Ctx = createContext<AudioCtx>({ playing: false, toggle: () => {} });

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef            = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio('/WhatsApp%20Audio%202026-04-22%20at%2013.00.29.mp3');
    audio.loop   = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
      window.removeEventListener('click',   tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
    window.addEventListener('click',   tryPlay);
    window.addEventListener('keydown', tryPlay);

    return () => {
      window.removeEventListener('click',   tryPlay);
      window.removeEventListener('keydown', tryPlay);
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return <Ctx.Provider value={{ playing, toggle }}>{children}</Ctx.Provider>;
}

export const useAudio = () => useContext(Ctx);
