/* ============================================================
   AGENTGRID — JAVASCRIPT
   ============================================================ */

'use strict';

/* ---- 1. HERO WAVE ANIMATION ---- */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0, fadeIn = 0;
  let mx = -9999, my = -9999, smx = -9999, smy = -9999;
  let mouseStrength = 0, mouseIdleFrames = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height;
    smx = W / 2; smy = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    mouseIdleFrames = 0;
  });

  const waves = [
    { y:0.50, amp:60, freq:0.0030, spd:0.003, ph:0.0,  r:99,  g:102, b:241, a:0.08, w:40,  blur:60, bc:[80,60,220]   },
    { y:0.52, amp:50, freq:0.0025, spd:0.002, ph:1.2,  r:168, g:85,  b:247, a:0.06, w:35,  blur:55, bc:[140,50,200]  },
    { y:0.44, amp:34, freq:0.0060, spd:0.008, ph:0.5,  r:99,  g:102, b:241, a:0.18, w:8,   blur:22, bc:[99,102,241]  },
    { y:0.47, amp:28, freq:0.0075, spd:0.010, ph:1.8,  r:168, g:85,  b:247, a:0.22, w:7,   blur:20, bc:[168,85,247]  },
    { y:0.53, amp:26, freq:0.0065, spd:0.007, ph:3.1,  r:56,  g:189, b:248, a:0.16, w:6,   blur:18, bc:[56,189,248]  },
    { y:0.57, amp:32, freq:0.0055, spd:0.009, ph:4.4,  r:59,  g:130, b:246, a:0.18, w:7,   blur:20, bc:[59,130,246]  },
    { y:0.43, amp:30, freq:0.0080, spd:0.012, ph:0.2,  r:140, g:100, b:255, a:0.70, w:1.5, blur:8,  bc:[140,100,255] },
    { y:0.46, amp:24, freq:0.0095, spd:0.009, ph:2.3,  r:168, g:85,  b:247, a:0.80, w:1.2, blur:6,  bc:[168,85,247]  },
    { y:0.50, amp:20, freq:0.0070, spd:0.014, ph:1.1,  r:56,  g:189, b:248, a:0.65, w:1.0, blur:7,  bc:[56,189,248]  },
    { y:0.54, amp:26, freq:0.0085, spd:0.011, ph:3.7,  r:99,  g:102, b:241, a:0.75, w:1.3, blur:8,  bc:[99,102,241]  },
    { y:0.58, amp:22, freq:0.0060, spd:0.008, ph:5.0,  r:59,  g:130, b:246, a:0.60, w:1.0, blur:6,  bc:[59,130,246]  },
    { y:0.48, amp:22, freq:0.0100, spd:0.016, ph:0.8,  r:200, g:150, b:255, a:0.90, w:1.0, blur:12, bc:[200,150,255] },
    { y:0.52, amp:18, freq:0.0090, spd:0.013, ph:2.9,  r:100, g:200, b:255, a:0.85, w:0.9, blur:10, bc:[100,200,255] },
    { y:0.38, amp:45, freq:0.0040, spd:0.004, ph:0.6,  r:80,  g:60,  b:200, a:0.05, w:50,  blur:70, bc:[60,40,180]   },
    { y:0.62, amp:40, freq:0.0035, spd:0.003, ph:2.0,  r:120, g:40,  b:180, a:0.05, w:45,  blur:65, bc:[100,30,160]  },
  ];

  const SIGMA = 240, PULL = 0.22, S2 = 2 * SIGMA * SIGMA;

  function drawWave(wv, alpha, ms) {
    ctx.save();
    ctx.shadowColor = `rgb(${wv.bc[0]},${wv.bc[1]},${wv.bc[2]})`;
    ctx.shadowBlur  = wv.blur;
    const a    = wv.a * alpha;
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0.00, `rgba(${wv.r},${wv.g},${wv.b},0)`);
    grad.addColorStop(0.08, `rgba(${wv.r},${wv.g},${wv.b},${a})`);
    grad.addColorStop(0.92, `rgba(${wv.r},${wv.g},${wv.b},${a})`);
    grad.addColorStop(1.00, `rgba(${wv.r},${wv.g},${wv.b},0)`);
    ctx.beginPath();
    const baseY  = H * wv.y;
    const breath = 1 + 0.12 * Math.sin(t * 0.004 + wv.ph * 0.7);
    const amp    = wv.amp * breath;
    for (let x = 0; x <= W; x += 2) {
      const waveY = baseY + Math.sin(wv.freq * x + wv.ph + t * wv.spd) * amp;
      const dx    = x - smx;
      const bell  = ms * Math.exp(-(dx * dx) / S2);
      const y     = waveY + (smy - waveY) * bell * PULL;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth   = wv.w;
    ctx.stroke();
    ctx.restore();
  }

  function drawBg(alpha) {
    const cx = W * 0.5, cy = H * 0.5, r = Math.min(W, H) * 0.55;
    const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0,   `rgba(80,50,200,${0.10 * alpha})`);
    g.addColorStop(0.5, `rgba(60,30,160,${0.06 * alpha})`);
    g.addColorStop(1,   `rgba(5,5,16,0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawAura(ms) {
    if (smx < 0 || ms < 0.01) return;
    const g = ctx.createRadialGradient(smx, smy, 0, smx, smy, 180);
    g.addColorStop(0,   `rgba(168,85,247,${0.13 * ms})`);
    g.addColorStop(0.4, `rgba(99,102,241,${0.07 * ms})`);
    g.addColorStop(1,   `rgba(99,102,241,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(smx, smy, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    fadeIn = Math.min(1, t / 120);
    smx += (mx - smx) * 0.06;
    smy += (my - smy) * 0.06;
    mouseIdleFrames++;
    mouseStrength = mouseIdleFrames > 120
      ? Math.max(0, mouseStrength - 0.02)
      : Math.min(1, mouseStrength + 0.04);
    drawBg(fadeIn);
    drawAura(mouseStrength * fadeIn);
    for (const wv of waves) drawWave(wv, fadeIn, mouseStrength);
    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- 2. SCROLL PROGRESS BAR ---- */
const scrollBar = document.getElementById('scrollBar');

function updateScrollBar() {
  const doc = document.documentElement;
  const progress = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
  scrollBar.style.width = Math.min(progress, 100) + '%';
}

/* ---- 3. NAV SCROLL STATE ---- */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
}

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - var_navH() - 60;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

function var_navH() { return 80; }

/* ---- 4. HERO PARTICLE CANVAS (disabled) ---- */
class ParticleCanvas {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.stars   = [];
    this.W = this.H = this.cx = this.cy = 0;

    const STAR_COLORS = [
      [255,255,255],[255,255,255],[255,255,255],
      [200,220,255],[180,210,255],[140,190,255],[200,170,255],[56,189,248],
    ];
    this.STAR_COUNT = 180;
    this.SPEED      = 0.4;
    this.FOV        = 300;
    this.COLORS     = STAR_COLORS;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  makeStar() {
    const col = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    return {
      x:    (Math.random() - 0.5) * this.W * 2,
      y:    (Math.random() - 0.5) * this.H * 2,
      z:    Math.random() * this.W,
      pz:   0,
      col,
      size: 0.4 + Math.random() * 1.2,
    };
  }

  resize() {
    this.W  = this.canvas.width  = window.innerWidth;
    this.H  = this.canvas.height = window.innerHeight;
    this.cx = this.W / 2;
    this.cy = this.H / 2;
    this.stars = Array.from({ length: this.STAR_COUNT }, () => {
      const s = this.makeStar();
      s.pz = s.z;
      return s;
    });
  }

  animate() {
    const { ctx, W, H, cx, cy, stars, FOV, SPEED } = this;

    ctx.fillStyle = 'rgba(5,5,16,0.25)';
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      s.pz = s.z;
      s.z -= SPEED;
      if (s.z <= 1) { Object.assign(s, this.makeStar()); s.z = W; s.pz = W; return; }

      const sx = (s.x / s.z) * FOV + cx;
      const sy = (s.y / s.z) * FOV + cy;
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) return;

      const px    = (s.x / s.pz) * FOV + cx;
      const py    = (s.y / s.pz) * FOV + cy;
      const depth = 1 - s.z / W;
      const alpha = Math.min(1, depth * 1.4 + 0.05);
      const r     = Math.max(0.15, depth * s.size * 2.2);
      const [cr, cg, cb] = s.col;

      const trailLen = Math.hypot(sx - px, sy - py);
      if (trailLen > 0.5) {
        const grad = ctx.createLinearGradient(px, py, sx, sy);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${alpha * 0.6})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = r * 0.8;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
      ctx.fill();

      if (depth > 0.7 && r > 1) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.25})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(sx, sy, r * 5, 0, Math.PI * 2); ctx.fill();
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

/* ---- 5. HERO TEXT REVEAL ---- */
function revealHero() {
  // Badge
  setTimeout(() => document.getElementById('heroBadge')?.classList.add('visible'), 100);

  // Lines
  const lines = document.querySelectorAll('.hero-heading .line-inner');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), 250 + i * 180);
  });

  // Rest
  setTimeout(() => document.getElementById('heroSub')?.classList.add('visible'), 820);
  setTimeout(() => document.getElementById('heroCtas')?.classList.add('visible'), 1020);
  setTimeout(() => document.getElementById('heroStats')?.classList.add('visible'), 1220);
}

