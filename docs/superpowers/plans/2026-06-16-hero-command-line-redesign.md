# Hero "Command Line" Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage hero into a terminal/command-line aesthetic that leans into Velloris's `> velloris.ai` monospace brand DNA — terminal bar, typed command, type-everything headline reveal with a blinking cursor, engineering-grid background, and toned-down reactive waves.

**Architecture:** Static site, no build step or test framework. Changes are confined to three files (`index.html`, `styles.css`, `script.js`). Verification is browser-based: serve the site, drive it with Playwright, screenshot, and check the console — there are no unit tests. The full headline text lives in the DOM as real text; JS only governs *visibility* of already-present characters, so SEO/screen-readers and a `prefers-reduced-motion` fallback work without JS-injected content.

**Tech Stack:** HTML5, vanilla CSS (custom properties already defined in `:root`), vanilla JS (IIFE wave canvas + `requestAnimationFrame`), Google Fonts (Inter already loaded; **add JetBrains Mono**), Python `http.server` + Playwright MCP for verification.

**Spec:** `docs/superpowers/specs/2026-06-16-hero-command-line-redesign-design.md`

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `index.html` | Hero markup + font link | Modify `<link>` (line 10) to add JetBrains Mono; replace hero inner markup (lines ~65–86) |
| `styles.css` | Hero visual styling | Rewrite hero block (~307–460); remove dead `.hero-stats`/`.hstat-*` rules (438–468); update mobile refs (994–998, 1042–1045) |
| `script.js` | Reveal sequence + wave tuning | Rewrite `revealHero()` (352–367); retune `waves[]` array (47–63) |

**Conventions to follow (already in the codebase):**
- Colors come from `:root` vars: `--accent` `#6366f1`, `--accent-2` `#a855f7`, cyan is literal `#22D3EE`, `--grad`, `--grad-text`, `--smooth` easing.
- Reuse the existing `.btn` / `.btn-primary` / `.btn-outline` base classes (styles.css 85–116) — do **not** redefine them. Hero buttons get a mono-label modifier only.
- The `.grad-text` class (styles.css 63–68) already does the gradient clip — reuse it on the last headline line.
- Hero canvas id is `#heroCanvas`; the wave IIFE is `script.js` lines 8–143; mobile wave-clip logic (lines 23–35) and mouse/resize handlers must be preserved.

---

## Task 1: Add JetBrains Mono font

**Files:**
- Modify: `index.html:10`

- [ ] **Step 1: Replace the Google Fonts link to include JetBrains Mono**

Replace line 10:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap" rel="stylesheet" />
```

with:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Add a `--mono` custom property**

In `styles.css`, inside `:root` (after the `--grad-text` line, line 19), add:

```css
  --mono:      'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

- [ ] **Step 3: Verify the font loads**

Serve the site and confirm JetBrains Mono is fetched (no need to restyle yet):

```bash
pkill -f "http.server 8123" 2>/dev/null; sleep 0.5
cd /Users/talsabag/repos/velloris-website && nohup python3 -m http.server 8123 >/tmp/velloris.log 2>&1 &
sleep 1.5
curl -s http://localhost:8123/ | grep -o 'JetBrains+Mono[^"&]*'
```

