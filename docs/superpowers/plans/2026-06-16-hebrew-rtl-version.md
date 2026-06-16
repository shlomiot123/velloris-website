# Hebrew RTL Version Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Hebrew, right-to-left version of the Velloris site (`index.he.html`) that reuses the existing CSS/JS, plus one RTL override stylesheet and a language switcher between the two versions.

**Architecture:** A new standalone `index.he.html` at the repo root clones the structure of `index.html` with Hebrew copy and `dir="rtl"`. It loads `styles.css` unchanged, then a new `rtl.css` that mirrors the handful of physical-direction CSS rules that don't auto-flip, and switches the body font to Heebo. The terminal/command-line/logo elements are forced `dir="ltr"`. `index.html` gets a `עב` switcher link and reciprocal `hreflang` tags.

**Tech Stack:** Static HTML, CSS, vanilla JS. Google Fonts (Heebo). No build step. Deployed as static files via Render.

**Note on testing:** This is a static site with no test framework. "Verification" steps mean loading the page in a browser and checking the listed visual criteria. The executor may use the Playwright MCP tools (`browser_navigate`, `browser_take_screenshot`, `browser_snapshot`) against a local `python3 -m http.server` for automated checks, or open the file manually.

**Domain assumption:** `hreflang` tags use `https://velloris.ai/` as the canonical origin (matches the brand/logo). If the production domain differs, update the four absolute URLs in Task 2 and Task 3 accordingly.

---

### Task 1: Create `rtl.css` (RTL overrides)

**Files:**
- Create: `rtl.css`

- [ ] **Step 1: Create `rtl.css` with the full content below**

These overrides mirror the physical-direction rules found in `styles.css` at:
`.scroll-bar` (186), `.hl-cursor` (443), `.btn-mono:hover .btn-arrow` (478),
`.team-quote` (818–820), `.why-item::before` (711), `.process-step` padding (626),
`.process-step::before` (680–684), and the mobile block (1130–1175). Everything
else (fl/grid) mirrors automatically under `dir="rtl"`.

```css
/* ============================================================
   VELLORIS — RTL OVERRIDES (Hebrew page only)
   Loaded after styles.css. All rules scoped to [dir="rtl"].
   ============================================================ */

/* Hebrew body font (Heebo); JetBrains Mono kept for terminal/code */
[dir="rtl"] body {
  font-family: 'Heebo', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Keep the terminal bar, command line, and logos visually LTR */
[dir="rtl"] .term-bar,
[dir="rtl"] .cmd-line,
[dir="rtl"] .nav-logo {
  direction: ltr;
}

/* Scroll progress bar grows from the right edge */
[dir="rtl"] .scroll-bar { left: auto; right: 0; }

/* Headline cursor sits at the logical end (left side in RTL) */
[dir="rtl"] .hl-cursor { margin-left: 0; margin-right: 6px; }

/* CTA arrow nudges toward the left (forward direction in RTL) on hover */
[dir="rtl"] .btn-mono:hover .btn-arrow { transform: translateX(-4px); }

/* Team quote accent border flips to the right */
[dir="rtl"] .team-quote {
  border-left: none;
  border-right: 2px solid var(--accent);
  padding-left: 0;
  padding-right: 20px;
}

/* "Why" item accent dash flips to the right edge (desktop) */
[dir="rtl"] .why-item::before { left: auto; right: 20px; }

/* Process desktop: inter-column padding + hover underline mirrored */
[dir="rtl"] .process-step { padding: 0 0 0 28px; }
[dir="rtl"] .process-step::before {
  left: 14px;
  right: -14px;
  transform-origin: right;
}

@media (max-width: 768px) {
  /* Services accordion: text alignment + content indent flip */
  [dir="rtl"] .macc-trigger { text-align: right; }
  [dir="rtl"] .macc-body { padding: 0 48px 0 0; }
  [dir="rtl"] .macc-item.open .macc-body { padding: 0 48px 16px 0; }

  /* Process vertical timeline: rail + number to the right */
  [dir="rtl"] .process-track { padding-left: 0; padding-right: 46px; }
  [dir="rtl"] .process-track::before { left: auto; right: 14px; }
  [dir="rtl"] .step-num { left: auto; right: -40px; }

  /* "Why" statement cards: accent border + big watermark number flip */
  [dir="rtl"] .why-item { border-left: none; border-right: 3px solid transparent; }
  [dir="rtl"] .why-item:nth-child(1) { border-right-color: #8b5cf6; }
  [dir="rtl"] .why-item:nth-child(2) { border-right-color: #22d3ee; }
  [dir="rtl"] .why-item:nth-child(3) { border-right-color: #3b82f6; }
  [dir="rtl"] .why-item:nth-child(4) { border-right-color: #0ea5e9; }
  [dir="rtl"] .why-num { right: auto; left: -6px; }

  /* Stacked "who we help" card exits to the left */
  [dir="rtl"] .sstack-card.sstack-exit {
    transform: translateX(-115%) rotate(-9deg) !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add rtl.css
git commit -m "Add RTL override stylesheet for Hebrew page"
```

---

### Task 2: Create `index.he.html` (Hebrew RTL page)

**Files:**
- Create: `index.he.html`

