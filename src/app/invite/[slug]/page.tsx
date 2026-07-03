import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, responses } from "@/db/schema";
import { RsvpForm } from "@/components/invite/rsvp-form";
import { FloatingShapes } from "@/components/invite/floating-shapes";
import { ScrollReveal } from "@/components/invite/scroll-reveal";
import { InviteSection } from "@/components/invite/invite-section";
import {
  RattleIcon,
  BootiesIcon,
  BottleIcon,
  MoonIcon,
  CloudIcon,
  StarIcon,
  BabyFeetIcon,
} from "@/components/invite/baby-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Shirt, Cross, Heart } from "lucide-react";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date?: string | null) {
  if (!date) return null;
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

function formatTime(time?: string | null) {
  if (!time) return null;
  try {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  } catch {
    return time;
  }
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

  const eventItems = [
    whenText
      ? { icon: Calendar, label: "When", text: whenText }
      : null,
    details?.venueName || details?.venueAddress
      ? {
          icon: MapPin,
          label: "Where",
          text: details.venueName,
          subtext: details.venueAddress,
        }
      : null,
    details?.dressCode
      ? { icon: Shirt, label: "What to Wear", text: details.dressCode }
      : null,
  ].filter(Boolean);

  const roleLabel =
    guest.role === "godfather" ? "Godfather" : "Godmother";

  return (
    <div
      data-gender={gender}
      className="relative min-h-full overflow-hidden bg-gradient-to-b from-background via-soft/60 to-background px-4 py-10 sm:py-16"
    >
      <FloatingShapes gender={gender} />

      <div className="relative mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl">
        <Card className="animate-scale-in-bounce overflow-hidden border border-primary/10 bg-card/90 shadow-2xl backdrop-blur-sm">
          {/* Hero */}
          <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-transparent px-6 pb-10 pt-10 text-center sm:px-10 sm:pb-12 sm:pt-14">
            {/* Decorative top elements */}
            <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center gap-3 opacity-60">
              <StarIcon className="h-4 w-4 text-primary/50 animate-twinkle" />
              <MoonIcon className="h-5 w-5 text-primary/40 animate-bob" />
              <span className="animate-twinkle" style={{ animationDelay: "0.5s" }}>
                <StarIcon className="h-3 w-3 text-accent" />
              </span>
            </div>

            <ScrollReveal delay={100}>
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-primary">
                <Cross className="mr-2 h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Baptismal Invitation
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-[2.5rem] border-4 border-primary/20 bg-white p-2 shadow-xl sm:h-56 sm:w-56">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
                  <Image
                    src="/baby.png"
                    alt={childName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <h1 className="text-balance font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
                {childName}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="mt-2 text-lg font-medium text-muted-foreground sm:text-xl">
                Holy Baptism
              </p>
            </ScrollReveal>
          </div>

          <CardContent className="space-y-8 px-5 pb-10 text-center sm:px-8 sm:pb-12 lg:px-12">
            {/* Greeting */}
            <InviteSection delay={500} icon={Heart} title="A loving invitation">
              <div className="space-y-4">
                <p className="text-xl font-medium text-foreground sm:text-2xl">
                  Dear{" "}
                  <span className="font-heading font-semibold text-primary">
                    {guest.name}
                  </span>
                  ,
                </p>
                {details?.message ? (
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {details.message.replace(
                      /\{godparent\}/g,
                      roleLabel
                    )}
                  </p>
                ) : (
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    We would be honored if you would stand with us as{" "}
                    <span className="font-semibold text-foreground">
                      {roleLabel}
                    </span>{" "}
                    for our child on this blessed day.
                  </p>
                )}
              </div>
            </InviteSection>

            {/* Event Details */}
            {eventItems.length > 0 && (
              <InviteSection
                delay={600}
                icon={RattleIcon}
                title="Event Details"
              >
                <div className="space-y-5 text-left">
                  {eventItems.map((item, index) => {
                    if (!item) return null;
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="group flex items-start gap-4 rounded-2xl bg-secondary/50 p-4 transition-all duration-200 hover:bg-secondary hover:shadow-sm"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
                            {item.text}
                          </p>
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
              </InviteSection>
            )}

            {/* Baby icon row decoration */}
            <ScrollReveal delay={700}>
              <div className="flex items-center justify-center gap-4 rounded-2xl bg-secondary/30 py-4 text-primary/60">
                <span className="animate-bob" style={{ animationDelay: "0s" }}>
                  <BootiesIcon className="h-6 w-6" />
                </span>
                <span className="animate-bob" style={{ animationDelay: "0.2s" }}>
                  <BottleIcon className="h-6 w-6" />
                </span>
                <span className="animate-bob" style={{ animationDelay: "0.4s" }}>
                  <BabyFeetIcon className="h-6 w-6" />
                </span>
                <span className="animate-float" style={{ animationDelay: "0.6s" }}>
                  <CloudIcon className="h-6 w-6" />
                </span>
              </div>
            </ScrollReveal>

            {/* RSVP Section */}
            <ScrollReveal delay={800}>
              <div className="rounded-3xl border border-primary/10 bg-gradient-to-b from-primary/5 to-transparent p-6 sm:p-8">
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
                <RsvpForm guest={guest} existing={existing} />
              </div>
            </ScrollReveal>
          </CardContent>
        </Card>

        {/* Footer note */}
        <ScrollReveal delay={900}>
          <p className="mt-8 text-center text-sm text-muted-foreground/80 sm:text-base">
            With love and gratitude,
            <br />
            <span className="font-heading font-medium text-foreground">
              The Family
            </span>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
