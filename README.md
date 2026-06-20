# Rishi Vendhan K K — Portfolio

A premium, motion-driven portfolio for **Rishi Vendhan K K** — Full Stack Engineer (GenAI / RAG) based in Chennai. Built to read instantly for recruiters while showcasing senior front-end craft: a WebGL background, smooth scrolling, and tightly choreographed GSAP motion.

🔗 **Live:** [rishi-portfolio-orcin.vercel.app](https://rishi-portfolio-orcin.vercel.app)

## Tech stack

- **[Vite](https://vitejs.dev/)** — build tooling, code-splitting
- **[Three.js](https://threejs.org/)** — GPU particle-terrain background (custom GLSL shaders, simplex noise, mouse ripple, scroll-energy + page-progress reactive). Pauses when the tab is hidden; degrades gracefully with no WebGL.
- **[GSAP](https://gsap.com/) + ScrollTrigger** — preloader, hero intro, split-text reveals, animated counters, parallax
- **[Lenis](https://lenis.darkroom.engineering/)** — smooth scrolling synced with ScrollTrigger and the WebGL scene
- Vanilla JS + modern CSS — content lives in static HTML for SEO / no-JS resilience and a fast first paint

## Highlights

- Static, crawlable content + JSON-LD `Person` schema, Open Graph / Twitter meta
- Animated preloader, custom cursor, velocity-reactive metrics marquee, pointer-tracked glow cards
- Fully responsive with a dedicated mobile menu; honours `prefers-reduced-motion`
- Performance-minded: Three.js isolated into its own cached chunk, capped pixel ratio, reduced particle counts on mobile, RAF paused when hidden
- Résumé available as a direct download

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy (Vercel)

The repo ships with `vercel.json`. Import the repository at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite (build `npm run build`, output `dist`). No environment variables required.

## Structure

```
index.html         # all content (hero, work, stack, experience, projects, contact)
src/style.css      # design system + components
src/scene.js       # Three.js particle-terrain background
src/main.js        # GSAP + Lenis orchestration, cursor, menu, counters
public/            # favicon, OG image, résumé
```
