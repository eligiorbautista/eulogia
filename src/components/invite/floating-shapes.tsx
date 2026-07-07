"use client";

import { useEffect, useState } from "react";
import { StarIcon, CloudIcon } from "./baby-icons";

interface FloatingShapesProps {
  gender: "boy" | "girl";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);

    function handleChange(event: MediaQueryListEvent) {
      setReduced(event.matches);
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

export function FloatingShapes({ gender }: FloatingShapesProps) {
  const reducedMotion = useReducedMotion();

  const primaryClass = gender === "boy" ? "bg-primary/15" : "bg-primary/15";
  const accentClass = gender === "boy" ? "bg-accent/30" : "bg-accent/30";
  const highlightClass = gender === "boy" ? "bg-highlight/25" : "bg-highlight/25";

  const float = reducedMotion ? "" : "animate-float";
  const floatSlow = reducedMotion ? "" : "animate-float-slow";
  const bob = reducedMotion ? "" : "animate-bob";
  const twinkle = reducedMotion ? "" : "animate-twinkle";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Large soft blob top */}
      <div
        className={`absolute -left-20 -top-20 h-72 w-72 rounded-full ${primaryClass} blur-3xl ${float}`}
      />
      <div
        className={`absolute right-0 top-0 h-64 w-64 rounded-full ${highlightClass} blur-3xl ${floatSlow}`}
        style={{ animationDelay: "1s" }}
      />

      {/* Extra top-right blob */}
      <div
        className={`absolute -right-16 top-1/3 h-48 w-48 rounded-full ${highlightClass} blur-3xl ${floatSlow}`}
        style={{ animationDelay: "2s" }}
      />

      {/* Bottom blobs */}
      <div
        className={`absolute -bottom-20 left-1/4 h-64 w-64 rounded-full ${accentClass} blur-3xl ${float}`}
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className={`absolute -bottom-10 right-1/4 h-56 w-56 rounded-full ${primaryClass} blur-3xl ${bob}`}
      />

      {/* Extra bottom-left blob */}
      <div
        className={`absolute -left-12 bottom-1/4 h-52 w-52 rounded-full ${accentClass} blur-3xl ${bob}`}
        style={{ animationDelay: "1.5s" }}
      />

      {/* Small floating icons */}
      <div
        className={`absolute left-[10%] top-[20%] text-primary/30 ${bob}`}
        style={{ animationDelay: "0.3s" }}
      >
        <StarIcon className="h-6 w-6" />
      </div>
      <div
        className={`absolute right-[12%] top-[30%] text-accent/40 ${twinkle}`}
        style={{ animationDelay: "0.8s" }}
      >
        <StarIcon className="h-4 w-4" />
      </div>
      <div
        className={`absolute left-[8%] top-[60%] text-highlight/40 ${floatSlow}`}
        style={{ animationDelay: "1.2s" }}
      >
        <CloudIcon className="h-10 w-10" />
      </div>
      <div
        className={`absolute right-[8%] top-[65%] text-primary/25 ${bob}`}
        style={{ animationDelay: "1.8s" }}
      >
        <CloudIcon className="h-8 w-8" />
      </div>
      <div
        className={`absolute left-[15%] bottom-[15%] text-accent/35 ${twinkle}`}
        style={{ animationDelay: "0.5s" }}
      >
        <StarIcon className="h-5 w-5" />
      </div>
      <div
        className={`absolute right-[18%] bottom-[20%] text-primary/30 ${float}`}
        style={{ animationDelay: "2.1s" }}
      >
        <StarIcon className="h-6 w-6" />
      </div>
    </div>
  );
}
