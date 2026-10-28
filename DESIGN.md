---
name: RFID Anti-Theft Console
description: A calm, instrument-grade light UI for the sold-tag list and alarm events.
colors:
  cerulean: "oklch(0.55 0.14 233)"
  cerulean-deep: "oklch(0.47 0.14 233)"
  cerulean-wash: "oklch(0.95 0.03 233)"
  signal-red: "oklch(0.55 0.20 27)"
  signal-red-deep: "oklch(0.50 0.21 27)"
  signal-red-wash: "oklch(0.955 0.035 27)"
  signal-red-ink: "oklch(0.45 0.16 27)"
  ok-green: "oklch(0.62 0.13 150)"
  ok-green-ink: "oklch(0.40 0.10 150)"
  ok-green-wash: "oklch(0.96 0.03 150)"
  amber: "oklch(0.72 0.15 75)"
  amber-ink: "oklch(0.45 0.09 75)"
  amber-wash: "oklch(0.96 0.05 75)"
  canvas: "oklch(0.985 0.005 233)"
  surface: "oklch(1 0 0)"
  surface-sunken: "oklch(0.97 0.006 233)"
  hairline: "oklch(0.922 0.006 233)"
  hairline-strong: "oklch(0.86 0.008 233)"
  ink: "oklch(0.255 0.015 245)"
  ink-strong: "oklch(0.205 0.02 245)"
  ink-muted: "oklch(0.50 0.015 245)"
  on-color: "oklch(1 0 0)"
typography:
  headline:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
  code:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
    fontFeature: "'tnum' 1, 'zero' 1"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.cerulean-deep}"
    textColor: "{colors.on-color}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "oklch(0.42 0.14 233)"
    textColor: "{colors.on-color}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-danger:
    backgroundColor: "{colors.signal-red-deep}"
    textColor: "{colors.on-color}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-strong}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  status-chip-alarm:
    backgroundColor: "{colors.signal-red-wash}"
    textColor: "{colors.signal-red-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  nav-item-active:
    backgroundColor: "{colors.cerulean-wash}"
    textColor: "{colors.cerulean-deep}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: RFID Anti-Theft Console

## 1. Overview

**Creative North Star: "The Instrument Panel"**

This is the read-out for a piece of equipment, not an app being sold. A technician
trusts a well-made instrument because it is legible, consistent, and never theatrical:
the needle sits still until something is actually wrong, and when it moves you believe it.
The console borrows that posture. Surfaces are quiet white under a faint cool daylight
canvas; structure is drawn with hairlines, not boxes-in-boxes; every tag EPC, reader ID,
and timestamp is set in monospace so codes line up and read like measurements. One
cerulean carries identity and intent. Alarm red is kept in a locked drawer and only comes
out when a tag that is not on the sold list is detected at a gate.

The system explicitly rejects four things named in PRODUCT.md. It is **not a legacy ERP**
(no dense gray forms, no toolbar thickets, no hierarchy-by-accident). It is **not a generic
AI dashboard** (no gradient stat cards, no oversized hero metric, no decorative donut
charts, no identical icon-card grid). It is **not a flashy consumer toy** (no gamified
color, no motion for its own sake). And it is **not a stock PrimeNG demo**: PrimeNG is the
component layer, and the Aura defaults are overridden token-for-token so nothing reads as
"sample app."

The register is product: the design serves the task and then disappears. Familiarity is a
feature here. Staff should trust the table, the form, and the event log on first sight.

**Key Characteristics:**
- Light, pure-white surfaces on a faint cool canvas; depth from hairlines, not shadow.
- One cerulean for identity; alarm red rationed to genuine alarm states only.
- Monospace for every machine value (EPC, reader, timestamp, counts).
- Calm density: comfortable, scannable rows, never a wall of gray.
- State is never color-only: color + icon + text, always.

## 2. Colors

A cool, instrument palette: near-pure neutrals carrying a faint cerulean undertone, a
single confident cerulean for intent, and a small, disciplined set of semantic signals.

### Primary
- **Cerulean** (`oklch(0.55 0.14 233)`, renders ≈ `#007db5`): the brand and intent color.
  Active nav, selected rows, focus rings, links, primary icons, the alarm-count emphasis.
  Reads as a calibrated sensor blue, not corporate navy.
- **Cerulean Deep** (`oklch(0.47 0.14 233)`, ≈ `#00649b`): fills that must carry white text,
  primary button background, link text on white. Hover goes one step deeper still.
- **Cerulean Wash** (`oklch(0.95 0.03 233)`, ≈ `#dcf3ff`): selected-row and active-nav
  background, primary-ghost hover. Carries the brand at whisper volume.

