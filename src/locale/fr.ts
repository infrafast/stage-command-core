import {defineLocaleHooks} from "../locale.js";

const unitRules: readonly [RegExp, string][] = [
  [/\bmillisecondes?\b/giu, "ms"],
  [/\bsecondes?\b/giu, "s"],
  [/\bminutes?\b/giu, "m"],
  [/\bheures?\b/giu, "h"],
];

export const frLocaleHooks = defineLocaleHooks({
  locale: "fr-FR",
  numbers: {
    decimalSeparators: [",", "."],
    positiveWords: ["plus"],
    negativeWords: ["moins"],
  },
  durations: {
    canonicalizeDuration(input: string): string {
      return unitRules.reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        input,
      );
    },
  },
});

export default frLocaleHooks;
