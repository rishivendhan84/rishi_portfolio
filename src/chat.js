import './chat.css';

/* "Chat with my bot": a modal chat panel over POST /api/chat (SSE).
   Lazy-loaded by main.js on first open, so the page's first load is untouched.
   Model text is only ever inserted with textContent / text nodes; the only
   innerHTML is the static icon markup below. */

const API = '/api/chat';
const EMAIL = 'rishivendhan.tech@gmail.com';
const MAX_CHARS = 500;
const MAX_HISTORY = 6;
const SUGGESTIONS = [
  { title: 'What has he built with RAG?', hint: 'Production chatbot and this bot' },
  { title: "What's his stack?", hint: 'Frontend, backend, GenAI' },
  { title: 'Tell me about VitaLens', hint: 'Vision LLM + nutrition data' },
  { title: 'How do I contact him?', hint: 'Email, LinkedIn, GitHub' },
];

const ICON = {
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  retry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>',
  scores: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
};

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'icon') node.innerHTML = ICON[v];
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) if (c != null) node.append(c);
  return node;
};

const iconButton = (icon, label, onclick, cls = 'chat__icon-btn') =>
  el('button', { type: 'button', class: cls, 'aria-label': label, title: label, onclick }, el('span', { class: 'chat__icon', 'aria-hidden': 'true', icon }));

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
          ? el('button', { type: 'button', class: 'chat__cite', 'aria-label': `Source ${n}: ${src.heading}`, onclick: () => onCite(n) }, String(n))
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
  const panel = el('div', { class: 'chat__how', hidden: '' });
  panel.append(
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
      el('tr', {}, el('td', { text: String(s.n) }), el('td', { text: `${s.title} > ${s.heading}` }), el('td', { text: fmt(s.fused, 4) }), el('td', { text: fmt(s.bm25, 2) }), el('td', { text: fmt(s.cosine) })),
    );
    panel.append(
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
  return panel;
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
  let history = [];
  let controller = null;
  let busy = false;

  /* ---------- Structure ---------- */
  const avatar = (size = '') => el('span', { class: `chat__avatar ${size}`, 'aria-hidden': 'true', icon: 'bot' });

  const head = el(
    'div',
    { class: 'chat__head' },
    avatar(),
    el(
      'div',
      { class: 'chat__head-text' },
      el('h2', { class: 'chat__title', id: 'chat-title', text: 'Chat with my bot' }),
      el('p', { class: 'chat__status' }, el('span', { class: 'chat__status-dot', 'aria-hidden': 'true' }), 'Answers from Rishi’s own write-ups'),
    ),
    iconButton('plus', 'New chat', () => reset()),
    iconButton('close', 'Close chat', () => hide()),
  );

  const welcome = el(
    'div',
    { class: 'chat__welcome' },
    avatar('chat__avatar--lg'),
    el('h3', { class: 'chat__welcome-title', text: 'Ask me about Rishi’s work' }),
    el('p', { class: 'chat__welcome-text', text: 'Projects, stack, experience and how to reach him. Every answer cites its sources.' }),
    el(
      'div',
      { class: 'chat__suggestions', role: 'group', 'aria-label': 'Suggested questions' },
      ...SUGGESTIONS.map((s) =>
        el('button', { type: 'button', class: 'chat__suggestion', onclick: () => ask(s.title) }, el('span', { class: 'chat__suggestion-title', text: s.title }), el('span', { class: 'chat__suggestion-hint', text: s.hint })),
      ),
    ),
  );

  const thread = el('div', { class: 'chat__thread', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' });
  const viewport = el('div', { class: 'chat__viewport', 'data-lenis-prevent': '' }, welcome, thread);
  const jump = el('button', { type: 'button', class: 'chat__jump', 'aria-label': 'Scroll to latest message', hidden: '', onclick: () => scrollDown(true) }, el('span', { class: 'chat__icon', 'aria-hidden': 'true', icon: 'down' }));

  const input = el('textarea', {
    class: 'chat__input',
    rows: '1',
    maxlength: String(MAX_CHARS),
    placeholder: 'Ask about his projects, stack or experience…',
    'aria-label': 'Your question',
  });
  const counter = el('span', { class: 'chat__count', 'aria-hidden': 'true' });
  const send = el('button', { type: 'submit', class: 'chat__send', 'aria-label': 'Send question' }, el('span', { class: 'chat__icon', 'aria-hidden': 'true', icon: 'send' }));
  const form = el('form', { class: 'chat__composer' }, input, el('div', { class: 'chat__composer-row' }, counter, send));
  const footer = el('div', { class: 'chat__foot' }, form, el('p', { class: 'chat__disclaimer', text: 'Answers can still be wrong: check the sources. Questions are not stored.' }));

  const panel = el(
    'div',
    { class: 'chat', id: 'chat-panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'chat-title', hidden: '' },
    head,
    viewport,
    jump,
    footer,
  );
  document.body.append(panel);

  /* ---------- Rendering ---------- */
  const nearBottom = () => viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 80;
  function scrollDown(force = false) {
    if (force || nearBottom()) viewport.scrollTop = viewport.scrollHeight;
    jump.hidden = nearBottom();
  }
  viewport.addEventListener('scroll', () => (jump.hidden = nearBottom()));

  function setEmpty(empty) {
    welcome.hidden = !empty;
    panel.classList.toggle('is-empty', empty);
  }

  function addUser(text) {
    thread.append(el('div', { class: 'chat__msg chat__msg--user' }, el('p', { class: 'chat__bubble', text })));
  }

  function addBot() {
    const body = el('p', { class: 'chat__text' }, el('span', { class: 'chat__dots', 'aria-label': 'Thinking' }, el('i'), el('i'), el('i')));
    const content = el('div', { class: 'chat__content' }, body);
    const msg = el('div', { class: 'chat__msg chat__msg--bot', 'aria-busy': 'true' }, avatar('chat__avatar--sm'), content);
    thread.append(msg);
    return { msg, body, content };
  }

  function addSources(content, meta, text) {
    const cited = new Set([...text.matchAll(/\[S(\d+)\]/g)].map((m) => Number(m[1])));
    const ordered = [...meta.sources].sort((a, b) => cited.has(b.n) - cited.has(a.n) || a.n - b.n);
    if (!ordered.length) return () => {};
    const pill = (s) =>
      el(
        'li',
        { class: cited.size && !cited.has(s.n) ? 'is-extra' : '' },
        el(
          s.url ? 'a' : 'span',
          {
            class: `chat__source${cited.has(s.n) ? ' is-cited' : ''}`,
            'data-source': String(s.n),
            tabindex: '0',
            title: `${s.title} › ${s.heading} (${cited.has(s.n) ? 'cited in the answer' : 'retrieved, not cited'})`,
            ...(s.url ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' } : {}),
          },
          el('b', { text: String(s.n) }),
          el('span', { text: `${s.title} · ${s.heading}` }),
        ),
      );
    const list = el('ul', { class: 'chat__sources', 'aria-label': 'Sources' }, ...ordered.map(pill));
    // Cited sources show; the rest of what retrieval returned sits behind a toggle.
    const extra = cited.size ? ordered.length - ordered.filter((s) => cited.has(s.n)).length : 0;
    if (extra) {
      list.classList.add('is-collapsed');
      const more = el('button', { type: 'button', class: 'chat__more', 'aria-expanded': 'false', onclick: () => {
        const open = list.classList.toggle('is-collapsed') === false;
        more.setAttribute('aria-expanded', String(open));
        more.textContent = open ? 'Show fewer' : `+${extra} more retrieved`;
        scrollDown();
      } }, `+${extra} more retrieved`);
      list.append(el('li', {}, more));
    }
    content.append(list);
    return (n) => {
      const chip = content.querySelector(`[data-source="${n}"]`);
      if (!chip) return;
      chip.classList.remove('is-flash');
      void chip.offsetWidth;
      chip.classList.add('is-flash');
      chip.focus();
    };
  }

  function addActions(content, { text, meta, question, msg }) {
    const copy = iconButton('copy', 'Copy answer', async () => {
      try {
        await navigator.clipboard.writeText(text);
        copy.querySelector('.chat__icon').innerHTML = ICON.check;
        setTimeout(() => (copy.querySelector('.chat__icon').innerHTML = ICON.copy), 1400);
      } catch {
        /* clipboard blocked: nothing to do */
      }
    }, 'chat__action');
    const retry = iconButton('retry', 'Ask again', () => {
      // Drop this exchange (and its history pair) and ask the same question again.
      const userMsg = msg.previousElementSibling;
      msg.remove();
      userMsg?.remove();
      if (msg.dataset.inHistory) history = history.slice(0, -2);
      ask(question);
    }, 'chat__action chat__retry');
    const how = howPanel(meta);
    const toggle = el(
      'button',
      { type: 'button', class: 'chat__action chat__action--label', 'aria-expanded': 'false', onclick: () => {
        how.hidden = !how.hidden;
        toggle.setAttribute('aria-expanded', String(!how.hidden));
        scrollDown();
      } },
      el('span', { class: 'chat__icon', 'aria-hidden': 'true', icon: 'scores' }),
      'How I answered',
    );
    content.append(el('div', { class: 'chat__actions' }, copy, retry, toggle), how);
  }

  function setBusy(on) {
    busy = on;
    send.setAttribute('aria-label', on ? 'Stop answering' : 'Send question');
    send.querySelector('.chat__icon').innerHTML = on ? ICON.stop : ICON.send;
    send.classList.toggle('is-stop', on);
  }

  /* ---------- Asking ---------- */
  async function ask(raw) {
    const question = raw.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    // "Ask again" only makes sense on the latest answer.
    thread.querySelectorAll('.chat__retry').forEach((b) => b.remove());
    setEmpty(false);
    setBusy(true);
    input.value = '';
    updateCount();
    addUser(question);
    const { msg, body, content } = addBot();
    scrollDown(true);

    controller = new AbortController();
    let text = '';
    let meta = { sources: [], gate: {} };
    let stopped = false;
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
      if (controller.signal.aborted) stopped = true;
    } catch (err) {
      if (err.name === 'AbortError') stopped = true;
      else {
        msg.classList.add('chat__msg--error');
        body.replaceChildren(renderAnswer(err.message || `Something went wrong. Email Rishi at ${EMAIL}.`, [], () => {}));
      }
    }

    if (!msg.classList.contains('chat__msg--error')) {
      if (stopped && !text) text = 'Stopped.';
      let highlight = () => {};
      body.replaceChildren(renderAnswer(text, meta.sources, (n) => highlight(n)));
      if (stopped) body.append(el('span', { class: 'chat__stopped', text: ' (stopped)' }));
      highlight = addSources(content, meta, text);
      addActions(content, { text, meta, question, msg });
      if (!stopped) {
        history.push({ role: 'user', content: question }, { role: 'assistant', content: text });
        msg.dataset.inHistory = '1';
      }
    }
    msg.setAttribute('aria-busy', 'false');
    controller = null;
    setBusy(false);
    scrollDown();
    if (!panel.hidden) input.focus();
  }

  function reset() {
    controller?.abort();
    history = [];
    thread.replaceChildren();
    setEmpty(true);
    jump.hidden = true;
    input.focus();
  }

  function updateCount() {
    const n = input.value.length;
    counter.textContent = n > MAX_CHARS * 0.8 ? `${n}/${MAX_CHARS}` : '';
    // Measure only while visible: a hidden textarea reports 0 and would collapse.
    if (!panel.hidden) {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
    }
    send.disabled = !busy && !input.value.trim();
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
    if (busy) controller?.abort();
    else ask(input.value);
  });

  // Focus trap + Escape while open.
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hide();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...panel.querySelectorAll('button, a[href], textarea, [tabindex="0"]')].filter(
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

  setEmpty(true);
  updateCount();

  function show() {
    panel.hidden = false;
    document.body.classList.add('is-chat');
    launcher.setAttribute('aria-expanded', 'true');
    void panel.offsetWidth; // commit the hidden-to-visible change so the open transition runs
    panel.classList.add('is-open');
    updateCount();
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