### Secondary (Signal)
The semantic set. Each appears as a tinted chip (wash background + ink text + a dot), never
as a saturated fill, except the alarm's loudest moment (an active-alarm banner or the alarm
status fill), which earns Signal Red Deep with white text.
- **Signal Red** (`oklch(0.55 0.20 27)`, ≈ `#cc2827`) / **Deep** (`oklch(0.50 0.21 27)`,
  ≈ `#be000d`): a tag that is not on the sold list was detected by a fixed reader. The product's one loud color.
- **OK Green** (`oklch(0.62 0.13 150)`, ≈ `#429c5a`): a tag is on the sold list and the gate lets it pass.
  Used as the chip dot and small indicators, never as a large fill.
- **Amber** (`oklch(0.72 0.15 75)`, ≈ `#da950b`): acknowledged or pending review; an
  in-between state that needs attention but isn't a live alarm.

### Neutral
- **Ink** (`oklch(0.255 0.015 245)`, ≈ `#1d242a`): body text. 15:1 on white.
- **Ink Strong** (`oklch(0.205 0.02 245)`, ≈ `#0f1820`): headings, key values, table data.
- **Ink Muted** (`oklch(0.50 0.015 245)`, ≈ `#5c646b`): secondary text, placeholders,
  helper copy. Meets 4.5:1; it is the floor, never go lighter for "elegance."
- **Canvas** (`oklch(0.985 0.005 233)`, ≈ `#f7fbfd`): the page background the white surfaces
  sit on. The faint cool tint, not warm.
- **Surface** (`oklch(1 0 0)`, `#ffffff`): cards, panels, table body, top bar, side nav.
- **Surface Sunken** (`oklch(0.97 0.006 233)`, ≈ `#f1f6f8`): table header row, hover row,
  inset wells.
- **Hairline** (`oklch(0.922 0.006 233)`, ≈ `#e1e6e9`): the default 1px divider and border.
- **Hairline Strong** (`oklch(0.86 0.008 233)`, ≈ `#ccd2d5`): input borders, emphasis rules.

### Named Rules
**The Locked-Drawer Rule.** Signal Red is forbidden as decoration. It appears only where a
tag that is not on the sold list has been detected: alarm rows, the active-alarm banner, the alarm status
chip and its count. If red is on screen, something is actually wrong. Its rarity is what
makes a glance enough.

**The Whisper Tint Rule.** Status is shown as a wash-tinted chip with dark ink and a colored
dot, not a saturated block. Saturated fills are reserved for the single most urgent affordance
on a screen (a live-alarm banner or its primary "Acknowledge" action). Everything calmer is a
tint.

## 3. Typography

**Display / Body Font:** IBM Plex Sans (with `system-ui`, `sans-serif`)
**Data / Code Font:** IBM Plex Mono (with `ui-monospace`, `monospace`)

**Character:** One engineered superfamily worn two ways. Plex Sans is humane but precise,
built by a hardware company, so it reads as dependable rather than trendy and never as a
generic Inter clone. Plex Mono carries every machine value, which gives the console the feel
of a calibrated instrument and makes EPC codes verifiable digit by digit.

### Hierarchy
- **Headline** (600, 1.5rem/24px, 1.25): page titles ("Tag Registry", "Alarm Events").
- **Title** (600, 1.125rem/18px, 1.3): card and section headers, dialog titles.
- **Body** (400, 0.875rem/14px, 1.5): default UI and table text. Prose blocks cap at 70ch.
- **Label** (500, 0.75rem/12px, +0.01em): form labels, column headers, chip text. Sentence
  case, not all-caps tracked eyebrows.
- **Code** (500, 0.8125rem/13px, tabular figures): EPC values, reader IDs, timestamps, counts,
  any monospace-worthy machine value.

### Named Rules
**The Machine-Value Rule.** Anything the hardware produces, an EPC, a reader ID, an ISO
timestamp, a numeric count, is set in IBM Plex Mono with tabular figures so columns align and
codes can be read and compared digit by digit. Human language stays in Plex Sans.

**The Two-Step Rule.** Hierarchy comes from at most two visible weights (400 and 600) plus
scale. No light-weight body, no third typeface, no italics-as-emphasis in UI chrome.

## 4. Elevation

Flat by default. Depth is drawn with hairline borders and the canvas/surface tonal step, not
with shadow. The console should look pressed and precise, not floating. Shadow is allowed in
exactly one situation: content that genuinely overlays the page (dropdowns, dialogs, toasts,
date pickers), where a soft shadow signals "this is above everything." Interactive rows and
buttons respond with a one-step tonal shift, not a lift.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 6px 24px -8px oklch(0.255 0.03 245 / 0.18)`): dropdowns, popovers,
  date pickers.
- **Dialog** (`box-shadow: 0 16px 48px -12px oklch(0.255 0.03 245 / 0.28)`): modal surfaces
  above the backdrop.

### Named Rules
**The Flat-Until-Floating Rule.** A surface that is part of the layout gets a hairline and no
shadow. A surface that floats above the layout gets a shadow and no heavy border. If a card
has both a shadow and a border at rest, the shadow is wrong.

## 5. Components

### Buttons
- **Shape:** lightly squared (4px / `rounded.sm`), 36px tall, label type (12px/500).
- **Primary:** Cerulean Deep fill (`#00649b`) with white text; hover deepens to
  `oklch(0.42 0.14 233)`; active deepens again. Used once per view for the main action.