Expected: prints `JetBrains+Mono:wght@400;500;700` (proves the link is in the served HTML).

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add JetBrains Mono font for hero command-line aesthetic"
```

---

## Task 2: Replace hero markup

**Files:**
- Modify: `index.html` (hero inner content, lines ~65–86)

- [ ] **Step 1: Replace the hero content block**

In `index.html`, replace the `<div class="hero-content">…</div>` block (lines 65–86) with the markup below. **Keep** the `<canvas id="heroCanvas">` (line 59) and the three `.hero-orb` divs (lines 61–63) exactly as they are — only the content div changes.

```html
    <div class="hero-content">
      <div class="term-bar" id="termBar">
        <span class="term-dot term-dot--r"></span>
        <span class="term-dot term-dot--y"></span>
        <span class="term-dot term-dot--g"></span>
        <span class="term-id"><span class="term-chev">&gt;</span> velloris<span class="term-ai">.ai</span></span>
        <span class="term-sep">—</span>
        <span class="term-path">~/strategy.engine</span>
      </div>

      <div class="cmd-line" id="cmdLine"><span class="cmd-chev">&gt;</span> <span class="cmd-text">init velloris --rebuild-org</span></div>

      <h1 class="hero-heading" id="heroHeading">
        <span class="hl-line" id="hlLine1">Re-Engineering</span>
        <span class="hl-line" id="hlLine2">the Organization</span>
        <span class="hl-line grad-text" id="hlLine3">for the Generative Era.</span><span class="hl-cursor" id="hlCursor"></span>
      </h1>

      <p class="hero-sub" id="heroSub">Strategy, structure, and clarity to lead your organization through AI.</p>

      <div class="hero-ctas" id="heroCtas">
        <a href="#contact" class="btn btn-primary btn-mono">Book a Discovery Call <span class="btn-arrow">&rarr;</span></a>
        <a href="#services" class="btn btn-outline btn-mono">See Our Services</a>
      </div>
    </div>
```

Note: the old elements `#heroBadge` (the pill) and the old `.line-wrap`/`.line-inner` headline structure are intentionally gone. The headline text is full real text in the DOM.

- [ ] **Step 2: Verify the page still loads with full headline text present**

```bash
curl -s http://localhost:8123/ | grep -o 'for the Generative Era.'
```

Expected: prints `for the Generative Era.` (proves headline is real DOM text, good for SEO/a11y).

- [ ] **Step 3: Screenshot current (unstyled) state to confirm no crash**

