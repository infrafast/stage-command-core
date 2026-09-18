export const GATEWAY_PROTOCOL = "lsa-command-gateway/v1" as const;

export type GatewayProtocol = typeof GATEWAY_PROTOCOL;
export type CommandEffect = "none" | "read" | "write";
export type AnalyzeStatus = "unrecognized" | "ready" | "clarification";

export interface AnalyzeCommandRequest {
  protocol: GatewayProtocol;
  text: string;
  locale?: string;
  continuationToken?: string;
}

export interface AnalyzeUnrecognized {
  protocol: GatewayProtocol;
  recognized: false;
  status: "unrecognized";
  effect: "none";
  responseText?: string | null;
}

export interface AnalyzeReady {
  protocol: GatewayProtocol;
  recognized: true;
  status: "ready";
  effect: Exclude<CommandEffect, "none">;
  planToken: string;
  expiresInMs: number;
  responseText?: string | null;
}

export interface AnalyzeClarification {
  protocol: GatewayProtocol;
  recognized: true;
  status: "clarification";
  effect: "none";
  continuationToken: string;
  expiresInMs: number;
  responseText: string;
}

export type AnalyzeCommandResult =
  | AnalyzeUnrecognized
  | AnalyzeReady
  | AnalyzeClarification;

export interface ExecuteCommandRequest {
  protocol: GatewayProtocol;
  planToken: string;
}

export interface ExecuteCommandResult {
  protocol: GatewayProtocol;
  ok: boolean;
  responseText?: string | null;
  errorCode?: "invalid_token" | "expired_token" | "stale_plan" | "execution_failed";
}

export function isGatewayProtocol(value: unknown): value is GatewayProtocol {
  return value === GATEWAY_PROTOCOL;
}
