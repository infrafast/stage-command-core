# @infrafast/stage-command-core

Shared deterministic command primitives for LiveStageAssistant MCP servers.

This package implements the generic parts of the `lsa-command-gateway/v1` contract. It is **not a service** and contains no mixer, QLC+, OSC, channel, bus, mute, button, caption, or manufacturer-specific semantics.

## Design rules

- Domain semantics stay in each MCP.
- Analysis is side-effect free.
- Write plans use short-lived opaque one-shot tokens.
- Clarification continuations use opaque short-lived tokens.
- Raw text is always preserved alongside normalized text and source spans.
- Normalization is never authorization: exact domain identifiers/captions must be checked against raw/source text by the MCP.
- Cloud MCP tools are not changed or replaced by this package.

## Runtime

- Node.js 20+
- TypeScript 5+
- ESM

## Initial OR4B0 scope

- `lsa-command-gateway/v1` protocol types
- raw/normalized text model with source spans
- deterministic tokenization and matching helpers
- numeric/sign/percentage helpers
- duration helper using `parse-duration`
- locale hooks
- plan/continuation token store with TTL and one-shot writes
- corpus test harness
- MCP gateway registration helpers

See `docs/protocol.md` for the protocol contract.


## Current consumers

- QLCPlus-MCP OR4B1 pins this package by exact Git commit and uses it for the first deterministic Local gateway vertical slice.
- XMSeries-MCP remains the next consumer planned for OR4B2.

For Git-based consumers, the package defines a `prepare` script so `dist/` is built during installation even though generated output is not committed.
