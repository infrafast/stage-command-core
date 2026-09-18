import {describe, expect, it} from "vitest";
import {TokenStore} from "../src/store.js";

describe("TokenStore", () => {
  it("makes write plans one-shot", () => {
    const store = new TokenStore<{command: string}>();
    const {token} = store.createPlan({command: "write"}, "write");
    expect(store.takePlan(token).ok).toBe(true);
    expect(store.takePlan(token)).toEqual({ok: false, error: "invalid_token"});
  });

  it("allows read plan reuse until expiry", () => {
    let now = 1000;
    const store = new TokenStore<{command: string}>({now: () => now});
    const {token} = store.createPlan({command: "read"}, "read", 50);
    expect(store.takePlan(token).ok).toBe(true);
    expect(store.takePlan(token).ok).toBe(true);
    now = 1050;
    expect(store.takePlan(token)).toEqual({ok: false, error: "expired_token"});
  });

  it("rejects stale plans", () => {
    const store = new TokenStore<{generation: number}>();
    const {token} = store.createPlan({generation: 1}, "write");
    expect(store.takePlan(token, (plan) => plan.generation !== 2))
      .toEqual({ok: false, error: "stale_plan"});
  });

  it("makes continuations one-shot", () => {
    const store = new TokenStore<unknown, {candidates: string[]}>();
    const {token} = store.createContinuation({candidates: ["a", "b"]});
    expect(store.takeContinuation(token).ok).toBe(true);
    expect(store.takeContinuation(token)).toEqual({ok: false, error: "invalid_token"});
  });
});
