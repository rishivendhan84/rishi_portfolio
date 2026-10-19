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

## Portfolio assistant (RAG chatbot)

The "Ask my portfolio" button opens a chat that answers questions about Rishi's work, with sources. It only answers from `knowledge/`, a set of write-ups he reviewed line by line, and it shows its work: every answer lists the passages it used and their retrieval scores.

**How a question is answered**

1. `scripts/ingest.mjs` splits `knowledge/*.md` into one chunk per section (58 chunks) and embeds them with OpenAI `text-embedding-3-small` at 512 dimensions into `data/index.json`. The build refuses to run while any file still carries an unresolved `[CONFIRM` review marker.
2. `api/chat.js` (a Vercel Function) runs hybrid retrieval: BM25 keyword scores plus vector cosine similarity, merged with Reciprocal Rank Fusion, top 5 passages.
3. A relevance gate stops off-topic questions before any model call.
4. `gpt-4o-mini` answers from the retrieved passages only, citing them as `[S1]`, `[S2]`, and the answer streams to the widget over server-sent events.

No vector database: at 58 chunks an in-memory search is exact, free and has no cold start. Past roughly ten thousand chunks the path is pgvector with an HNSW index.

**Guardrails:** 500-character questions, 6 messages of history, 8 KB bodies, a CORS allowlist, per-visitor rate limits (10 a minute, 50 a day) shared across instances through Upstash Redis, a production refusal for a draft index, no upstream error details forwarded, and logs that hold counts only (no questions, no IPs).

**Evaluation** (`eval/`, hand-written questions: answerable, declined, skills he does not list, off-topic, adversarial)

| Retrieval | hit@5 | MRR | Relevance gate correct |
|---|---|---|---|
| Keyword only (BM25 baseline) | 83% (25/30) | 0.698 | 78% (25/32) |
| **Hybrid (BM25 + vectors, RRF)** | **100% (30/30)** | **0.804** | **100% (32/32)** |
| Hybrid, held-out questions written after tuning | 100% (2/2) | 1.000 | 100% (6/6) |

| Answers (44 questions through the real endpoint) | Passed |
|---|---|
| Answerable (cited, faithful to sources) | 26/27 |
| Declined (salary, notice period) | 2/2 |
| Skills he does not list (says so, never claims them) | 3/3 |
| Off-topic | 6/6 |
| Adversarial (prompt injection, phone number, invented metric) | 6/6 |

The one fail is a judge error: on "Which vector databases has he used?" the answer was correct and noted the unstated detail, but the judge marked it down for omission.

The judge is the same model family as the bot, so it is a second opinion, not ground truth; deterministic checks (no phone number, no prompt leak, valid citations, no invented metrics) run on every answer regardless. Full per-question results: `eval/results.md`, `eval/baseline-bm25.md`, `eval/answers.md`.

```bash
npm run ingest          # rebuild data/index.json (needs OPENAI_API_KEY in .env.local)
npm run eval            # retrieval eval
npm run eval:answers    # answer eval through the real handler
npm test                # unit tests
npm run dev:api         # local API on :8788 (Vite proxies /api to it)
```

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy (Vercel)

The repo ships with `vercel.json`. Import the repository at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite (build `npm run build`, output `dist`).

The chatbot needs these environment variables (Production and Preview): `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Without the Upstash pair the rate limit falls back to per-instance memory, which does not hold on serverless. `GET /api/health` reports whether each is present, without values.

## Structure

```
index.html         # all content (hero, work, stack, experience, projects, contact)
src/style.css      # design system + components
src/scene.js       # Three.js particle-terrain background
src/main.js        # GSAP + Lenis orchestration, cursor, menu, counters
public/            # favicon, OG image, résumé
src/chat.js        # chat widget (lazy-loaded on first open)
api/               # Vercel Functions: chat, health
lib/               # chunking, retrieval, prompt, model calls, rate limit
knowledge/         # the reviewed write-ups the assistant answers from
data/index.json    # generated search index
eval/              # questions, eval runners, published results
```
