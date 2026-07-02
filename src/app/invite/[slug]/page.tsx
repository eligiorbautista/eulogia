import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, responses } from "@/db/schema";
import { RsvpForm } from "@/components/invite/rsvp-form";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Shirt, Cross } from "lucide-react";

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
  const gender = details?.gender ?? "boy";

  const whenText = [
    details?.baptismDate ? formatDate(details.baptismDate) : null,
    details?.baptismTime ? formatTime(details.baptismTime) : null,
  ].filter(Boolean).join(" at ");

  const eventItems = [
    whenText ? { icon: Calendar, label: "When?", text: whenText } : null,
    details?.venueName || details?.venueAddress
      ? {
          icon: MapPin,
          label: "Where?",
          text: details.venueName,
          subtext: details.venueAddress,
        }
      : null,
    details?.dressCode
      ? { icon: Shirt, label: "What to Wear?", text: details.dressCode }
      : null,
  ].filter(Boolean);

  return (
    <div data-gender={gender} className="relative min-h-full overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg">
        <Card className="animate-scale-in d-0 overflow-hidden border border-primary/10 shadow-xl">
          <div className="bg-gradient-to-b from-primary/10 to-transparent px-6 pb-8 pt-10 text-center sm:px-10 sm:pb-10 sm:pt-12">
            <div className="animate-fade-in-up d-1 mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Cross className="mr-2 h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Baptismal Invitation
              </span>
            </div>

            <div className="animate-pop-in d-2 mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-full border-4 border-primary/20 bg-white p-2 shadow-lg sm:h-52 sm:w-52">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                <Image
                  src="/baby.png"
                  alt={childName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h1 className="animate-fade-in-up d-3 text-balance font-heading text-2xl font-semibold leading-tight text-foreground sm:text-3xl md:text-4xl">
              {childName}
            </h1>
            <p className="animate-fade-in-up d-3 mt-2 text-lg text-muted-foreground">
              Holy Baptism
            </p>
          </div>

          <CardContent className="space-y-8 px-6 pb-10 text-center sm:px-10 sm:pb-12">
            <div className="animate-fade-in-up d-4 space-y-4">
              <p className="text-lg leading-relaxed text-foreground">
                Dear <span className="font-semibold">{guest.name}</span>,
              </p>
              {details?.message && (
                <p className="text-base leading-relaxed text-muted-foreground">
                  {details.message.replace(/\{godparent\}/g, guest.role.charAt(0).toUpperCase() + guest.role.slice(1))}
                </p>
              )}
            </div>

            {eventItems.length > 0 && (
              <div className="animate-fade-in d-5 rounded-2xl bg-secondary/40 p-5 text-left">
                <div className="mb-4 text-center">
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Event Details
                  </span>
                </div>
                <ul className="space-y-4">
                  {eventItems.map((item, index) => {
                    if (!item) return null;
                    const Icon = item.icon;
                    return (
                      <li key={index} className="animate-slide-in-left space-y-2" style={{ animationDelay: `${500 + index * 80}ms` }}>
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-primary/20" />
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {item.label}
                          </span>
                          <div className="h-px flex-1 bg-primary/20" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {item.text}
                            </p>
                            {item.subtext && (
                              <p className="text-sm text-muted-foreground">
                                {item.subtext}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="animate-fade-in-up d-6 border-t border-primary/10 pt-8">
              {!existing && (
                <>
                  <h2 className="mb-1 font-heading text-xl font-semibold">
                    Kindly Respond
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Please let us know if you can join us.
                  </p>
                </>
              )}
              <RsvpForm guest={guest} existing={existing} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
