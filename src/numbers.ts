export interface ParsedNumber {
  value: number;
  relative: boolean;
  explicitSign: -1 | 0 | 1;
}

export interface NumberLocaleHooks {
  decimalSeparators?: readonly string[];
  positiveWords?: readonly string[];
  negativeWords?: readonly string[];
  percentSuffixes?: readonly string[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

export function parseNumericLiteral(
  input: string,
  hooks: NumberLocaleHooks = {},
): ParsedNumber | null {
  const decimalSeparators = hooks.decimalSeparators ?? [",", "."];
  const positiveWords = hooks.positiveWords ?? [];
  const negativeWords = hooks.negativeWords ?? [];

  let text = input.trim().toLocaleLowerCase();
  let explicitSign: -1 | 0 | 1 = 0;

  for (const word of positiveWords) {
    const re = new RegExp("^" + escapeRegExp(word) + "\\s+", "u");
    if (re.test(text)) {
      explicitSign = 1;
      text = text.replace(re, "");
      break;
    }
  }

  for (const word of negativeWords) {
    const re = new RegExp("^" + escapeRegExp(word) + "\\s+", "u");
    if (re.test(text)) {
      explicitSign = -1;
      text = text.replace(re, "");
      break;
    }
  }

  if (text.startsWith("+")) {
    explicitSign = 1;
    text = text.slice(1).trim();
  } else if (text.startsWith("-") || text.startsWith("−")) {
    explicitSign = -1;
    text = text.slice(1).trim();
  }

  if (!/^[0-9]+(?:[.,][0-9]+)?$/u.test(text)) return null;

  let canonical = text;
  for (const separator of decimalSeparators) {
    if (separator !== ".") canonical = canonical.replace(separator, ".");
  }

  const magnitude = Number(canonical);
  if (!Number.isFinite(magnitude)) return null;
  const value = explicitSign === -1 ? -magnitude : magnitude;

  return {value, relative: explicitSign !== 0, explicitSign};
}

export interface ParsedPercentage extends ParsedNumber {
  unit: "percent";
}

export function parsePercentage(
  input: string,
  hooks: NumberLocaleHooks = {},
): ParsedPercentage | null {
  const suffixes = hooks.percentSuffixes ?? ["%"];
  const trimmed = input.trim();

  for (const suffix of suffixes) {
    const re = new RegExp("^(.*?)\\s*" + escapeRegExp(suffix) + "$", "iu");
    const match = trimmed.match(re);
    if (!match?.[1]) continue;
    const parsed = parseNumericLiteral(match[1], hooks);
    if (parsed) return {...parsed, unit: "percent"};
  }

  return null;
}
