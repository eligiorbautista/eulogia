import type { ReactNode, ComponentType } from "react";
import { ScrollReveal } from "./scroll-reveal";

interface InviteSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  icon?: ComponentType<{ className?: string }>;
  title?: string;
}

export function InviteSection({
  children,
  className = "",
  delay = 0,
  icon: Icon,
  title,
}: InviteSectionProps) {
  return (
    <ScrollReveal delay={delay} className={className}>
      <div className="rounded-3xl border border-primary/10 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        {(title || Icon) && (
          <div className="mb-5 flex items-center justify-center gap-2">
            {Icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            )}
            {title && (
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </ScrollReveal>
  );
}
