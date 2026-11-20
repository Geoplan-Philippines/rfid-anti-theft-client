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
- `DESIGN.md` — visual system: tokens, typography, spacing, components (normative).

The visual system is **Meedo's** (Geoplan-Philippines/meedo-client, `staging`): the same
colour tokens, type, spacing and radius. **Light theme only**: no dark mode, no theme toggle.
Source of truth in code: `src/styles.css` (tokens + Tailwind mapping), `src/design-system.css`
(list-page `ds-*` rules), `src/app/core/theme/app-preset.ts` (PrimeNG tokens).

In brief: Poppins for headings, Work Sans for everything else; primary `#0B4EA2`; colours
only through theme tokens (`bg-primary`, `text-muted`, `border-divider`, ...), never hex in
components. Badges are `p-tag` muted pairs (AA on their fill); never use `--destructive` as
text. Build with PrimeNG components and the shared `app-page`, `app-list-paginator` and
`app-empty-state`, not one-off CSS. Lists paginate with `app-list-paginator` (summary left,
pages right). State is never colour-only.

Explicitly avoid: legacy ERP density, generic AI dashboard (gradient stat cards, hero
metrics), flashy/playful flourishes, and the stock PrimeNG Aura theme.