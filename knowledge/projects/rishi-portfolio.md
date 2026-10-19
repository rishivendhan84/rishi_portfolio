---
title: This portfolio site
source: https://github.com/rishivendhan84/rishi_portfolio
---

# This portfolio site

## What it is

Rishi's portfolio, built to read instantly for recruiters while showing front-end craft. Live at https://rishi-portfolio-orcin.vercel.app. Besides the standard sections it has a Story Mode and a Game Mode.

## How it is built

- Vite for build tooling and code splitting; Three.js isolated in its own cached chunk.
- A GPU particle-terrain background in Three.js with custom GLSL shaders, simplex noise, a mouse ripple, and scroll-energy and page-progress reactivity. It pauses when the tab is hidden and degrades gracefully without WebGL.
- GSAP with ScrollTrigger for the preloader, hero intro, split-text reveals, animated counters and parallax; Lenis smooth scrolling synced with ScrollTrigger and the WebGL scene.
- Vanilla JS and modern CSS. Content lives in static HTML for SEO, no-JS resilience and a fast first paint, with JSON-LD Person schema and Open Graph / Twitter meta.
- Fully responsive with a dedicated mobile menu, honors prefers-reduced-motion, caps pixel ratio and reduces particle counts on mobile.
- Deployed on Vercel.