- [ ] **Step 1: Create `index.he.html` with the full content below**

This is a structural clone of `index.html` with: `lang="he" dir="rtl"`, Heebo font
link added, `rtl.css` linked after `styles.css`, `hreflang` alternates, an `EN`
switcher link (nav + mobile), Hebrew copy throughout, `dir="ltr"` on the
terminal/command-line, `←` arrows, and a Hebrew copy of the inline stacked-cards
`DATA` script. Brand/company names (Velloris, Yad2, etc.), job titles (CTO, VP R&D,
R&D Director), LinkedIn, the email, and all code/terminal text stay in Latin script.

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Velloris — אסטרטגיית AI וטרנספורמציה</title>
  <meta name="description" content="Velloris מסייעת לצוותי הנהלה לבנות את האסטרטגיה והבהירות הנדרשות כדי להוביל את המעבר ל-AI. ייעוץ אסטרטגי תחילה עבור הנהלה בכירה ומחלקות R&D." />
  <link rel="alternate" hreflang="en" href="https://velloris.ai/" />
  <link rel="alternate" hreflang="he" href="https://velloris.ai/index.he.html" />
  <link rel="alternate" hreflang="x-default" href="https://velloris.ai/" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="rtl.css" />
</head>
<body>

  <!-- Scroll Progress -->
  <div class="scroll-bar" id="scrollBar"></div>

  <!-- NAV -->
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="#" class="nav-logo">
        <svg width="256" height="50" viewBox="0 0 256 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text font-family="'Courier New', Courier, monospace" font-size="30" font-weight="700">
            <tspan x="4" y="36" fill="#8B5CF6">&gt; </tspan><tspan fill="#FFFFFF">velloris</tspan><tspan fill="#22D3EE">.ai</tspan>
          </text>
        </svg>
      </a>

      <ul class="nav-links" id="navLinks">
        <li><a href="#about" class="nav-link">אודות</a></li>
        <li><a href="#serve" class="nav-link">למי אנחנו עוזרים</a></li>
        <li><a href="#services" class="nav-link">שירותים</a></li>
        <li><a href="#process" class="nav-link">התהליך</a></li>
        <li><a href="#team" class="nav-link">מאחורי Velloris</a></li>
        <li><a href="index.html" class="nav-link nav-lang" dir="ltr">EN</a></li>
        <li><a href="#contact" class="nav-link nav-cta">דברו איתנו</a></li>
      </ul>

      <button class="hamburger" id="hamburger" aria-label="פתיחת תפריט">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu" id="mobileMenu">
      <ul>
        <li><a href="#about" class="mobile-link">אודות</a></li>
        <li><a href="#serve" class="mobile-link">למי אנחנו עוזרים</a></li>
        <li><a href="#services" class="mobile-link">שירותים</a></li>
        <li><a href="#process" class="mobile-link">התהליך</a></li>
        <li><a href="#team" class="mobile-link">מאחורי Velloris</a></li>
        <li><a href="index.html" class="mobile-link" dir="ltr">EN</a></li>
        <li><a href="#contact" class="mobile-link mobile-link--cta">דברו איתנו</a></li>
      </ul>
    </div>
  </nav>

  <!-- ===== HERO ===== -->
  <section class="hero" id="hero">

    <canvas id="heroCanvas"></canvas>

    <div class="hero-grid" aria-hidden="true"></div>

    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>

    <div class="hero-content">
      <div class="term-bar" id="termBar" dir="ltr">
        <span class="term-dot term-dot--r"></span>
        <span class="term-dot term-dot--y"></span>
        <span class="term-dot term-dot--g"></span>
        <span class="term-id"><span class="term-chev">&gt;</span> velloris<span class="term-ai">.ai</span></span>
        <span class="term-sep">—</span>
        <span class="term-path">~/strategy.engine</span>
      </div>

      <div class="cmd-line" id="cmdLine" dir="ltr"><span class="cmd-chev">&gt;</span> <span class="cmd-text">init velloris --rebuild-org</span></div>

      <h1 class="hero-heading" id="heroHeading">
        <span class="hl-line" id="hlLine1">מהנדסים מחדש</span>
        <span class="hl-line" id="hlLine2">את הארגון</span>
        <span class="hl-line grad-text" id="hlLine3">לעידן הגנרטיבי.</span><span class="hl-cursor" id="hlCursor"></span>
      </h1>

      <p class="hero-sub" id="heroSub">אסטרטגיה, מבנה ובהירות שיובילו את הארגון שלכם דרך עידן ה-AI.</p>

      <div class="hero-ctas" id="heroCtas">
        <a href="#contact" class="btn btn-primary btn-mono">לתיאום שיחת היכרות <span class="btn-arrow">&larr;</span></a>
        <a href="#services" class="btn btn-outline btn-mono">לשירותים שלנו</a>
      </div>
    </div>

  </section>

  <!-- ===== ABOUT ===== -->
  <section class="about section" id="about">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="section-label reveal" style="--label-color:#8B5CF6">אודות</div>
      <div class="about-grid">
        <div class="about-left">
          <h2 class="reveal-text">אנחנו לא <span class="grad-text">מייעצים.</span><br/>אנחנו מובילים שינוי.</h2>
          <p class="reveal">Velloris הוקמה על ידי אנשי מקצוע שהובילו תוכניות AI בתוך חברות טכנולוגיה מהירות-קצב. חווינו על בשרנו את הכאוס שבאיזון בין שאיפות ה-AI לבין דדליינים הנדסיים, מפות דרך של מוצר וחוב נתונים.</p>
          <p class="reveal">אנחנו לא מגישים לכם מצגת אסטרטגיה ונעלמים. אנחנו עובדים לצד ההנהלה והצוותים שלכם כדי לבנות אסטרטגיה שהאנשים שלכם יוכלו להוביל, ליישם ולפתח — הרבה אחרי שההתקשרות איתנו מסתיימת.</p>
        </div>
        <div class="about-right reveal">
          <div class="about-quote-block">
            <div class="about-quote-mark">"</div>
            <p class="about-quote-text">נבנה עבור הצוותים שעושים את העבודה האמיתית</p>
            <span class="about-quote-sub">טרנספורמציית AI לא מתרחשת רק ברמת ההנהלה הבכירה. היא קורית בתוך מחלקות ה-R&D וההנדסה שלכם. שם אנחנו מתמקדים.</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== WHO WE SERVE ===== -->
  <section class="serve section" id="serve">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="section-label reveal" style="--label-color:#22D3EE">למי אנחנו עוזרים</div>
      <h2 class="section-heading reveal-text">נבנה עבור האנשים<br/>שמקבלים את <span class="grad-text">ההחלטות</span></h2>
      <div class="serve-grid">
        <div class="serve-card reveal-up">
          <div class="serve-num">01</div>
          <h3>סטארטאפים</h3>
          <p>נעים מהר וצריכים לעשות את ההימורים הנכונים על AI מוקדם, בלי לבזבז מסלול על כלים או ניסויים לא נכונים.</p>
          <div class="serve-line"></div>
        </div>
        <div class="serve-card reveal-up" style="--delay:0.12s">
          <div class="serve-num">02</div>
          <h3>חברות בגודל בינוני</h3>
          <p>צוותים בצמיחה שזקוקים לאסטרטגיית AI ברורה לפני שהמורכבות מקשה על שינוי כיוון.</p>
          <div class="serve-line"></div>
        </div>
        <div class="serve-card reveal-up" style="--delay:0.24s">
          <div class="serve-num">03</div>
          <h3>ארגוני אנטרפרייז</h3>
          <p>ארגונים גדולים שמנווטים בין יישור פנימי, ממשל והאתגר שבתנועה מהירה בקנה מידה גדול.</p>
          <div class="serve-line"></div>
        </div>
      </div>

      <!-- MOBILE ONLY: stacked tap cards -->
      <div class="serve-mobile-tabs">
        <div class="sstack-cards" id="sstack">
          <div class="sstack-card sstack-front" onclick="advanceSstack()">
            <div class="sstack-top">
              <div class="sstack-num">01</div>
              <div class="sstack-badge">סטארטאפים</div>
            </div>
            <div>
              <h3>סטארטאפים</h3>
              <p>נעים מהר וצריכים לעשות את ההימורים הנכונים על AI מוקדם, בלי לבזבז מסלול על כלים או ניסויים לא נכונים.</p>
            </div>
          </div>
          <div class="sstack-card sstack-mid">
            <div class="sstack-top">
              <div class="sstack-num">02</div>
              <div class="sstack-badge sstack-badge--cyan">בינוני</div>
            </div>
            <div>
              <h3>חברות בגודל בינוני</h3>
              <p>צוותים בצמיחה שזקוקים לאסטרטגיית AI ברורה לפני שהמורכבות מקשה על שינוי כיוון.</p>
            </div>
          </div>
          <div class="sstack-card sstack-back">
            <div class="sstack-top">
              <div class="sstack-num">03</div>
              <div class="sstack-badge sstack-badge--blue">אנטרפרייז</div>
            </div>
            <div>
              <h3>ארגוני אנטרפרייז</h3>
              <p>ארגונים גדולים שמנווטים בין יישור פנימי, ממשל והאתגר שבתנועה מהירה בקנה מידה גדול.</p>
            </div>
          </div>
        </div>
        <div class="sstack-hint">הקישו כדי להמשיך</div>
        <div class="sstack-dots">
          <div class="sstack-dot active" id="ssdot0"></div>
          <div class="sstack-dot" id="ssdot1"></div>
          <div class="sstack-dot" id="ssdot2"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- wave divider: light → dark -->
  <div class="wave-sep wave-sep--to-dark" aria-hidden="true">
    <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sepg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#6366f1" stop-opacity="0"/>
          <stop offset="20%"  stop-color="#6366f1" stop-opacity="0.35"/>
          <stop offset="55%"  stop-color="#a855f7" stop-opacity="0.4"/>
          <stop offset="80%"  stop-color="#38bdf8" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="sepg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#a855f7" stop-opacity="0"/>
          <stop offset="30%"  stop-color="#38bdf8" stop-opacity="0.2"/>
          <stop offset="70%"  stop-color="#6366f1" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path fill="none" stroke="url(#sepg1)" stroke-width="1.2">
        <animate attributeName="d" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M0,32 C240,20 480,44 720,32 C960,20 1200,44 1440,32;M0,32 C240,44 480,20 720,32 C960,44 1200,20 1440,32;M0,32 C240,20 480,44 720,32 C960,20 1200,44 1440,32"/>
      </path>
      <path fill="none" stroke="url(#sepg2)" stroke-width="0.8">
        <animate attributeName="d" dur="13s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M0,38 C320,26 640,50 960,36 C1120,30 1320,46 1440,38;M0,38 C320,50 640,26 960,40 C1120,50 1320,28 1440,38;M0,38 C320,26 640,50 960,36 C1120,30 1320,46 1440,38"/>
      </path>
    </svg>
  </div>

  <!-- ===== SERVICES ===== -->
  <section class="services section dark-section" id="services">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="section-label reveal" style="--label-color:#3B82F6">שירותים</div>
      <h2 class="section-heading reveal-text">כל מה שצריך<br/>כדי <span class="grad-text">להוביל AI</span></h2>
      <p class="section-sub reveal">ייעוץ אסטרטגי מקצה לקצה — מהאבחון הראשוני ועד ליווי ארוך-טווח.</p>
      <div class="svc-grid">

        <div class="svc-card reveal-up">
          <div class="svc-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3>אבחון מוכנות ל-AI</h3>
          <p>אבחון מעמיק של המקום שבו הארגון שלכם נמצא היום: פערי אסטרטגיה, כלים, תהליכים ומוכנות הצוות. תקבלו תמונה ברורה של היכן אתם נמצאים ומה צריך להשתנות.</p>
        </div>

        <div class="svc-card reveal-up" style="--delay:0.06s">
          <div class="svc-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3>אסטרטגיית AI ומפת דרכים</h3>
          <p>כיוון ברור, יוזמות מתועדפות ותוכנית רב-רבעונית עם אבני דרך ומדדי KPI מדידים — כך שההנהלה יודעת בדיוק לאן הארגון הולך ואיך להגיע לשם.</p>
        </div>

        <div class="svc-card reveal-up" style="--delay:0.12s">
          <div class="svc-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 8v3m0 3v.01M8 11h3m3 0h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <h3>גילוי ותעדוף תרחישי שימוש</h3>
          <p>מפגשים מובנים לחשיפת הזדמנויות AI בעלות ערך גבוה לרוחב העסק, ודירוגן לפי ROI, היתכנות והתאמה אסטרטגית. מצאו את ההימורים הנכונים לפני שאתם מקצים משאבים.</p>
        </div>

        <div class="svc-card reveal-up" style="--delay:0.18s">
          <div class="svc-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <h3>העצמת הארגון</h3>
          <p>תוכניות אוריינות AI להנהלה, הגדרת תפקידים לצוותים AI-native ומסגרת לניהול שינוי שבונה תרבות שמוכנה להוביל AI — לא רק לאמץ אותו.</p>
        </div>

        <div class="svc-card reveal-up" style="--delay:0.24s">
          <div class="svc-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3>ייעוץ ספקים וטכנולוגיה</h3>
          <p>ייעוץ עצמאי וניטרלי לספקים בבחירת מודלים, הערכת פלטפורמות והחלטות build-vs-buy — כדי שתשקיעו בכלים הנכונים להקשר הספציפי שלכם, לא בספק הרועש ביותר.</p>
        </div>

        <div class="svc-card reveal-up" style="--delay:0.30s">
          <div class="svc-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3>ממשל וניהול סיכוני AI</h3>
          <p>מדיניות, מסגרות אחריותיות וניהול סיכונים כדי שהארגון שלכם ינוע מהר — ובאחריות. כולל שימוש בנתונים, עמידה ברגולציה וסיכון תפעולי.</p>
        </div>

      </div>

      <!-- MOBILE ONLY: accordion -->
      <div class="svc-mobile-acc">
        <div class="macc-item" onclick="macc(this)">
          <button class="macc-trigger">
            <div class="macc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>אבחון מוכנות ל-AI</h3>
            <svg class="macc-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="macc-body"><p>אבחון מעמיק של המקום שבו הארגון שלכם נמצא היום: פערי אסטרטגיה, כלים, תהליכים ומוכנות הצוות. תקבלו תמונה ברורה של היכן אתם נמצאים ומה צריך להשתנות.</p></div>
        </div>
        <div class="macc-item" onclick="macc(this)">
          <button class="macc-trigger">
            <div class="macc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>אסטרטגיית AI ומפת דרכים</h3>
            <svg class="macc-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="macc-body"><p>כיוון ברור, יוזמות מתועדפות ותוכנית רב-רבעונית עם אבני דרך ומדדי KPI מדידים — כך שההנהלה יודעת בדיוק לאן הארגון הולך ואיך להגיע לשם.</p></div>
        </div>
        <div class="macc-item" onclick="macc(this)">
          <button class="macc-trigger">
            <div class="macc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 8v3m0 3v.01M8 11h3m3 0h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
            <h3>גילוי ותעדוף תרחישי שימוש</h3>
            <svg class="macc-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="macc-body"><p>מפגשים מובנים לחשיפת הזדמנויות AI בעלות ערך גבוה לרוחב העסק, ודירוגן לפי ROI, היתכנות והתאמה אסטרטגית. מצאו את ההימורים הנכונים לפני שאתם מקצים משאבים.</p></div>
        </div>
        <div class="macc-item" onclick="macc(this)">
          <button class="macc-trigger">
            <div class="macc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
            <h3>העצמת הארגון</h3>
            <svg class="macc-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="macc-body"><p>תוכניות אוריינות AI להנהלה, הגדרת תפקידים לצוותים AI-native ומסגרת לניהול שינוי שבונה תרבות שמוכנה להוביל AI — לא רק לאמץ אותו.</p></div>
        </div>
        <div class="macc-item" onclick="macc(this)">
          <button class="macc-trigger">
            <div class="macc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>ייעוץ ספקים וטכנולוגיה</h3>
            <svg class="macc-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="macc-body"><p>ייעוץ עצמאי וניטרלי לספקים בבחירת מודלים, הערכת פלטפורמות והחלטות build-vs-buy — כדי שתשקיעו בכלים הנכונים להקשר הספציפי שלכם, לא בספק הרועש ביותר.</p></div>
        </div>
        <div class="macc-item" onclick="macc(this)">
          <button class="macc-trigger">
            <div class="macc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3>ממשל וניהול סיכוני AI</h3>
            <svg class="macc-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="macc-body"><p>מדיניות, מסגרות אחריותיות וניהול סיכונים כדי שהארגון שלכם ינוע מהר — ובאחריות. כולל שימוש בנתונים, עמידה ברגולציה וסיכון תפעולי.</p></div>
        </div>
      </div>

    </div>
  </section>

  <!-- ===== PROCESS ===== -->
  <section class="process section" id="process">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="section-label reveal" style="--label-color:#7C3AED">התהליך שלנו</div>
      <h2 class="section-heading reveal-text">מאבחון<br/>ועד <span class="grad-text">ליווי מתמשך</span></h2>
      <div class="process-track">
        <div class="process-step reveal-up">
          <div class="step-num">01</div>
          <div class="step-body">
            <h3>אבחון</h3>
            <p>מתחילים בהבנת העסק שלכם, הצוות שלכם והמקום שבו אתם נמצאים היום. בלי הנחות, בלי תבניות — אבחון אמיתי.</p>
          </div>
        </div>
        <div class="process-step reveal-up" style="--delay:0.1s">
          <div class="step-num">02</div>
          <div class="step-body">
            <h3>יישור</h3>
            <p>עובדים עם ההנהלה כדי להגדיר את היעד: אסטרטגיה, מטרות, מדדי KPI והמבנה הארגוני הדרוש כדי להגיע לשם.</p>
          </div>
        </div>
        <div class="process-step reveal-up" style="--delay:0.2s">
          <div class="step-num">03</div>
          <div class="step-body">
            <h3>תכנון</h3>
            <p>בונים מפת דרכים קונקרטית — יוזמות מתועדפות, אבני דרך, דרישות משאבים ומסגרת ממשל.</p>
          </div>
        </div>
        <div class="process-step reveal-up" style="--delay:0.3s">
          <div class="step-num">04</div>
          <div class="step-body">
            <h3>ליווי</h3>
            <p>נשארים לצד צוות ההנהלה שלכם כשהביצוע מתחיל — בוחנים החלטות, מכווננים את הכיוון ומוודאים שהאסטרטגיה נשארת על המסלול.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== WHY VELLORIS ===== -->
  <section class="why section" id="why">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="section-label reveal" style="--label-color:#0EA5E9">למה Velloris</div>
      <h2 class="section-heading reveal-text">מה עושה אותנו<br/><span class="grad-text">שונים</span></h2>
      <div class="why-grid">
        <div class="why-item reveal-up">
          <div class="why-num">01</div>
          <h3>אסטרטגיה תחילה, תמיד</h3>
          <p>אנחנו לא מוכרים כלים, לא מטמיעים תוכנה ולא לוקחים עמלות מספקים. התוצר היחיד שלנו הוא חשיבה בהירה ואסטרטגיה ישימה.</p>
        </div>
        <div class="why-item reveal-up" style="--delay:0.1s">
          <div class="why-num">02</div>
          <h3>נבנה עבור ההנהלה</h3>
          <p>רוב יועצי ה-AI מדברים עם מהנדסים. אנחנו מדברים בשפת העסקים — ROI, סיכון, מבנה ארגוני ומיצוב תחרותי.</p>
        </div>
        <div class="why-item reveal-up" style="--delay:0.15s">
          <div class="why-num">03</div>
          <h3>מומחיות ממוקדת</h3>
          <p>אנחנו עוסקים אך ורק בטרנספורמציית AI. לא בטרנספורמציה דיגיטלית רחבה, לא בייעוץ IT — זה כל מה שאנחנו עושים.</p>
        </div>
        <div class="why-item reveal-up" style="--delay:0.2s">
          <div class="why-num">04</div>
          <h3>עצמאיים ואובייקטיביים</h3>
          <p>ההמלצות שלנו מונעות אך ורק ממה שנכון לארגון שלכם.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- wave divider: light → dark -->
  <div class="wave-sep wave-sep--to-dark" aria-hidden="true">
    <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sepg3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#6366f1" stop-opacity="0"/>
          <stop offset="25%"  stop-color="#a855f7" stop-opacity="0.3"/>
          <stop offset="60%"  stop-color="#38bdf8" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="sepg4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#38bdf8" stop-opacity="0"/>
          <stop offset="35%"  stop-color="#6366f1" stop-opacity="0.2"/>
          <stop offset="75%"  stop-color="#a855f7" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path fill="none" stroke="url(#sepg3)" stroke-width="1.2">
        <animate attributeName="d" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M0,28 C200,16 500,42 800,28 C1050,18 1280,40 1440,28;M0,28 C200,40 500,16 800,30 C1050,42 1280,18 1440,28;M0,28 C200,16 500,42 800,28 C1050,18 1280,40 1440,28"/>
      </path>
      <path fill="none" stroke="url(#sepg4)" stroke-width="0.8">
        <animate attributeName="d" dur="16s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M0,40 C360,28 720,52 1080,38 C1240,32 1380,46 1440,40;M0,40 C360,52 720,28 1080,42 C1240,52 1380,30 1440,40;M0,40 C360,28 720,52 1080,38 C1240,32 1380,46 1440,40"/>
      </path>
    </svg>
  </div>

  <!-- ===== TEAM ===== -->
  <section class="team section dark-section" id="team">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="section-label reveal" style="--label-color:#6366F1">מאחורי Velloris</div>
      <div class="team-grid">
        <div class="team-photo-col reveal-up">
          <div class="team-photo-wrap">
            <img src="assets/shlomi.jpg" alt="שלומי אוטמזגין — מייסד, Velloris" />
            <div class="team-photo-glow"></div>
          </div>
          <a href="https://www.linkedin.com/in/shlomiot/" target="_blank" rel="noopener noreferrer" class="linkedin-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            התחברו ב-LinkedIn
          </a>
        </div>
        <div class="team-bio">
          <h2 class="reveal-text">שלומי אוטמזגין<br/><span class="grad-text">מייסד, Velloris</span></h2>
          <p class="reveal">עם מעל 20 שנות ניסיון בהובלת ארגוני R&D — מסטארטאפים בתחילת דרכם ועד ארגוני אנטרפרייז גלובליים — שלומי פעל בכל רמה של מערך ההנדסה והמוצר.</p>
          <p class="reveal">כ-CTO של Yad2, הוא בנה והרחיב מאפס ארגון של מעל 100 מהנדסים, היה חלוץ בתהליכי עבודה AI-native באמצעות הטמעת סוכנים אוטונומיים ו-Copilots לאורך כל ה-SDLC, ומילא תפקיד מכריע ברכישת החברה בסך 950 מיליון יורו על ידי Apax Partners.</p>
          <div class="team-career reveal">
            <div class="career-item">
              <span class="career-co">Yad2</span>
              <span class="career-role" dir="ltr">CTO · 2019–2026</span>
            </div>
            <div class="career-item">
              <span class="career-co">G Medical Innovations</span>
              <span class="career-role" dir="ltr">VP R&D · 2017–2018</span>
            </div>
            <div class="career-item">
              <span class="career-co">Colmobil</span>
              <span class="career-role" dir="ltr">R&D Director · 2014–2017</span>
            </div>
            <div class="career-item">
              <span class="career-co">Umoove</span>
              <span class="career-role" dir="ltr">VP R&D · 2012–2014</span>
            </div>
          </div>
          <blockquote class="team-quote reveal">
            "Velloris הוקמה מתוך אמונה אחת: החברות שינצחו במעבר ל-AI לא יהיו אלה עם הכי הרבה כלים — אלא אלה עם האסטרטגיה הברורה ביותר."
          </blockquote>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CONTACT ===== -->
  <section class="contact section dark-section" id="contact">
    <canvas class="section-wave"></canvas>
    <div class="container">
      <div class="contact-inner">
        <div class="contact-text">
          <div class="section-label reveal" style="--label-color:#A78BFA">צור קשר</div>
          <h2 class="reveal-text">מוכנים לבנות את<br/><span class="grad-text">אסטרטגיית ה-AI שלכם?</span></h2>
          <p class="reveal">מוכנים לדבר? בואו נתחיל.</p>
        </div>
        <form class="contact-form reveal-up" id="contactForm" novalidate>
          <div class="form-row">
            <div class="form-field">
              <label for="fname">שם</label>
              <input type="text" id="fname" name="name" placeholder="השם שלכם" autocomplete="name" required />
            </div>
            <div class="form-field">
              <label for="femail">אימייל בעבודה</label>
              <input type="email" id="femail" name="email" placeholder="you@company.com" autocomplete="email" dir="ltr" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label for="fcompany">חברה</label>
              <input type="text" id="fcompany" name="company" placeholder="שם החברה" autocomplete="organization" />
            </div>
            <div class="form-field">
              <label for="frole">תפקיד</label>
              <input type="text" id="frole" name="role" placeholder="התפקיד שלכם" />
            </div>
          </div>
          <div class="form-field">
            <label for="fmessage">הודעה</label>
            <textarea id="fmessage" name="message" placeholder="ספרו לנו על מה אתם עובדים..." rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="formSubmit">
            <span class="btn-text">שליחת הודעה</span>
            <span class="btn-arrow">←</span>
          </button>
          <div class="form-success" id="formSuccess">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ההודעה נשלחה. נחזור אליכם בקרוב.
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- ===== FOOTER ===== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="#" class="nav-logo">
            <svg width="230" height="44" viewBox="0 0 256 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text font-family="'Courier New', Courier, monospace" font-size="30" font-weight="700">
                <tspan x="4" y="36" fill="#8B5CF6">&gt; </tspan><tspan fill="#FFFFFF">velloris</tspan><tspan fill="#22D3EE">.ai</tspan>
              </text>
            </svg>
          </a>
          <p>מהנדסים ארגונים מחדש<br/>לעידן הגנרטיבי.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>חברה</h4>
            <a href="#about">אודות</a>
            <a href="#team">מאחורי Velloris</a>
            <a href="#contact">צור קשר</a>
          </div>
          <div class="footer-col">
            <h4>שירותים</h4>
            <a href="#services">אסטרטגיית AI</a>
            <a href="#services">ממשל וסיכונים</a>
            <a href="#services">גילוי תרחישי שימוש</a>
          </div>
          <div class="footer-col">
            <h4>התחברו</h4>
            <a href="https://www.linkedin.com/in/shlomiot/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="mailto:shlomiot@gmail.com">shlomiot@gmail.com</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Velloris. כל הזכויות שמורות.</span>
        <a href="https://www.linkedin.com/in/shlomiot/" target="_blank" rel="noopener" class="footer-li">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
  <script>
    // stacked cards — who we help (Hebrew)
    (function(){
      const DATA = [
        { num:'01', badge:'סטארטאפים', badgeMod:'',              title:'סטארטאפים',           body:'נעים מהר וצריכים לעשות את ההימורים הנכונים על AI מוקדם, בלי לבזבז מסלול על כלים או ניסויים לא נכונים.' },
        { num:'02', badge:'בינוני',    badgeMod:'sstack-badge--cyan', title:'חברות בגודל בינוני', body:'צוותים בצמיחה שזקוקים לאסטרטגיית AI ברורה לפני שהמורכבות מקשה על שינוי כיוון.' },
        { num:'03', badge:'אנטרפרייז', badgeMod:'sstack-badge--blue', title:'ארגוני אנטרפרייז',    body:'ארגונים גדולים שמנווטים בין יישור פנימי, ממשל והאתגר שבתנועה מהירה בקנה מידה גדול.' }
      ];
      let top = 0; // index of card currently on top

      function cardHTML(d) {
        return `<div class="sstack-top"><div class="sstack-num">${d.num}</div><div class="sstack-badge ${d.badgeMod}">${d.badge}</div></div><div><h3>${d.title}</h3><p>${d.body}</p></div>`;
      }

      function updateDots() {
        document.querySelectorAll('.sstack-dot').forEach((d,i) => d.classList.toggle('active', i===top));
      }

      function advanceSstack() {
        const cards = document.querySelectorAll('.sstack-card');
        const front = cards[0];

        // animate exit
        front.classList.add('sstack-exit');
        front.style.cursor = 'default';

        setTimeout(function(){
          // move to bottom of DOM (z-index lowest), reset
          front.classList.remove('sstack-exit', 'sstack-front');
          front.style.cssText = '';
          front.classList.add('sstack-back');
          front.onclick = null;
          document.getElementById('sstack').appendChild(front);

          // re-assign classes to all 3 in new order
          const updated = document.querySelectorAll('.sstack-card');
          updated[0].classList.remove('sstack-mid','sstack-back'); updated[0].classList.add('sstack-front'); updated[0].onclick = advanceSstack; updated[0].style.cssText = '';
          updated[1].classList.remove('sstack-front','sstack-back'); updated[1].classList.add('sstack-mid'); updated[1].style.cssText = '';
          updated[2].classList.remove('sstack-front','sstack-mid'); updated[2].classList.add('sstack-back'); updated[2].style.cssText = '';

          top = (top + 1) % 3;
          updateDots();
        }, 380);
      }

      window.advanceSstack = advanceSstack;
      updateDots();
    })();

    function macc(item) { item.classList.toggle('open'); }
  </script>
