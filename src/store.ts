import {randomBytes} from "node:crypto";
import type {CommandEffect} from "./protocol.js";

export type TokenFailure = "invalid_token" | "expired_token" | "stale_plan";

interface Entry<T> {
  value: T;
  expiresAt: number;
  oneShot: boolean;
}

export interface StoredToken {
  token: string;
  expiresInMs: number;
}

export type TakeResult<T> =
  | {ok: true; value: T}
  | {ok: false; error: TokenFailure};

export interface TokenStoreOptions {
  defaultTtlMs?: number;
  now?: () => number;
  tokenBytes?: number;
}

export class TokenStore<TPlan, TContinuation = unknown> {
  private readonly plans = new Map<string, Entry<TPlan>>();
  private readonly continuations = new Map<string, Entry<TContinuation>>();
  private readonly defaultTtlMs: number;
  private readonly now: () => number;
  private readonly tokenBytes: number;

  constructor(options: TokenStoreOptions = {}) {
    this.defaultTtlMs = options.defaultTtlMs ?? 30_000;
    this.now = options.now ?? Date.now;
    this.tokenBytes = options.tokenBytes ?? 24;
  }

  private newToken(prefix: "p" | "c"): string {
    return prefix + "_" + randomBytes(this.tokenBytes).toString("base64url");
  }

  private put<T>(
    map: Map<string, Entry<T>>,
    prefix: "p" | "c",
    value: T,
    ttlMs: number,
    oneShot: boolean,
  ): StoredToken {
    const token = this.newToken(prefix);
    map.set(token, {value, expiresAt: this.now() + ttlMs, oneShot});
    return {token, expiresInMs: ttlMs};
  }

  createPlan(
    value: TPlan,
    effect: CommandEffect,
    ttlMs = this.defaultTtlMs,
  ): StoredToken {
    return this.put(this.plans, "p", value, ttlMs, effect === "write");
  }

  createContinuation(
    value: TContinuation,
    ttlMs = this.defaultTtlMs,
  ): StoredToken {
    return this.put(this.continuations, "c", value, ttlMs, true);
  }

  takePlan(token: string, isStale?: (plan: TPlan) => boolean): TakeResult<TPlan> {
    return this.take(this.plans, token, isStale);
  }

  takeContinuation(token: string): TakeResult<TContinuation> {
    return this.take(this.continuations, token);
  }

  peekPlan(token: string): TakeResult<TPlan> {
    return this.peek(this.plans, token);
  }

  sweepExpired(): number {
    const before = this.plans.size + this.continuations.size;
    this.sweep(this.plans);
    this.sweep(this.continuations);
    return before - (this.plans.size + this.continuations.size);
  }

  private peek<T>(map: Map<string, Entry<T>>, token: string): TakeResult<T> {
    const entry = map.get(token);
    if (!entry) return {ok: false, error: "invalid_token"};
    if (entry.expiresAt <= this.now()) {
      map.delete(token);
      return {ok: false, error: "expired_token"};
    }
    return {ok: true, value: entry.value};
  }

  private take<T>(
    map: Map<string, Entry<T>>,
    token: string,
    isStale?: (value: T) => boolean,
  ): TakeResult<T> {
    const entry = map.get(token);
    if (!entry) return {ok: false, error: "invalid_token"};

    if (entry.expiresAt <= this.now()) {
      map.delete(token);
      return {ok: false, error: "expired_token"};
    }

    if (isStale?.(entry.value)) {
      map.delete(token);
      return {ok: false, error: "stale_plan"};
    }

    if (entry.oneShot) map.delete(token);
    return {ok: true, value: entry.value};
  }

  private sweep<T>(map: Map<string, Entry<T>>): void {
    const now = this.now();
    for (const [token, entry] of map) {
      if (entry.expiresAt <= now) map.delete(token);
    }
  }
}
