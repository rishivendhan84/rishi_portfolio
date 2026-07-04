import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Scene } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.remove('no-js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- WebGL scene (graceful fallback) ---------- */
let scene = null;
try {
  scene = new Scene(document.getElementById('webgl'));
} catch (err) {
  console.warn('WebGL unavailable — continuing without 3D background.', err);
  const c = document.getElementById('webgl');
  if (c) c.style.display = 'none';
}

/* ---------- Smooth scroll ---------- */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !reduceMotion,
});

lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  if (scene) {
    scene.setScrollVelocity(e.velocity);
    scene.setProgress(e.scroll / (e.limit || 1));
  }
});

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* anchor links via Lenis */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      closeMenu();
      lenis.scrollTo(target, { offset: 0 });
    }
  });
});

/* ---------- Custom cursor ---------- */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursor) {
  const pos = { x: -100, y: -100 };
  const dot = { x: -100, y: -100 };
  window.addEventListener('pointermove', (e) => {
    dot.x = e.clientX;
    dot.y = e.clientY;
    gsap.set(cursorDot, { x: dot.x, y: dot.y });
  });
  gsap.ticker.add(() => {
    pos.x += (dot.x - pos.x) * 0.15;
    pos.y += (dot.y - pos.y) * 0.15;
    gsap.set(cursor, { x: pos.x, y: pos.y });
  });
  document.querySelectorAll('a, button, [data-hover], [data-hover-card]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ---------- Card glow follows pointer ---------- */
document.querySelectorAll('[data-hover-card]').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ---------- Header behaviour ---------- */
const header = document.getElementById('header');
let lastScroll = 0;
lenis.on('scroll', ({ scroll }) => {
  header.classList.toggle('is-scrolled', scroll > 40);
  if (scroll > lastScroll && scroll > 400) header.classList.add('is-hidden');
  else header.classList.remove('is-hidden');
  lastScroll = scroll;
});

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
function openMenu() {
  menuBtn.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  menuBtn.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
}
function closeMenu() {
  menuBtn.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}
menuBtn?.addEventListener('click', () => {
  if (menuBtn.classList.contains('is-open')) closeMenu();
  else openMenu();
});

/* ---------- Split helpers ---------- */
function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="split-line" aria-hidden="true"><span>${w}</span></span>`)
    .join(' ');
  return el.querySelectorAll('.split-line > span');
}

/* ---------- Preloader + hero intro ---------- */
const preloader = document.getElementById('preloader');
const countEl = document.getElementById('preloader-count');
const fillEl = document.getElementById('preloader-fill');

function revealHero() {
  scene?.playIntro();
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(preloader, { yPercent: -100, duration: 1, ease: 'power3.inOut' })
    .set(preloader, { display: 'none' })
    .from('.hero .hero__line-inner', { yPercent: 115, duration: 1.2, stagger: 0.12 }, '-=0.5')
    .to('.hero__top [data-fade], .hero__tagline, .hero__actions, .hero__scroll',
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=0.75');
}

if (reduceMotion) {
  preloader.style.display = 'none';
  gsap.set('[data-fade], [data-reveal]', { opacity: 1 });
} else {
  gsap.set('.hero__top [data-fade], .hero__tagline, .hero__actions, .hero__scroll',
    { opacity: 0, y: 26 });
  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate: () => {
      const val = Math.round(counter.v);
      countEl.textContent = val;
      fillEl.style.width = `${val}%`;
    },
    onComplete: revealHero,
  });
}

/* ---------- Scroll-triggered animations ---------- */
if (!reduceMotion) {
  document.querySelectorAll('[data-fade]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(el, { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, { yPercent: 115, duration: 1, stagger: 0.05, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  document.querySelectorAll('[data-split-lines]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, { yPercent: 115, opacity: 0, duration: 0.85, stagger: 0.012,
      ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* contact title */
  gsap.from('.contact__title .hero__line-inner', {
    yPercent: 115, duration: 1.15, stagger: 0.12, ease: 'power4.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 85%' },
  });

  /* hero parallax out */
  gsap.to('.hero__title', {
    yPercent: -14, opacity: 0.2, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ---------- Counters ---------- */
document.querySelectorAll('[data-counter]').forEach((el) => {
  const end = parseFloat(el.dataset.counter);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  const fmt = (n) => {
    const v = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-US');
    return v + suffix;
  };
  if (reduceMotion) { el.textContent = fmt(end); return; }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: end, duration: 1.8, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 92%' },
    onUpdate: () => { el.textContent = fmt(obj.v); },
  });
});

/* ---------- Metrics marquee (velocity reactive) ---------- */
const track = document.getElementById('metrics-track');
if (track && !reduceMotion) {
  let x = 0;
  let speed = 0.5;
  const groupWidth = () => track.scrollWidth / 2;
  lenis.on('scroll', (e) => {
    speed = 0.5 + Math.min(Math.abs(e.velocity) * 0.1, 3.5);
  });
  gsap.ticker.add(() => {
    speed += (0.5 - speed) * 0.04;
    x -= speed;
    const w = groupWidth();
    if (w > 0 && Math.abs(x) >= w) x += w;
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
}

/* ---------- Game mode (lazy-loaded, leaves the site untouched) ---------- */
let activeGame = null;
let gameLoading = false;

async function launchGame() {
  if (activeGame || gameLoading) return;
  gameLoading = true;
  document.querySelectorAll('[data-game-launch]').forEach((b) => b.classList.add('is-loading'));
  try {
    const { PortfolioGame } = await import('./game.js');
    closeMenu();
    lenis.stop();
    if (scene) scene.running = false;
    document.body.classList.add('is-game');
    activeGame = new PortfolioGame({
      onExit: () => {
        activeGame = null;
        document.body.classList.remove('is-game');
        lenis.start();
        if (scene) scene.running = true;
      },
    });
  } catch (err) {
    console.error('Game mode failed to start.', err);
  } finally {
    gameLoading = false;
    document.querySelectorAll('[data-game-launch]').forEach((b) => b.classList.remove('is-loading'));
  }
}

document.querySelectorAll('[data-game-launch]').forEach((btn) => {
  btn.addEventListener('click', launchGame);
});

/* ---------- Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* refresh triggers once fonts/layout settle */
window.addEventListener('load', () => ScrollTrigger.refresh());
