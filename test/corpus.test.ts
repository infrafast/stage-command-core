import {describe, expect, it} from "vitest";
import {runCorpus} from "../src/corpus.js";

describe("corpus harness", () => {
  it("reports deterministic failures without domain assumptions", async () => {
    const result = await runCorpus(
      [
        {utterance: "A", expected: "a"},
        {utterance: "B", expected: "wrong"},
      ],
      (utterance) => utterance.toLowerCase(),
      (actual, expected) => actual === expected,
    );
    expect(result.total).toBe(2);
    expect(result.passed).toBe(1);
    expect(result.failures).toHaveLength(1);
  });
});
