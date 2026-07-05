/* =========================================================================
   PORTFOLIO: THE PATHWAY — 3D game mode
   A neon runner along a winding light-road. Each checkpoint gate opens a
   chapter of the portfolio. Lazy-loaded; the normal site stays untouched.
   ========================================================================= */
import * as THREE from 'three';
import './arcade.css';

/* ---------- Portfolio content, expressed as game levels ---------- */
const CHECKPOINTS = [
  {
    key: 'about',
    gate: 'ABOUT',
    zone: 'Sector 01 · Origin',
    title: 'The Builder',
    meta: 'Chennai, India · UTC+5:30',
    desc:
      'Full Stack Engineer who owns features <em>end to end</em> — from architecture and API design through deployment — and ships AI that solves real business problems. Strong across React.js, Node.js / Express, Python and SQL / NoSQL, with proven results in performance, multi-tenant systems and GenAI engineering.',
    stats: [
      ['~4.5', 'years of experience'],
      ['9,000+', 'work orders digitized'],
      ['200', 'users on SSO platform'],
      ['35%', 'faster API responses'],
    ],
    tags: ['React.js', 'Node.js', 'Python', 'PostgreSQL', 'RAG', 'Multi-agent'],
  },
  {
    key: 'work-1',
    gate: 'WORK 01',
    zone: 'Sector 02 · Shipped',
    title: 'Production Planning System',
    meta: 'Different Hair · 2025',
    desc:
      'Architected and shipped an 8-module platform that digitized a fully manual, handwritten process — managing 9,000+ work orders, 4,500+ SKUs, 16 BORs and 8 stations, with a real-time timeline tracking every work order’s full lifecycle. Owned design through deployment with company leadership.',
    stats: [
      ['9,000+', 'work orders'],
      ['30', 'daily users'],
      ['8', 'modules · RBAC'],
    ],
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL'],
  },
  {
    key: 'work-2',
    gate: 'WORK 02',
    zone: 'Sector 02 · Shipped',
    title: 'Multi-Platform Content Agent',
    meta: 'GenAI · Multi-agent',
    desc:
      'An autonomous multi-agent system that produces complete daily social posts — images, copy, captions and hashtags — end-to-end from a single prompt, tailored separately for 8 platforms. Eliminated manual content production across the team’s channels.',
    stats: [
      ['8', 'platforms'],
      ['1', 'prompt → full posts'],
      ['0', 'manual steps'],
    ],
    tags: ['LangChain', 'LangGraph', 'n8n', 'Multi-agent'],
  },
  {
    key: 'work-3',
    gate: 'WORK 03',
    zone: 'Sector 02 · Shipped',
    title: 'Production RAG Chatbot',
    meta: 'Deployed · Live',
    desc:
      'A deployed RAG chatbot over complex internal data using vector databases and LangChain, embedded as a live widget. Fields 30–150 user queries a day with accurate self-serve answers, cutting repetitive support load.',
    stats: [
      ['30–150', 'queries / day'],
      ['Live', 'widget'],
      ['RAG', 'grounded'],
    ],
    tags: ['RAG', 'Vector DBs', 'LangChain', 'Python'],
    link: { href: 'https://hc-chat-widget.vercel.app', label: 'Open live demo ↗' },
  },
  {
    key: 'work-4',
    gate: 'WORK 04',
    zone: 'Sector 02 · Shipped',
    title: 'SEO Analytics Agent',
    meta: 'Automation · Python',
    desc:
      'A custom agent that ingests Google Search Console and GA4 data and auto-delivers scheduled weekly SEO, AEO and GEO reports — reducing manual reporting from 15 hours a week to under 30 minutes.',
    stats: [
      ['15 hrs → 30 min', 'weekly reporting'],
      ['GSC + GA4', 'data sources'],
      ['Weekly', 'auto-reports'],
    ],
    tags: ['Python', 'n8n', 'GA4', 'Search Console'],
  },
  {
    key: 'work-5',
    gate: 'WORK 05',
    zone: 'Sector 02 · Shipped',
    title: 'Email-Marketing Analytics',
    meta: 'CX Analytix · B2B',
    desc:
      'A B2B analytics product that surfaces campaign KPIs through live dashboards, giving clients real-time visibility into performance and cutting manual reporting by ~10 hours a week.',
    stats: [
      ['~10 hrs/wk', 'saved'],
      ['Live', 'dashboards'],
      ['Real-time', 'KPIs'],
    ],
    tags: ['Node.js', 'Python', 'PostgreSQL'],
  },
  {
    key: 'work-6',
    gate: 'WORK 06',
    zone: 'Sector 02 · Shipped',
    title: 'Multi-Tenant SSO Platform',
    meta: 'Minsway · Platform',
    desc:
      'A single sign-on system serving 200 users across ~25 tenants — centralizing authentication and access control with secure, tenant-aware session handling. Paired with Monad, a Saudi B2B wholesale platform where API response time was cut by 35%.',
    stats: [
      ['200', 'users'],
      ['~25', 'tenants'],
      ['35%', 'faster APIs'],
    ],
    tags: ['React', 'Node.js', 'MSSQL', 'SSO · Caching'],
  },
  {
    key: 'stack',
    gate: 'STACK',
    zone: 'Sector 03 · Arsenal',
    title: 'Tools I Reach For',
    meta: 'Full stack · GenAI · Automation',
    desc:
      '<b>Languages</b> — JavaScript, Python, SQL. <b>Frontend</b> — React.js, Tailwind CSS, shadcn/ui. <b>Backend</b> — Node.js, Express.js, FastAPI, Flask. <b>Databases</b> — PostgreSQL, MongoDB, MSSQL, Neo4j, pgvector. <b>GenAI</b> — RAG, LangChain, LangGraph, MCP, multi-agent systems. <b>Automation</b> — n8n, RPA, Playwright.',
    stats: [
      ['8', 'skill domains'],
      ['CI/CD', 'Vercel · Render'],
      ['E2E', 'ownership'],
    ],
    tags: ['Agile / Scrum', 'Git / GitHub', 'Multi-tenant SSO', 'Knowledge Graphs', 'Prompt Eng.'],
  },
  {
    key: 'experience',
    gate: 'EXPERIENCE',
    zone: 'Sector 04 · Timeline',
    title: 'Where I’ve Worked',
    meta: 'Dec 2021 — Present',
    desc:
      '<b>Full Stack Developer</b> · Different Hair &amp; CX Analytix (May 2025 — Present) — production web apps and GenAI systems end-to-end. <br /><br /><b>Software Engineer</b> · Minsway Solutions (Dec 2021 — May 2025) — React dashboards and Node.js APIs for Monad, a Saudi B2B wholesale platform; 35% faster APIs, multi-tenant SSO for 200 users. <br /><br /><b>B.E., Mechanical Engineering</b> · Easwari Engineering College, SRM Group (2017 — 2021).',
    stats: [
      ['2', 'companies'],
      ['~4.5', 'years shipping'],
      ['Agile', 'sprints'],
    ],
    tags: ['React', 'Node.js', 'Python', 'MSSQL', 'LangChain', 'n8n'],
  },
  {
    key: 'labs',
    gate: 'LABS',
    zone: 'Sector 05 · Side quests',
    title: 'Built On My Own Time',
    meta: 'Independent projects',
    desc:
      '<b>AI Medical Report Scanner</b> — reads lab reports and explains real health status in plain language (OCR / vision + LLM + medical knowledge layer). <br /><br /><b>Food-Image Nutrition Analyzer</b> — a meal photo becomes a full macro breakdown via a vision LLM and nutrition DB. <br /><br /><b>Fun Friday Arena</b> — real-time multiplayer gaming platform (UNO, chess) over WebSockets. Yes — building games is the side quest.',
    stats: [
      ['3', 'projects'],
      ['4', 'certifications'],
      ['∞', 'curiosity'],
    ],
    tags: ['Vision LLM', 'Python', 'WebSockets', 'React', 'Node.js'],
  },
];

