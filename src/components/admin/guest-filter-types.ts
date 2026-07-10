export type FilterValue =
  | "all"
  | "godfather"
  | "godmother"
  | "attending"
  | "not-attending"
  | "no-response";

export const FILTER_VALUES: FilterValue[] = [
  "all",
  "godfather",
  "godmother",
  "attending",
  "not-attending",
  "no-response",
];

export function parseFilter(value: string | null): FilterValue {
  return value && FILTER_VALUES.includes(value as FilterValue)
    ? (value as FilterValue)
    : "all";
}
