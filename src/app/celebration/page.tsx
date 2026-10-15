import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/db";
import { StorybookPage } from "@/components/invite/storybook-page";
import { FloatingShapes } from "@/components/invite/floating-shapes";
import { SparkleDecoration } from "@/components/invite/sparkle-decoration";
import { Footer } from "@/components/footer";
import { formatDate, formatTime } from "@/lib/format";
import {
  RattleIcon,
  BootiesIcon,
  BottleIcon,
  CloudIcon,
  BabyFeetIcon,
} from "@/components/invite/baby-icons";
import { Calendar, MapPin, Shirt, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Baptism Celebration | Eulogia",
  description: "You are warmly invited to celebrate with us.",
};

// Renders on demand so it always reflects the latest event details.
export const dynamic = "force-dynamic";

export default async function CelebrationPage() {
  const details = await db.query.eventDetails.findFirst();

  const childName = details?.childName ?? "our baby";
  const gender = (details?.gender ?? "boy") as "boy" | "girl";

  const whenText = [
    details?.baptismDate ? formatDate(details.baptismDate) : null,
    details?.baptismTime ? formatTime(details.baptismTime) : null,
  ]
    .filter(Boolean)
    .join(" at ");

  const items = [
    whenText
      ? { icon: Calendar, label: "When", text: whenText, subtext: undefined }
      : null,
    details?.receptionVenueName || details?.receptionVenueAddress
      ? {
          icon: MapPin,
          label: "Celebration",
          text: details.receptionVenueName,
          subtext: details.receptionVenueAddress,
        }
      : null,
    details?.venueName || details?.venueAddress
      ? {
          icon: MapPin,
          label: "Ceremony",
          text: details.venueName,
          subtext: details.venueAddress,
        }
      : null,
    details?.dressCode
      ? { icon: Shirt, label: "What to Wear", text: details.dressCode, subtext: undefined }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div
      data-gender={gender}
      className="relative min-h-full overflow-hidden bg-gradient-to-b from-background via-soft/60 to-background px-4 py-8 sm:py-12"
    >
      <FloatingShapes gender={gender} />

      <div className="relative mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl">
        {/* Poster cover */}
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
                  src="/images/leo_new.JPG"
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
              Join us for the celebration
            </p>

            {/* Divider */}
            <div className="mx-auto my-6 flex items-center justify-center gap-3 text-primary/30">
              <span className="h-px w-12 bg-primary/20 sm:w-16" />
              <Heart className="h-4 w-4" />
              <span className="h-px w-12 bg-primary/20 sm:w-16" />
            </div>

            <p className="text-xl font-medium text-foreground sm:text-2xl">
              Dear friends and family,
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              With grateful hearts, we invite you to share in our joy and join us
              for the celebration of {childName}&apos;s baptism.
            </p>

            {/* Baby icons */}
            <div className="mt-6 flex items-center justify-center gap-3 text-primary/40">
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
          </div>
        </StorybookPage>

        {/* The Day */}
        {items.length > 0 && (
          <StorybookPage
            label="The Day"
            icon={RattleIcon}
            delay={150}
            className="mb-6 sm:mb-8"
          >
            <div className="space-y-4 text-left">
              {items.map((item, index) => {
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
          </StorybookPage>
        )}

        {/* Closing */}
        <StorybookPage delay={300} className="text-center">
          <p className="text-sm text-muted-foreground/80 sm:text-base">
            We can&apos;t wait to celebrate with you.
            <br />
            <span className="font-heading font-medium text-foreground">
              With love, The Family
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
