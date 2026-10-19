import './chat.css';

/* Portfolio assistant: a modal chat panel over POST /api/chat (SSE).
   Lazy-loaded by main.js on first open, so the page's first load is untouched.
   Model text is only ever inserted with textContent / text nodes. */

const API = '/api/chat';
const EMAIL = 'rishivendhan.tech@gmail.com';
const MAX_CHARS = 500;
const MAX_HISTORY = 6;
const STARTERS = ['What has he built with RAG?', "What's his stack?", 'How do I contact him?'];

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) if (c != null) node.append(c);
  return node;
};

// Turn "...answer [S2] see https://x" into text nodes, citation buttons and links.
function renderAnswer(text, sources, onCite) {
  const frag = document.createDocumentFragment();
  // [S2] citations, [label](url) markdown links, bare URLs, emails.
  const re = /\[S(\d+)\]|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)\]]+[^\s)\].,;])|([\w.+-]+@[\w-]+\.[\w.]+[\w])/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) frag.append(text.slice(last, m.index));
    if (m[1]) {
      const n = Number(m[1]);
      const src = sources.find((s) => s.n === n);
      frag.append(
        src
          ? el('button', { type: 'button', class: 'chat__cite', 'aria-label': `Source ${n}: ${src.heading}`, onclick: () => onCite(n) }, `S${n}`)
          : m[0],
      );
    } else if (m[3]) {
      frag.append(el('a', { href: m[3], target: '_blank', rel: 'noopener noreferrer' }, m[2]));
    } else if (m[4]) {
      frag.append(el('a', { href: m[4], target: '_blank', rel: 'noopener noreferrer' }, m[4]));
    } else {
      frag.append(el('a', { href: `mailto:${m[5]}` }, m[5]));
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) frag.append(text.slice(last));
  return frag;
}

const fmt = (x, d = 3) => (x == null ? '-' : Number(x).toFixed(d));

function howPanel(meta) {
  const gate = meta.gate || {};
  const details = el('details', { class: 'chat__how' }, el('summary', { text: 'How I answered' }));
  details.append(
    el(
      'p',
      {},
      gate.passed
        ? `Hybrid retrieval (BM25 keywords + ${meta.mode === 'hybrid' ? 'vector similarity' : 'no vectors'}, fused with Reciprocal Rank Fusion) picked these ${meta.sources.length} passages; gpt-4o-mini answered only from them.`
        : 'Nothing in Rishi’s write-ups was relevant enough, so the relevance gate stopped the question before any model call.',
    ),
    el('p', { class: 'chat__how-gate', text: `Gate ${gate.passed ? 'passed' : 'stopped'} · top cosine ${fmt(gate.topCosine)} · top BM25 ${fmt(gate.topBm25, 2)}` }),
  );
  if (meta.sources.length) {
    const rows = meta.sources.map((s) =>
      el('tr', {}, el('td', { text: `S${s.n}` }), el('td', { text: `${s.title} > ${s.heading}` }), el('td', { text: fmt(s.fused, 4) }), el('td', { text: fmt(s.bm25, 2) }), el('td', { text: fmt(s.cosine) })),
    );
    details.append(
      el(
        'div',
        { class: 'chat__how-table', tabindex: '0', role: 'region', 'aria-label': 'Retrieval scores' },
        el(
          'table',
          {},
          el('thead', {}, el('tr', {}, ...['#', 'Passage', 'RRF', 'BM25', 'Cosine'].map((h) => el('th', { scope: 'col', text: h })))),
          el('tbody', {}, ...rows),
        ),
      ),
    );
  }
  return details;
}

async function* readSSE(response, signal) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (!signal.aborted) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const block = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const m = block.match(/^event: (\w+)\ndata: (.*)$/s);
      if (m) yield { event: m[1], data: JSON.parse(m[2]) };
    }
  }
}

