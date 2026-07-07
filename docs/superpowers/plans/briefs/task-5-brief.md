# Task 5: Refactor the invite page into storybook sections

**Files:**
- Modify: `src/app/invite/[slug]/page.tsx`
- Modify: `src/components/invite/invite-section.tsx` (remove if fully replaced by StorybookPage)

**Interfaces:**
- Consumes: `EnvelopeOpening` from Task 2, `StorybookPage` from Task 3, `SparkleDecoration` from Task 4, existing `FloatingShapes`, `RsvpForm`, baby icons, lucide icons
- Produces: redesigned `InvitePage` with envelope overlay and storybook page sections

## Steps

1. **Add new imports and remove old wrapper**

In `src/app/invite/[slug]/page.tsx`, add:

```tsx
import { EnvelopeOpening } from "@/components/invite/envelope-opening";
import { StorybookPage } from "@/components/invite/storybook-page";
import { SparkleDecoration } from "@/components/invite/sparkle-decoration";
```

Remove the `InviteSection` import and the `import { Card, CardContent } from "@/components/ui/card";` line.

2. **Update return structure to use envelope and storybook pages**

Replace the existing `return (...)` block with the following structure. Keep all existing data formatting logic above the return.

```tsx
return (
  <div
    data-gender={gender}
    className="relative min-h-full overflow-hidden bg-gradient-to-b from-background via-soft/60 to-background px-4 py-8 sm:py-12"
  >
    <EnvelopeOpening gender={gender} />
    <FloatingShapes gender={gender} />

    <div className="relative mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl">
      {/* Page 1 — Cover */}
      <StorybookPage
        delay={2400}
        className="mb-6 sm:mb-8"
      >
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Cross className="mr-2 h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Baptismal Invitation
            </span>
          </div>

          <div className="relative mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-[2.5rem] border-4 border-white bg-white p-2 shadow-xl sm:h-56 sm:w-56">
            <SparkleDecoration />
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

          <h1 className="text-balance font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
            {childName}
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground sm:text-xl">
            Holy Baptism
          </p>
        </div>
      </StorybookPage>

      {/* Page 2 — The Invitation */}
      <StorybookPage
        label="The Invitation"
        icon={Heart}
        delay={2600}
        className="mb-6 sm:mb-8"
      >
        <div className="space-y-4 text-center">
          <p className="text-xl font-medium text-foreground sm:text-2xl">
            Dear{" "}
            <span className="font-heading font-semibold text-primary">
              {guest.name}
            </span>
            ,
          </p>
          {details?.message ? (
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {details.message.replace(/\{godparent\}/g, roleLabel)}
            </p>
          ) : (
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We would be honored if you would stand with us as{" "}
              <span className="font-semibold text-foreground">{roleLabel}</span>{" "}
              for our child on this blessed day.
            </p>
          )}
        </div>
      </StorybookPage>

      {/* Page 3 — The Day */}
      {eventItems.length > 0 && (
        <StorybookPage
          label="The Day"
          icon={RattleIcon}
          delay={2800}
          className="mb-6 sm:mb-8"
        >
          <div className="space-y-4 text-left">
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
        </StorybookPage>
      )}

      {/* Page 4 — Blessings */}
      <StorybookPage
        label="Blessings"
        icon={StarIcon}
        delay={3000}
        className="mb-6 sm:mb-8"
      >
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-4 rounded-2xl bg-secondary/30 py-4 text-primary/60">
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
          <p className="mx-auto max-w-md text-base italic leading-relaxed text-muted-foreground sm:text-lg">
            May your love and guidance bless our child always.
          </p>
        </div>
      </StorybookPage>

      {/* Page 5 — Your Response */}
      <StorybookPage
        label="Your Response"
        icon={CheckCircle2}
        delay={3200}
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
          <RsvpForm guest={guest} existing={existing} />
        </div>
      </StorybookPage>

      {/* Closing */}
      <StorybookPage delay={3400} className="text-center">
        <p className="text-sm text-muted-foreground/80 sm:text-base">
          With love and gratitude,
          <br />
          <span className="font-heading font-medium text-foreground">
            The Family
          </span>
        </p>
      </StorybookPage>
    </div>
  </div>
);
```

3. **Add missing imports if needed**

Ensure `Cross`, `Heart`, `CheckCircle2`, and the baby icons are imported. The existing page already imports most of these; only `EnvelopeOpening`, `StorybookPage`, and `SparkleDecoration` are new.

4. **Remove unused InviteSection component (optional)**

If `InviteSection` is no longer used anywhere, delete `src/components/invite/invite-section.tsx`. Otherwise leave it in place.

Run: `grep -r "InviteSection" src/`
If no usages remain, run: `git rm src/components/invite/invite-section.tsx`

5. **Verify TypeScript and build**

Run: `npx tsc --noEmit && npm run build`
Expected: Build succeeds.

6. **Commit**

```bash
git add src/app/invite/\[slug\]/page.tsx
git commit -m "feat: refactor invite page into storybook sections with envelope opening"
```

## Acceptance Criteria

- Invitation page uses `EnvelopeOpening` overlay.
- Content is split into 5+ `StorybookPage` sections with chapter labels and corner icons.
- Baby photo has `SparkleDecoration`.
- RSVP form is preserved and functional.
- Existing `InviteSection` is removed if unused.
- TypeScript check and production build pass.
- No emojis, no new dependencies beyond existing stack.
- Page is responsive across small, standard, and large mobile screens.
