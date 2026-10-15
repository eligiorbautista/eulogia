"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";

interface CopyInviteUrlProps {
  /** Guest slug; used to build the per-guest invite link when `path` is omitted. */
  slug?: string;
  /** Explicit path to copy (e.g. `/celebration`). Takes precedence over `slug`. */
  path?: string;
  /** Optional visible label; when set the button renders as a labeled "sm" button. */
  label?: string;
}

export function CopyInviteUrl({ slug, path, label }: CopyInviteUrlProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const target = path ?? `/invite/${slug}`;
    const url = `${window.location.origin}${target}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ariaLabel = label ?? "Copy invite URL";

  return (
    <Button
      type="button"
      variant="outline"
      size={label ? "sm" : "icon"}
      onClick={handleCopy}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
      {label ? (
        <span className="ml-2">{copied ? "Copied!" : label}</span>
      ) : null}
    </Button>
  );
}
