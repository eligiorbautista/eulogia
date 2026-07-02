"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";

interface CopyInviteUrlProps {
  slug: string;
}

export function CopyInviteUrl({ slug }: CopyInviteUrlProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/invite/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy invite URL"
      title="Copy invite URL"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
    </Button>
  );
}
