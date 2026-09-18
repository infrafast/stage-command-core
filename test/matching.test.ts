import {describe, expect, it} from "vitest";
import {exactText} from "../src/matching.js";

describe("exactText", () => {
  it("is case-insensitive but accent-sensitive", () => {
    expect(exactText("Blue Speed", "blue speed", "fr-FR")).toBe(true);
    expect(exactText("Été", "Ete", "fr-FR")).toBe(false);
  });

  it("does not rewrite separators", () => {
    expect(exactText("blue speed", "blue_speed", "fr-FR")).toBe(false);
    expect(exactText("blue speed", "blue-speed", "fr-FR")).toBe(false);
  });
});
