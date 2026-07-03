"use client";

import confetti from "canvas-confetti";

interface LaunchConfettiOptions {
  origin?: { x?: number; y?: number };
  gender?: "boy" | "girl";
}

export function launchConfetti(options: LaunchConfettiOptions = {}) {
  if (typeof window === "undefined") return;

  const { origin = { x: 0.5, y: 0.6 }, gender = "boy" } = options;

  const boyColors = ["#0891B2", "#38BDF8", "#A7F3D0", "#FDE68A", "#FFFFFF"];
  const girlColors = ["#EC4899", "#F9A8D4", "#DDD6FE", "#FDE68A", "#FFFFFF"];
  const colors = gender === "boy" ? boyColors : girlColors;

  const defaults = {
    origin: { x: origin.x ?? 0.5, y: origin.y ?? 0.6 },
    colors,
    disableForReducedMotion: true,
    zIndex: 9999,
  };

  const burst = (count: number, scalar: number, spread: number) => {
    confetti({
      ...defaults,
      particleCount: count,
      scalar,
      spread,
      startVelocity: 45 + scalar * 20,
      decay: 0.92,
      gravity: 0.8,
    });
  };

  burst(40, 1.2, 70);
  setTimeout(() => burst(30, 0.9, 90), 100);
  setTimeout(() => burst(20, 0.7, 120), 200);
}