Drive with Playwright MCP: navigate to `http://localhost:8123/`, resize to 1440×900, screenshot, and Read the screenshot. Expected: page renders (will look unstyled/odd until Task 3 — that's fine). Check console: no JS errors except a possible favicon 404.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Replace hero markup with terminal bar + command-line structure"
```

---

## Task 3: Style the terminal bar and command line

**Files:**
- Modify: `styles.css` (hero block, around lines 364–392 where `.hero-badge` currently lives)

- [ ] **Step 1: Remove the old `.hero-badge` rules and add terminal-bar styles**

In `styles.css`, replace the `.hero-badge` … `@keyframes pulse { … }` block (lines 364–392) with:

```css
/* Terminal bar */
.term-bar {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  background: rgba(124,108,255,0.06);
  border: 1px solid rgba(124,108,255,0.25);
  border-radius: 8px;
  padding: 8px 14px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s var(--smooth), transform 0.6s var(--smooth);
}
.term-bar.visible { opacity: 1; transform: translateY(0); }
.term-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.term-dot--r { background: #ff5f56; }
.term-dot--y { background: #ffbd2e; }
.term-dot--g { background: #27c93f; }
.term-id { margin-left: 4px; }
.term-chev { color: var(--accent-2); font-weight: 700; }
.term-ai { color: #22D3EE; }
.term-sep { opacity: 0.4; }
.term-path { color: #22D3EE; }

/* Command line */
.cmd-line {
  font-family: var(--mono);
  font-size: clamp(13px, 1.3vw, 15px);
  color: rgba(255,255,255,0.5);
  margin-bottom: 22px;
  opacity: 0;
  transition: opacity 0.4s var(--smooth);
}
.cmd-line.visible { opacity: 1; }
.cmd-chev { color: var(--accent-2); font-weight: 700; }
.cmd-text { color: rgba(255,255,255,0.85); }
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:8123/` in Playwright (hard reload), screenshot, Read it. Expected: terminal bar pill with three colored dots and `> velloris.ai — ~/strategy.engine` in monospace appears near the top of the hero; command line text below it. (Typing animation not wired yet — text shows statically; that's fine.)

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Style hero terminal bar and command line"
```

---

## Task 4: Style the headline, cursor, comment subhead, and mono buttons

**Files:**
- Modify: `styles.css` (hero heading/sub/ctas block, lines ~394–436)

- [ ] **Step 1: Replace the heading + sub + ctas styles**

In `styles.css`, replace the `.hero-heading` … `.hero-ctas.visible { … }` block (lines 394–436) with:

```css
/* Hero heading */
.hero-heading {
  color: #fff;
  margin-bottom: 28px;
  font-size: clamp(44px, 7vw, 96px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 800;
}
.hl-line { display: block; }
/* During typing JS clips each line; default state is fully visible (reduced-motion / no-JS) */
.hl-cursor {
  display: inline-block;
  width: 0.55ch;
  height: 0.92em;
  background: #22D3EE;
  vertical-align: -0.12em;
  margin-left: 6px;
  box-shadow: 0 0 12px rgba(34,211,238,0.8);
  animation: heroCaret 1s steps(1) infinite;
}
@keyframes heroCaret { 50% { opacity: 0; } }

/* Hero subhead — code comment style */
.hero-sub {
  font-family: var(--mono);
  font-size: clamp(14px, 1.4vw, 17px);
  color: rgba(255,255,255,0.45);
  max-width: 560px;
  line-height: 1.7;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.7s var(--smooth), transform 0.7s var(--smooth);
}
.hero-sub::before { content: '// '; color: #22D3EE; }
.hero-sub.visible { opacity: 1; transform: translateY(0); }

/* Hero CTAs */
.hero-ctas {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 0;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.7s var(--smooth), transform 0.7s var(--smooth);
}
.hero-ctas.visible { opacity: 1; transform: translateY(0); }
.btn-mono { font-family: var(--mono); font-weight: 500; }
.btn-arrow { transition: transform 0.2s var(--ease); }
.btn-mono:hover .btn-arrow { transform: translateX(4px); }
```

- [ ] **Step 2: Verify in browser**

Reload in Playwright, screenshot, Read it. Expected: large Inter headline (last line gradient) with a glowing cyan caret after it, `// Strategy, structure…` monospace subhead, two monospace buttons. Note: subhead and CTAs have `opacity:0` and will be invisible until Task 5 wires the reveal — to confirm styling now, in Playwright run `browser_evaluate` with `() => { document.getElementById('heroSub').classList.add('visible'); document.getElementById('heroCtas').classList.add('visible'); }` then screenshot.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Style hero headline, cyan caret, comment subhead, mono buttons"
```

---

## Task 5: Add the engineering-grid background

**Files:**
- Modify: `index.html` (add grid div inside hero)
- Modify: `styles.css` (`.hero` block ~307, add `.hero-grid`)

- [ ] **Step 1: Add the grid element to the hero**

In `index.html`, immediately after `<canvas id="heroCanvas"></canvas>` (line 59), add:

```html
    <div class="hero-grid" aria-hidden="true"></div>
```

- [ ] **Step 2: Add grid styles**

In `styles.css`, after the `#heroCanvas { … }` rule (ends line 323), add:

```css
.hero-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image:
    linear-gradient(rgba(124,108,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,108,255,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask: radial-gradient(120% 100% at 25% 30%, #000 0%, transparent 75%);
          mask: radial-gradient(120% 100% at 25% 30%, #000 0%, transparent 75%);
}
```

Confirm `#heroCanvas` has no explicit `z-index` above 1 and `.hero-content` has `z-index:2` (it does, line 357) so content stays on top.

- [ ] **Step 3: Verify in browser**

Reload in Playwright, screenshot, Read it. Expected: a faint indigo engineering grid visible in the top-left region of the hero, fading out toward the lower-right; content and waves still on top.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add engineering-grid background to hero"
```

---

## Task 6: Retune the wave canvas (toned down, lower)

**Files:**
- Modify: `script.js` (`waves[]` array, lines 47–63)
- Modify: `styles.css` (`#heroCanvas` opacity, line 322)

- [ ] **Step 1: Lower the canvas opacity**

In `styles.css`, change the `#heroCanvas` `opacity: 1;` (line 322) to:

```css
  opacity: 0.55;
```

- [ ] **Step 2: Replace the `waves[]` array with a smaller, lower set**

In `script.js`, replace the entire `const waves = [ … ];` array (lines 47–63) with:

```javascript
  const waves = [
    { y:0.64, amp:34, freq:0.0060, spd:0.008, ph:0.5,  r:99,  g:102, b:241, a:0.16, w:1.3, blur:10, bc:[99,102,241]  },
    { y:0.68, amp:28, freq:0.0075, spd:0.010, ph:1.8,  r:168, g:85,  b:247, a:0.18, w:1.1, blur:10, bc:[168,85,247]  },
    { y:0.72, amp:26, freq:0.0065, spd:0.007, ph:3.1,  r:56,  g:189, b:248, a:0.14, w:1.0, blur:8,  bc:[56,189,248]  },
    { y:0.62, amp:22, freq:0.0090, spd:0.012, ph:0.2,  r:140, g:100, b:255, a:0.50, w:1.0, blur:8,  bc:[140,100,255] },
    { y:0.70, amp:20, freq:0.0085, spd:0.011, ph:3.7,  r:99,  g:102, b:241, a:0.45, w:1.0, blur:8,  bc:[99,102,241]  },
  ];
```

This preserves every property key the existing `drawWave()` reads (`y, amp, freq, spd, ph, r, g, b, a, w, blur, bc`), so no other code changes are needed. Waves now sit lower (`y` 0.62–0.72) and there are 5 instead of 15.

- [ ] **Step 3: Verify in browser**

Reload in Playwright. Move the cursor to confirm reactivity: run `browser_evaluate` with `() => { for(let i=0;i<30;i++) window.dispatchEvent(new MouseEvent('mousemove',{clientX:700+i*4,clientY:500})); }`, wait ~1s, screenshot, Read it. Expected: subtle glowing waves low in the hero that bend toward the cursor; they no longer dominate the upper content area. Console: no errors.

- [ ] **Step 4: Commit**

```bash
git add script.js styles.css
git commit -m "Tone down and lower hero wave canvas"
```

---

## Task 7: Wire the type-everything reveal sequence

**Files:**
- Modify: `script.js` (`revealHero()`, lines 352–367)
- Modify: `styles.css` (add `.hl-line` typing-clip styles)

- [ ] **Step 1: Add CSS for the typing clip**

The reveal works by clipping each headline line and the command to a JS-driven width *only while it is being typed*, while the text stays fully present in the DOM. Clipping is scoped to the `.typing` class so that at rest (and for no-JS / reduced-motion) the lines wrap normally. In `styles.css`, add (right after the `.hl-line { display:block; }` rule from Task 4):

```css
/* Clip only during the typing animation; at rest lines wrap normally. */
.hl-line.typing,
.cmd-text.typing {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: bottom;
}
```

Note: the `.typing` class is added/removed by JS (Task 7) around each element's reveal. The animation steps `width` in `ch` units to reveal characters left-to-right. After typing, JS removes both the inline width and the `.typing` class, so the element returns to natural block flow and responsive wrapping is preserved.

- [ ] **Step 2: Replace `revealHero()` with the typing sequence**

In `script.js`, replace the entire `revealHero()` function (lines 352–367) with:

```javascript
/* ---- 5. HERO TYPE-EVERYTHING REVEAL ---- */
function revealHero() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const termBar = document.getElementById('termBar');
  const cmdLine = document.getElementById('cmdLine');
  const cmdText = cmdLine?.querySelector('.cmd-text');
  const sub     = document.getElementById('heroSub');
  const ctas    = document.getElementById('heroCtas');
  const cursor  = document.getElementById('hlCursor');
  const lines   = [
    document.getElementById('hlLine1'),
    document.getElementById('hlLine2'),
    document.getElementById('hlLine3'),
  ].filter(Boolean);

  // Reduced motion / safety: show everything immediately, no typing.
  if (reduce) {
    termBar?.classList.add('visible');
    cmdLine?.classList.add('visible');
    sub?.classList.add('visible');
    ctas?.classList.add('visible');
    return;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Type by stepping inline width in ch units (text already in DOM).
  function typeWidth(el, text, speed) {
    return new Promise(resolve => {
      el.classList.add('typing');
      el.style.width = '0ch';
      let i = 0;
      (function step() {
        if (i <= text.length) {
          el.style.width = i + 'ch';
          i++;
          setTimeout(step, speed);
        } else {
          el.style.width = '';        // back to natural flow
          el.classList.remove('typing');
          resolve();
        }
      })();
    });
  }

  async function run() {
    cursor.style.opacity = '0';
    termBar?.classList.add('visible');
    await sleep(220);

    // Command
    cmdLine?.classList.add('visible');
    if (cmdText) await typeWidth(cmdText, cmdText.textContent, 38);
    await sleep(260);

    // Headline lines, cursor moves to the active line
    cursor.style.opacity = '1';
    for (const line of lines) {
      if (cursor.previousElementSibling !== line) {
        line.after(cursor);          // park cursor at end of current line
      }
      await typeWidth(line, line.textContent, 42);
    }
    await sleep(180);

    // Subhead + CTAs
    sub?.classList.add('visible');
    await sleep(160);
    ctas?.classList.add('visible');
  }
  run();
}
```

Note on the cursor: in the markup (Task 2) `#hlCursor` already follows `#hlLine3`. The loop re-parents it after each line as that line types, so the caret visually tracks the active line and ends after the gradient line. For `ch`-based width to align with the monospace command, `.cmd-text` is monospace (good). The headline is Inter (proportional), so `ch` stepping is an *approximation* of per-character reveal — it still reads as a left-to-right type-on, which is the intended effect. Accept this; do not switch the headline to monospace (spec decision).

- [ ] **Step 3: Verify the animated sequence**

Reload `http://localhost:8123/` in Playwright. Immediately screenshot (mid-animation) and Read it — expect partial text + caret. Then `browser_wait_for` 4 seconds, screenshot again, Read it — expect: terminal bar, full command, full 3-line headline, `//` subhead, and both CTAs all visible, caret blinking after the gradient line. Console: no errors.

- [ ] **Step 4: Verify reduced-motion fallback**

In Playwright, emulate reduced motion and reload:
- Run `browser_evaluate`: `() => matchMedia('(prefers-reduced-motion: reduce)').matches` after setting emulation. (If the MCP can't set the media feature, instead temporarily hard-code `const reduce = true;` to confirm, screenshot showing everything visible immediately with no typing, then revert.)

Expected: all hero content visible instantly, no typing animation, page fully readable.

- [ ] **Step 5: Commit**

```bash
git add script.js styles.css
git commit -m "Wire type-everything hero reveal with reduced-motion fallback"
```

---

## Task 8: Clean up dead CSS and fix mobile rules

**Files:**
- Modify: `styles.css` (remove `.hero-stats`/`.hstat-*` block 438–468; mobile refs 994–998, 1042–1045)

- [ ] **Step 1: Remove the dead hero-stats styles**

In `styles.css`, delete the entire block from `.hero-stats {` (line 438) through the `.hstat-sep { … }` rule (ends line 468). These have no matching markup (stats were removed from the hero previously) and the new hero has no stats. Do **not** delete the `@keyframes fadeIn` that follows (line 470) — it may be used elsewhere; verify with `grep -n "fadeIn" styles.css` and leave it if referenced.

- [ ] **Step 2: Fix the 768px mobile hero rules**

In `styles.css`, in the `@media (max-width: 768px)` block, replace these lines (994–998):

```css
  .hero-badge { margin-bottom: 22px; }
  .hero-sub { margin-bottom: 28px; }
  .hero-ctas { margin-bottom: 24px; }
  .hero-stats { gap: 20px; }
  .hstat-sep { display: none; }
```

with:

```css
  .term-bar { margin-bottom: 22px; }
  .hero-sub { margin-bottom: 28px; }
  .hero-ctas { margin-bottom: 0; }
  .cmd-line { font-size: 13px; }
```

- [ ] **Step 3: Fix the 480px mobile hero rules**

In `styles.css`, in the `@media (max-width: 480px)` block, replace this line (1045):

```css
  .hero-stats { flex-direction: row; flex-wrap: wrap; gap: 16px 28px; }
```

with:

```css
  .term-bar { font-size: 12px; flex-wrap: wrap; }
```

(The `.hero-ctas { flex-direction: column; … }` rule on line 1043 stays — it correctly stacks the buttons on narrow screens.)

- [ ] **Step 4: Verify no broken references and mobile layout**

```bash
grep -n "hero-stats\|hstat\|hero-badge" styles.css
```

Expected: no matches (all removed/renamed).

Then in Playwright: resize to 390×844 (mobile), reload `http://localhost:8123/`, wait 4s, screenshot, Read it. Expected: terminal bar wraps gracefully, headline clamps smaller, buttons stack full-width, no horizontal scroll. Resize back to 1440×900 and screenshot to confirm desktop still good.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "Remove dead hero-stats CSS and fix mobile hero rules"
```

---

## Task 9: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Desktop full check**

In Playwright: resize 1440×900, navigate to `http://localhost:8123/`, `browser_console_messages` level `error`. Expected: 0 errors (a favicon.ico 404 from a sub-resource is acceptable only if it's not present; the real favicon.svg should load). Wait 4s, screenshot, Read it. Expected: matches the approved Command Line direction — terminal bar, typed command, 3-line headline with gradient last line + cyan caret, `//` subhead, two mono CTAs, faint grid top-left, subtle low waves.

- [ ] **Step 2: Cursor reactivity check**

Run `browser_evaluate`: `() => { for(let i=0;i<40;i++) window.dispatchEvent(new MouseEvent('mousemove',{clientX:500+i*6,clientY:520})); }`, wait 1s, screenshot, Read it. Expected: waves bend toward cursor path.

- [ ] **Step 3: Tablet + mobile breakpoints**

Repeat navigate + 4s wait + screenshot at 768×1024 and 390×844. Expected: no horizontal scroll, content readable, buttons usable (≥44px tall — the `.btn` padding 14px×2 + text satisfies this).

- [ ] **Step 4: Confirm headline is real DOM text (SEO/a11y)**

```bash
curl -s http://localhost:8123/ | grep -o 'Re-Engineering' | head -1
curl -s http://localhost:8123/ | grep -o 'the Organization' | head -1
curl -s http://localhost:8123/ | grep -o 'for the Generative Era.' | head -1
```

Expected: all three print (headline fully present without JS).

- [ ] **Step 5: Clean up artifacts and confirm clean tree**

```bash
cd /Users/talsabag/repos/velloris-website
rm -rf .playwright-mcp
find . -maxdepth 1 -name 'page-*.png' -delete 2>/dev/null
git status --short
```

Expected: only intended changes committed; no stray screenshot files. `.superpowers/` and `.playwright-mcp/` are gitignored.

- [ ] **Step 6: Stop the dev server (optional)**

```bash
pkill -f "http.server 8123" 2>/dev/null; echo "stopped"
```

---

## Self-Review Notes

**Spec coverage:** Layout (T2), terminal bar (T3), command line (T3), headline+caret (T4), comment subhead (T4), mono CTAs (T4), engineering grid (T5), toned-down waves (T6), type-everything motion + reduced-motion fallback (T7), real-text-in-DOM a11y (T2/T9), JetBrains Mono dependency (T1), dead `.hero-stats` removal + mobile fixes (T8). All spec sections map to a task.

**Verification model:** No unit-test framework exists; per the spec, verification is browser-driven (serve + Playwright + screenshot + console). Steps reflect that rather than `pytest`-style TDD.

**Type/name consistency:** IDs (`termBar`, `cmdLine`, `heroSub`, `heroCtas`, `hlLine1/2/3`, `hlCursor`) are identical between the T2 markup and the T7 JS. The `typeWidth` helper, `.typing` class, and `.visible` class names are consistent across CSS and JS tasks. Wave object keys in T6 match those read by the existing `drawWave()`.
