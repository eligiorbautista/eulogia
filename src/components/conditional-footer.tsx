"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/invite") ||
    pathname?.startsWith("/celebration")
  ) {
    return null;
  }

  return <Footer />;
}
