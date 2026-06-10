# Product

## Register

product

## Users

Facility staff at First Sumiden Circuits (security / operations). They work alongside
a **fixed RFID** installation: readers mounted at exits/gates that detect tagged items.
Their context is a shift on-site, not a focused desk session, so they dip into the app
to do a specific job and leave: register or correct a tag, or check why an alarm fired.

The job to be done:
- Maintain the registry of **known EPCs** (the tags the system watches). This is the
  surface they touch most: create, edit, deactivate, search.
- Understand alarm events. When a known EPC is picked up by a fixed reader, the hardware
  sounds a physical alarm; staff use the app to see what tripped it and when.
- Review the **history of alarmed tags** to spot repeat offenders and patterns.

## Product Purpose

A management client for a fixed-RFID anti-theft system. The hardware does the detection
and the alarming; this app is the human side of it. It exists to keep the list of watched
tags (known EPCs) accurate and to make alarm events legible after the fact.

Scope for the First Sumiden pitch, deliberately small:
1. **Known-EPC registry** — CRUD over watched tags (EPC, asset/label, status).
2. **Alarm events** — what tripped, which reader, when; acknowledge / resolve.
3. **Alarm history** — a table of past alarmed tags for review.

No live floor-monitoring dashboard and no reader/zone configuration in this cut; keep it
simple and complete rather than broad.

Success = First Sumiden sees a tool that looks dependable and obviously usable by their
staff on day one, distinct from a stock PrimeNG sample.

## Brand Personality

**Trustworthy, precise, calm.** Serious without being cold. The voice is plain and
operational: it states what happened and what to do, never hypes. Confidence comes from
restraint and accuracy, not decoration. The interface should feel like equipment you
trust, not software being sold to you.

## Anti-references

Avoid all four, explicitly called out by the team:
- **Cluttered legacy ERP** (SAP/Oracle): dense gray forms, endless toolbars, no hierarchy.
- **Generic AI dashboard**: gradient stat cards, oversized hero metrics, identical
  icon-card grids, decorative charts that say nothing.
- **Flashy / playful consumer UI**: bright gamified color, animation for its own sake.
- **Stock PrimeNG demo**: an untouched Aura theme that reads as "every PrimeNG sample."
  PrimeNG is the component layer, not the identity; the theme must be made our own.

## Design Principles

1. **The registry is the product.** Most time is spent maintaining known EPCs, so that
   table and its create/edit flow must be fast, legible, and forgiving: inline feedback,
   clear validation, easy undo. Optimize this before anything else.
2. **An alarm demands a glance, not a hunt.** An active or recent alarm event must be
   unmistakable at a glance and resolvable in one or two actions. Never signal state by
   color alone (icon + text + color), so it survives color blindness and a busy floor.
3. **Calm by default, loud only when it matters.** The UI stays quiet and neutral;
   saturated alert color is rationed for genuine alarm states so it actually carries weight
   when it appears.
4. **Earned familiarity over novelty.** Staff should trust standard table, form, and
   detail patterns on first sight. No invented affordances for standard tasks; the tool
   disappears into the work.
5. **Demo-ready honesty.** Because this is a pitch, ship realistic EPC data, real empty
   states, and a populated history that shows the system working, not lorem-ipsum filler.

## Accessibility & Inclusion

WCAG 2.1 AA minimum; must pass AXE with no violations (mandated in project CLAUDE.md).
Specifics that matter for this product:
- State (alarm / acknowledged / resolved, active / inactive tag) is never color-only;
  pair color with an icon and a text label.
- Visible focus on every interactive element; full keyboard operation of tables, forms,
  and dialogs.
- Body and placeholder text meet 4.5:1 contrast; status text meets it against its tint.
- Respect `prefers-reduced-motion`: alarm emphasis must not depend on motion alone.
