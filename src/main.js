import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Scene } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- WebGL scene (graceful fallback if WebGL unavailable) ---------- */
let scene = null;
try {
  scene = new Scene(document.getElementById('webgl'));
} catch (err) {
  console.warn('WebGL unavailable, continuing without 3D background.', err);
  document.getElementById('webgl').style.display = 'none';
}

/* ---------- Smooth scroll (Lenis) ---------- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !reduceMotion,
});

lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  if (scene) scene.setScrollVelocity(e.velocity);
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* anchor links through Lenis */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    }
  });
});

/* ---------- Custom cursor ---------- */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const pos = { x: -100, y: -100 };
  const dotPos = { x: -100, y: -100 };

  window.addEventListener('pointermove', (e) => {
    dotPos.x = e.clientX;
    dotPos.y = e.clientY;
    gsap.set(cursorDot, { x: dotPos.x, y: dotPos.y });
  });

  gsap.ticker.add(() => {
    pos.x += (dotPos.x - pos.x) * 0.12;
    pos.y += (dotPos.y - pos.y) * 0.12;
    gsap.set(cursor, { x: pos.x, y: pos.y });
  });

  document.querySelectorAll('a, button, [data-hover], [data-hover-card]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ---------- Card glow follows pointer ---------- */
document.querySelectorAll('.service').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

/* ---------- Text splitting (words) ---------- */
function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(/\s+/)
    .map(
      (w) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:top;" aria-hidden="true"><span style="display:inline-block;will-change:transform;" class="w">${w}</span></span>`
    )
    .join(' ');
  return el.querySelectorAll('.w');
}

/* ---------- Preloader + hero intro ---------- */
const preloader = document.getElementById('preloader');
const countEl = document.getElementById('preloader-count');

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(preloader, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' })
    .set(preloader, { display: 'none' })
    .from(
      '.hero__line-inner',
      { yPercent: 110, duration: 1.2, stagger: 0.12 },
      '-=0.45'
    )
    .to(
      '.hero__meta-item, .hero__tagline, .hero__scroll',
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
      '-=0.7'
    );
}

if (reduceMotion) {
  preloader.style.display = 'none';
  gsap.set('[data-fade], [data-reveal]', { opacity: 1 });
} else {
  gsap.set('.hero__meta-item, .hero__tagline, .hero__scroll', { opacity: 0, y: 24 });

  const counter = { value: 0 };
  gsap.to(counter, {
    value: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      countEl.textContent = Math.round(counter.value);
    },
    onComplete: heroIntro,
  });
}

/* ---------- Scroll animations ---------- */
if (!reduceMotion) {
  /* generic fades (outside hero — hero handled by intro) */
  document.querySelectorAll('[data-fade]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  /* card / row reveals */
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 56 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 90%' },
      }
    );
  });

  /* split-word titles */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 110,
      duration: 1,
      stagger: 0.06,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* split-line lead paragraphs */
  document.querySelectorAll('[data-split-lines]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: 0.015,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* stat counters */
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const end = parseInt(el.dataset.counter, 10);
    const obj = { value: 0 };
    gsap.to(obj, {
      value: end,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => {
        el.textContent = Math.round(obj.value);
      },
    });
  });

  /* contact big title */
  gsap.from('.contact__title .hero__line-inner', {
    yPercent: 110,
    duration: 1.2,
    stagger: 0.12,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 85%' },
  });

  /* hero parallax out on scroll */
  gsap.to('.hero__title', {
    yPercent: -18,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ---------- Marquee — velocity reactive ---------- */
const track = document.getElementById('marquee-track');
if (track && !reduceMotion) {
  let x = 0;
  let speed = 0.6;
  const groupWidth = () => track.scrollWidth / 2;

  lenis.on('scroll', (e) => {
    speed = 0.6 + Math.min(Math.abs(e.velocity) * 0.12, 4);
  });

  gsap.ticker.add(() => {
    speed += (0.6 - speed) * 0.04;
    x -= speed;
    const w = groupWidth();
    if (w > 0 && Math.abs(x) >= w) x += w;
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
}

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
