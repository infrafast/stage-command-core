import parseDuration from "parse-duration";

export interface DurationLocaleHooks {
  canonicalizeDuration?: (input: string) => string;
}

export interface ParseDurationOptions {
  maxInputLength?: number;
  localeHooks?: DurationLocaleHooks;
}

export function parseDurationMs(
  input: string,
  options: ParseDurationOptions = {},
): number | null {
  const maxInputLength = options.maxInputLength ?? 100;
  if (input.length === 0 || input.length > maxInputLength) return null;

  const canonical = options.localeHooks?.canonicalizeDuration
    ? options.localeHooks.canonicalizeDuration(input)
    : input;

  const value = parseDuration(canonical);
  return value == null || !Number.isFinite(value) ? null : value;
}
