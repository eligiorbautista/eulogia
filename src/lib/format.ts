const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Formats a stored date (typically `YYYY-MM-DD`) for display.
 *
 * Date-only strings are parsed into a *local* date so the day never shifts
 * backwards for viewers in negative-UTC timezones.
 */
export function formatDate(date?: string | null): string | null {
  if (!date) return null;

  const trimmed = date.trim();
  const match = DATE_ONLY.exec(trimmed);

  if (match) {
    const [, year, month, day] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-US", DATE_OPTIONS);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", DATE_OPTIONS);
}

const TIME_ONLY = /^(\d{1,2}):(\d{2})/;

/** Formats a stored 24-hour time (typically `HH:mm`) as a 12-hour time. */
export function formatTime(time?: string | null): string | null {
  if (!time) return null;

  const match = TIME_ONLY.exec(time.trim());
  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return time;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}