/* ---- 6. INTERSECTION OBSERVER — SCROLL REVEALS ---- */
function initReveal() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal, .reveal-up, .reveal-text').forEach(el => {
    observer.observe(el);
  });
}

/* ---- 7. COUNTER ANIMATION ---- */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.count');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ---- 8. MOBILE MENU ---- */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) closeMenu();
  });
}

/* ---- 9. SERVICE CARD — MOUSE GLOW ---- */
function initSvcGlow() {
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ---- 10. CONTACT FORM ---- */
function initForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('formSubmit');
  const success = document.getElementById('formSuccess');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending...';

    const data = new FormData(form);
    data.append('access_key', '358ed785-0ccc-4750-b47e-5d5a5c6bea48');
    data.append('subject',    'New contact from Velloris');
    data.append('from_name',  'Velloris Website');

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        body:    data,
      });
      const json = await res.json();

      if (json.success) {
        form.reset();
        btn.style.display = 'none';
        success.classList.add('show');
      } else {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Try Again';
      }
    } catch {
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Try Again';
    }
  });
}

/* ---- 11. SMOOTH SCROLL ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - var_navH() + 4;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---- SCROLL HANDLER ---- */
let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollBar();
      updateNav();
      updateActiveLink();
      ticking = false;
    });
    ticking = true;
  }
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  revealHero();
  initReveal();
  initCounters();
  initMobileMenu();
  initSvcGlow();
  initForm();
  initSmoothScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
  updateNav();
  updateScrollBar();
});