export function createChat({ launcher, onOpen, onClose }) {
  const history = [];
  let controller = null;
  let busy = false;

  const close = el('button', { type: 'button', class: 'chat__close', 'aria-label': 'Close chat' }, '×');
  const log = el('div', { class: 'chat__log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions', 'data-lenis-prevent': '' });
  const input = el('textarea', {
    class: 'chat__input',
    rows: '1',
    maxlength: String(MAX_CHARS),
    placeholder: 'Ask about his projects, stack or experience',
    'aria-label': 'Your question',
  });
  const counter = el('span', { class: 'chat__count', 'aria-hidden': 'true', text: `0/${MAX_CHARS}` });
  const send = el('button', { type: 'submit', class: 'chat__send', 'aria-label': 'Send question' }, '↑');
  const form = el('form', { class: 'chat__form' }, input, el('div', { class: 'chat__form-row' }, counter, send));
  const starters = el(
    'div',
    { class: 'chat__starters', role: 'group', 'aria-label': 'Suggested questions' },
    ...STARTERS.map((q) => el('button', { type: 'button', class: 'chat__starter', onclick: () => ask(q) }, q)),
  );

  const panel = el(
    'div',
    { class: 'chat', id: 'chat-panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'chat-title', hidden: '' },
    el(
      'div',
      { class: 'chat__head' },
      el(
        'div',
        {},
        el('h2', { class: 'chat__title', id: 'chat-title', text: 'Ask about Rishi’s work' }),
        el('p', { class: 'chat__note', text: 'Answers come from his own write-ups, with sources. Questions are not stored.' }),
      ),
      close,
    ),
    log,
    starters,
    form,
  );
  document.body.append(panel);
  log.append(
    el('div', { class: 'chat__msg chat__msg--bot' },
      el('p', { class: 'chat__text', text: 'Hi. I answer questions about Rishi’s projects, stack and experience, using only his own write-ups, and I show my sources.' })),
  );

  function addUser(text) {
    log.append(el('div', { class: 'chat__msg chat__msg--user' }, el('p', { text })));
  }

  function addBot() {
    const body = el('p', { class: 'chat__text' });
    const msg = el('div', { class: 'chat__msg chat__msg--bot', 'aria-busy': 'true' }, body);
    log.append(msg);
    return { msg, body };
  }

  function scrollDown() {
    log.scrollTop = log.scrollHeight;
  }

  function addSources(msg, meta, text) {
    const cited = new Set([...text.matchAll(/\[S(\d+)\]/g)].map((m) => Number(m[1])));
    const ordered = [...meta.sources].sort((a, b) => cited.has(b.n) - cited.has(a.n) || a.n - b.n);
    const highlight = (n) => {
      const chip = msg.querySelector(`[data-source="${n}"]`);
      if (!chip) return;
      chip.classList.remove('is-flash');
      void chip.offsetWidth;
      chip.classList.add('is-flash');
      chip.focus();
    };
    if (meta.sources.length) {
      msg.append(
        el(
          'ul',
          { class: 'chat__sources', 'aria-label': 'Sources' },
          ...ordered.map((s) =>
            el(
              'li',
              {},
              el(
                s.url ? 'a' : 'span',
                {
                  class: `chat__chip${cited.has(s.n) ? ' is-cited' : ''}`,
                  title: cited.has(s.n) ? 'Cited in the answer' : 'Retrieved, not cited',
                  'data-source': String(s.n),
                  tabindex: '0',
                  ...(s.url ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' } : {}),
                },
                el('b', { text: `S${s.n}` }),
                ` ${s.title} › ${s.heading}`,
              ),
            ),
          ),
        ),
      );
    }
    msg.append(howPanel(meta));
    return highlight;
  }

  async function ask(raw) {
    const question = raw.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    busy = true;
    starters.hidden = true;
    send.disabled = true;
    input.value = '';
    updateCount();
    addUser(question);
    const { msg, body } = addBot();
    body.classList.add('is-typing');
    scrollDown();

    controller = new AbortController();
    let text = '';
    let meta = { sources: [], gate: {} };
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: history.slice(-MAX_HISTORY) }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Something went wrong. Email Rishi at ${EMAIL}.`);
      }
      for await (const { event, data } of readSSE(res, controller.signal)) {
        if (event === 'meta') meta = data;
        else if (event === 'token') {
          text += data.t;
          body.textContent = text;
          scrollDown();
        } else if (event === 'error') throw new Error(data.message);
      }
      body.replaceChildren(renderAnswer(text, meta.sources, (n) => highlight(n)));
      const highlight = addSources(msg, meta, text);
      history.push({ role: 'user', content: question }, { role: 'assistant', content: text });
    } catch (err) {
      if (err.name !== 'AbortError') {
        msg.classList.add('chat__msg--error');
        body.replaceChildren(renderAnswer(err.message || `Something went wrong. Email Rishi at ${EMAIL}.`, [], () => {}));
      }
    } finally {
      body.classList.remove('is-typing');
      msg.setAttribute('aria-busy', 'false');
      busy = false;
      send.disabled = false;
      controller = null;
      scrollDown();
      if (!panel.hidden) input.focus();
    }
  }

  function updateCount() {
    counter.textContent = `${input.value.length}/${MAX_CHARS}`;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }

  input.addEventListener('input', updateCount);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      ask(input.value);
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });

  // Focus trap + Escape while open.
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hide();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...panel.querySelectorAll('button, a[href], textarea, summary, [tabindex="0"]')].filter(
      (n) => !n.disabled && n.offsetParent !== null,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  close.addEventListener('click', () => hide());

  function show() {
    panel.hidden = false;
    document.body.classList.add('is-chat');
    launcher.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => panel.classList.add('is-open'));
    onOpen?.();
    input.focus();
  }

  function hide() {
    controller?.abort();
    panel.classList.remove('is-open');
    panel.hidden = true;
    document.body.classList.remove('is-chat');
    launcher.setAttribute('aria-expanded', 'false');
    onClose?.();
    launcher.focus();
  }

  return { show, hide, get open() { return !panel.hidden; } };
}
