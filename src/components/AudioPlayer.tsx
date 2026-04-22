"use client";
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const audioRef            = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    const audio = new Audio('/WhatsApp%20Audio%202026-04-22%20at%2013.00.29.mp3');
    audio.loop   = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Autoplay on first user gesture (browser policy)
    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
      setReady(true);
      window.removeEventListener('click',   tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
    window.addEventListener('click',   tryPlay);
    window.addEventListener('keydown', tryPlay);
    setReady(true);

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

  if (!ready) return null;

  return (
    <>
      {/* Bouncing bar keyframes */}
      <style>{`
        @keyframes bar-bounce {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      {/* Fixed floating button — bottom-right, above timeline */}
      <button
        onClick={toggle}
        title="Forest Lament Resurgence — luyzatalexandre"
        className="fixed z-50 flex flex-col items-center justify-center gap-0.5 px-2.5 py-2 rounded-xl transition-all duration-200 hover:brightness-110 hover:scale-105 active:scale-95"
        style={{
          bottom: '100px',
          right:  '16px',
          background: playing ? 'rgba(13,31,22,0.92)' : 'rgba(13,31,22,0.75)',
          border: `1px solid ${playing ? 'rgba(201,169,74,0.45)' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(8px)',
          boxShadow: playing ? '0 0 16px rgba(201,169,74,0.2), 0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        {playing ? (
          <div className="flex items-end gap-[2px]" style={{ height: '14px' }}>
            {[3, 5, 4, 6, 3].map((h, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full"
                style={{
                  height: `${h * 2}px`,
                  background: '#c9a94a',
                  animation: `bar-bounce ${0.38 + i * 0.09}s ease-in-out infinite alternate`,
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
            <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/>
          </svg>
        )}
        <span
          className="text-[8px] font-bold tracking-wider uppercase leading-none"
          style={{ color: playing ? 'rgba(201,169,74,0.8)' : 'rgba(255,255,255,0.3)' }}
        >
          {playing ? 'On' : 'Off'}
        </span>
      </button>
    </>
  );
}
