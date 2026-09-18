# OR4B0 dependency decisions

## Reuse-first rule

Before implementing deterministic parsing primitives, prefer maintained existing libraries or platform APIs when they meet the live-stage constraints.

### Adopted

- **Intl.Segmenter (Node/ECMAScript)** for deterministic token boundaries and source indices.
- **parse-duration** for duration parsing. The wrapper enforces a 100-character default input bound and uses locale canonicalization hooks rather than mutating parse-duration's global unit table.

### Deliberately not adopted yet

- **Microsoft Recognizers Text**: broad number/percentage recognition, but much larger than OR4B0 needs. Benchmark on Raspberry Pi 5 before adding it.
- **Chevrotain**: mature parser toolkit, but OR4B0 does not need a central grammar engine. Domain grammars stay in MCPs.
- **NLP.js / general NLP frameworks**: unnecessary for deterministic primitives and contrary to the small/fast core goal.

### Custom code retained

Custom code is limited to project-specific invariants: protocol types, source-span model, conservative literals/signs/percentages, opaque token lifecycle, Local-only MCP registration, and corpus harness.

No mixer, QLC+, OSC, channel, bus, mute, caption, button, or manufacturer-specific semantics are allowed here.
