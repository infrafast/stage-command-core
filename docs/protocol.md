# lsa-command-gateway/v1

## Purpose

`lsa-command-gateway/v1` is the deterministic Local command contract between LiveStageAssistant and MCP servers. The gateway is Local-only and opt-in. Existing cloud MCP tools and prompts remain unchanged.

## Analyze

Logical tool name: `lsa_local_analyze_command`.

Analysis MUST be side-effect free. It may consult live state, inventory, resolvers, and caches.

A ready result provides a short-lived `planToken` and classifies the effect as `read` or `write`. A clarification provides a short-lived `continuationToken`; the user's reply is sent back to the same MCP and LSA does not interpret its domain meaning.

## Execute

Logical tool name: `lsa_local_execute_command`.

Write plans are short-lived and one-shot. MCPs should bind plans to the live identity/generation necessary to reject stale execution.

## Safety invariants

1. Analyze never writes.
2. A Local write is executed only through an analyzed plan token.
3. Write tokens are opaque, random, short-lived, and one-shot.
4. A stale live-state/inventory plan is rejected before write.
5. Normalized text is never an authorization substitute for a raw exact identifier/caption.
6. Domain semantics and protocol operations stay inside the MCP.
7. Gateway tools are disabled unless `LSA_LOCAL_COMMAND_GATEWAY=1` (or equivalent explicit Local-only instance configuration).
8. Shared HTTP instances used by cloud agents must not dynamically expose Local-only tools.
