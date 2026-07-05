/* =========================================================================
   GAME MODE — "THE PATHWAY", an interactive story
   A narrative journey through the portfolio. The camera flies you between
   chapters along a neon pathway; each chapter is told as a story with
   hands-on interactive moments built from the real content. No reflexes
   required — read, click, explore. Lazy-loaded; the site stays untouched.
   ========================================================================= */
import * as THREE from 'three';
import './game.css';

const ACCENT = 0x6ee7ff;
const ACCENT2 = 0x8a7dff;
const BG = 0x06060a;

/* ======================= THE STORY ======================= */
const CHAPTERS = [
  {
    key: 'origin', label: 'Prologue', title: 'Origin',
    kicker: 'Prologue · 2017 — 2021 · Chennai', u: 0.07, scene: 'origin',
  },
  {
    key: 'minsway', label: 'Ch. 01', title: 'First Contact',
    kicker: 'Chapter 01 · Dec 2021 — May 2025 · Minsway Solutions', u: 0.21, scene: 'minsway',
  },
  {
    key: 'factory', label: 'Ch. 02', title: 'The Paper Factory',
    kicker: 'Chapter 02 · May 2025 — Present · Different Hair Pvt. Ltd', u: 0.35, scene: 'factory',
  },
  {
    key: 'ai', label: 'Ch. 03', title: 'The Machines Learn',
    kicker: 'Chapter 03 · The GenAI arc · Different Hair & CX Analytix', u: 0.50, scene: 'ai',
  },
  {
    key: 'labs', label: 'Ch. 04', title: 'Side Quests',
    kicker: 'Chapter 04 · Nights & weekends', u: 0.65, scene: 'labs',
  },
  {
    key: 'stack', label: 'Ch. 05', title: 'The Arsenal',
    kicker: 'Chapter 05 · The toolkit behind every chapter', u: 0.79, scene: 'stack',
  },
  {
    key: 'epilogue', label: 'Epilogue', title: 'Your Move',
    kicker: 'Epilogue · Chennai, India · Open to work', u: 0.92, scene: 'epilogue',
  },
];

// Chapter 03 lets the reader choose the order they meet the AI systems.
const AGENT_BEATS = {
  rag: {
    text: 'Meet the <b>production RAG chatbot</b> — deployed as a live widget, grounded in complex internal data with vector search and LangChain. It fields <b>30–150 real user questions a day</b>. Don’t take my word for it — interview it yourself.',
    widget: 'chat',
    tags: ['RAG', 'Vector DBs', 'LangChain', 'Python'],
  },
  content: {
    text: 'Next, the <b>multi-platform content agent</b>: an autonomous multi-agent system. One prompt goes in — complete daily social posts come out. Images, copy, captions, hashtags, tailored separately for <b>8 platforms</b>. Try sending one.',
    widget: 'platforms',
    tags: ['LangChain', 'LangGraph', 'n8n', 'Multi-agent'],
  },
  seo: {
    text: 'And the quiet one: an <b>SEO analytics agent</b> that reads Google Search Console and GA4, then writes and delivers the weekly SEO / AEO / GEO reports on its own. A 15-hour weekly chore, automated down to 30 minutes.',
    widget: 'seo',
    tags: ['Python', 'n8n', 'GA4', 'Search Console'],
  },
};

function buildScript() {
  return [
    // ---- Prologue: Origin ----
    { ch: 0, text: 'Every builder has an origin story. This one starts with <b>machines</b>.' },
    {
      ch: 0,
      text: 'Easwari Engineering College, SRM Group, Chennai. A degree in <b>Mechanical Engineering</b> — gears, torque, tolerances. Four years learning how physical systems fit together.',
    },
    {
      ch: 0,
      text: 'But the machines that pulled him in weren’t made of steel. They were made of <b>code</b> — systems you could architect at midnight and ship to real users by morning. So he crossed over. He never went back.',
    },

    // ---- Chapter 01: Minsway ----
    {
      ch: 1,
      text: 'December 2021. Rishi joins <b>Minsway Solutions</b> as a Software Engineer — and meets <b>Monad</b>, a B2B wholesale platform serving businesses across Saudi Arabia. React dashboards, Node.js APIs, real money moving through them.',
    },
    {
      ch: 1,
      text: 'The platform worked. But “worked” isn’t the same as <b>fast</b> — and wholesale buyers don’t wait. So he went hunting through query plans, caching layers and payload sizes. Run the optimization and see what he shipped.',
      widget: 'latency',
    },
    {
      ch: 1,
      text: 'Then a bigger puzzle: <b>200 users across ~25 tenant companies</b>, each needing one secure door into everything. He designed the <b>multi-tenant SSO system</b> that became the platform’s front gate — tenant-aware sessions, centralized access control.',
      facts: [['200', 'users'], ['~25', 'tenants'], ['1', 'login']],
      tags: ['React', 'Node.js', 'MSSQL', 'SSO · Caching', 'Agile sprints'],
    },

    // ---- Chapter 02: The Paper Factory ----
    {
      ch: 2,
      text: 'May 2025. A hair-manufacturing company in Chennai runs its entire production floor on <b>handwritten paper</b>. Thousands of work orders. Sixteen bills of resources. Eight stations. Zero visibility.',
    },
    {
      ch: 2,
      text: 'His mission: turn the paper into software. Working directly with company leadership, he architected an <b>8-module production planning system</b> and owned it from whiteboard to deployment. Press the button — do what he did.',
      widget: 'digitize',
    },
    {
      ch: 2,
      text: 'Today <b>30 people use it every day</b>. Every work order has a live timeline from raw material to dispatch. Role-based access for every station. Nobody writes production plans by hand anymore.',
      facts: [['9,000+', 'work orders'], ['4,500+', 'SKUs'], ['8', 'modules · RBAC'], ['30', 'daily users']],
      tags: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    },

    // ---- Chapter 03: The Machines Learn ----
    {
      ch: 3,
      text: 'Somewhere along the way, the tools themselves changed. Language models arrived — and Rishi started shipping <b>AI systems that run in production</b>, not demos. Three of them are on duty right now.',
    },
    {
      ch: 3,
      choice: {
        prompt: 'Which one do you want to meet first?',
        options: [
          { label: '🤖 The chatbot that answers customers', order: ['rag', 'content', 'seo'] },
          { label: '🎨 The agent that creates content', order: ['content', 'rag', 'seo'] },
          { label: '📈 The analyst that writes reports', order: ['seo', 'rag', 'content'] },
        ],
      },
    },
    // (the three agent beats are spliced in here, in the chosen order)

    // ---- Chapter 04: Side Quests ----
    {
      ch: 4,
      text: 'What does he build when nobody’s asking? <b>Side quests.</b> Three of them — open each one up.',
      widget: 'labs',
    },
    {
      ch: 4,
      text: 'And yes — one of those side quests is literally <b>a game platform</b>. Certifications collected along the way: Generative AI for Web Developers, Agent Development, OS Administration & Security, Technical Support Fundamentals.',
      facts: [['3', 'independent projects'], ['4', 'certifications'], ['∞', 'curiosity']],
    },

    // ---- Chapter 05: The Arsenal ----
    {
      ch: 5,
      text: 'Every chapter so far was built with the same toolkit — <b>full stack by training, AI-native by obsession</b>. Open the arsenal and look around.',
      widget: 'stack',
    },

    // ---- Epilogue ----
    {
      ch: 6,
      text: 'That’s the story so far: <b>~4.5 years</b>, two companies, a paper factory digitized, three AI systems answering to no one, and a stack that keeps growing.',
      facts: [['~4.5', 'years shipping'], ['35%', 'faster APIs'], ['9,000+', 'work orders'], ['3', 'AI systems live']],
    },
    {
      ch: 6,
      text: 'The next chapter is <b>unwritten</b>. It could start with a message.',
      end: true,
    },
  ];
}

