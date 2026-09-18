export const LOCAL_GATEWAY_ENV = "LSA_LOCAL_COMMAND_GATEWAY" as const;

export const LOCAL_GATEWAY_TOOL_NAMES = {
  analyze: "lsa_local_analyze_command",
  execute: "lsa_local_execute_command",
} as const;

export function isLocalGatewayEnabled(
  env: Readonly<Record<string, string | undefined>> = process.env,
): boolean {
  const value = env[LOCAL_GATEWAY_ENV]?.trim().toLocaleLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export interface GatewayToolRegistrar<TTool> {
  register(tool: TTool): void;
}

export function registerLocalGatewayTools<TTool>(
  registrar: GatewayToolRegistrar<TTool>,
  tools: readonly TTool[],
  env: Readonly<Record<string, string | undefined>> = process.env,
): boolean {
  if (!isLocalGatewayEnabled(env)) return false;
  for (const tool of tools) registrar.register(tool);
  return true;
}