</body>
</html>
```

> Note: the inline `DATA`/`cardHTML` script is intentionally duplicated from `index.html` with Hebrew strings — it's page-specific content, not shared logic. `script.js` (shared) contains no hardcoded copy and needs no change.

- [ ] **Step 2: Verify the page loads and renders RTL**

Run a local server from the repo root and open the page:

```bash
python3 -m http.server 8123
```

Open `http://localhost:8123/index.he.html`. Confirm:
- The page direction is RTL (text starts from the right; nav logo is on the right, links flow leftward).
- Hebrew text renders in Heebo (rounded geometric sans), not a serif fallback.
- The terminal bar (`> velloris.ai — ~/strategy.engine`) and command line render LTR and correctly ordered.
- The hero headline types in and the cyan cursor lands at the left end of the last line.
- No raw `&larr;`/entity text shows; the CTA shows a `←` arrow.

- [ ] **Step 3: Commit**

```bash
git add index.he.html
git commit -m "Add Hebrew RTL version of the site"
```

---

### Task 3: Add language switcher + hreflang to the English page

**Files:**
- Modify: `index.html` (head: after line 7; nav list: line 36; mobile list: line 51)

- [ ] **Step 1: Add `hreflang` alternates to the English `<head>`**

In `index.html`, immediately after the `<meta name="description" ...>` line (line 7),
add:

