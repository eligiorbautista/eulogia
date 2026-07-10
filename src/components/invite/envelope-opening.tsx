"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

interface EnvelopeOpeningProps {
  gender: "boy" | "girl";
  childName?: string;
  onOpen?: () => void;
  onOpenComplete?: () => void;
}

export function EnvelopeOpening({ gender, childName, onOpen, onOpenComplete }: EnvelopeOpeningProps) {
  const [phase, setPhase] = useState<"ready" | "opening" | "revealing" | "done">("ready");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      onOpenComplete?.();
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [onOpenComplete]);

  const startAnimation = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    timersRef.current.push(
      setTimeout(() => setPhase("opening"), 600)
    );
    timersRef.current.push(
      setTimeout(() => setPhase("revealing"), 1400)
    );
    timersRef.current.push(
      setTimeout(() => {
        setPhase("done");
        onOpenComplete?.();
      }, 2400)
    );
  }, [onOpenComplete]);

  const handleOpen = useCallback(() => {
    if (phase !== "ready" || prefersReducedMotion) return;

    onOpen?.();
    startAnimation();
  }, [phase, prefersReducedMotion, onOpen, startAnimation]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  if (prefersReducedMotion || phase === "done") {
    return null;
  }

  const isOpening = phase === "opening" || phase === "revealing";
  const isRevealing = phase === "revealing";

  return (
    <button
      type="button"
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      aria-label="Open invitation"
      className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-soft to-background px-6 transition-opacity duration-700 ${
        isRevealing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-[min(78vw,300px)] sm:w-[min(56vw,380px)] lg:w-[380px]">
        {/* Soft glow behind envelope */}
        <div className="absolute -inset-8 rounded-[3rem] bg-primary/15 blur-3xl" aria-hidden="true" />

        {/* Invitation card peeking out from top */}
        <div
          className={`absolute inset-x-3 top-0 z-10 flex flex-col items-center justify-end rounded-2xl border border-primary/15 bg-card px-5 pb-5 pt-8 shadow-xl ${
            isRevealing ? "animate-envelope-reveal" : "translate-y-2 opacity-0"
          }`}
          style={{ height: "55%", top: "-45%" }}
        >
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <p className="font-heading text-sm font-semibold text-foreground sm:text-base">
            {childName ?? "Invitation"}
          </p>
          <p className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Baptismal Invitation
          </p>
        </div>

        {/* Envelope body — with perspective for 3D flap */}
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/25 to-primary/40 shadow-xl shadow-primary/20"
          style={{
            width: "100%",
            paddingTop: "71.43%",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Inner content positioned absolutely to replace aspect-ratio */}
          <div className="absolute inset-0">
            {/* Top flap — folds back on open */}
            <div
              className={`absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-gradient-to-b from-primary/35 to-primary/20 ${
                isOpening ? "animate-envelope-flap" : ""
              }`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                WebkitClipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />

            {/* Front face with wax seal */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/85 to-white/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/25 sm:h-14 sm:w-14">
                <Heart className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
            </div>

            {/* Subtle bottom shadow inside envelope */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* Tap to open cue */}
      {phase === "ready" && (
        <div className="absolute bottom-[15%] left-0 right-0 text-center">
          <span className="animate-pulse-soft inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" />
            Tap to open
          </span>
        </div>
      )}
    </button>
  );
}
