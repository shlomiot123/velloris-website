# Hebrew RTL Version — Design Spec

**Date:** 2026-06-16
**Status:** Approved

## Goal

Add a Hebrew, right-to-left (RTL) version of the Velloris marketing site alongside
the existing English (LTR) site, with a language switcher between them. The two
versions share the same stylesheet and JavaScript and stay independently editable.

## Architecture

A new standalone page **`index.he.html`** lives at the repo root and is served by
Render at `/index.he.html`. It reuses the existing `styles.css` and `script.js`
unchanged, plus one new Hebrew-only stylesheet, **`rtl.css`**, loaded after
`styles.css`.

Rationale for root placement (not `/he/index.html`): every relative asset path
(`styles.css`, `script.js`, `assets/shlomi.jpg`, `favicon.svg`) stays identical, so
nothing needs path rewriting.

The English `index.html` is modified only to add the language switcher and an
`hreflang` alternate link.

Files:
- `index.he.html` — new, Hebrew RTL markup (structural clone of `index.html`)
- `rtl.css` — new, RTL-only overrides scoped under `[dir="rtl"]`
- `index.html` — edit: add switcher link (nav + mobile menu) and `hreflang` alternate
- `styles.css`, `script.js` — unchanged

## RTL Strategy

### Document
- `<html lang="he" dir="rtl">` on the Hebrew page.
- Flexbox and grid layouts mirror automatically under `dir="rtl"`; logical flow
  flips without per-rule changes.

### `rtl.css` overrides (scoped under `[dir="rtl"]`)
The existing CSS uses a handful of physical-direction properties that do NOT
auto-flip. These are overridden:

| Element | Original (LTR) | RTL override |
|---|---|---|
| `.team-quote` | `border-left` + `padding-left: 20px` | `border-right` + `padding-right: 20px`, reset left |
| `.why-item::before` (decorative dot, `left: 20px`) | left-anchored | right-anchored |
| Mobile `.why-item` colored accent (`border-left-color`) | left border | right border |
| Mobile `.process-track::before` rail (`left: 14px`) | left rail | right rail (`right: 14px; left: auto`) |
| Mobile `.process-step` (`padding-left: 46px`) + `.step-num` (`left: -40px`) | left | right side |
| Mobile `.why-num` (`right: -6px`) | right | left |
| `.process-step::before` hover underline (`left: -14px; right: 14px`) | mirrored offsets |
| `.btn-arrow` hover `transform: translateX(4px)` | moves right | moves left (`translateX(-4px)`) |

Note: the exact directional rules to mirror are enumerated from `styles.css` lines
136, 619–620, 677–687, 708–717, 818–820, 1137–1171, and 478. The implementation
plan will verify each against the live file before mirroring.

### Typography
- `body` font becomes **Heebo** (Google Fonts), the Hebrew companion to Inter's
  geometric sans aesthetic.
- JetBrains Mono is retained for the terminal/command-line/code elements (Latin
  only). `'Courier New'` mono accents (`.section-label::before` `>`, logo) unchanged.
- Hebrew page `<head>` loads Heebo in addition to the existing font links.

### Terminal / code aesthetic
The hero terminal is a developer/code motif and stays visually LTR. These elements
get `dir="ltr"` so they render correctly inside the RTL page:
- `.term-bar` (dots, `> velloris.ai`, `—`, `~/strategy.engine`)
- `.cmd-line` (`> init velloris --rebuild-org`)
- `.nav-logo` / footer logo (`> velloris.ai`)

The typing reveal in `script.js` animates `width: 0ch → Nch`. With the headline text
flowing RTL, the unmask naturally proceeds right-to-left. No JS change required.

### Arrow glyphs
Directional arrows in CTAs and the form button (`→`) are replaced with `←` in the
Hebrew markup, and the hover nudge is mirrored in `rtl.css`.

## Content / Translation

All visible copy is translated to natural, idiomatic Hebrew (not literal). Section
by section: nav, hero headline + subhead + CTAs, About, Who We Help (desktop grid
+ mobile stacked cards), Services (desktop grid + mobile accordion), Process, Why
Velloris, Team bio, Contact form, footer.

**Kept in Latin script (standard Israeli tech/business practice):**
- Brand and company names: Velloris, Yad2, G Medical Innovations, Colmobil, Umoove
- Job titles: CTO, VP R&D, R&D Director
- LinkedIn; the email address `shlomiot@gmail.com`
- All code/terminal text and the `velloris.ai` logo

**Mobile JS data:** `index.html` has an inline `<script>` with a `DATA` array
(Who-We-Help stacked cards) containing English strings. `index.he.html` gets its own
copy of that inline script with Hebrew strings. The shared `script.js` has no
hardcoded copy, so it needs no change.

**Form:** same web3forms `access_key`. Labels/placeholders translated. Text inputs
inherit RTL; the email input is set `dir="ltr"` for correct address entry. The
`subject`/`from_name` sent to web3forms may be marked as Hebrew-page origin so
submissions are distinguishable.

## Language Switcher

- English `index.html`: a compact `עב` link in the nav links list and in the mobile
  menu, pointing to `index.he.html`.
- Hebrew `index.he.html`: a compact `EN` link in the same positions, pointing to
  `index.html`.
- Styled to match existing nav links (lightweight; may reuse `.nav-link` with a
  small modifier class). No new JS.
- SEO: each page gets reciprocal `<link rel="alternate" hreflang="...">` tags
  (`he` / `en` + `x-default`).

## Out of Scope (YAGNI)

- No build tooling or templating.
- No JavaScript i18n framework or runtime text-swap toggle.
- No Render config change (static serving already covers the new files).
- No translation of code/terminal content.
- No automatic language detection/redirect.

## Testing / Verification

- Open `index.he.html` in a browser; confirm: page direction is RTL, Hebrew renders
  in Heebo, the terminal/logo render LTR and the typing reveal works, layout mirrors
  cleanly (nav, grids, team quote border, process rail, arrows), and mobile
  breakpoints (stacked cards, accordion, process rail) mirror correctly.
- Confirm the switcher round-trips EN ↔ עב on both desktop and mobile.
- Confirm the contact form submits (email field LTR).
- Confirm the English page is visually unchanged except for the new `עב` link.
