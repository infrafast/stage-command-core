import {describe, expect, it, vi} from "vitest";
import {isLocalGatewayEnabled, registerLocalGatewayTools} from "../src/mcp.js";

describe("Local-only gateway registration", () => {
  it("is disabled by default", () => {
    expect(isLocalGatewayEnabled({})).toBe(false);
  });

  it("registers only when explicitly enabled", () => {
    const register = vi.fn();
    const enabled = registerLocalGatewayTools(
      {register},
      ["analyze", "execute"],
      {LSA_LOCAL_COMMAND_GATEWAY: "1"},
    );
    expect(enabled).toBe(true);
    expect(register).toHaveBeenCalledTimes(2);
  });
});
