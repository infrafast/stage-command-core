export type MatchResult<T> =
  | {kind: "none"; matches: readonly []}
  | {kind: "unique"; value: T; matches: readonly [T]}
  | {kind: "ambiguous"; matches: readonly T[]};

export function exactText(a: string, b: string, locale = "fr-FR"): boolean {
  return a.localeCompare(b, locale, {sensitivity: "base", usage: "search"}) === 0;
}

export function containsText(haystack: string, needle: string): boolean {
  return needle.length > 0 && haystack.includes(needle);
}

export function classifyMatches<T>(matches: readonly T[]): MatchResult<T> {
  if (matches.length === 0) return {kind: "none", matches: []};
  if (matches.length === 1) return {kind: "unique", value: matches[0]!, matches: [matches[0]!]};
  return {kind: "ambiguous", matches};
}

export function uniqueBy<T>(
  values: readonly T[],
  predicate: (value: T) => boolean,
): MatchResult<T> {
  return classifyMatches(values.filter(predicate));
}
