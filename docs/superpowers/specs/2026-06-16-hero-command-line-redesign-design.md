# Hero Redesign — "Command Line" Direction

**Date:** 2026-06-16
**Section:** Homepage hero (`#hero` in `index.html`)
**Goal:** Maximize visual impact while keeping the existing message. Lean into Velloris's
monospace `> velloris.ai` brand DNA so the hero is *ownable* — recognizably Velloris, not a
generic dark AI/SaaS hero.

## Decisions (locked with user)

| Decision | Choice |
|---|---|
| Direction | Command Line (terminal/code-editor aesthetic) |
| Headline motion | **Type everything** — command and all 3 headline lines type out character-by-character with a blinking cursor |
| Headline font | **Inter** (bold sans), with **JetBrains Mono** on terminal/command/subhead/buttons |
| Identity element | **Terminal bar only** — replaces the old "AI Strategy Advisory" pill badge |
| Command copy | `> init velloris --rebuild-org` |
| Palette | Unchanged: indigo `#6366f1`, purple `#a855f7`, cyan `#22D3EE` |

## Layout

Full-viewport (`min-height:100svh`) dark stage, left-aligned content, same container width
(`--container: 1180px`) and horizontal padding as the current hero.

```
┌─ terminal bar ──────────────────────────────┐
│ ● ● ●   > velloris.ai — ~/strategy.engine    │   mono, traffic-light dots
└──────────────────────────────────────────────┘
> init velloris --rebuild-org                      typed command (mono)

Re-Engineering                                     H1, Inter 800, types in
the Organization
for the Generative Era.  ▌                          gradient last line + cyan cursor

// Strategy, structure, and clarity to lead        subhead as code comment (mono)
   your organization through AI.

[ Book a Discovery Call → ]  [ See Our Services ]  mono buttons
```

### Components

1. **Terminal bar** — inline-flex pill: three traffic-light dots (red/yellow/green), then
   `> velloris.ai` (chevron purple, `.ai` cyan), then `— ~/strategy.engine` (cyan path).
   Monospace, subtle border `rgba(124,108,255,.25)` + faint fill. Fades in first.
2. **Command line** — `> init velloris --rebuild-org`, chevron purple, command text near-white.
   Monospace. Types out character-by-character.
3. **Headline (H1)** — three lines, Inter 800, `clamp(44px, 7vw, 96px)`, `line-height:1.04`,
   `letter-spacing:-.035em`. Lines 1–2 white; line 3 uses existing `--grad-text`. A cyan
   block cursor (`box-shadow` glow) sits at the active typing position and rests after the
   last line.
4. **Subhead** — code comment style: `// ` prefix in cyan, monospace,
   `rgba(255,255,255,.45)`, `max-width:560px`. Copy: "Strategy, structure, and clarity to
   lead your organization through AI."
5. **CTAs** — two buttons, monospace labels:
   - Primary: `Book a Discovery Call →` — gradient fill, glow shadow, arrow nudges on hover.
   - Outline: `See Our Services` — cyan border/text on hover.
   Links target `#contact` and `#services` (unchanged from current).

## Background treatment

- **Engineering grid** (new signature): two 1px linear-gradient line layers at 48px spacing,
  `rgba(124,108,255,.06)`, faded out by a radial mask anchored top-left
  (`radial-gradient(120% 100% at 25% 30%, #000 0%, transparent 75%)`).
- **Reactive wave canvas** (reuse existing `#heroCanvas` system): toned down to ~55% opacity
  and a reduced layer set positioned lower in the frame (`y` ≈ 0.60–0.70) so it reads as a
  baseline shimmer beneath the content rather than competing with the grid. Waves still bend
  toward the cursor via the existing gaussian-pull logic.
- **Glow orbs**: keep two soft blurred orbs (indigo top-left, purple bottom-right) for depth.

## Motion sequence

1. Terminal bar fades up (~120ms in).
2. `> init velloris --rebuild-org` types out at ~38ms/char.
3. ~260ms pause; cyan cursor appears.
4. Headline lines type sequentially at ~42ms/char; cursor tracks the active line, ending on
   the gradient line.
5. Subhead fades up, then CTAs fade up (~160ms stagger).
6. Cursor keeps a slow blink (1s steps) at rest.

Total ≈ 3s to settle.

## Accessibility & performance

- **Real text in DOM:** the full headline, subhead, and command live as real text in the
  markup. JS animates the *reveal* by progressively revealing already-present characters
  (per-line `clip`/`max-width` step, or wrapping chars in spans toggled visible) — it never
  injects or rebuilds the text content. SEO and screen readers get complete content
  immediately. Concrete approach is the implementer's choice as long as the DOM text is
  complete on load and the animation only governs visibility.
- **`prefers-reduced-motion`:** skip all typing; show terminal bar, full headline, subhead,
  and CTAs with a simple opacity fade. Cursor static (or hidden).
- **Canvas:** reuse the existing requestAnimationFrame loop; fewer wave layers than today, so
  no added cost. Respect reduced-motion by leaving the canvas static/faded if needed.
- **Font:** add JetBrains Mono via the existing Google Fonts `<link>` (one new family,
  weights 400/500/700) with `display=swap`. Inter stays as-is.
- **Contrast:** command text and headline on `#050510` are near-white (passes 4.5:1); the
  muted subhead at `rgba(255,255,255,.45)` is decorative supporting copy — acceptable, but
  verify it still reads.

## Files to change

- **`index.html`** — replace hero inner markup (lines ~57–88): terminal bar + command line +
  headline (real text) + comment subhead + CTAs. Add JetBrains Mono to the fonts `<link>`
  (line 10). Remove the old `.hero-badge` markup.
- **`styles.css`** — rewrite the hero block (~lines 307–460): add `.term-bar`, `.cmd-line`,
  grid background, mono subhead/buttons; retune `.hero-heading` cursor; keep orbs. **Remove
  dead `.hero-stats` rules** (lines ~438–459 and mobile refs ~997/1045 — no matching markup).
  Remove `.hero-badge` rules if the pill is fully dropped.
- **`script.js`** — rewrite `revealHero()` (~line 353) into the type-everything sequence with a
  reduced-motion guard; retune the `waves` array (lines 47–63) for the lower, lighter look.
  Keep the mobile wave-clip logic (lines 23–35) and the resize/mouse handlers.

## Out of scope

- No changes to nav, other sections, or copy beyond the hero.
- No palette or framework changes.
- Mobile keeps the existing responsive approach; headline clamps down as today, terminal bar
  wraps gracefully.

## Anti-patterns to avoid (from UI/UX review)

- No emojis as icons (traffic-light dots are CSS circles, not emoji).
- Buttons keep `cursor:pointer` and 150–300ms transitions.
- Don't let the typing block content for no-JS / reduced-motion users.
- Don't stack the grid + full-strength waves + orbs all at full opacity (visual noise) — the
  waves are deliberately toned down.
