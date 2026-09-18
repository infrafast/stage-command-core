export interface SourceSpan {
  start: number;
  end: number;
}

export interface CommandToken {
  raw: string;
  normalized: string;
  source: SourceSpan;
  normalizedStart: number;
  normalizedEnd: number;
  wordLike: boolean;
}

export interface CommandText {
  rawText: string;
  normalizedText: string;
  tokens: readonly CommandToken[];
  locale: string;
}

export interface NormalizeOptions {
  locale?: string;
  caseFold?: boolean;
  unicodeForm?: "NFC" | "NFKC";
}

function normalizeSegment(value: string, locale: string, options: NormalizeOptions): string {
  const form = options.unicodeForm ?? "NFC";
  const unicodeNormalized = value.normalize(form);
  return options.caseFold === false
    ? unicodeNormalized
    : unicodeNormalized.toLocaleLowerCase(locale);
}

export function buildCommandText(
  rawText: string,
  options: NormalizeOptions = {},
): CommandText {
  const locale = options.locale ?? "fr-FR";
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  const tokens: CommandToken[] = [];
  let normalizedText = "";

  for (const part of segmenter.segment(rawText)) {
    if (/^\s+$/u.test(part.segment)) continue;
    const normalized = normalizeSegment(part.segment, locale, options);
    if (normalizedText.length > 0) normalizedText += " ";
    const normalizedStart = normalizedText.length;
    normalizedText += normalized;
    tokens.push({
      raw: part.segment,
      normalized,
      source: {start: part.index, end: part.index + part.segment.length},
      normalizedStart,
      normalizedEnd: normalizedText.length,
      wordLike: part.isWordLike ?? false,
    });
  }

  return {rawText, normalizedText, tokens, locale};
}

export function rawTextForSpan(text: CommandText, span: SourceSpan): string {
  return text.rawText.slice(span.start, span.end);
}
