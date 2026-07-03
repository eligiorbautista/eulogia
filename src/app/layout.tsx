import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";
import { db } from "@/db";
import { eventDetails } from "@/db/schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Eulogia | Baptism Invitation",
  description: "You are lovingly invited to our child's baptism.",
};

async function getGender(): Promise<string> {
  try {
    const rows = await db
      .select({ gender: eventDetails.gender })
      .from(eventDetails)
      .limit(1);
    return rows[0]?.gender ?? "boy";
  } catch {
    return "boy";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gender = await getGender();

  return (
    <html
      lang="en"
      data-gender={gender}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