/* ======================= TINY SYNTH ======================= */
class Sfx {
  constructor() { this.ctx = null; this.muted = false; }
  _ensure() {
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    } catch { this.ctx = null; }
    return !!this.ctx;
  }
  tone(freq, dur = 0.09, type = 'sine', gain = 0.045, slide = 0) {
    if (this.muted || !this._ensure()) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t0 = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(this.ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch { /* best-effort */ }
  }
  ui() { this.tone(660, 0.05, 'sine', 0.028); }
  next() { this.tone(520, 0.07, 'triangle', 0.035, 160); }
  whoosh() { this.tone(220, 0.5, 'sawtooth', 0.02, -140); this.tone(880, 0.45, 'sine', 0.015, -500); }
  chapter() { this.tone(392, 0.28, 'sine', 0.05, 260); this.tone(587, 0.32, 'triangle', 0.035, 200); }
  success() { this.tone(784, 0.12, 'triangle', 0.05, 260); }
  finish() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.22, 'triangle', 0.05), i * 110)); }
}

/* ======================= CANVAS HELPERS ======================= */
function makeTextSprite(text, { size = 64, color = '#6ee7ff', weight = 600, worldScale = 0.018 } = {}) {
  const pad = 36;
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `${weight} ${size}px 'Space Grotesk', sans-serif`;
  const w = Math.ceil(measure.measureText(text).width) + pad * 2;
  const h = size + pad * 2;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.font = `${weight} ${size}px 'Space Grotesk', sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.shadowColor = color;
  ctx.shadowBlur = 26;
  ctx.fillStyle = color;
  ctx.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  const spr = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  spr.scale.set(w * worldScale, h * worldScale, 1);
  return spr;
}

function makeGlowSprite(color = '#6ee7ff', scale = 6) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color + '55');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const spr = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  spr.scale.set(scale, scale, 1);
  return spr;
}

function makeGridTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.strokeStyle = 'rgba(110, 231, 255, 0.34)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0.5, 0.5, 127, 127);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(90, 90);
  return tex;
}

/* ======================= ROAD SHADER ======================= */
const roadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const roadFragment = /* glsl */ `
  uniform float uTime;
  uniform float uBoost;
  varying vec2 vUv;
  void main() {
    vec3 base = vec3(0.028, 0.028, 0.055);
    vec3 accent = vec3(0.431, 0.906, 1.0);
    vec3 accent2 = vec3(0.541, 0.49, 1.0);
    float e = min(vUv.x, 1.0 - vUv.x);
    float edge = smoothstep(0.06, 0.0, e);
    float edgeSoft = smoothstep(0.16, 0.0, e) * 0.28;
    float center = smoothstep(0.008, 0.0, abs(vUv.x - 0.5));
    float dash = step(0.45, fract(vUv.y * 1.4));
    float flowSpeed = 0.6 + uBoost * 6.0;
    float flow = smoothstep(0.1, 0.0, abs(fract(vUv.y * 0.35 - uTime * flowSpeed * 0.08) - 0.5)) * (0.08 + uBoost * 0.3);
    vec3 col = base + accent * (edge * 1.25 + edgeSoft) + accent2 * center * dash * 0.85 + accent * flow;
    gl_FragColor = vec4(col, 0.94);
  }
`;

/* ======================= INTERACTIVE WIDGETS =======================
   Each widget is a self-contained interactive moment built from the
   portfolio's real numbers. They render into the story card. */
const WIDGETS = {
  /* Ch.01 — run the API optimization */
  latency(root, game) {
    root.innerHTML = `
      <div class="w-latency">
        <div class="w-latency__row"><span>Before</span><div class="w-bar"><i class="w-bar__before" style="width:100%">480 ms</i></div></div>
        <div class="w-latency__row"><span>After</span><div class="w-bar"><i class="w-bar__after" style="width:2%"></i></div></div>
        <button type="button" class="w-btn">▶ Run the optimization</button>
        <span class="w-result" hidden>−35% response time · caching + query optimization ✓</span>
      </div>`;
    const btn = root.querySelector('.w-btn');
    const after = root.querySelector('.w-bar__after');
    const result = root.querySelector('.w-result');
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = 'Profiling queries…';
      game.sfx.ui();
      setTimeout(() => {
        after.style.width = '65%';
        after.textContent = '312 ms';
        btn.textContent = 'Optimized ✓';
        result.hidden = false;
        game.sfx.success();
      }, 700);
    });
  },

  /* Ch.02 — digitize the paper factory */
  digitize(root, game) {
    const CELLS = 48;
    root.innerHTML = `
      <div class="w-digitize">
        <div class="w-digitize__top">
          <span class="w-digitize__count"><b>0</b> work orders digitized</span>
        </div>
        <div class="w-digitize__grid">${'<i></i>'.repeat(CELLS)}</div>
        <button type="button" class="w-btn">▶ Digitize the factory</button>
        <span class="w-result" hidden>Paper → PostgreSQL. A live timeline for every order ✓</span>
      </div>`;
    const btn = root.querySelector('.w-btn');
    const count = root.querySelector('.w-digitize__count b');
    const cells = [...root.querySelectorAll('.w-digitize__grid i')];
    const result = root.querySelector('.w-result');
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = 'Migrating…';
      game.sfx.ui();
      cells.forEach((c, i) => setTimeout(() => {
        c.classList.add('is-on');
        if (i % 8 === 0) game.sfx.tone(700 + i * 14, 0.04, 'sine', 0.014);
      }, 240 + i * 28));
      const t0 = performance.now();
      const dur = 240 + CELLS * 28 + 200;
      const step = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        count.textContent = Math.round((1 - Math.pow(1 - t, 3)) * 9000).toLocaleString('en-US') + (t === 1 ? '+' : '');
        if (t < 1) requestAnimationFrame(step);
        else {
          btn.textContent = 'Factory digitized ✓';
          result.hidden = false;
          game.sfx.success();
          game.fxFactory();
        }
      };
      requestAnimationFrame(step);
    });
  },

  /* Ch.03 — interview the RAG chatbot */
  chat(root, game) {
    const QA = [
      ['What exactly do you do?', 'I answer questions over complex internal data — grounded with vector search and LangChain, so I cite what’s true instead of guessing. RAG, not vibes.'],
      ['How busy are you?', 'Between 30 and 150 real user queries a day, as a live embedded widget. I absorb the repetitive support load so humans get the interesting problems.'],
      ['Who built you?', 'Rishi did — the vector database, the retrieval pipeline, the prompts, this widget, and the deployment. End to end, like everything else in this story.'],
    ];
    root.innerHTML = `
      <div class="w-chat">
        <div class="w-chat__log"><div class="w-chat__msg w-chat__msg--bot">Hi — I’m the production RAG bot. Ask me something.</div></div>
        <div class="w-chat__qs">${QA.map(([q], i) => `<button type="button" data-q="${i}">${q}</button>`).join('')}</div>
        <a class="w-chat__live" href="https://hc-chat-widget.vercel.app" target="_blank" rel="noopener noreferrer">or interrogate the real one, live ↗</a>
      </div>`;
    const log = root.querySelector('.w-chat__log');
    root.querySelectorAll('.w-chat__qs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [q, a] = QA[+btn.dataset.q];
        btn.disabled = true;
        btn.classList.add('is-asked');
        game.sfx.ui();
        const qm = document.createElement('div');
        qm.className = 'w-chat__msg w-chat__msg--you';
        qm.textContent = q;
        log.appendChild(qm);
        const am = document.createElement('div');
        am.className = 'w-chat__msg w-chat__msg--bot';
        log.appendChild(am);
        game.typeInto(am, a, () => game.sfx.success(), 8);
        log.scrollTop = log.scrollHeight;
      });
    });
  },

  /* Ch.03 — fire the content agent */
  platforms(root, game) {
    const P = ['Instagram', 'Facebook', 'X / Twitter', 'LinkedIn', 'YouTube', 'Pinterest', 'Threads', 'Blog'];
    root.innerHTML = `
      <div class="w-platforms">
        <div class="w-platforms__prompt">
          <span class="w-platforms__label">PROMPT</span>
          <span class="w-platforms__text">“Post about today’s new product drop.”</span>
        </div>
        <button type="button" class="w-btn">▶ Send the one prompt</button>
        <div class="w-platforms__grid">${P.map((p) => `<span>${p}</span>`).join('')}</div>
        <span class="w-result" hidden>8 platform-native posts — images, copy, captions, hashtags. 0 manual steps ✓</span>
      </div>`;
    const btn = root.querySelector('.w-btn');
    const chips = [...root.querySelectorAll('.w-platforms__grid span')];
    const result = root.querySelector('.w-result');
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = 'Agents working…';
      game.sfx.ui();
      chips.forEach((c, i) => setTimeout(() => {
        c.classList.add('is-done');
        game.sfx.tone(600 + i * 60, 0.06, 'triangle', 0.02);
        if (i === chips.length - 1) {
          btn.textContent = 'Posted everywhere ✓';
          result.hidden = false;
          game.sfx.success();
        }
      }, 350 + i * 260));
    });
  },

  /* Ch.03 — let the SEO agent write the weekly report */
  seo(root, game) {
    const LINES = [
      'Connecting to Google Search Console… ✓',
      'Pulling GA4 sessions & conversions… ✓',
      'Analyzing SEO / AEO / GEO signals… ✓',
      'Writing the weekly report… ✓',
      'Delivered — like every week, on schedule.',
    ];
    root.innerHTML = `
      <div class="w-seo">
        <div class="w-seo__term"></div>
        <button type="button" class="w-btn">▶ Generate the weekly report</button>
        <div class="w-seo__stat" hidden><b>15 hrs</b><span>→</span><b>30 min</b><em>of weekly reporting</em></div>
      </div>`;
    const btn = root.querySelector('.w-btn');
    const term = root.querySelector('.w-seo__term');
    const stat = root.querySelector('.w-seo__stat');
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = 'Running…';
      game.sfx.ui();
      LINES.forEach((l, i) => setTimeout(() => {
        const row = document.createElement('span');
        row.textContent = l;
        term.appendChild(row);
        game.sfx.tone(500 + i * 90, 0.05, 'sine', 0.018);
        if (i === LINES.length - 1) {
          btn.textContent = 'Report delivered ✓';
          stat.hidden = false;
          game.sfx.success();
        }
      }, 300 + i * 480));
    });
  },

  /* Ch.04 — open the side quests */
  labs(root, game) {
    const L = [
      ['🩺', 'AI Medical Report Scanner', 'Reads medical lab reports and explains your real health status in plain language — OCR / vision, LLM reasoning and a medical knowledge layer. Designed education-first to stay outside medical-device classification.'],
      ['🥗', 'Food-Image Nutrition Analyzer', 'A photo of a meal becomes a full macro and nutrient breakdown — a vision LLM paired with a nutrition database, capturing structured intake to personalize insights.'],
      ['🎲', 'Fun Friday Arena', 'A real-time multiplayer gaming platform for internal teams — UNO, chess and more — with live state sync and concurrent sessions over WebSockets.'],
    ];
    root.innerHTML = `
      <div class="w-labs">${L.map(([e, name, desc], i) => `
        <button type="button" class="w-lab" data-i="${i}">
          <span class="w-lab__head"><span class="w-lab__name">${e} ${name}</span><span class="w-lab__more">+</span></span>
          <span class="w-lab__desc">${desc}</span>
        </button>`).join('')}
      </div>`;
    root.querySelectorAll('.w-lab').forEach((el) => {
      el.addEventListener('click', () => {
        const open = el.classList.toggle('is-open');
        el.querySelector('.w-lab__more').textContent = open ? '−' : '+';
        if (open) game.sfx.ui();
      });
    });
  },

  /* Ch.05 — browse the arsenal */
  stack(root, game) {
    const S = [
      ['Languages', ['JavaScript', 'Python', 'SQL']],
      ['Frontend', ['React.js', 'Tailwind CSS', 'shadcn/ui', 'Responsive UI', 'UI/UX sense']],
      ['Backend', ['Node.js', 'Express.js', 'FastAPI', 'Flask', 'REST API design']],
      ['Databases', ['PostgreSQL', 'MongoDB', 'MSSQL', 'Neo4j', 'pgvector', 'Knowledge Graphs']],
      ['GenAI / AI', ['RAG', 'LangChain', 'LangGraph', 'MCP', 'Multi-agent systems', 'Prompt / Context Eng.']],
      ['Automation', ['n8n', 'RPA', 'Workflow automation', 'Playwright']],
      ['Practices', ['Agile / Scrum', 'Git / GitHub', 'CI/CD (Vercel, Render)', 'Multi-tenant SSO', 'Caching', 'E2E ownership']],
      ['Familiar', ['TypeScript', 'React Native', 'Redis', 'Docker', 'TanStack Query', 'Microservices']],
    ];
    root.innerHTML = `
      <div class="w-stack">
        <div class="w-stack__tabs">${S.map(([cat], i) => `<button type="button" data-i="${i}" class="${i === 0 ? 'is-active' : ''}">${cat}</button>`).join('')}</div>
        <div class="w-stack__chips"></div>
      </div>`;
    const chips = root.querySelector('.w-stack__chips');
    const tabs = [...root.querySelectorAll('.w-stack__tabs button')];
    const show = (i) => {
      tabs.forEach((t) => t.classList.toggle('is-active', +t.dataset.i === i));
      chips.innerHTML = S[i][1].map((c, k) => `<span style="animation-delay:${k * 45}ms">${c}</span>`).join('');
    };
    tabs.forEach((t) => t.addEventListener('click', () => { show(+t.dataset.i); game.sfx.ui(); }));
    show(0);
  },
};

/* ============================ THE GAME ============================ */
export class PortfolioGame {
  constructor({ onExit } = {}) {
    this.onExit = onExit || (() => {});
    this.sfx = new Sfx();
    this.state = 'title'; // title | travel | story | end
    this.disposed = false;

    this.script = buildScript();
    this.stepIndex = -1;
    this.currentCh = -1;
    this.playerU = 0.015;
    this.boost = 0;
    this.mouse = { x: 0, y: 0 };
    this._typing = null;

    this._buildDom();
    this._buildScene();
    this._bind();
    this.renderer.setAnimationLoop(() => this._tick());
  }

  /* ---------------- DOM ---------------- */
  _buildDom() {
    const root = document.createElement('div');
    root.className = 'game';
    root.innerHTML = `
      <canvas class="game__canvas"></canvas>
      <div class="game__vignette" aria-hidden="true"></div>

      <div class="game__hud">
        <button class="game__exit" type="button" title="Exit story (Esc)">✕ <span>Exit</span></button>
        <div class="game__track">
          <div class="game__track-fill"></div>
          <div class="game__track-dots"></div>
        </div>
        <button class="game__mute" type="button" title="Toggle sound">♪</button>
      </div>

      <div class="game__chapter" aria-live="polite"></div>

      <div class="story" hidden>
        <div class="story__kicker"></div>
        <div class="story__text"></div>
        <div class="story__widget"></div>
        <div class="story__facts"></div>
        <ul class="story__tags"></ul>
        <div class="story__choices" hidden></div>
        <div class="story__nav">
          <button class="story__back" type="button" title="Previous">‹ Back</button>
          <button class="story__next" type="button">Continue ▸</button>
        </div>
      </div>

      <div class="game__hint">
        <span class="game__hint-desktop"><kbd>Enter</kbd> continue · <kbd>←</kbd> back · chapter dots jump · <kbd>Esc</kbd> exit</span>
        <span class="game__hint-touch">Tap Continue · chapter dots jump around the story</span>
      </div>

      <div class="game__screen game__screen--intro">
        <p class="game__screen-kicker">An interactive story</p>
        <h1 class="game__screen-title">THE PATHWAY</h1>
        <p class="game__screen-sub">
          The career of <b>Rishi Vendhan K K</b>, told as a journey — seven chapters,
          from mechanical engineering to production AI systems. No reflexes needed:
          read at your pace, and when the story hands you the controls, press the buttons
          he pressed. <em>≈ 3 minutes, or as long as you like.</em>
        </p>
        <button class="game__start" type="button">▶ &nbsp;Begin the story</button>
        <p class="game__screen-keys">
          <span>Prologue · Origin</span><span>→</span><span>Ch.01 · First Contact</span><span>→</span>
          <span>Ch.02 · The Paper Factory</span><span>→</span><span>Ch.03 · The Machines Learn</span><span>→</span>
          <span>… → Epilogue</span>
        </p>
      </div>

      <div class="game__screen game__screen--end" hidden>
        <p class="game__screen-kicker">Epilogue · Open to work</p>
        <h1 class="game__screen-title">THE NEXT CHAPTER<br/>IS <span class="game__screen-accent">UNWRITTEN</span></h1>
        <p class="game__screen-sub">Full-stack &amp; AI engineering roles · Chennai, India · UTC+5:30</p>
        <div class="game__end-links">
          <a href="mailto:rishivendhan.tech@gmail.com">rishivendhan.tech@gmail.com</a>
          <a href="https://www.linkedin.com/in/rishivendhan" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="https://github.com/rishivendhan84" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="/Rishi_Vendhan_Resume.docx" download>Résumé ↓</a>
        </div>
        <div class="game__end-actions">
          <button class="game__start game__replay" type="button">↻ &nbsp;Read it again</button>
          <button class="game__ghostbtn game__end-exit" type="button">Back to the portfolio</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    this.root = root;
    this.canvas = root.querySelector('.game__canvas');
    this.el = {
      trackFill: root.querySelector('.game__track-fill'),
      trackDots: root.querySelector('.game__track-dots'),
      chapter: root.querySelector('.game__chapter'),
      story: root.querySelector('.story'),
      kicker: root.querySelector('.story__kicker'),
      text: root.querySelector('.story__text'),
      widget: root.querySelector('.story__widget'),
      facts: root.querySelector('.story__facts'),
      tags: root.querySelector('.story__tags'),
      choices: root.querySelector('.story__choices'),
      back: root.querySelector('.story__back'),
      next: root.querySelector('.story__next'),
      intro: root.querySelector('.game__screen--intro'),
      end: root.querySelector('.game__screen--end'),
      mute: root.querySelector('.game__mute'),
    };

    // chapter dots — clickable jumps
    CHAPTERS.forEach((c, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.title = `${c.label} — ${c.title}`;
      d.style.left = `${(i / (CHAPTERS.length - 1)) * 100}%`;
      d.addEventListener('click', () => this._jumpToChapter(i));
      this.el.trackDots.appendChild(d);
    });

    requestAnimationFrame(() => root.classList.add('is-on'));
  }

  /* ---------------- typewriter ----------------
     Types HTML content by revealing its text nodes progressively,
     so <b>/<em> styling appears in place. Click skips to the end. */
  typeInto(el, html, done, cps = 2) {
    this.skipTyping();
    el.innerHTML = html;
    el.classList.add('is-typing');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) { nodes.push([n, n.nodeValue]); n.nodeValue = ''; }
    let ni = 0, ci = 0;
    const finish = () => {
      nodes.slice(ni).forEach(([node, text], k) => { node.nodeValue = k === 0 ? text : text; });
      nodes.forEach(([node, text]) => { node.nodeValue = text; });
      el.classList.remove('is-typing');
      this._typing = null;
      done?.();
    };
    const timer = setInterval(() => {
      for (let k = 0; k < cps; k++) {
        if (ni >= nodes.length) { clearInterval(timer); finish(); return; }
        const [node, text] = nodes[ni];
        ci++;
        node.nodeValue = text.slice(0, ci);
        if (ci >= text.length) { ni++; ci = 0; }
      }
    }, 14);
    this._typing = { timer, finish };
  }
  skipTyping() {
    if (!this._typing) return false;
    clearInterval(this._typing.timer);
    this._typing.finish();
    return true;
  }
  get isTyping() { return !!this._typing; }

  /* ---------------- story engine ---------------- */
  _begin() {
    if (this.state !== 'title') return;
    this.el.intro.hidden = true;
    this.root.classList.add('is-reading');
    this.sfx.chapter();
    this.stepIndex = -1;
    this._advance();
  }

  _advance() {
    if (this.state === 'travel') return;
    if (this.skipTyping()) return; // first press completes the line
    const step = this.script[this.stepIndex + 1];
    if (!step) return;
    this.stepIndex++;
    if (step.end) { this._showStep(step); return; }
    this._renderStep(step);
  }

  _goBack() {
    if (this.state === 'travel' || this.stepIndex <= 0) return;
    this.skipTyping();
    let i = this.stepIndex - 1;
    while (i > 0 && this.script[i].choice?.consumed) i--; // skip resolved choices
    this.stepIndex = i;
    this._renderStep(this.script[i], true);
  }

  _renderStep(step, isBack = false) {
    const ch = CHAPTERS[step.ch];
    if (step.ch !== this.currentCh) {
      this.currentCh = step.ch;
      this._travelTo(ch, () => this._showStep(step));
    } else {
      this._showStep(step);
    }
    if (!isBack) this.sfx.next();
    this._updateProgress();
  }

  _travelTo(ch, then) {
    this.state = 'travel';
    this.el.story.hidden = true;
    this.sfx.whoosh();
    const from = this.playerU;
    const to = ch.u;
    const dist = Math.abs(to - from);
    const dur = Math.max(900, Math.min(3000, dist * 16000));
    const t0 = performance.now();
    this._travel = { from, to, t0, dur, then, ch };
    // chapter title flash
    this.el.chapter.innerHTML = `<b>${ch.label}</b><span>${ch.title}</span>`;
    this.el.chapter.classList.remove('is-flash');
    void this.el.chapter.offsetWidth;
    this.el.chapter.classList.add('is-flash');
  }

  _showStep(step) {
    this.state = 'story';
    const ch = CHAPTERS[step.ch];
    this.el.kicker.textContent = ch.kicker;

    // reset card sections
    this.el.widget.innerHTML = '';
    this.el.facts.innerHTML = '';
    this.el.tags.innerHTML = '';
    this.el.choices.hidden = true;
    this.el.choices.innerHTML = '';
    this.el.next.hidden = false;
    this.el.back.disabled = this.stepIndex <= 0;

    if (step.end) {
      this._finish();
      return;
    }

    if (step.choice && !step.choice.consumed) {
      this.el.next.hidden = true;
      this.typeInto(this.el.text, step.choice.prompt, () => {
        this.el.choices.hidden = false;
        step.choice.options.forEach((opt) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = opt.label;
          b.addEventListener('click', () => this._resolveChoice(step, opt));
          this.el.choices.appendChild(b);
        });
      });
    } else if (step.choice) {
      // revisiting a consumed choice — just move along
      this._advance();
      return;
    } else {
      this.typeInto(this.el.text, step.text, () => {
        if (step.facts) {
          this.el.facts.innerHTML = step.facts
            .map(([b, l], i) => `<span style="animation-delay:${i * 90}ms"><b>${b}</b> ${l}</span>`)
            .join('');
        }
        if (step.tags) {
          this.el.tags.innerHTML = step.tags.map((t) => `<li>${t}</li>`).join('');
        }
        if (step.widget && WIDGETS[step.widget]) {
          WIDGETS[step.widget](this.el.widget, this);
        }
      });
    }
    this.el.story.hidden = false;
  }

  _resolveChoice(step, opt) {
    step.choice.consumed = true;
    const idx = this.script.indexOf(step);
    const beats = opt.order.map((k) => ({ ch: step.ch, ...AGENT_BEATS[k] }));
    this.script.splice(idx + 1, 0, ...beats);
    this.sfx.chapter();
    this._advance();
  }

  _resolvePendingChoices() {
    this.script.forEach((s, i) => {
      if (s.choice && !s.choice.consumed) {
        s.choice.consumed = true;
        const beats = s.choice.options[0].order.map((k) => ({ ch: s.ch, ...AGENT_BEATS[k] }));
        this.script.splice(i + 1, 0, ...beats);
      }
    });
  }

  _jumpToChapter(chIdx) {
    if (this.state === 'title' || this.state === 'end' || this.disposed) return;
    this._resolvePendingChoices();
    const target = this.script.findIndex((s) => s.ch === chIdx && !s.choice);
    if (target === -1) return;
    this.skipTyping();
    this.stepIndex = target;
    this.currentCh = -2; // force travel
    this.sfx.ui();
    const step = this.script[target];
    this.currentCh = step.ch;
    this._travelTo(CHAPTERS[chIdx], () => this._showStep(step));
    this._updateProgress();
  }

  _updateProgress() {
    const chSteps = this.script.filter((s) => s.ch === this.currentCh && !s.choice);
    const within = Math.max(0, chSteps.indexOf(this.script[this.stepIndex]));
    const frac = chSteps.length > 1 ? within / (chSteps.length - 1) : 1;
    const p = (Math.max(this.currentCh, 0) + frac * 0.9) / (CHAPTERS.length - 1);
    this.el.trackFill.style.width = `${Math.min(p * 100, 100).toFixed(1)}%`;
    [...this.el.trackDots.children].forEach((d, i) => {
      d.classList.toggle('is-done', i < this.currentCh);
      d.classList.toggle('is-here', i === this.currentCh);
    });
  }

  _finish() {
    this.state = 'end';
    this.el.story.hidden = true;
    this.el.trackFill.style.width = '100%';
    [...this.el.trackDots.children].forEach((d) => d.classList.add('is-done'));
    this.el.end.hidden = false;
    requestAnimationFrame(() => this.el.end.classList.add('is-open'));
    this.sfx.finish();
  }

  _replay() {
    if (this.state !== 'end') return;
    this.el.end.classList.remove('is-open');
    this.el.end.hidden = true;
    this.script = buildScript();
    this.stepIndex = -1;
    this.currentCh = -1;
    this.state = 'story';
    this.sfx.chapter();
    this._advance();
  }

  /* 3D flourish hook: the factory wall turns from paper to data */
  fxFactory() {
    if (!this._factoryCells) return;
    this._factoryCells.forEach((m, i) => {
      setTimeout(() => {
        m.material.color.setHex(ACCENT);
        m.material.opacity = 0.85;
      }, i * 40);
    });
  }

  /* ---------------- 3D scene ---------------- */
  _buildScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BG, 0.0135);
    this.camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 700);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(BG, 1);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.clock = new THREE.Clock();

    this._buildPath();
    this._buildRoad();
    this._buildEnvironment();
    this._buildPortals();
    this._buildSetPieces();
    this._buildShip();
  }

  _buildPath() {
    const pts = [];
    const N = 15;
    for (let i = 0; i < N; i++) {
      const x = i === 0 ? 0 : Math.sin(i * 0.95) * 22;
      const y = Math.sin(i * 0.55) * 2.2;
      pts.push(new THREE.Vector3(x, y, -i * 52));
    }
    this.curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    this.curveLen = this.curve.getLength();
  }

  _onPath(u, lat = 0, lift = 0, out = new THREE.Vector3()) {
    const uu = THREE.MathUtils.clamp(u, 0, 1);
    const p = this.curve.getPointAt(uu);
    const t = this.curve.getTangentAt(uu);
    const n = this._tmpN.set(-t.z, 0, t.x).normalize();
    out.copy(p).addScaledVector(n, lat);
    out.y = p.y + lift;
    return out;
  }
  get _tmpN() { return this.__tmpN || (this.__tmpN = new THREE.Vector3()); }

  _buildRoad() {
    const SEGS = 700;
    const HALF = 3.4;
    const pos = new Float32Array((SEGS + 1) * 2 * 3);
    const uv = new Float32Array((SEGS + 1) * 2 * 2);
    const idx = [];
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let i = 0; i <= SEGS; i++) {
      const u = i / SEGS;
      this.curve.getPointAt(u, p);
      const t = this.curve.getTangentAt(u);
      n.set(-t.z, 0, t.x).normalize();
      const v = (u * this.curveLen) / 8;
      pos.set([p.x + n.x * HALF, p.y, p.z + n.z * HALF, p.x - n.x * HALF, p.y, p.z - n.z * HALF], i * 6);
      uv.set([0, v, 1, v], i * 4);
      if (i < SEGS) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    this.roadUniforms = { uTime: { value: 0 }, uBoost: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      vertexShader: roadVertex,
      fragmentShader: roadFragment,
      uniforms: this.roadUniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.scene.add(new THREE.Mesh(geo, mat));
  }

  _buildEnvironment() {
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(1600, 1600),
      new THREE.MeshBasicMaterial({ map: makeGridTexture(), transparent: true, opacity: 0.3, depthWrite: false })
    );
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, -5.5, -360);
    this.scene.add(grid);

    const starCount = 1400;
    const sPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 260 + Math.random() * 320;
      const a = Math.random() * Math.PI * 2;
      const h = Math.random() * 0.9 + 0.04;
      sPos[i * 3] = Math.cos(a) * r;
      sPos[i * 3 + 1] = h * 230 - 20;
      sPos[i * 3 + 2] = Math.sin(a) * r - 340;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    this.scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
      color: 0xbfd8ff, size: 1.15, sizeAttenuation: true, transparent: true, opacity: 0.8, depthWrite: false,
    })));

    const sun = makeGlowSprite('#8a7dff', 150);
    sun.position.set(0, 26, -880);
    this.scene.add(sun);
    const sunCore = makeGlowSprite('#6ee7ff', 70);
    sunCore.position.set(0, 26, -878);
    this.scene.add(sunCore);

    this.debris = [];
    const shapes = [
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.OctahedronGeometry(1.9, 0),
      new THREE.TetrahedronGeometry(1.7, 0),
    ];
    for (let i = 0; i < 40; i++) {
      const m = new THREE.Mesh(
        shapes[i % shapes.length],
        new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? ACCENT2 : ACCENT,
          wireframe: true, transparent: true, opacity: 0.24,
        })
      );
      const u = 0.04 + (i / 40) * 0.94;
      const side = i % 2 === 0 ? 1 : -1;
      this._onPath(u, side * (11 + Math.random() * 18), 2 + Math.random() * 9, m.position);
      m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      m.userData.spin = 0.1 + Math.random() * 0.3;
      m.scale.setScalar(0.5 + Math.random() * 1.4);
      this.scene.add(m);
      this.debris.push(m);
    }
  }

  _buildPortals() {
    // A portal ring on the road just before each chapter — you fly through it.
    this.portals = [];
    CHAPTERS.forEach((ch) => {
      const group = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.6, 0.09, 12, 72),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(4.05, 0.03, 8, 72),
        new THREE.MeshBasicMaterial({ color: ACCENT2, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      group.add(ring, ring2);
      const label = makeTextSprite(ch.title.toUpperCase(), { size: 68, color: '#eceaf6', worldScale: 0.015 });
      label.position.y = 5.4;
      group.add(label);
      const sub = makeTextSprite(ch.label, { size: 36, color: '#6ee7ff', weight: 500, worldScale: 0.012 });
      sub.position.y = 4.45;
      group.add(sub);
      const pu = Math.max(ch.u - 0.018, 0.02);
      this._onPath(pu, 0, 3.0, group.position);
      const ahead = this._onPath(Math.min(pu + 0.01, 1), 0, 3.0, new THREE.Vector3());
      group.lookAt(ahead);
      this.scene.add(group);
      this.portals.push({ ring, ring2 });
    });
  }

  /* Scene set pieces — one 3D vignette per chapter, placed around its stop */
  _buildSetPieces() {
    const addAt = (u, lat, lift, obj) => {
      this._onPath(u, lat, lift, obj.position);
      this.scene.add(obj);
      return obj;
    };
    this.animated = [];

    // Prologue — interlocking wireframe gears + code sprite
    {
      const u = CHAPTERS[0].u + 0.022;
      const g1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.1, 0.32, 6, 9),
        new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.5 })
      );
      addAt(u, -7.5, 4.2, g1);
      const g2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.3, 0.24, 6, 7),
        new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.6 })
      );
      addAt(u + 0.006, -5.2, 6.1, g2);
      this.animated.push({ obj: g1, spin: 0.25 }, { obj: g2, spin: -0.4 });
      const code = makeTextSprite('{ code }', { size: 58, color: '#6ee7ff', worldScale: 0.015 });
      addAt(u + 0.004, 7, 4.5, code);
      const mech = makeTextSprite('B.E. MECH', { size: 40, color: '#8a7dff', weight: 500, worldScale: 0.012 });
      addAt(u - 0.004, 8.5, 2.6, mech);
    }

    // Ch.01 — tenant towers around an SSO core
    {
      const u = CHAPTERS[1].u + 0.024;
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
      );
      addAt(u, -8, 5, core);
      this.animated.push({ obj: core, spin: 0.5 });
      const coreGlow = makeGlowSprite('#6ee7ff', 5);
      coreGlow.position.copy(core.position);
      this.scene.add(coreGlow);
      const linePts = [];
      for (let i = 0; i < 8; i++) {
        const h = 1.2 + Math.random() * 2.4;
        const tower = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, h, 0.5),
          new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.5 })
        );
        const lat = -8 + Math.cos((i / 8) * Math.PI * 2) * 4.2;
        const du = (Math.sin((i / 8) * Math.PI * 2) * 4.2) / this.curveLen;
        addAt(u + du, lat, 1 + h / 2, tower);
        linePts.push(tower.position.clone().setY(tower.position.y + h / 2), core.position.clone());
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      this.scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
        color: ACCENT, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending,
      })));
    }

    // Ch.02 — a wall of paper work orders (turns to data via fxFactory)
    {
      const u = CHAPTERS[2].u + 0.024;
      this._factoryCells = [];
      const cols = 6, rows = 4;
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const cell = new THREE.Mesh(
            new THREE.PlaneGeometry(0.85, 1.1),
            new THREE.MeshBasicMaterial({
              color: 0xd8d6e6, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
            })
          );
          addAt(u + (cx - cols / 2) * 0.0035, 8.2, 2.2 + cy * 1.35, cell);
          cell.lookAt(this._onPath(u, 0, 3, new THREE.Vector3()));
          this._factoryCells.push(cell);
        }
      }
      const label = makeTextSprite('9,000+ WORK ORDERS', { size: 40, color: '#8a7dff', weight: 500, worldScale: 0.012 });
      addAt(u, 8.2, 8.4, label);
    }

    // Ch.03 — a pulsing neural constellation
    {
      const u = CHAPTERS[3].u + 0.024;
      const nodes = [];
      for (let i = 0; i < 22; i++) {
        const s = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.16, 0),
          new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? ACCENT2 : ACCENT,
            transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
          })
        );
        const du = ((Math.random() - 0.5) * 7) / this.curveLen;
        addAt(u + du, -7 + (Math.random() - 0.5) * 5, 3.5 + (Math.random() - 0.5) * 4, s);
        s.userData.seed = i;
        nodes.push(s);
        this.animated.push({ obj: s, pulse: true });
      }
      const pts = [];
      nodes.forEach((a, i) => {
        const b = nodes[(i + 3) % nodes.length];
        pts.push(a.position.clone(), b.position.clone());
      });
      this.scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending })
      ));
      const label = makeTextSprite('RAG · AGENTS · GRAPHS', { size: 38, color: '#6ee7ff', weight: 500, worldScale: 0.012 });
      addAt(u, -7, 7.6, label);
    }

    // Ch.04 — three floating side-quest artifacts
    {
      const u = CHAPTERS[4].u + 0.024;
      ['MEDICAL AI', 'NUTRITION AI', 'GAME ARENA'].forEach((name, i) => {
        const m = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.9, 0),
          new THREE.MeshBasicMaterial({ color: i === 1 ? ACCENT2 : ACCENT, wireframe: true, transparent: true, opacity: 0.55 })
        );
        addAt(u + (i - 1) * 0.008, 7.6, 3.4 + (i % 2) * 1.6, m);
        this.animated.push({ obj: m, spin: 0.3 + i * 0.1 });
        const t = makeTextSprite(name, { size: 30, color: '#8b8a99', weight: 500, worldScale: 0.011 });
        t.position.copy(m.position);
        t.position.y += 1.6;
        this.scene.add(t);
      });
    }

    // Ch.05 — a constellation of skills
    {
      const u = CHAPTERS[5].u + 0.024;
      const WORDS = ['React.js', 'Node.js', 'Python', 'PostgreSQL', 'LangChain', 'RAG', 'n8n', 'Neo4j', 'FastAPI', 'MongoDB', 'LangGraph', 'MCP'];
      WORDS.forEach((w, i) => {
        const spr = makeTextSprite(w, { size: 38, color: i % 3 === 0 ? '#8a7dff' : '#6ee7ff', weight: 500, worldScale: 0.011 });
        const du = ((i % 4) - 1.5) * 2.4 / this.curveLen * 8;
        addAt(u + du, -6.5 - (i % 3) * 2.2, 2.4 + Math.floor(i / 4) * 1.7, spr);
        spr.material.opacity = 0.65;
        spr.userData.bobSeed = i * 1.3;
        spr.userData.baseY = spr.position.y;
        this.debris.push(spr);
      });
    }

    // Epilogue — an open portal
    {
      const u = CHAPTERS[6].u + 0.03;
      const big = new THREE.Mesh(
        new THREE.TorusGeometry(5.4, 0.12, 12, 80),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      addAt(u, 0, 4.2, big);
      const ahead = this._onPath(Math.min(u + 0.01, 1), 0, 4.2, new THREE.Vector3());
      big.lookAt(ahead);
      this.animated.push({ obj: big, spinZ: 0.12 });
      const glow = makeGlowSprite('#6ee7ff', 12);
      glow.position.copy(big.position);
      this.scene.add(glow);
      const open = makeTextSprite('OPEN TO WORK', { size: 52, color: '#6ee7ff', worldScale: 0.014 });
      addAt(u, 0, 11.2, open);
    }
  }

  _buildShip() {
    const ship = new THREE.Group();
    const hull = new THREE.Mesh(
      new THREE.ConeGeometry(0.34, 1.25, 5),
      new THREE.MeshBasicMaterial({ color: 0x0d0d18 })
    );
    hull.rotation.x = Math.PI / 2;
    const wire = new THREE.Mesh(
      new THREE.ConeGeometry(0.36, 1.3, 5),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.9 })
    );
    wire.rotation.x = Math.PI / 2;
    const wings = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42, 0),
      new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.55 })
    );
    wings.scale.set(2.1, 0.28, 0.9);
    wings.position.z = -0.28;
    const glow = makeGlowSprite('#6ee7ff', 2.6);
    glow.position.z = -0.15;
    const engine = makeGlowSprite('#8a7dff', 1.3);
    engine.position.z = -0.85;
    ship.add(hull, wire, wings, glow, engine);
    this.scene.add(ship);
    this.ship = ship;
    this.shipEngine = engine;

    this._shipPos = new THREE.Vector3();
    this._shipAhead = new THREE.Vector3();
    this._camPos = new THREE.Vector3();
    this._camLook = new THREE.Vector3();
    this._placeCamera(0, true);
  }

  _placeCamera(dt, snap = false) {
    const t = this.clock.elapsedTime;
    const reading = this.state === 'story';
    // gentle sway + mouse parallax while reading; tight chase while travelling
    const sway = reading ? Math.sin(t * 0.35) * 0.5 : 0;
    const lat = sway + this.mouse.x * (reading ? 0.7 : 0.25);
    const lift = 2.3 + this.mouse.y * (reading ? 0.3 : 0.1);

    this._onPath(this.playerU + 0.004, 0, 0.55 + Math.sin(t * 1.6) * 0.06, this._shipPos);
    this._onPath(this.playerU + 0.011, 0, 0.55, this._shipAhead);
    this.ship.position.copy(this._shipPos);
    this.ship.lookAt(this._shipAhead);

    this._onPath(this.playerU - 0.011, lat, lift, this._camPos);
    this._onPath(this.playerU + 0.014, 0, 1.15, this._camLook);
    if (snap) this.camera.position.copy(this._camPos);
    else this.camera.position.lerp(this._camPos, Math.min(dt * 4, 1));
    this.camera.lookAt(this._camLook);
  }

  /* ---------------- input ---------------- */
  _bind() {
    this._onKeyDown = (e) => {
      if (e.repeat) return;
      switch (e.key) {
        case 'Escape': this.exit(); break;
        case 'Enter': case ' ': case 'ArrowRight':
          if (this.state === 'title') this._begin();
          else if (this.state === 'story') this._advance();
          else if (this.state === 'end') this._replay();
          e.preventDefault();
          break;
        case 'ArrowLeft': case 'Backspace':
          if (this.state === 'story') { this._goBack(); e.preventDefault(); }
          break;
      }
    };
    window.addEventListener('keydown', this._onKeyDown);

    this._onPointerMove = (e) => {
      this.mouse.x = (e.clientX / innerWidth - 0.5) * 2;
      this.mouse.y = -(e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', this._onPointerMove, { passive: true });

    // clicking the sky advances the story (classic visual-novel behaviour)
    this._onCanvasClick = () => {
      if (this.state === 'story') this._advance();
    };
    this.canvas.addEventListener('click', this._onCanvasClick);

    this._onResize = () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    };
    window.addEventListener('resize', this._onResize);

    this.root.querySelector('.game__exit').addEventListener('click', () => this.exit());
    this.el.intro.querySelector('.game__start').addEventListener('click', () => this._begin());
    this.root.querySelector('.game__replay').addEventListener('click', () => this._replay());
    this.root.querySelector('.game__end-exit').addEventListener('click', () => this.exit());
    this.el.mute.addEventListener('click', () => {
      this.sfx.muted = !this.sfx.muted;
      this.el.mute.classList.toggle('is-muted', this.sfx.muted);
      if (!this.sfx.muted) this.sfx.ui();
    });
    this.el.next.addEventListener('click', () => this._advance());
    this.el.back.addEventListener('click', () => this._goBack());
    // click on the narrative text finishes the typewriter
    this.el.text.addEventListener('click', () => this.skipTyping());
  }

  /* ---------------- frame loop ---------------- */
  _tick() {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    this.roadUniforms.uTime.value = time;
    const boostTarget = this.state === 'travel' ? 1 : 0.08;
    this.boost += (boostTarget - this.boost) * Math.min(dt * 3, 1);
    this.roadUniforms.uBoost.value = this.boost;

    for (const d of this.debris) {
      if (d.isSprite && d.userData.baseY !== undefined) {
        d.position.y = d.userData.baseY + Math.sin(time * 0.7 + d.userData.bobSeed) * 0.35;
      } else if (d.userData.spin) {
        d.rotation.x += d.userData.spin * dt;
        d.rotation.y += d.userData.spin * 1.3 * dt;
      }
    }
    for (const a of this.animated) {
      if (a.spin) { a.obj.rotation.x += a.spin * dt; a.obj.rotation.y += a.spin * 0.7 * dt; }
      if (a.spinZ) a.obj.rotation.z += a.spinZ * dt;
      if (a.pulse) {
        const s = 1 + Math.sin(time * 2 + a.obj.userData.seed) * 0.35;
        a.obj.scale.setScalar(s);
      }
    }
    for (const p of this.portals) {
      p.ring.rotation.z += dt * 0.4;
      p.ring2.rotation.z -= dt * 0.25;
    }
    this.shipEngine.material.opacity = 0.55 + Math.sin(time * 20) * 0.2 + this.boost * 0.4;

    if (this.state === 'title') {
      this.playerU = 0.015 + Math.sin(time * 0.14) * 0.002;
    } else if (this.state === 'travel' && this._travel) {
      const { from, to, t0, dur, then } = this._travel;
      const t = Math.min((performance.now() - t0) / dur, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.playerU = from + (to - from) * ease;
      if (t >= 1) {
        this._travel = null;
        this.sfx.chapter();
        then();
      }
    }

    this._placeCamera(dt, false);
    this.renderer.render(this.scene, this.camera);
  }

  /* ---------------- teardown ---------------- */
  exit() {
    if (this.disposed) return;
    this.disposed = true;
    this.skipTyping();
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('click', this._onCanvasClick);
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      }
    });
    this.renderer.dispose();
    this.root.classList.remove('is-on');
    const root = this.root;
    setTimeout(() => root.remove(), 450);
    this.onExit();
  }
}
