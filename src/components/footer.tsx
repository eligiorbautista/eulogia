import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 text-center text-sm text-muted-foreground">
      <p className="inline-flex items-center gap-1.5">
        Made with <Heart className="h-4 w-4 fill-current text-primary" /> by Eli Bautista
      </p>
    </footer>
  );
}
