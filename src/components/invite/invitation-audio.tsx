"use client";

import { useEffect, useRef } from "react";

interface InvitationAudioProps {
  play: boolean;
}

const BG_MUSIC_DELAY_MS = 2000;

export function InvitationAudio({ play }: InvitationAudioProps) {
  const openSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    openSoundRef.current = new Audio("/sounds/open-envelope.mp3");
    openSoundRef.current.preload = "auto";
    openSoundRef.current.load();

    bgMusicRef.current = new Audio("/sounds/bg-music.mp3");
    bgMusicRef.current.preload = "auto";
    bgMusicRef.current.loop = true;
    bgMusicRef.current.load();

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      openSoundRef.current?.pause();
      if (openSoundRef.current) openSoundRef.current.currentTime = 0;

      bgMusicRef.current?.pause();
      if (bgMusicRef.current) {
        bgMusicRef.current.currentTime = 0;
        bgMusicRef.current.loop = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!play || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const playOpen = async () => {
      try {
        await openSoundRef.current?.play();
      } catch {
        // Open sound playback failed; continue silently.
      }
    };

    const playBg = async () => {
      try {
        await bgMusicRef.current?.play();
      } catch {
        // Background music playback failed; ignore.
      }
    };

    playOpen();
    timersRef.current.push(setTimeout(playBg, BG_MUSIC_DELAY_MS));
  }, [play]);

  return null;
}