- **Secondary:** white fill, Hairline Strong border, Ink Strong text; hover fills Surface
  Sunken. The default for most actions.
- **Ghost:** no border, Ink Muted text; hover fills Cerulean Wash with Cerulean Deep text.
  Toolbar and row actions.
- **Danger:** Signal Red Deep fill with white text, reserved for destructive confirms
  (delete tag) and the primary action inside a live-alarm context.
- **Focus:** 2px Cerulean ring at 2px offset on every variant. Never remove the outline.

### Inputs / Fields
- **Style:** white fill, 1px Hairline Strong border, 4px radius, 36px tall, body type, Ink
  Strong text, Ink Muted placeholder (meets 4.5:1).
- **Focus:** border shifts to Cerulean plus a 2px Cerulean ring; no glow.
- **Error:** border and ring shift to Signal Red, with a Signal-Red-Ink helper line and an
  inline icon. Never color-only.
- **Disabled:** Surface Sunken fill, Ink Muted text, no border emphasis.

### Status Chips
- **Style:** wash background + matching ink text + a 6px leading dot, 4px radius, label type.
  Always paired with a text word and an icon, never color alone.
- **Vocabulary:** Alarm (red wash), Sold (green wash), Acknowledged (amber wash),
  Resolved/Inactive (neutral Surface Sunken + Ink Muted dot).

### Cards / Panels
- **Corner:** 6px (`rounded.md`). **Background:** Surface white on Canvas.
- **Border:** 1px Hairline. **Shadow:** none at rest (see Elevation).
- **Padding:** 16px (`lg`). Avoid nesting cards; use hairline dividers inside a single panel.

### Data Table (signature component)
The registry and the event log are the product, so the table is the marquee component.
- **Header:** Surface Sunken background, Label type, Ink Strong, hairline bottom rule,
  sortable columns with a quiet caret.
- **Rows:** 44px tall, body text, EPC / ID / timestamp columns in Code (mono, tabular),
  hairline row separators, hover fills Surface Sunken, selected row fills Cerulean Wash.
- **Alarm row:** left cell carries the Alarm chip; the row keeps a Signal-Red-Wash tint so a
  live event is unmistakable while scanning, without shouting.
- **Density + empty state:** comfortable by default; the empty state teaches the next action
  ("No sold tags yet. Add an EPC when it is sold."), never a bare "No data."

### Navigation
- **Style:** left side-nav on Surface white, Label/Body type, icon + word. Default Ink Muted;
  hover Surface Sunken; **active** Cerulean Wash background with Cerulean Deep text and a 2px
  Cerulean leading marker. Collapses to icon-rail under 768px.

## 6. Do's and Don'ts

### Do:
- **Do** keep Signal Red in the locked drawer: alarm rows, alarm chip, live-alarm banner,
  alarm count. Nowhere else.
- **Do** set every EPC, reader ID, timestamp, and count in IBM Plex Mono with tabular figures.
- **Do** pair every status with an icon and a text label; color is the third signal, never the
  only one.
- **Do** draw structure with hairlines and the canvas/surface step; keep resting surfaces flat.
- **Do** keep Ink Muted (`#5c646b`) as the lightest text on screen; bump toward Ink if a value
  matters.
- **Do** give the data table the most care: alignment, mono columns, a teaching empty state,
  a visible focus and keyboard path.

### Don't:
- **Don't** ship the stock PrimeNG Aura theme; override the tokens so nothing reads as a
  "sample app."
- **Don't** build a generic AI dashboard: no gradient stat cards, no oversized hero metric, no
  decorative donut/area charts, no identical icon-card grid.
- **Don't** drift toward legacy ERP: no dense gray forms, no toolbar thickets, no
  borders-inside-borders, no hierarchy left to chance.
- **Don't** add flashy or playful flourishes: no gamified color, no bounce/elastic motion, no
  animation that doesn't convey state.
- **Don't** use a `border-left`/`border-right` colored stripe as an accent on rows, cards, or
  alerts; tint the whole row or lead with the chip instead.
- **Don't** use gradient text, decorative glassmorphism, or a saturated status fill where a
  wash tint will do.
- **Don't** signal any state by color alone, and never animate the alarm emphasis as the only
  cue (respect `prefers-reduced-motion`).