const SKILL_WORDS = [
  'React.js', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'MSSQL', 'RAG',
  'LangChain', 'LangGraph', 'MCP', 'n8n', 'FastAPI', 'Neo4j', 'pgvector',
  'Tailwind', 'Express', 'Playwright', 'SSO', 'Multi-agent', 'Knowledge Graphs',
];

const ACCENT = 0x6ee7ff;
const ACCENT2 = 0x8a7dff;
const BG = 0x06060a;

/* ---------- Tiny synth for UI/game feedback (no assets) ---------- */
class Sfx {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  _ensure() {
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    } catch {
      this.ctx = null;
    }
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
    } catch { /* audio is best-effort */ }
  }
  collect() { this.tone(1046, 0.09, 'triangle', 0.05, 500); }
  gate() { this.tone(392, 0.3, 'sine', 0.05, 300); this.tone(587, 0.34, 'triangle', 0.035, 200); }
  start() { this.tone(261, 0.14, 'triangle', 0.05, 260); }
  finish() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.22, 'triangle', 0.05), i * 110)); }
  ui() { this.tone(660, 0.05, 'sine', 0.03); }
}

/* ---------- Canvas-texture helpers ---------- */
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
  ctx.clearRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(110, 231, 255, 0.34)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0.5, 0.5, 127, 127);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(90, 90);
  return tex;
}

