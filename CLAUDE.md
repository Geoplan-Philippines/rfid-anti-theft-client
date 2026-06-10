# Claude Code Project Instructions

## Required Project Rules

Before making changes, read and follow:

- `.claude/rules/angular-standards.md`

## Skills

Project-specific skills are located in:

- `.claude/skills`

Use the relevant skill when the task matches the skill description.

## Design Context

Before building or styling any UI, read:

- `PRODUCT.md` — strategy: register (product), users, purpose, anti-references, design principles.
- `DESIGN.md` — visual system: tokens, palette, typography, components (normative).
- `.impeccable/design.json` — sidecar: tonal ramps, motion, component snippets.

North Star: **"The Instrument Panel."** Light, pure-white surfaces on a faint cool canvas;
one cerulean (`oklch(0.55 0.14 233)`) for identity; signal red rationed to genuine alarm
states only; IBM Plex Sans for UI, IBM Plex Mono for every machine value (EPC, reader ID,
timestamp, count). Depth from hairlines, not shadow. State is never color-only.

Explicitly avoid: legacy ERP density, generic AI dashboard (gradient stat cards, hero
metrics), flashy/playful flourishes, and the stock PrimeNG Aura theme.