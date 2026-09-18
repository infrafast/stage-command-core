import {describe, expect, it} from "vitest";
import fr from "../src/locale/fr.js";
import {parseDurationMs} from "../src/duration.js";
import {parseNumericLiteral, parsePercentage} from "../src/numbers.js";

describe("numeric helpers", () => {
  it("parses French decimal comma and relative signs", () => {
    expect(parseNumericLiteral("+3,5", fr.numbers)).toEqual({
      value: 3.5, relative: true, explicitSign: 1,
    });
    expect(parseNumericLiteral("moins 2", fr.numbers)).toEqual({
      value: -2, relative: true, explicitSign: -1,
    });
  });

  it("parses percentages", () => {
    expect(parsePercentage("-10 %", fr.numbers)?.value).toBe(-10);
    expect(parsePercentage("25 pour cent", fr.numbers)?.value).toBe(25);
  });
});

describe("duration helper", () => {
  it("reuses parse-duration after locale canonicalization", () => {
    expect(parseDurationMs("2 secondes", {localeHooks: fr.durations})).toBe(2000);
    expect(parseDurationMs("1 minute 30 secondes", {localeHooks: fr.durations})).toBe(90000);
  });

  it("rejects oversized input", () => {
    expect(parseDurationMs("x".repeat(101))).toBeNull();
  });
});
