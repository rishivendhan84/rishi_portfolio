# Rishi Vendhan K K — Portfolio

A motion-driven, Three.js-integrated portfolio for **Rishi Vendhan K K** — GenAI Architect & Full Stack Developer based in Chennai.

Design direction inspired by [motion.zajno.com](https://motion.zajno.com/): dark, typographic, WebGL-backed, with smooth scrolling and scroll-choreographed reveals.

## Tech stack

- **[Vite](https://vitejs.dev/)** — build tooling
- **[Three.js](https://threejs.org/)** — GPU particle wave background (custom GLSL shaders, simplex noise, mouse ripple, scroll-energy reactive)
- **[GSAP](https://gsap.com/) + ScrollTrigger** — preloader, hero intro, split-text reveals, counters, parallax
- **[Lenis](https://lenis.darkroom.engineering/)** — smooth scrolling, synced with ScrollTrigger and the WebGL scene
- Vanilla JS + modern CSS — zero framework overhead, fast first paint

## Features

- Animated preloader with counter
- Custom cursor with hover states (auto-disabled on touch devices)
- Velocity-reactive skills marquee
- Pointer-tracked glow cards
- Fully responsive, `prefers-reduced-motion` respected
- SEO meta + Open Graph tags

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploying to Vercel

The repo ships with a `vercel.json` — just import the repository in Vercel:

1. Go to [vercel.com/new](https://vercel.com/new) and import `rishi_portfolio`
2. Vercel auto-detects **Vite** (build: `npm run build`, output: `dist`)
3. Deploy — no environment variables required