```html
  <link rel="alternate" hreflang="en" href="https://velloris.ai/" />
  <link rel="alternate" hreflang="he" href="https://velloris.ai/index.he.html" />
  <link rel="alternate" hreflang="x-default" href="https://velloris.ai/" />
```

- [ ] **Step 2: Add the `עב` switcher to the desktop nav**

In `index.html`, in `<ul class="nav-links" id="navLinks">`, add a new `<li>` directly
before the `Get in Touch` CTA list item (currently line 36):

```html
        <li><a href="index.he.html" class="nav-link nav-lang">עב</a></li>
```

So the list reads: About, Who We Help, Services, Process, Behind Velloris, **עב**, Get in Touch.

- [ ] **Step 3: Add the `עב` switcher to the mobile menu**

In `index.html`, in `<div class="mobile-menu" id="mobileMenu">`'s `<ul>`, add a new
`<li>` directly before the `Get in Touch` mobile link (currently line 51):

```html
        <li><a href="index.he.html" class="mobile-link">עב</a></li>
```

- [ ] **Step 4: Verify the English page**

With the server from Task 2 still running, open `http://localhost:8123/index.html`.
Confirm:
- The page is unchanged except for a new `עב` link in the nav (and mobile menu).
- Clicking `עב` navigates to `index.he.html`.
- On the Hebrew page, clicking `EN` navigates back to `index.html`.
- View source on each page shows three reciprocal `hreflang` link tags.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add Hebrew language switcher and hreflang alternates to English page"
```

---

### Task 4: Full RTL verification pass

**Files:** none (verification + any fixes uncovered)

- [ ] **Step 1: Desktop visual sweep**

With `python3 -m http.server 8123` running, open `http://localhost:8123/index.he.html`
at a desktop width (≥1024px) and scroll through every section. Confirm each mirrors
cleanly:
- **Nav:** logo right, links leftward, CTA at far left, active-link underline correct.
- **Hero:** terminal/command LTR; headline + subhead RTL; `←` CTA arrow nudges left on hover.
- **About:** two-column grid mirrored (text right, quote block left); quote-mark and text RTL.
- **Who We Help:** three cards in mirrored order (01 on the right).
- **Services:** six-card grid; icons sit on the right of each card's start.
- **Process:** horizontal track; the inter-column gap and hover underline are on the correct side; the connecting rail spans symmetrically.
- **Why:** `::before` accent dash sits at the top-right of each item.
- **Team:** photo column / bio mirrored; the `team-quote` accent border is on the **right** with right padding; career roles (CTO, VP R&D) render LTR and readable.
- **Contact:** text/form grid mirrored; the email field shows its placeholder LTR; submit button `←` arrow.
- **Footer:** brand + columns mirrored.

