import type { ComponentType } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, responses } from "@/db/schema";
import { RsvpForm } from "@/components/invite/rsvp-form";
import { FloatingShapes } from "@/components/invite/floating-shapes";
import { InviteShell } from "./invite-shell";
import { StorybookPage } from "@/components/invite/storybook-page";
import { Footer } from "@/components/footer";
import { SparkleDecoration } from "@/components/invite/sparkle-decoration";
import { formatDate, formatTime } from "@/lib/format";
import {
  RattleIcon,
  BootiesIcon,
  BottleIcon,
  CloudIcon,
  BabyFeetIcon,
} from "@/components/invite/baby-icons";
import { Calendar, MapPin, Shirt, Heart, CheckCircle2 } from "lucide-react";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

interface EventItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  text?: string | null;
  subtext?: string | null;
}

interface EventSection {
  key: string;
  title?: string;
  items: EventItem[];
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;

  const guest = await db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  });

  if (!guest) {
    notFound();
  }

  const details = await db.query.eventDetails.findFirst();
  const existing = await db.query.responses.findFirst({
    where: eq(responses.guestId, guest.id),
  });

  const childName = details?.childName ?? "our baby";
  const gender = (details?.gender ?? "boy") as "boy" | "girl";

  const whenText = [
    details?.baptismDate ? formatDate(details.baptismDate) : null,
    details?.baptismTime ? formatTime(details.baptismTime) : null,
  ]
    .filter(Boolean)
    .join(" at ");

  const ceremonyItems: EventItem[] = [];
  if (whenText) {
    ceremonyItems.push({ icon: Calendar, label: "When", text: whenText });
  }
  if (details?.venueName || details?.venueAddress) {
    ceremonyItems.push({
      icon: MapPin,
      label: "Where",
      text: details.venueName,
      subtext: details.venueAddress,
    });
  }

  const celebrationItems: EventItem[] = [];
  if (details?.receptionVenueName || details?.receptionVenueAddress) {
    celebrationItems.push({
      icon: MapPin,
      label: "Where",
      text: details.receptionVenueName,
      subtext: details.receptionVenueAddress,
    });
  }

  const dressItems: EventItem[] = details?.dressCode
    ? [{ icon: Shirt, label: "What to Wear", text: details.dressCode }]
    : [];

  const sections: EventSection[] = [
    {
      key: "ceremony",
      title: celebrationItems.length > 0 ? "Ceremony" : undefined,
      items: ceremonyItems,
    },
    { key: "celebration", title: "Celebration", items: celebrationItems },
    { key: "dress", items: dressItems },
  ].filter((section) => section.items.length > 0);

  const roleLabel = guest.role === "godfather" ? "Godfather" : "Godmother";

  return (
    <div
      data-gender={gender}
      className="relative min-h-full overflow-hidden bg-gradient-to-b from-background via-soft/60 to-background px-4 py-8 sm:py-12"
    >
      <InviteShell childName={childName} />
      <FloatingShapes gender={gender} />

      <div className="relative mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl">
        {/* Page 1 — Cover with Invitation & Blessings */}
        <StorybookPage className="mb-6 sm:mb-8">
          <div className="text-center">
            <div className="relative mx-auto mb-6 h-44 w-44 sm:h-56 sm:w-56">
              {/* Soft outer glow */}
              <div className="absolute -inset-3 rounded-full bg-primary/20 blur-2xl" aria-hidden="true" />
              {/* Decorative ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 via-accent/40 to-primary/30" aria-hidden="true" />
              {/* Photo frame */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                <SparkleDecoration />
                <Image
                  src="/images/leo.png"
                  alt={childName}
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h1 className="text-balance font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
              {childName}
            </h1>
            <p className="mt-2 text-lg font-medium text-muted-foreground sm:text-xl">
              Holy Baptism
            </p>

            {/* Divider */}
            <div className="mx-auto my-6 flex items-center justify-center gap-3 text-primary/30">
              <span className="h-px w-12 bg-primary/20 sm:w-16" />
              <Heart className="h-4 w-4" />
              <span className="h-px w-12 bg-primary/20 sm:w-16" />
            </div>

            {/* The Invitation — greeting & message */}
            <p className="text-xl font-medium text-foreground sm:text-2xl">
              Dear{" "}
              <span className="font-heading font-semibold text-primary">
                {guest.name}
              </span>
              ,
            </p>
            {details?.message ? (
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {details.message.replace(/\{godparent\}/g, roleLabel)}
              </p>
            ) : (
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                We would be honored if you would stand with us as{" "}
                <span className="font-semibold text-foreground">{roleLabel}</span>{" "}
                for our child on this blessed day.
              </p>
            )}

            {/* Blessings — baby icons + blessing line */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-3 text-primary/40">
                <span className="animate-bob" style={{ animationDelay: "0s" }}>
                  <BootiesIcon className="h-5 w-5" />
                </span>
                <span className="animate-bob" style={{ animationDelay: "0.15s" }}>
                  <BottleIcon className="h-5 w-5" />
                </span>
                <span className="animate-bob" style={{ animationDelay: "0.3s" }}>
                  <BabyFeetIcon className="h-5 w-5" />
                </span>
                <span className="animate-float" style={{ animationDelay: "0.45s" }}>
                  <CloudIcon className="h-5 w-5" />
                </span>
              </div>
              <p className="mx-auto max-w-md text-base italic leading-relaxed text-muted-foreground sm:text-lg">
                May your love and guidance bless our child always.
              </p>
            </div>
          </div>
        </StorybookPage>

        {/* Page 2 — The Day */}
        {sections.length > 0 && (
          <StorybookPage
            label="The Day"
            icon={RattleIcon}
            delay={2600}
            className="mb-6 sm:mb-8"
          >
            <div className="space-y-6 text-left">
              {sections.map((section) => (
                <div key={section.key} className="space-y-4">
                  {section.title && (
                    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      <span className="h-px w-6 bg-primary/30" />
                      {section.title}
                    </p>
                  )}
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={`${section.key}-${index}`}
                        className="group flex items-start gap-4 rounded-2xl bg-secondary/50 p-4 transition-all duration-200 hover:bg-secondary hover:shadow-sm"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.label}
                          </p>
                          {item.text && (
                            <p className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
                              {item.text}
                            </p>
                          )}
                          {item.subtext && (
                            <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">
                              {item.subtext}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </StorybookPage>
        )}

        {/* Page 3 — Your Response */}
        <StorybookPage
          label="Your Response"
          icon={CheckCircle2}
          delay={2800}
          className="mb-6 sm:mb-8"
        >
          <div className="rounded-3xl border border-primary/10 bg-gradient-to-b from-primary/5 to-transparent p-5 sm:p-8">
            {!existing && (
              <div className="mb-6 text-center">
                <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                  Kindly Respond
                </h2>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Please let us know if you can join us on this special day.
                </p>
              </div>
            )}
            <RsvpForm guest={guest} existing={existing} gender={gender} />
          </div>
        </StorybookPage>

        {/* Closing */}
        <StorybookPage delay={3000} className="text-center">
          <p className="text-sm text-muted-foreground/80 sm:text-base">
            With love and gratitude,
            <br />
            <span className="font-heading font-medium text-foreground">
              The Family
            </span>
          </p>
        </StorybookPage>
      </div>

      <div className="mt-8 sm:mt-12">
        <Footer />
      </div>
    </div>
  );
}
