import {describe, expect, it} from "vitest";
import {buildCommandText, rawTextForSpan} from "../src/text.js";

describe("buildCommandText", () => {
  it("preserves raw accents and source spans", () => {
    const text = buildCommandText("QLC Été Blue Speed", {locale: "fr-FR"});
    expect(text.rawText).toBe("QLC Été Blue Speed");
    expect(text.normalizedText).toContain("été");
    expect(text.normalizedText).not.toContain("ete");
    const ete = text.tokens.find((token) => token.raw === "Été");
    expect(ete).toBeDefined();
    expect(rawTextForSpan(text, ete!.source)).toBe("Été");
  });
});
