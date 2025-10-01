import{d as t,j as e}from"./index-Bmr0gcqO.js";const o="var(--card, #111)",r="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",a="var(--border, #222)",i="var(--accent, #22c55e)",l="var(--danger, #ef4444)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:t.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${r};
        border: 1px solid ${a};
        border-radius: ${d};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:t.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:t.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:t.section`
        border-top: 1px dashed ${a};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${a};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        pre.good,
        pre.bad,
        pre.note {
            white-space: pre-wrap;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
            border-radius: 10px;
            padding: 12px 14px;
            margin: 8px 0 12px 0;
            border: 1px dashed ${a};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${i};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${l};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:t.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${a};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Cross-Tab Sync"}),e.jsx(s.Subtitle,{children:"Sync selected slices between tabs with BroadcastChannel + storage events."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Pick which slices to sync (don’t mirror the entire store)."}),e.jsxs("li",{children:["Broadcast local changes with ",e.jsx("code",{children:"BroadcastChannel"})," and fallback to ",e.jsx("code",{children:"storage"})," events."]}),e.jsxs("li",{children:["Prevent echo loops with a ",e.jsx("code",{children:"tabId"})," + suppression flag."]}),e.jsx("li",{children:"Handle ordering with timestamps; debounce bursts of updates."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Decide the sync surface"}),e.jsx("p",{children:"Only sync state that should be shared between tabs (e.g., theme, auth, feature flags). Leave widget-local UI out."}),e.jsx("pre",{className:"good",children:`// stores/app.js (sketch)
import { create } from 'zustand';

export const useApp = create((set, get) => ({
  theme: { mode: 'dark' },
  auth:  { user: null },
  // other local UI that should NOT sync:
  ui:    { sidebarOpen: true, toast: null },

  setTheme: (mode) => set({ theme: { mode } }, false, 'theme/set'),
  login:    (user) => set({ auth: { user } }, false, 'auth/login'),
  logout:   () => set({ auth: { user: null } }, false, 'auth/logout'),
}));
// We will sync only { theme, auth }`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Transport helpers (BroadcastChannel + storage fallback)"}),e.jsxs("p",{children:["Use a single channel name across tabs. Tag each message with a ",e.jsx("code",{children:"tabId"})," and timestamp."]}),e.jsx("pre",{className:"good",children:`// sync/transport.js
const CHANNEL = 'zustand-handbook-sync-v1';
export const tabId = crypto?.randomUUID?.() || String(Math.random());
export const now = () => Date.now();

export const bc = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel(CHANNEL)
  : null;

// Fallback: storage event (fires in other tabs)
export function emitStorage(msg) {
  try {
    localStorage.setItem(CHANNEL, JSON.stringify(msg));
    // optional: remove to keep LS clean (event already fired)
    localStorage.removeItem(CHANNEL);
  } catch {}
}

export function postMessage(payload) {
  const msg = { ...payload, tabId, t: now() };
  if (bc) bc.postMessage(msg);
  emitStorage(msg);
}

export function onMessage(cb) {
  bc?.addEventListener('message', (e) => cb(e.data));
  window.addEventListener('storage', (e) => {
    if (e.key !== CHANNEL || !e.newValue) return;
    try { cb(JSON.parse(e.newValue)); } catch {}
  });
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Wire it to Zustand (subscribe + apply)"}),e.jsx("p",{children:"Subscribe to only the syncable slice, broadcast patches, and apply incoming patches safely."}),e.jsx("pre",{className:"good",children:`// sync/glue.js
import { shallow } from 'zustand/shallow';
import { useApp } from '../stores/app';
import { onMessage, postMessage, tabId } from './transport';

// choose what to sync
const selectSyncable = (s) => ({ theme: s.theme, auth: s.auth });

let suppress = false; // prevents echo loops
let lastApplied = 0;  // ordering guard

// 1) Broadcast local changes (debounced)
let timer = null;
useApp.subscribe(
  selectSyncable,
  (next) => {
    if (suppress) return; // change came from remote
    clearTimeout(timer);
    const patch = next; // you could diff with previous if desired
    timer = setTimeout(() => {
      postMessage({ type: 'SYNC_PATCH', patch });
    }, 60); // debounce bursty updates
  },
  { equalityFn: shallow }
);

// 2) Apply remote patches
onMessage((msg) => {
  if (!msg || msg.tabId === tabId || msg.type !== 'SYNC_PATCH') return;
  if (msg.t <= lastApplied) return; // ignore out-of-order
  lastApplied = msg.t;

  suppress = true;
  useApp.setState(
    (s) => ({ ...s, ...msg.patch }), // shallow merge of syncable keys
    false,
    'sync/incoming'
  );
  suppress = false;
});`}),e.jsx(s.Callout,{children:"This merges only the syncable keys. Keep complex reconciliation inside your own actions if needed."})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["4) Using with ",e.jsx("code",{children:"persist"})]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Persist"})," gives you durable state on reload, but not live tab-to-tab updates."]}),e.jsx("li",{children:"Keep using the sync glue above for live updates; persist remains for reload/restore."}),e.jsx("li",{children:"Partialize persisted state the same way you partialize your sync surface."})]}),e.jsx("pre",{className:"note",children:`persist(
  (set, get) => ({ /* ...app state... */ }),
  {
    name: 'app',
    partialize: (s) => ({ theme: s.theme, auth: s.auth }),
    version: 2,
    migrate: (persisted, v) => persisted, // add real migrations when shapes change
  }
)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Pitfalls & tips"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Never sync ephemeral UI (like open modals) unless you truly want shared UI across tabs."}),e.jsxs("li",{children:["Include a ",e.jsx("code",{children:"tabId"})," and suppress self-originated updates to avoid ping-pong."]}),e.jsxs("li",{children:["Use timestamps to ignore out-of-order messages; keep a small ",e.jsx("code",{children:"lastApplied"}),"."]}),e.jsx("li",{children:"Debounce 30–120ms to coalesce bursts without feeling laggy."}),e.jsx("li",{children:"Validate payload shape before applying (defensive parsing if messages could be spoofed)."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Minimal “it works” checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Open two tabs → change theme in one → the other tab updates."}),e.jsx("li",{children:"Reload both tabs → persisted theme still matches."}),e.jsx("li",{children:"Rapid toggles don’t flood → messages are debounced."})]})]})]});export{h as default};
