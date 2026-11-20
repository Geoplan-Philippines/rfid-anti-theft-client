---
name: MUJI EAS Console
description: Meedo's light list-page system (Geoplan-Philippines/meedo-client, staging) applied to the sold-tag registry, sales, and alarm events.
colors:
  primary: "#0B4EA2"
  primary-hover: "#03285A"
  primary-foreground: "#FFFFFF"
  secondary: "#E8F1FF"
  secondary-foreground: "#0B4EA2"
  background: "#F1F6FC"
  page: "#FFFFFF"
  chrome: "#F6F8FB"
  subtle: "#F3F6FA"
  hover: "#F2F5F9"
  selected: "#E9F0FA"
  divider: "#E6ECF2"
  border: "#DBE5F0"
  border-strong: "#C7D6E6"
  text-heading: "#0B161F"
  text-body: "#365261"
  text-muted: "#5E7180"
  text-faint: "#8696A5"
  ring: "#0E7490"
  destructive: "#FF4B4B"
  muted-destructive: "#FFE1DE"
  muted-destructive-foreground: "#C0322F"
  success: "#3DBE81"
  muted-success: "#D1EDE0"
  muted-success-foreground: "#1B6B47"
  warning: "#E8A317"
  muted-warning: "#FEF3D6"
  muted-warning-foreground: "#92580B"
  info: "#2F6FE0"
  muted-info: "#DCE9FB"
  muted-info-foreground: "#1A4F9C"
  badge-neutral-bg: "#E6ECF2"
  badge-neutral-fg: "#33495A"
typography:
  page-title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  base: "0.25rem"
  card: "0.375rem"
  pill: "999px"
spacing:
  page-gutter: "2rem (1rem under 768px)"
  page-gap: "1.25rem"
  toolbar-gap: "0.5rem"
  cell-x: "0.75rem"
  row-h: "2.75rem"
  row-h-head: "2.25rem"
  control-h: "2.25rem"
---

# Design System: MUJI EAS Console

The console uses Meedo's visual system (Geoplan-Philippines/meedo-client, `staging`):
the same colour tokens, type, spacing and radius. **Light theme only**: there is no
dark mode and no theme toggle.

## Where it lives

| File | Holds |
| --- | --- |
| `src/styles.css` | CSS variables, the Tailwind `@theme` mapping, base type. The only place hex colours live besides the preset. |
| `src/design-system.css` | `ds-*` rules for list pages (table bleed, sticky header, toolbar heights, skeletons, banners). Layer `components`. |
| `src/app/core/theme/app-preset.ts` | PrimeNG component tokens (Aura preset, Meedo values). |
| `src/app/shared/ui/` | `app-page` (page frame), `app-list-paginator` (list footer), `app-empty-state`. |
| `src/app/layout/` | Header, sidebar, and the layout service. |

Cascade: PrimeNG sits in its own layer between Tailwind's base and `components`, so
`ds-*` rules and Tailwind utilities both override it without `!important`.

## Colour

- Use the theme tokens, never raw hex in components: `bg-primary`, `text-heading`,
  `text-body`, `text-muted`, `border-divider`, `bg-chrome`, `bg-selected`, and so on.
- The app chrome (header and sidebar) is `--chrome`; content sits on white `--page`.
  The sign-in page sits on `--background`. Depth comes from 1px `--divider` hairlines,
  not shadows; only overlays (dialogs, dropdowns, toasts) carry a shadow.
- **Status is a muted pair**: fill `--muted-*` with text `--muted-*-foreground`. Every
  pair meets WCAG AA (danger is the tightest at 4.57:1). The solid tones (`--destructive`,
  `--success`, ...) are for dots and borders only; `--destructive` as text is 3.3:1
  and fails AA. Use `text-muted-destructive-foreground` for error text.
- Filled danger buttons use `--muted-destructive-foreground` (5.6:1 with white), not
  Aura's red-500 (3.8:1).

## Type

- **Poppins** (600) for headings, applied globally to `h1`–`h6`.
- **Work Sans** for everything else: body, buttons, inputs, tables.
- No other families. Machine values (EPC, timestamps, counts) use Work Sans with
  `ds-num` (tabular figures). EPCs in the registry are grouped in fours (`epcFormat`).
- Sizes: page title 1.375rem; body and table cells 0.875rem; labels, column headers,
  badges 0.75rem/500; muted helper copy 0.8125rem.

## Spacing and density

Tailwind's 4px scale, named by role in `styles.css`: page gutter 2rem (1rem on
phones), 1.25rem between page sections, 0.5rem between toolbar controls. List rows
are 44px, header rows 36px, toolbar controls 36px. Radius is 4px (`rounded-base`),
6px for cards and thumbnails (`rounded-card`), and a full pill for badges and avatars.

## Components

Build with PrimeNG components and the shared wrappers, not one-off CSS.

- **Page**: `<app-page heading subtitle>` with slots `pageBreadcrumb`, `pageActions`,
  `pageSummary`, `pageToolbar`, `pageToolbarEnd`, and the default content slot.
- **Lists**: `p-table class="ds-table"` inside `div.ds-table-scroll`. Rows run edge to
  edge with hairline dividers; the header sticks under the app header.
- **Pagination**: `app-list-paginator` under every list. "Showing x to y of n" on the
  left; page links and a 10/25/50 rows-per-page select on the right. Never centred.
- **Search**: `p-iconfield.ds-search` + `p-inputicon` + `pInputText`; the clear button
  is a small text `p-button` inside `p-inputicon.ds-search-clear`.
- **Badges**: `p-tag` with `[rounded]="true"` and a severity (`danger`, `info`,
  `success`, `warn`, `secondary`). Always pair with an icon or a word; never colour alone.
- **Row actions**: icon-only `p-button` (`text`, `rounded`, `size="small"`) with an
  `ariaLabel` and a `pTooltip`.
- **Errors and banners**: `p-message styleClass="ds-message"`.
- **Empty states**: `app-empty-state` with an icon, one line, an optional description
  and an action.
- **Dialogs**: `p-dialog`, 440px wide, `closeAriaLabel="Close"`. Footer: a secondary
  text Cancel, then the primary (or `danger`) action. Confirmations use a `p-dialog`, as
  Meedo does, not `p-confirmdialog`.
- **Forms**: label `text-sm font-medium text-heading` above the field, hint
  `text-xs text-muted` below, error `text-xs text-muted-destructive-foreground` with
  `role="alert"`.
- **Navigation**: sidebar sections with small muted titles; the active link is
  `bg-selected text-heading` with a primary icon. It collapses to an icon rail on
  desktop and becomes an off-canvas drawer under 768px.

## Accessibility

Every screen must pass axe (WCAG 2.1 A/AA and best practice). Every control keeps a
visible focus ring: 2px `--ring` at a 2px offset (PrimeNG's `focusRing` token, and a
global `:focus-visible` rule for everything else). Respect `prefers-reduced-motion`.
