"use client";

import { useState } from "react";
import { EnvelopeOpening } from "@/components/invite/envelope-opening";
import { InvitationAudio } from "@/components/invite/invitation-audio";

interface InviteShellProps {
  gender: "boy" | "girl";
  childName: string;
}

export function InviteShell({ gender, childName }: InviteShellProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <InvitationAudio play={isOpened} />
      <EnvelopeOpening
        gender={gender}
        childName={childName}
        onOpen={() => setIsOpened(true)}
      />
    </>
  );
}
