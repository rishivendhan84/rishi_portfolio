/* =========================================================================
   STORY MODE — "THE PATHWAY"
   A cinematic, interactive telling of the portfolio. Letterboxed like a
   film: chapter title cards fade from black, the camera drifts through a
   quiet particle world, and the story reveals itself word by word — with
   interactive moments built from the real work. No game mechanics; the
   reader sets the pace. Lazy-loaded; the site itself stays untouched.
   ========================================================================= */
import * as THREE from 'three';
import './game.css';

const ACCENT = 0x6ee7ff;
const ACCENT2 = 0x8a7dff;
const BG = 0x06060a;

/* ======================= THE CHAPTERS ======================= */
const CHAPTERS = [
  { key: 'origin', numeral: 'I', title: 'Origin', dates: '2017 — 2021 · Chennai', motif: 'origin' },
  { key: 'minsway', numeral: 'II', title: 'First Contact', dates: 'Dec 2021 — May 2025 · Minsway Solutions', motif: 'towers' },
  { key: 'factory', numeral: 'III', title: 'The Paper Factory', dates: 'May 2025 — Present · Different Hair Pvt. Ltd', motif: 'paper' },
  { key: 'ai', numeral: 'IV', title: 'The Machines Learn', dates: 'The GenAI arc · Different Hair & CX Analytix', motif: 'neural' },
  { key: 'labs', numeral: 'V', title: 'After Hours', dates: 'Independent projects', motif: 'artifacts' },
  { key: 'craft', numeral: 'VI', title: 'The Craft', dates: 'One toolkit behind every chapter', motif: 'constellation' },
  { key: 'unwritten', numeral: 'VII', title: 'The Unwritten Chapter', dates: 'Chennai, India · Open to work', motif: 'portal' },
];

/* Chapter IV lets the reader choose the order they meet the AI systems. */
const AGENT_BEATS = {
  rag: {
    text: 'The <b>production RAG chatbot</b> — deployed as a live widget, grounded in complex internal data with vector search and LangChain. It answers <b>30–150 real user questions a day</b>. Don’t take the story’s word for it — interview it.',
    widget: 'chat',
    tags: ['RAG', 'Vector DBs', 'LangChain', 'Python'],
  },
  content: {
    text: 'The <b>multi-platform content agent</b> — an autonomous multi-agent system. One prompt goes in; complete daily social posts come out. Images, copy, captions, hashtags — tailored separately for <b>8 platforms</b>.',
    widget: 'platforms',
    tags: ['LangChain', 'LangGraph', 'n8n', 'Multi-agent'],
  },
  seo: {
    text: 'And the quiet one: an <b>SEO analytics agent</b> that reads Google Search Console and GA4, then writes and delivers the weekly SEO / AEO / GEO reports on its own — a 15-hour weekly chore, reduced to 30 minutes.',
    widget: 'seo',
    tags: ['Python', 'n8n', 'GA4', 'Search Console'],
  },
};