Fix any rule that didn't mirror by adding a scoped `[dir="rtl"]` override to `rtl.css`.

- [ ] **Step 2: Mobile visual sweep**

Resize to ≤768px (or use Playwright `browser_resize` to 390×844). Confirm:
- Hamburger menu opens; the `עב`/`EN` link is present and works.
- **Who We Help** stacked cards: tapping advances; the exiting card slides off to the **left**.
- **Services** accordion: triggers are right-aligned; expanding indents the body on the right; chevron rotates.
- **Process** vertical timeline: the rail and number circles are on the **right**, text indented from the right.
- **Why** statement cards: the colored accent border is on the **right**; the big watermark number sits at the top-left.

Fix any issue with a scoped override in `rtl.css`.

- [ ] **Step 3: Contact form submission**

On `index.he.html`, fill the form and submit. Confirm the request posts to web3forms
and the Hebrew success message ("ההודעה נשלחה. נחזור אליכם בקרוב.") appears.

- [ ] **Step 4: Commit any fixes**

If Steps 1–3 required `rtl.css` changes:

```bash
git add rtl.css
git commit -m "Polish RTL overrides from verification pass"
```

If no fixes were needed, note that verification passed with no changes and skip the commit.

---

## Self-Review Notes

- **Spec coverage:** architecture (Task 2 file + Task 1 css), RTL document/typography/terminal/arrows (Task 1 + Task 2 markup), content translation with Latin proper nouns (Task 2), mobile JS DATA copy (Task 2 inline script), form email LTR + web3forms key reuse (Task 2), switcher + hreflang (Task 2 + Task 3), verification (Task 4) — all present.
- **Decision recorded:** the founder's personal name is rendered in Hebrew (שלומי אוטמזגין, per user) on the Hebrew page, while the brand (Velloris) and job titles (CTO, VP R&D) stay Latin.
- **Naming consistency:** switcher uses `index.html` ↔ `index.he.html` throughout; the new `nav-lang` class is additive (styled by existing `.nav-link`); `rtl.css` selectors all match real classes verified against `styles.css`.