/* ---------- Road shader ---------- */
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

    float flowSpeed = 2.2 + uBoost * 4.0;
    float flow = smoothstep(0.1, 0.0, abs(fract(vUv.y * 0.35 - uTime * flowSpeed * 0.08) - 0.5)) * (0.10 + uBoost * 0.22);

    vec3 col = base
      + accent * (edge * 1.25 + edgeSoft)
      + accent2 * center * dash * 0.85
      + accent * flow;

    gl_FragColor = vec4(col, 0.94);
  }
`;

/* ============================ THE GAME ============================ */
export class PortfolioArcade {
  constructor({ onExit } = {}) {
    this.onExit = onExit || (() => {});
    this.sfx = new Sfx();
    this.state = 'intro'; // intro | running | panel | end
    this.disposed = false;

    this.playerU = 0.012;      // position along the curve (0..1)
    this.playerLat = 0;        // lateral offset on the road
    this.targetLat = 0;
    this.baseSpeed = 24;       // world units / second
    this.boost = 0;
    this.cores = 0;
    this.startTime = 0;
    this.elapsedAtEnd = 0;

    this.keys = { left: false, right: false, boost: false };
    this.pointerSteer = null;  // -1..1 while touch/drag steering

    this._buildDom();
    this._buildScene();
    this._bind();
    this.renderer.setAnimationLoop(() => this._tick());
  }

  /* ---------------- DOM / HUD ---------------- */
  _buildDom() {
    const root = document.createElement('div');
    root.className = 'arcade';
    root.innerHTML = `
      <canvas class="arcade__canvas"></canvas>
      <div class="arcade__vignette" aria-hidden="true"></div>

      <div class="arcade__hud">
        <button class="arcade__exit" type="button" title="Exit game (Esc)">✕ <span>Exit</span></button>
        <div class="arcade__track">
          <div class="arcade__track-fill"></div>
          <div class="arcade__track-dots"></div>
        </div>
        <div class="arcade__right">
          <span class="arcade__cores"><i>⬢</i> <b class="arcade__cores-n">0</b>/<span class="arcade__cores-t">0</span></span>
          <button class="arcade__mute" type="button" title="Toggle sound">♪</button>
        </div>
      </div>

      <div class="arcade__zone" aria-live="polite"></div>
      <div class="arcade__toast" aria-hidden="true"></div>

      <div class="arcade__hint">
        <span class="arcade__hint-desktop"><kbd>◀</kbd><kbd>▶</kbd> steer &nbsp;·&nbsp; <kbd>W</kbd> boost &nbsp;·&nbsp; <kbd>Esc</kbd> exit</span>
        <span class="arcade__hint-touch">Drag to steer · your ship flies itself</span>
      </div>

      <div class="arcade__panel" hidden>
        <div class="gpanel"></div>
      </div>

      <div class="arcade__screen arcade__screen--intro">
        <p class="arcade__screen-kicker">Rishi Vendhan K K presents</p>
        <h1 class="arcade__screen-title">PORTFOLIO<span>:</span> THE&nbsp;PATHWAY</h1>
        <p class="arcade__screen-sub">
          Pilot a light-ship down the career pathway. Pass the gates to unlock
          each chapter — work, stack, experience — and collect data&nbsp;cores on the way.
        </p>
        <button class="arcade__start" type="button">▶ &nbsp;Start the run</button>
        <p class="arcade__screen-keys">
          <span><kbd>◀</kbd> <kbd>▶</kbd> or <kbd>A</kbd> <kbd>D</kbd> — steer</span>
          <span><kbd>W</kbd> / <kbd>▲</kbd> — boost</span>
          <span><kbd>Enter</kbd> — continue</span>
          <span>On touch — drag to steer</span>
        </p>
      </div>

      <div class="arcade__screen arcade__screen--end" hidden>
        <p class="arcade__screen-kicker">Run complete</p>
        <h1 class="arcade__screen-title">LET’S BUILD<br/>SOMETHING <span class="arcade__screen-accent">REAL</span></h1>
        <div class="arcade__end-stats"></div>
        <div class="arcade__end-links">
          <a href="mailto:rishivendhan.tech@gmail.com">rishivendhan.tech@gmail.com</a>
          <a href="https://www.linkedin.com/in/rishivendhan" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="https://github.com/rishivendhan84" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="/Rishi_Vendhan_Resume.docx" download>Résumé ↓</a>
        </div>
        <div class="arcade__end-actions">
          <button class="arcade__start arcade__replay" type="button">↻ &nbsp;Run it again</button>
          <button class="arcade__ghostbtn arcade__end-exit" type="button">Back to the portfolio</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    this.root = root;
    this.canvas = root.querySelector('.arcade__canvas');
    this.el = {
      trackFill: root.querySelector('.arcade__track-fill'),
      trackDots: root.querySelector('.arcade__track-dots'),
      coresN: root.querySelector('.arcade__cores-n'),
      coresT: root.querySelector('.arcade__cores-t'),
      zone: root.querySelector('.arcade__zone'),
      toast: root.querySelector('.arcade__toast'),
      panel: root.querySelector('.arcade__panel'),
      panelBox: root.querySelector('.gpanel'),
      intro: root.querySelector('.arcade__screen--intro'),
      end: root.querySelector('.arcade__screen--end'),
      endStats: root.querySelector('.arcade__end-stats'),
      hint: root.querySelector('.arcade__hint'),
      mute: root.querySelector('.arcade__mute'),
    };

    // one dot per checkpoint on the progress rail
    CHECKPOINTS.forEach((cp) => {
      const d = document.createElement('i');
      d.style.left = `${cp.uRatio ? cp.uRatio * 100 : 0}%`;
      this.el.trackDots.appendChild(d);
    });

    requestAnimationFrame(() => root.classList.add('is-on'));
  }

  _panelHTML(cp) {
    const stats = cp.stats
      ? `<div class="gpanel__stats">${cp.stats.map(([b, l]) => `<span><b>${b}</b> ${l}</span>`).join('')}</div>`
      : '';
    const tags = cp.tags
      ? `<ul class="gpanel__tags">${cp.tags.map((t) => `<li>${t}</li>`).join('')}</ul>`
      : '';
    const link = cp.link
      ? `<a class="gpanel__link" href="${cp.link.href}" target="_blank" rel="noopener noreferrer">${cp.link.label}</a>`
      : '';
    return `
      <div class="gpanel__head">
        <span class="gpanel__gate">◈ ${cp.gate} · UNLOCKED</span>
        <span class="gpanel__meta">${cp.meta || ''}</span>
      </div>
      <h2 class="gpanel__title">${cp.title}</h2>
      <p class="gpanel__desc">${cp.desc}</p>
      ${stats}${tags}${link}
      <button class="arcade__start gpanel__continue" type="button">Continue the run &nbsp;<kbd>Enter</kbd></button>
    `;
  }

  /* ---------------- 3D scene ---------------- */
  _buildScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BG, 0.0135);

    this.camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 700);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(BG, 1);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);

    this.clock = new THREE.Clock();

    this._buildPath();
    this._buildRoad();
    this._buildEnvironment();
    this._buildGates();
    this._buildOrbs();
    this._buildShip();

    // progress-rail dots now that u positions exist
    [...this.el.trackDots.children].forEach((d, i) => {
      d.style.left = `${this.gates[i].u * 100}%`;
    });
    this.el.coresT.textContent = String(this.orbs.length);
    this._setZone('Sector 00 · Launch pad');
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

  // point + frame on the road at param u with lateral offset
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
      depthWrite: true,
    });
    this.scene.add(new THREE.Mesh(geo, mat));
    this.roadHalf = HALF;
  }

  _buildEnvironment() {
    // grid ocean beneath everything
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(1600, 1600),
      new THREE.MeshBasicMaterial({
        map: makeGridTexture(),
        transparent: true,
        opacity: 0.30,
        depthWrite: false,
      })
    );
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, -5.5, -360);
    this.scene.add(grid);

    // star dome
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
      color: 0xbfd8ff, size: 1.15, sizeAttenuation: true,
      transparent: true, opacity: 0.8, depthWrite: false,
    })));

    // destination "sun" at the far end of the run
    const sun = makeGlowSprite('#8a7dff', 150);
    sun.position.set(0, 26, -880);
    this.scene.add(sun);
    const sunCore = makeGlowSprite('#6ee7ff', 70);
    sunCore.position.set(0, 26, -878);
    this.scene.add(sunCore);

    // floating wireframe debris beside the road
    this.debris = [];
    const shapes = [
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.OctahedronGeometry(1.9, 0),
      new THREE.TetrahedronGeometry(1.7, 0),
    ];
    for (let i = 0; i < 44; i++) {
      const m = new THREE.Mesh(
        shapes[i % shapes.length],
        new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? ACCENT2 : ACCENT,
          wireframe: true,
          transparent: true,
          opacity: 0.28,
        })
      );
      const u = 0.04 + (i / 44) * 0.94;
      const side = i % 2 === 0 ? 1 : -1;
      this._onPath(u, side * (9 + Math.random() * 18), 2 + Math.random() * 9, m.position);
      m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      m.userData.spin = 0.1 + Math.random() * 0.3;
      const s = 0.5 + Math.random() * 1.4;
      m.scale.setScalar(s);
      this.scene.add(m);
      this.debris.push(m);
    }

    // floating skill words along the route
    SKILL_WORDS.forEach((word, i) => {
      const spr = makeTextSprite(word, {
        size: 46,
        color: i % 3 === 0 ? '#8a7dff' : '#6ee7ff',
        worldScale: 0.014,
      });
      const u = 0.05 + (i / SKILL_WORDS.length) * 0.9;
      const side = i % 2 === 0 ? -1 : 1;
      this._onPath(u, side * (7.5 + (i % 4) * 2.2), 2.6 + (i % 3) * 1.4, spr.position);
      spr.material.opacity = 0.5;
      spr.userData.bobSeed = i * 1.7;
      spr.userData.baseY = spr.position.y;
      this.scene.add(spr);
      this.debris.push(spr);
    });
  }

  _buildGates() {
    this.gates = [];
    const n = CHECKPOINTS.length;
    CHECKPOINTS.forEach((cp, i) => {
      const u = 0.085 + (i / (n - 1)) * 0.82; // last gate at u = 0.905
      const group = new THREE.Group();

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.6, 0.09, 12, 72),
        new THREE.MeshBasicMaterial({
          color: ACCENT,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(4.05, 0.03, 8, 72),
        new THREE.MeshBasicMaterial({
          color: ACCENT2,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      group.add(ring, ring2);

      const label = makeTextSprite(cp.gate, { size: 74, color: '#eceaf6', worldScale: 0.016 });
      label.position.y = 5.6;
      group.add(label);

      const sub = makeTextSprite(cp.title, { size: 40, color: '#6ee7ff', weight: 500, worldScale: 0.013 });
      sub.position.y = 4.55;
      group.add(sub);

      this._onPath(u, 0, 3.0, group.position);
      const ahead = this._onPath(Math.min(u + 0.01, 1), 0, 3.0, new THREE.Vector3());
      group.lookAt(ahead);

      this.scene.add(group);
      this.gates.push({ ...cp, u, group, ring, ring2, label, sub, visited: false });
    });
  }

  _buildOrbs() {
    this.orbs = [];
    const geo = new THREE.IcosahedronGeometry(0.26, 0);
    const gapStarts = [0.03, ...this.gates.map((g) => g.u)];
    for (let g = 0; g < gapStarts.length; g++) {
      const from = gapStarts[g] + 0.012;
      const to = (g + 1 < gapStarts.length ? gapStarts[g + 1] : 0.965) - 0.012;
      if (to <= from) continue;
      const count = 6;
      for (let k = 0; k < count; k++) {
        const u = from + ((k + 0.5) / count) * (to - from);
        const lat = Math.sin((g * 7 + k) * 1.9) * (this.roadHalf - 1.15);
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            color: k % 3 === 0 ? ACCENT2 : ACCENT,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        this._onPath(u, lat, 0.85, mesh.position);
        mesh.userData.baseY = mesh.position.y;
        mesh.userData.seed = g * 10 + k;
        this.scene.add(mesh);
        this.orbs.push({ u, lat, mesh, taken: false });
      }
    }
  }

  _buildShip() {
    const ship = new THREE.Group();

    const hull = new THREE.Mesh(
      new THREE.ConeGeometry(0.34, 1.25, 5),
      new THREE.MeshBasicMaterial({ color: 0x0d0d18 })
    );
    hull.rotation.x = Math.PI / 2; // nose toward +Z (lookAt target)
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
    this._placeShipAndCamera(0, true);
  }

  _placeShipAndCamera(dt, snap = false) {
    this._onPath(this.playerU, this.playerLat, 0.55, this._shipPos);
    this._onPath(this.playerU + 0.006, this.playerLat, 0.55, this._shipAhead);
    this.ship.position.copy(this._shipPos);
    this.ship.lookAt(this._shipAhead);
    this.ship.rotation.z = THREE.MathUtils.clamp((this.targetLat - this.playerLat) * -0.9, -0.5, 0.5);

    this._onPath(this.playerU - 0.011, this.playerLat * 0.55, 2.35, this._camPos);
    this._onPath(this.playerU + 0.012, this.playerLat * 0.3, 1.0, this._camLook);
    if (snap) this.camera.position.copy(this._camPos);
    else this.camera.position.lerp(this._camPos, Math.min(dt * 5, 1));
    this.camera.lookAt(this._camLook);
  }

  /* ---------------- input / events ---------------- */
  _bind() {
    this._onKeyDown = (e) => {
      if (e.repeat) return;
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A': this.keys.left = true; break;
        case 'ArrowRight': case 'd': case 'D': this.keys.right = true; break;
        case 'ArrowUp': case 'w': case 'W': this.keys.boost = true; break;
        case 'Escape': this.exit(); break;
        case 'Enter': case ' ':
          if (this.state === 'intro') this._startRun();
          else if (this.state === 'panel') this._closePanel();
          else if (this.state === 'end') this._replay();
          e.preventDefault();
          break;
      }
    };
    this._onKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A': this.keys.left = false; break;
        case 'ArrowRight': case 'd': case 'D': this.keys.right = false; break;
        case 'ArrowUp': case 'w': case 'W': this.keys.boost = false; break;
      }
    };
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);

    // touch / drag steering
    this._onPointerDown = (e) => {
      if (e.target !== this.canvas) return;
      this._steering = true;
      this.pointerSteer = (e.clientX / innerWidth - 0.5) * 2;
    };
    this._onPointerMove = (e) => {
      if (!this._steering) return;
      this.pointerSteer = (e.clientX / innerWidth - 0.5) * 2;
    };
    this._onPointerUp = () => {
      this._steering = false;
      this.pointerSteer = null;
    };
    window.addEventListener('pointerdown', this._onPointerDown);
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    window.addEventListener('pointercancel', this._onPointerUp);

    this._onResize = () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    };
    window.addEventListener('resize', this._onResize);

    this.root.querySelector('.arcade__exit').addEventListener('click', () => this.exit());
    this.root.querySelector('.arcade__start').addEventListener('click', () => this._startRun());
    this.root.querySelector('.arcade__replay').addEventListener('click', () => this._replay());
    this.root.querySelector('.arcade__end-exit').addEventListener('click', () => this.exit());
    this.el.mute.addEventListener('click', () => {
      this.sfx.muted = !this.sfx.muted;
      this.el.mute.classList.toggle('is-muted', this.sfx.muted);
      if (!this.sfx.muted) this.sfx.ui();
    });
    this.el.panel.addEventListener('click', (e) => {
      if (e.target.closest('.gpanel__continue')) this._closePanel();
    });
  }

  /* ---------------- state transitions ---------------- */
  _startRun() {
    if (this.state !== 'intro') return;
    this.state = 'running';
    this.startTime = performance.now();
    this.el.intro.hidden = true;
    this.root.classList.add('is-running');
    this.sfx.start();
    this._setZone('Sector 01 · Origin — next gate: ABOUT');
  }

  _openPanel(gate) {
    this.state = 'panel';
    gate.visited = true;
    gate.ring.material.color.setHex(ACCENT2);
    gate.ring.material.opacity = 0.45;
    this.el.panelBox.innerHTML = this._panelHTML(gate);
    this.el.panel.hidden = false;
    requestAnimationFrame(() => this.el.panel.classList.add('is-open'));
    this.sfx.gate();

    const next = this.gates.find((g) => !g.visited);
    this._setZone(next ? `${gate.zone} — next gate: ${next.gate}` : `${gate.zone} — final stretch`);
    const dot = this.el.trackDots.children[this.gates.indexOf(gate)];
    if (dot) dot.classList.add('is-done');
  }

  _closePanel() {
    if (this.state !== 'panel') return;
    this.el.panel.classList.remove('is-open');
    const panel = this.el.panel;
    setTimeout(() => { panel.hidden = true; }, 260);
    this.state = 'running';
    this.sfx.ui();
  }

  _finish() {
    this.state = 'end';
    this.elapsedAtEnd = (performance.now() - this.startTime) / 1000;
    const secs = Math.round(this.elapsedAtEnd);
    this.el.endStats.innerHTML = `
      <span><b>${this.cores}/${this.orbs.length}</b> data cores</span>
      <span><b>${this.gates.length}/${this.gates.length}</b> gates cleared</span>
      <span><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b> run time</span>
    `;
    this.el.end.hidden = false;
    requestAnimationFrame(() => this.el.end.classList.add('is-open'));
    this.root.classList.remove('is-running');
    this.sfx.finish();
  }

  _replay() {
    if (this.state !== 'end') return;
    this.el.end.classList.remove('is-open');
    this.el.end.hidden = true;
    this.playerU = 0.012;
    this.playerLat = 0;
    this.targetLat = 0;
    this.cores = 0;
    this.el.coresN.textContent = '0';
    this.orbs.forEach((o) => { o.taken = false; o.mesh.visible = true; });
    this.gates.forEach((g) => {
      g.visited = false;
      g.ring.material.color.setHex(ACCENT);
      g.ring.material.opacity = 0.95;
    });
    [...this.el.trackDots.children].forEach((d) => d.classList.remove('is-done'));
    this._placeShipAndCamera(0, true);
    this.state = 'running';
    this.startTime = performance.now();
    this.root.classList.add('is-running');
    this._setZone('Sector 01 · Origin — next gate: ABOUT');
    this.sfx.start();
  }

  _setZone(text) {
    this.el.zone.textContent = text;
    this.el.zone.classList.remove('is-flash');
    void this.el.zone.offsetWidth;
    this.el.zone.classList.add('is-flash');
  }

  _toast(text) {
    this.el.toast.textContent = text;
    this.el.toast.classList.remove('is-on');
    void this.el.toast.offsetWidth;
    this.el.toast.classList.add('is-on');
  }

  /* ---------------- frame loop ---------------- */
  _tick() {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    this.roadUniforms.uTime.value = time;
    this.roadUniforms.uBoost.value = this.boost;

    // ambient motion
    for (const d of this.debris) {
      if (d.isSprite) {
        d.position.y = d.userData.baseY + Math.sin(time * 0.7 + d.userData.bobSeed) * 0.45;
      } else if (d.userData.spin) {
        d.rotation.x += d.userData.spin * dt;
        d.rotation.y += d.userData.spin * 1.3 * dt;
      }
    }
    for (const o of this.orbs) {
      if (o.taken) continue;
      o.mesh.rotation.y += dt * 2.2;
      o.mesh.position.y = o.mesh.userData.baseY + Math.sin(time * 2 + o.mesh.userData.seed) * 0.14;
    }
    for (const g of this.gates) {
      g.ring.rotation.z += dt * (g.visited ? 0.15 : 0.55);
      g.ring2.rotation.z -= dt * 0.3;
    }
    this.shipEngine.material.opacity = 0.6 + Math.sin(time * 22) * 0.25 + this.boost * 0.3;

    if (this.state === 'running') {
      // steering
      let input = 0;
      if (this.keys.left) input -= 1;
      if (this.keys.right) input += 1;
      if (this.pointerSteer !== null) {
        this.targetLat = THREE.MathUtils.clamp(this.pointerSteer * (this.roadHalf - 0.9), -(this.roadHalf - 0.9), this.roadHalf - 0.9);
      } else {
        this.targetLat = THREE.MathUtils.clamp(this.targetLat + input * 7.5 * dt, -(this.roadHalf - 0.9), this.roadHalf - 0.9);
      }
      this.playerLat += (this.targetLat - this.playerLat) * Math.min(dt * 8, 1);

      // speed + boost
      const boostTarget = this.keys.boost || this._steering ? 1 : 0;
      this.boost += (boostTarget - this.boost) * Math.min(dt * 3, 1);
      let speed = this.baseSpeed * (1 + this.boost * 0.8);

      // ease into unvisited gates, then open them
      const nextGate = this.gates.find((g) => !g.visited);
      if (nextGate) {
        const d = nextGate.u - this.playerU;
        if (d < 0.02) speed *= Math.max(d / 0.02, 0.12);
        if (d <= 0.0016) {
          this.playerU = nextGate.u;
          this._openPanel(nextGate);
        }
      }

      this.playerU = Math.min(this.playerU + (speed * dt) / this.curveLen, 1);

      // collect cores
      for (const o of this.orbs) {
        if (o.taken) continue;
        if (Math.abs(o.u - this.playerU) < 3.2 / this.curveLen && Math.abs(o.lat - this.playerLat) < 1.05) {
          o.taken = true;
          o.mesh.visible = false;
          this.cores++;
          this.el.coresN.textContent = String(this.cores);
          this._toast('+1 data core');
          this.sfx.collect();
        }
      }

      // finish line
      if (this.playerU >= 0.965 && !this.gates.some((g) => !g.visited)) this._finish();

      this.el.trackFill.style.width = `${(this.playerU * 100).toFixed(2)}%`;
    }

    const cruising = this.state === 'running' || this.state === 'panel';
    this._placeShipAndCamera(dt, false);
    if (this.state === 'intro') {
      // slow cinematic drift on the title screen
      this.playerU = 0.012 + Math.sin(time * 0.16) * 0.002;
    }
    if (cruising && this.state === 'running') {
      this.camera.position.y += Math.sin(time * 9) * 0.006 * this.boost;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* ---------------- teardown ---------------- */
  exit() {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);

    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);
    window.removeEventListener('resize', this._onResize);

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
    this.renderer.dispose();

    this.root.classList.remove('is-on');
    const root = this.root;
    setTimeout(() => root.remove(), 450);
    this.onExit();
  }
}