function buildScript() {
  return [
    /* I · Origin */
    { ch: 0, text: 'Every builder has an origin story.<br/>This one starts with <b>machines</b>.' },
    { ch: 0, text: 'Chennai, 2017. Easwari Engineering College — a degree in <b>Mechanical Engineering</b>. Gears, torque, tolerances. Four years learning how physical systems fit together.' },
    { ch: 0, text: 'But the machines that pulled him in weren’t made of steel. They were made of <b>code</b> — systems you could design at midnight and put in front of real users by morning. He crossed over. He never looked back.' },

    /* II · First Contact */
    { ch: 1, text: 'December 2021. Rishi joins <b>Minsway Solutions</b> — and meets <b>Monad</b>, a B2B wholesale platform serving businesses across Saudi Arabia. React dashboards. Node.js APIs. Real money moving through both.' },
    {
      ch: 1,
      text: 'The platform worked. But working isn’t the same as <b>fast</b> — and wholesale buyers don’t wait. He went hunting through query plans, caching layers and payload sizes. See it for yourself.',
      widget: 'latency',
    },
    {
      ch: 1,
      text: 'Then, a harder problem: <b>200 people across ~25 companies</b>, each needing one secure door into everything. His answer became the platform’s front gate — a <b>multi-tenant SSO system</b> with tenant-aware sessions and centralized access control.',
      stats: [['200', 'users'], ['~25', 'tenants'], ['1', 'login']],
      tags: ['React', 'Node.js', 'MSSQL', 'SSO · Caching'],
    },

    /* III · The Paper Factory */
    { ch: 2, text: 'May 2025. A manufacturing company in Chennai runs its entire production floor on <b>handwritten paper</b>. Thousands of work orders. Eight stations. Sixteen bills of resources. Zero visibility.' },
    {
      ch: 2,
      text: 'His brief: turn the paper into software. Working directly with company leadership, he architected an <b>8-module production planning system</b> and carried it from whiteboard to deployment.',
      widget: 'digitize',
    },
    {
      ch: 2,
      text: 'Today, <b>30 people</b> run their day inside it. Every work order carries a live timeline from raw material to dispatch. The paper is gone.',
      stats: [['9,000+', 'work orders'], ['4,500+', 'SKUs'], ['8', 'modules · RBAC'], ['30', 'daily users']],
      tags: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    },

    /* IV · The Machines Learn */
    { ch: 3, text: 'Then the tools themselves changed. Language models arrived — and Rishi began shipping <b>AI that works in production</b>, not in demos. Three systems are on duty right now.' },
    {
      ch: 3,
      choice: {
        prompt: 'Which one do you want to meet first?',
        options: [
          { label: 'The chatbot that answers customers', order: ['rag', 'content', 'seo'] },
          { label: 'The agent that creates content', order: ['content', 'rag', 'seo'] },
          { label: 'The analyst that writes reports', order: ['seo', 'rag', 'content'] },
        ],
      },
    },

    /* V · After Hours */
    {
      ch: 4,
      text: 'And when nobody is asking? He builds anyway. Three projects, made after hours — open them.',
      widget: 'labs',
    },
    {
      ch: 4,
      text: 'One of them is, quite literally, a multiplayer game platform — he builds play, too. Collected along the way: four certifications, from generative AI to systems administration.',
      stats: [['3', 'independent projects'], ['4', 'certifications'], ['∞', 'curiosity']],
    },

    /* VI · The Craft */
    {
      ch: 5,
      text: 'Six chapters, one craft: <b>full stack by training, AI-native by obsession</b>. This is the toolkit behind everything you just read.',
      widget: 'stack',
    },

    /* VII · The Unwritten Chapter */
    {
      ch: 6,
      text: 'The story so far: <b>~4.5 years</b>. Two companies. A paper factory digitized. Three AI systems working unsupervised. A toolkit that keeps growing.',
      stats: [['~4.5', 'years shipping'], ['35%', 'faster APIs'], ['9,000+', 'work orders'], ['3', 'AI systems live']],
    },
    { ch: 6, text: 'The next chapter is <b>unwritten</b>.<br/>It could start with a message.', end: true },
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
  tone(freq, dur = 0.09, type = 'sine', gain = 0.04, slide = 0) {
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
  ui() { this.tone(660, 0.05, 'sine', 0.022); }
  next() { this.tone(520, 0.06, 'sine', 0.025, 120); }
  swell() { this.tone(196, 0.9, 'sine', 0.035, 100); this.tone(294, 0.9, 'sine', 0.02, 60); }
  success() { this.tone(784, 0.12, 'triangle', 0.04, 220); }
  finish() { [392, 494, 587, 784].forEach((f, i) => setTimeout(() => this.tone(f, 0.3, 'sine', 0.04), i * 140)); }
}

/* ======================= CANVAS HELPERS ======================= */
function makeGlowSprite(color = '#6ee7ff', scale = 6, opacity = 1) {
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
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  spr.scale.set(scale, scale, 1);
  return spr;
}

/* ======================= WAVE FLOOR SHADER ======================= */
const floorVertex = /* glsl */ `
  uniform float uTime;
  varying float vElev;
  void main() {
    vec3 pos = position;
    float t = uTime * 0.4;
    float e = sin(pos.x * 0.28 + t) * 0.7
            + sin(pos.z * 0.22 + t * 1.4) * 0.6
            + sin((pos.x + pos.z) * 0.11 + t * 0.7) * 0.5;
    pos.y += e;
    vElev = e;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 2.4 * (26.0 / -mv.z);
  }
`;
const floorFragment = /* glsl */ `
  varying float vElev;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.1, length(uv));
    float h = clamp(vElev * 0.4 + 0.5, 0.0, 1.0);
    vec3 col = mix(vec3(0.16, 0.14, 0.32), vec3(0.43, 0.9, 1.0), pow(h, 1.6));
    gl_FragColor = vec4(col, a * (0.16 + h * 0.4));
  }
`;

/* ======================= INTERACTIVE MOMENTS =======================
   Quiet, hands-on beats built from the résumé's real numbers. */
const WIDGETS = {
  latency(root, game) {
    root.innerHTML = `
      <div class="w-latency">
        <div class="w-latency__row"><span>Before</span><div class="w-bar"><i class="w-bar__before" style="width:100%">480 ms</i></div></div>
        <div class="w-latency__row"><span>After</span><div class="w-bar"><i class="w-bar__after" style="width:2%"></i></div></div>
        <button type="button" class="w-btn">Run the optimization</button>
        <span class="w-result" hidden>−35% response time · caching + query optimization</span>
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

  digitize(root, game) {
    const CELLS = 48;
    root.innerHTML = `
      <div class="w-digitize">
        <span class="w-digitize__count"><b>0</b> work orders digitized</span>
        <div class="w-digitize__grid">${'<i></i>'.repeat(CELLS)}</div>
        <button type="button" class="w-btn">Digitize the factory</button>
        <span class="w-result" hidden>Paper → PostgreSQL. A live timeline for every order</span>
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
        if (i % 8 === 0) game.sfx.tone(700 + i * 14, 0.04, 'sine', 0.012);
      }, 240 + i * 26));
      const t0 = performance.now();
      const dur = 240 + CELLS * 26 + 200;
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

  platforms(root, game) {
    const P = ['Instagram', 'Facebook', 'X / Twitter', 'LinkedIn', 'YouTube', 'Pinterest', 'Threads', 'Blog'];
    root.innerHTML = `
      <div class="w-platforms">
        <div class="w-platforms__prompt">
          <span class="w-platforms__label">PROMPT</span>
          <span class="w-platforms__text">“Post about today’s new product drop.”</span>
        </div>
        <button type="button" class="w-btn">Send the one prompt</button>
        <div class="w-platforms__grid">${P.map((p) => `<span>${p}</span>`).join('')}</div>
        <span class="w-result" hidden>8 platform-native posts — images, copy, captions, hashtags. 0 manual steps</span>
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
        game.sfx.tone(600 + i * 60, 0.06, 'triangle', 0.016);
        if (i === chips.length - 1) {
          btn.textContent = 'Posted everywhere ✓';
          result.hidden = false;
          game.sfx.success();
        }
      }, 350 + i * 240));
    });
  },

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
        <button type="button" class="w-btn">Generate the weekly report</button>
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
        game.sfx.tone(500 + i * 90, 0.05, 'sine', 0.014);
        if (i === LINES.length - 1) {
          btn.textContent = 'Report delivered ✓';
          stat.hidden = false;
          game.sfx.success();
        }
      }, 300 + i * 460));
    });
  },

  labs(root, game) {
    const L = [
      ['AI Medical Report Scanner', 'Reads medical lab reports and explains your real health status in plain language — OCR / vision, LLM reasoning and a medical knowledge layer. Designed education-first to stay outside medical-device classification.'],
      ['Food-Image Nutrition Analyzer', 'A photo of a meal becomes a full macro and nutrient breakdown — a vision LLM paired with a nutrition database, capturing structured intake to personalize insights.'],
      ['Fun Friday Arena', 'A real-time multiplayer platform for internal teams — UNO, chess and more — with live state sync and concurrent sessions over WebSockets.'],
    ];
    root.innerHTML = `
      <div class="w-labs">${L.map(([name, desc], i) => `
        <button type="button" class="w-lab" data-i="${i}">
          <span class="w-lab__head"><span class="w-lab__name">${name}</span><span class="w-lab__more">+</span></span>
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

/* ============================ STORY MODE ============================ */
export class PortfolioGame {
  constructor({ onExit } = {}) {
    this.onExit = onExit || (() => {});
    this.sfx = new Sfx();
    this.state = 'title'; // title | transition | scene | end
    this.disposed = false;

    this.script = buildScript();
    this.stepIndex = -1;
    this.currentCh = -1;
    this.camZ = 30;
    this.mouse = { x: 0, y: 0 };
    this._reveal = null;
    this._typing = null;
    this._tcTimers = [];
    this._wheelLock = 0;

    this._buildDom();
    this._buildScene();
    this._bind();
    this.renderer.setAnimationLoop(() => this._tick());
  }

  static chZ(i) { return -i * 46; }

  /* ---------------- DOM ---------------- */
  _buildDom() {
    const root = document.createElement('div');
    root.className = 'game';
    root.innerHTML = `
      <canvas class="game__canvas"></canvas>
      <div class="game__grade" aria-hidden="true"></div>
      <div class="game__bar game__bar--top" aria-hidden="true"></div>
      <div class="game__bar game__bar--bottom" aria-hidden="true"></div>

      <button class="game__exit" type="button" title="Leave the story (Esc)">✕ <span>Exit story</span></button>
      <button class="game__mute" type="button" title="Toggle sound">♪</button>

      <div class="scene" hidden>
        <div class="scene__kicker"></div>
        <div class="scene__text"></div>
        <div class="scene__stats"></div>
        <div class="scene__widget"></div>
        <ul class="scene__tags"></ul>
        <div class="scene__choices" hidden></div>
      </div>

      <div class="game__nav">
        <button class="game__nav-prev" type="button" title="Previous (←)">‹</button>
        <div class="game__nav-mid">
          <span class="game__nav-label"></span>
          <div class="game__nav-ticks"></div>
        </div>
        <button class="game__nav-next" type="button" title="Continue (Enter)">›</button>
      </div>

      <div class="game__hint">
        <span class="game__hint-desktop">Click, scroll or <kbd>Enter</kbd> to continue · <kbd>←</kbd> back · <kbd>Esc</kbd> leave</span>
        <span class="game__hint-touch">Tap or swipe up to continue</span>
      </div>

      <div class="tc" aria-hidden="true">
        <span class="tc__numeral"></span>
        <span class="tc__name"></span>
        <span class="tc__dates"></span>
      </div>

      <div class="game__screen game__screen--intro">
        <p class="game__screen-kicker">Rishi Vendhan K K</p>
        <h1 class="game__screen-title">THE PATHWAY</h1>
        <p class="game__screen-sub">
          A cinematic story in seven chapters — how a mechanical engineer became
          the person you call when software has to actually ship. It reads at your
          pace, and when the story offers you its moments, they’re yours to take.
          <em>≈ 3 minutes.</em>
        </p>
        <button class="game__start" type="button">Begin</button>
        <p class="game__screen-keys">I · Origin — II · First Contact — III · The Paper Factory — IV · The Machines Learn — V · After Hours — VI · The Craft — VII · The Unwritten Chapter</p>
      </div>

      <div class="game__screen game__screen--end" hidden>
        <p class="game__screen-kicker">VII · Open to work</p>
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
      scene: root.querySelector('.scene'),
      kicker: root.querySelector('.scene__kicker'),
      text: root.querySelector('.scene__text'),
      stats: root.querySelector('.scene__stats'),
      widget: root.querySelector('.scene__widget'),
      tags: root.querySelector('.scene__tags'),
      choices: root.querySelector('.scene__choices'),
      navLabel: root.querySelector('.game__nav-label'),
      ticks: root.querySelector('.game__nav-ticks'),
      prev: root.querySelector('.game__nav-prev'),
      next: root.querySelector('.game__nav-next'),
      tc: root.querySelector('.tc'),
      tcNumeral: root.querySelector('.tc__numeral'),
      tcName: root.querySelector('.tc__name'),
      tcDates: root.querySelector('.tc__dates'),
      intro: root.querySelector('.game__screen--intro'),
      end: root.querySelector('.game__screen--end'),
      mute: root.querySelector('.game__mute'),
    };

    CHAPTERS.forEach((c, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.title = `${c.numeral} · ${c.title}`;
      d.addEventListener('click', () => this._jumpToChapter(i));
      this.el.ticks.appendChild(d);
    });

    requestAnimationFrame(() => root.classList.add('is-on'));
  }

  /* ---------------- word-by-word cinematic reveal ---------------- */
  revealText(el, html, done) {
    this.finishReveal();
    el.classList.remove('is-done');
    el.innerHTML = html;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);
    let idx = 0;
    textNodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((tok) => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
        const s = document.createElement('span');
        s.className = 'w';
        s.style.animationDelay = `${idx * 36}ms`;
        s.textContent = tok;
        frag.appendChild(s);
        idx++;
      });
      node.parentNode.replaceChild(frag, node);
    });
    const total = idx * 36 + 560;
    this._reveal = {
      el,
      done,
      t0: performance.now(),
      total,
      timer: setTimeout(() => { this._reveal = null; done?.(); }, total),
    };
  }
  finishReveal() {
    if (!this._reveal) return false;
    clearTimeout(this._reveal.timer);
    this._reveal.el.classList.add('is-done');
    const d = this._reveal.done;
    this._reveal = null;
    d?.();
    return true;
  }
  get isRevealing() { return !!this._reveal; }

  /* character typewriter — used inside the chat moment */
  typeInto(el, text, done, cps = 2) {
    if (this._typing) { clearInterval(this._typing.timer); this._typing.finish(); }
    el.textContent = '';
    let i = 0;
    const finish = () => { el.textContent = text; this._typing = null; done?.(); };
    const timer = setInterval(() => {
      i += cps;
      el.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(timer); finish(); }
    }, 16);
    this._typing = { timer, finish };
  }

  /* ---------------- story engine ---------------- */
  _begin() {
    if (this.state !== 'title') return;
    this.el.intro.hidden = true;
    this.root.classList.add('is-reading');
    this.stepIndex = -1;
    this._advance();
  }

  _advance() {
    if (this.state === 'transition') { this._skipTitleCard(); return; }
    if (this._reveal) {
      // mid-reveal: first press completes the line; but if the line is
      // already essentially on screen, the press should just advance
      const nearlyDone = performance.now() - this._reveal.t0 > this._reveal.total - 450;
      this.finishReveal();
      if (!nearlyDone) return;
    }
    const step = this.script[this.stepIndex + 1];
    if (!step) return;
    this.stepIndex++;
    this._renderStep(step);
  }

  _goBack() {
    if (this.state !== 'scene' || this.stepIndex <= 0) return;
    this.finishReveal();
    let i = this.stepIndex - 1;
    while (i > 0 && this.script[i].choice?.consumed) i--;
    this.stepIndex = i;
    this._renderStep(this.script[i], true);
  }

  _renderStep(step, isBack = false) {
    if (step.ch !== this.currentCh && !isBack) {
      this.currentCh = step.ch;
      this._travelTo(CHAPTERS[step.ch], () => this._showStep(step));
    } else {
      if (step.ch !== this.currentCh) {
        this.currentCh = step.ch;
        this._camTween = { from: this.camZ, to: PortfolioGame.chZ(step.ch) + 16, t0: performance.now(), dur: 900 };
      }
      this._showStep(step);
    }
    if (!isBack) this.sfx.next();
    this._updateProgress();
  }

  /* cinematic chapter transition: fade to black → title card → reveal */
  _travelTo(ch, then) {
    this.state = 'transition';
    this.el.scene.hidden = true;
    this.sfx.swell();
    this.el.tcNumeral.textContent = ch.numeral;
    this.el.tcName.textContent = ch.title;
    this.el.tcDates.textContent = ch.dates;
    this.root.classList.add('is-tc');
    this._pendingShow = then;
    this._tcTimers.forEach(clearTimeout);
    this._tcTimers = [
      setTimeout(() => {
        this._camTween = { from: this.camZ, to: PortfolioGame.chZ(CHAPTERS.indexOf(ch)) + 16, t0: performance.now(), dur: 1400 };
      }, 350),
      setTimeout(() => { this.root.classList.remove('is-tc'); }, 2450),
      setTimeout(() => {
        this.state = 'scene';
        const cb = this._pendingShow;
        this._pendingShow = null;
        cb?.();
      }, 2850),
    ];
  }
  _skipTitleCard() {
    if (this.state !== 'transition') return;
    this._tcTimers.forEach(clearTimeout);
    this._tcTimers = [];
    this.camZ = PortfolioGame.chZ(this.currentCh) + 16;
    this._camTween = null;
    this.root.classList.remove('is-tc');
    this.state = 'scene';
    const cb = this._pendingShow;
    this._pendingShow = null;
    cb?.();
  }

  _showStep(step) {
    this.state = 'scene';
    const ch = CHAPTERS[step.ch];
    this.el.kicker.textContent = `${ch.numeral} · ${ch.title}`;

    this.el.widget.innerHTML = '';
    this.el.stats.innerHTML = '';
    this.el.tags.innerHTML = '';
    this.el.choices.hidden = true;
    this.el.choices.innerHTML = '';
    this.el.next.hidden = false;
    this.el.prev.disabled = this.stepIndex <= 0;

    if (step.end) { this._finish(); return; }

    if (step.choice && !step.choice.consumed) {
      this.el.next.hidden = true;
      this.revealText(this.el.text, step.choice.prompt, () => {
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
      this._advance();
      return;
    } else {
      this.revealText(this.el.text, step.text, () => {
        if (step.stats) this._renderStats(step.stats);
        if (step.tags) this.el.tags.innerHTML = step.tags.map((t) => `<li>${t}</li>`).join('');
        if (step.widget && WIDGETS[step.widget]) WIDGETS[step.widget](this.el.widget, this);
      });
    }
    this.el.scene.hidden = false;
  }

  /* large numbers that count up as they appear */
  _renderStats(stats) {
    this.el.stats.innerHTML = stats
      .map(([v, l], i) => `<div class="scene__stat" style="animation-delay:${i * 120}ms"><b>${v}</b><span>${l}</span></div>`)
      .join('');
    this.el.stats.querySelectorAll('b').forEach((b) => {
      const raw = b.textContent;
      const m = raw.match(/^([~≈]?)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!m) return;
      const target = parseFloat(m[2].replace(/,/g, ''));
      const dec = m[2].includes('.') ? 1 : 0;
      const t0 = performance.now();
      const dur = 1100;
      const step = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3);
        b.textContent = m[1] + (dec ? (target * e).toFixed(1) : Math.round(target * e).toLocaleString('en-US')) + m[3];
        if (t < 1 && !this.disposed) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  _resolveChoice(step, opt) {
    step.choice.consumed = true;
    const idx = this.script.indexOf(step);
    const beats = opt.order.map((k) => ({ ch: step.ch, ...AGENT_BEATS[k] }));
    this.script.splice(idx + 1, 0, ...beats);
    this.sfx.success();
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
    if (this.state === 'title' || this.disposed) return;
    if (this.state === 'end') {
      this.el.end.classList.remove('is-open');
      this.el.end.hidden = true;
    }
    this._resolvePendingChoices();
    const target = this.script.findIndex((s) => s.ch === chIdx && !s.choice);
    if (target === -1) return;
    this.finishReveal();
    this.stepIndex = target;
    this.currentCh = chIdx;
    this.sfx.ui();
    this._travelTo(CHAPTERS[chIdx], () => this._showStep(this.script[target]));
    this._updateProgress();
  }

  _updateProgress() {
    const ch = CHAPTERS[Math.max(this.currentCh, 0)];
    this.el.navLabel.textContent = `${ch.numeral} · ${ch.title}`;
    [...this.el.ticks.children].forEach((d, i) => {
      d.classList.toggle('is-done', i < this.currentCh);
      d.classList.toggle('is-here', i === this.currentCh);
    });
  }

  _finish() {
    this.state = 'end';
    this.el.scene.hidden = true;
    [...this.el.ticks.children].forEach((d) => d.classList.add('is-done'));
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
    this.state = 'scene';
    this._advance();
  }

  /* the paper wall in the scene turns to light when the reader digitizes */
  fxFactory() {
    if (!this._paperCells) return;
    this._paperCells.forEach((m, i) => {
      setTimeout(() => {
        m.material.color.setHex(ACCENT);
        m.material.opacity = 0.55;
      }, i * 40);
    });
  }

  /* ---------------- 3D world ---------------- */
  _buildScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BG, 0.016);
    this.camera = new THREE.PerspectiveCamera(56, innerWidth / innerHeight, 0.1, 600);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(BG, 1);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.clock = new THREE.Clock();

    this._buildFloor();
    this._buildSky();
    this._buildMotifs();
  }

  _buildFloor() {
    const cols = 150, rows = 100;
    const count = cols * rows;
    const pos = new Float32Array(count * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        pos[i * 3] = (x / (cols - 1) - 0.5) * 130;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = 45 - (z / (rows - 1)) * 420;
        i++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.floorUniforms = { uTime: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      vertexShader: floorVertex,
      fragmentShader: floorFragment,
      uniforms: this.floorUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.position.y = -6;
    this.scene.add(pts);
  }

  _buildSky() {
    // distant stars
    const starCount = 1600;
    const sPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 180 + Math.random() * 260;
      const a = Math.random() * Math.PI * 2;
      const h = Math.random();
      sPos[i * 3] = Math.cos(a) * r;
      sPos[i * 3 + 1] = h * 180 - 30;
      sPos[i * 3 + 2] = Math.sin(a) * r - 160;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    this.scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
      color: 0xbfd8ff, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false,
    })));

    // slow drifting dust, closer to camera
    const dustCount = 260;
    const dPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 90;
      dPos[i * 3 + 1] = Math.random() * 24 - 4;
      dPos[i * 3 + 2] = 40 - Math.random() * 400;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    this.dust = new THREE.Points(dGeo, new THREE.PointsMaterial({
      color: ACCENT, size: 0.5, sizeAttenuation: true, transparent: true, opacity: 0.5,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.scene.add(this.dust);

    // soft nebula glows along the journey
    for (let i = 0; i < CHAPTERS.length; i++) {
      const neb = makeGlowSprite(i % 2 ? '#8a7dff' : '#6ee7ff', 70 + (i % 3) * 30, 0.14);
      neb.position.set((i % 2 ? 1 : -1) * (18 + (i % 3) * 8), 10 + (i % 3) * 5, PortfolioGame.chZ(i) - 40);
      this.scene.add(neb);
    }
    // and a destination light at the far end
    const sun = makeGlowSprite('#8a7dff', 160, 0.4);
    sun.position.set(0, 20, PortfolioGame.chZ(CHAPTERS.length - 1) - 130);
    this.scene.add(sun);
    const sunCore = makeGlowSprite('#6ee7ff', 70, 0.5);
    sunCore.position.copy(sun.position).z += 2;
    this.scene.add(sunCore);
  }

  /* One quiet, abstract motif per chapter — set dressing, never louder
     than the words. */
  _buildMotifs() {
    this.animated = [];
    const dim = (color, opacity = 0.2) =>
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });

    // I — interlocking gears
    {
      const z = PortfolioGame.chZ(0) - 14;
      const g1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.34, 6, 9), dim(ACCENT2, 0.22));
      g1.position.set(-8.5, 4.4, z);
      const g2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.26, 6, 7), dim(ACCENT, 0.26));
      g2.position.set(-5.4, 6.4, z - 2);
      this.scene.add(g1, g2);
      this.animated.push({ obj: g1, spin: 0.18 }, { obj: g2, spin: -0.28 });
    }
    // II — tenant towers linked to one core
    {
      const z = PortfolioGame.chZ(1) - 14;
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8, 0),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
      );
      core.position.set(8.5, 5.4, z);
      this.scene.add(core);
      this.animated.push({ obj: core, spin: 0.4 });
      const glow = makeGlowSprite('#6ee7ff', 4, 0.5);
      glow.position.copy(core.position);
      this.scene.add(glow);
      const linePts = [];
      for (let i = 0; i < 8; i++) {
        const h = 1 + Math.random() * 2.2;
        const tower = new THREE.Mesh(new THREE.BoxGeometry(0.4, h, 0.4), dim(ACCENT2, 0.2));
        tower.position.set(8.5 + Math.cos((i / 8) * Math.PI * 2) * 4, 1.5 + h / 2, z + Math.sin((i / 8) * Math.PI * 2) * 3);
        this.scene.add(tower);
        linePts.push(tower.position.clone().setY(tower.position.y + h / 2), core.position.clone());
      }
      this.scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(linePts),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending })
      ));
    }
    // III — a wall of paper that can turn to light
    {
      const z = PortfolioGame.chZ(2) - 15;
      this._paperCells = [];
      for (let cx = 0; cx < 6; cx++) {
        for (let cy = 0; cy < 4; cy++) {
          const cell = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 1.05),
            new THREE.MeshBasicMaterial({ color: 0xd8d6e6, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
          );
          cell.position.set(-10.5 + cx * 1.05, 2.6 + cy * 1.3, z - cx * 0.12);
          cell.rotation.y = 0.5;
          this.scene.add(cell);
          this._paperCells.push(cell);
        }
      }
    }
    // IV — a pulsing constellation of minds
    {
      const z = PortfolioGame.chZ(3) - 14;
      const nodes = [];
      for (let i = 0; i < 20; i++) {
        const s = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.13, 0),
          new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? ACCENT2 : ACCENT,
            transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false,
          })
        );
        s.position.set(7 + (Math.random() - 0.5) * 6, 4.5 + (Math.random() - 0.5) * 4.5, z + (Math.random() - 0.5) * 4);
        s.userData.seed = i;
        this.scene.add(s);
        nodes.push(s);
        this.animated.push({ obj: s, pulse: true });
      }
      const pts = [];
      nodes.forEach((a, i) => { pts.push(a.position.clone(), nodes[(i + 3) % nodes.length].position.clone()); });
      this.scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })
      ));
    }
    // V — three floating artifacts
    {
      const z = PortfolioGame.chZ(4) - 14;
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 0), dim(i === 1 ? ACCENT2 : ACCENT, 0.24));
        m.position.set(-9 + i * 2.6, 3.6 + (i % 2) * 1.8, z - i * 1.5);
        this.scene.add(m);
        this.animated.push({ obj: m, spin: 0.2 + i * 0.08 });
      }
    }
    // VI — a quiet field of points (the craft)
    {
      const z = PortfolioGame.chZ(5) - 14;
      const count = 60;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = 8 + (Math.random() - 0.5) * 8;
        pos[i * 3 + 1] = 4.5 + (Math.random() - 0.5) * 5;
        pos[i * 3 + 2] = z + (Math.random() - 0.5) * 6;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: ACCENT, size: 0.28, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending,
      })));
    }
    // VII — an open ring of light
    {
      const z = PortfolioGame.chZ(6) - 16;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(4.6, 0.07, 12, 80),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring.position.set(0, 5, z);
      this.scene.add(ring);
      this.animated.push({ obj: ring, spinZ: 0.1 });
      const glow = makeGlowSprite('#6ee7ff', 11, 0.35);
      glow.position.copy(ring.position);
      this.scene.add(glow);
    }
  }

  /* ---------------- input ---------------- */
  _bind() {
    this._onKeyDown = (e) => {
      if (e.repeat) return;
      switch (e.key) {
        case 'Escape': this.exit(); break;
        case 'Enter': case ' ': case 'ArrowRight': case 'ArrowDown':
          if (this.state === 'title') this._begin();
          else if (this.state === 'scene' || this.state === 'transition') this._advance();
          else if (this.state === 'end') this._replay();
          e.preventDefault();
          break;
        case 'ArrowLeft': case 'ArrowUp': case 'Backspace':
          if (this.state === 'scene') { this._goBack(); e.preventDefault(); }
          break;
      }
    };
    window.addEventListener('keydown', this._onKeyDown);

    this._onPointerMove = (e) => {
      this.mouse.x = (e.clientX / innerWidth - 0.5) * 2;
      this.mouse.y = -(e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', this._onPointerMove, { passive: true });

    // clicking the world advances; clicking during a transition skips it
    this._onCanvasClick = () => {
      if (this.state === 'scene') this._advance();
      else if (this.state === 'transition') this._skipTitleCard();
    };
    this.canvas.addEventListener('click', this._onCanvasClick);
    this.el.tc.addEventListener('click', this._onCanvasClick);

    // scroll to move through the story, like a film strip
    this._onWheel = (e) => {
      if (e.target.closest('.scene__widget') || e.target.closest('.game__screen')) return;
      const now = performance.now();
      if (now - this._wheelLock < 750 || Math.abs(e.deltaY) < 25) return;
      this._wheelLock = now;
      if (this.state === 'title' && e.deltaY > 0) { this._begin(); return; }
      if (this.state !== 'scene') return;
      if (e.deltaY > 0) this._advance();
      else this._goBack();
    };
    window.addEventListener('wheel', this._onWheel, { passive: true });

    // swipe on touch
    this._touchY = null;
    this._onTouchStart = (e) => { this._touchY = e.touches[0]?.clientY ?? null; };
    this._onTouchEnd = (e) => {
      if (this._touchY === null) return;
      const dy = this._touchY - (e.changedTouches[0]?.clientY ?? this._touchY);
      this._touchY = null;
      if (e.target.closest('.scene__widget') || e.target.closest('.game__screen') || e.target.closest('.game__nav')) return;
      if (Math.abs(dy) < 55) return;
      if (this.state === 'title' && dy > 0) { this._begin(); return; }
      if (this.state !== 'scene') return;
      if (dy > 0) this._advance();
      else this._goBack();
    };
    window.addEventListener('touchstart', this._onTouchStart, { passive: true });
    window.addEventListener('touchend', this._onTouchEnd, { passive: true });

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
    this.el.prev.addEventListener('click', () => this._goBack());
    this.el.text.addEventListener('click', () => this.finishReveal());
  }

  /* ---------------- frame loop ---------------- */
  _tick() {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    this.floorUniforms.uTime.value = time;
    if (this.dust) this.dust.rotation.y = Math.sin(time * 0.03) * 0.04;

    for (const a of this.animated) {
      if (a.spin) { a.obj.rotation.x += a.spin * dt; a.obj.rotation.y += a.spin * 0.7 * dt; }
      if (a.spinZ) a.obj.rotation.z += a.spinZ * dt;
      if (a.pulse) a.obj.scale.setScalar(1 + Math.sin(time * 1.6 + a.obj.userData.seed) * 0.3);
    }

    if (this._camTween) {
      const { from, to, t0, dur } = this._camTween;
      const t = Math.min((performance.now() - t0) / dur, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.camZ = from + (to - from) * ease;
      if (t >= 1) this._camTween = null;
    }
    if (this.state === 'title') this.camZ = 30 - Math.sin(time * 0.1) * 1.5;

    // slow dolly drift + gentle parallax — the film never fully stops
    const drift = Math.sin(time * 0.12) * 0.7;
    this.camera.position.set(
      this.mouse.x * 1.3 + drift,
      2.2 + this.mouse.y * 0.55 + Math.sin(time * 0.2) * 0.2,
      this.camZ
    );
    this.camera.lookAt(drift * 0.4, 2.6, this.camZ - 32);

    this.renderer.render(this.scene, this.camera);
  }

  /* ---------------- teardown ---------------- */
  exit() {
    if (this.disposed) return;
    this.disposed = true;
    this.finishReveal();
    if (this._typing) { clearInterval(this._typing.timer); this._typing = null; }
    this._tcTimers.forEach(clearTimeout);
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('wheel', this._onWheel);
    window.removeEventListener('touchstart', this._onTouchStart);
    window.removeEventListener('touchend', this._onTouchEnd);
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
