import { StarIcon } from "./baby-icons";

interface SparkleDecorationProps {
  className?: string;
}

export function SparkleDecoration({ className = "" }: SparkleDecorationProps) {
  const positions = [
    { top: "5%", left: "8%", size: "h-4 w-4", delay: "0s" },
    { top: "15%", right: "5%", size: "h-3 w-3", delay: "0.5s" },
    { bottom: "20%", left: "5%", size: "h-5 w-5", delay: "1s" },
    { bottom: "10%", right: "10%", size: "h-3 w-3", delay: "1.5s" },
  ];

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {positions.map((pos, index) => (
        <span
          key={index}
          className={`absolute text-primary/50 animate-sparkle ${pos.size}`}
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            animationDelay: pos.delay,
          }}
        >
          <StarIcon className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
