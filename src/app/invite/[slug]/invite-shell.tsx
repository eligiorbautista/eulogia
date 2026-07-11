"use client";

import { useCallback, useRef } from "react";
import { EnvelopeOpening } from "@/components/invite/envelope-opening";
import {
  InvitationAudio,
  InvitationAudioHandle,
} from "@/components/invite/invitation-audio";

interface InviteShellProps {
  gender: "boy" | "girl";
  childName: string;
}

const BG_MUSIC_DELAY_MS = 2000;

export function InviteShell({ gender, childName }: InviteShellProps) {
  const audioRef = useRef<InvitationAudioHandle>(null);

  const handleOpen = useCallback(() => {
    // iOS Safari requires audio playback to start synchronously within the
    // same user gesture. Trigger both sounds directly from the tap handler.
    void audioRef.current?.playOpen();

    window.setTimeout(() => {
      void audioRef.current?.playBackground();
    }, BG_MUSIC_DELAY_MS);
  }, []);

  return (
    <>
      <InvitationAudio ref={audioRef} />
      <EnvelopeOpening
        gender={gender}
        childName={childName}
        onOpen={handleOpen}
      />
    </>
  );
}
