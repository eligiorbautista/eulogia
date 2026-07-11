"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface InvitationAudioHandle {
  playOpen: () => Promise<void>;
  playBackground: () => Promise<void>;
}

export const InvitationAudio = forwardRef<InvitationAudioHandle>(
  function InvitationAudio(_props, ref) {
    const openSoundRef = useRef<HTMLAudioElement | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      const openSound = new Audio("/sounds/open-envelope.mp3");
      openSound.preload = "auto";
      openSound.load();
      openSoundRef.current = openSound;

      const bgMusic = new Audio("/sounds/bg-music.mp3");
      bgMusic.preload = "auto";
      bgMusic.loop = true;
      bgMusic.load();
      bgMusicRef.current = bgMusic;

      return () => {
        openSoundRef.current?.pause();
        if (openSoundRef.current) {
          openSoundRef.current.currentTime = 0;
        }

        bgMusicRef.current?.pause();
        if (bgMusicRef.current) {
          bgMusicRef.current.currentTime = 0;
          bgMusicRef.current.loop = false;
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      playOpen: async () => {
        const audio = openSoundRef.current;
        if (!audio) return;
        try {
          audio.currentTime = 0;
          await audio.play();
        } catch {
          // iOS may block audio if not triggered directly by user gesture.
        }
      },
      playBackground: async () => {
        const audio = bgMusicRef.current;
        if (!audio) return;
        try {
          audio.currentTime = 0;
          await audio.play();
        } catch {
          // Ignore background music playback failures.
        }
      },
    }));

    return null;
  }
);
