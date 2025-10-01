import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Cross-tab Sync — High-level Ideas"}),e.jsx(s.Subtitle,{children:"Keep multiple browser tabs in agreement without weird overwrites."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What this solves"}),e.jsxs("ul",{children:[e.jsx("li",{children:"User opens your app in 2–3 tabs; state should stay in sync."}),e.jsx("li",{children:"Edits in one tab should reflect in others (theme, cart, auth, etc.)."}),e.jsx("li",{children:"Conflicts should be predictable (last-write wins, versioning, or merge)."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Three simple building blocks"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"storage events"})," — fired when ",e.jsx("code",{children:"localStorage"})," changes in other tabs."]}),e.jsxs("li",{children:[e.jsx("b",{children:"BroadcastChannel"})," — pub/sub messages across tabs (modern, clean API)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"persist middleware"})," — store state in storage so other tabs can read it."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Approach A — storage event (works almost everywhere)"}),e.jsx("pre",{className:"good",children:`// 1) Persist your store to localStorage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useApp = create(
  persist(
    (set, get) => ({
      theme: { mode: 'light' },
      toggleTheme: () => set((s) => ({ theme: { mode: s.theme.mode === 'light' ? 'dark' : 'light' } }), false, 'theme/toggle'),
      version: 0, // simple change counter
    }),
    { name: 'app', version: 1 } // storage key + optional migration version
  )
);

// 2) Listen for changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key !== 'app') return;
  try {
    const parsed = JSON.parse(e.newValue ?? 'null');
    // naive last-write-wins (compare version/time)
    // you can also directly call useApp.setState(parsed.state)
    useApp.setState(parsed?.state ?? {}, true); // replace or merge as needed
  } catch {}
});`}),e.jsxs("p",{children:["The ",e.jsx("code",{children:"storage"})," event fires only in ",e.jsx("b",{children:"other"})," tabs, not the one that wrote. It’s a simple way to “pull” the latest state."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Approach B — BroadcastChannel (cleaner messaging)"}),e.jsx("pre",{className:"good",children:`// channel per app/slice
const ch = new BroadcastChannel('zustand-app');

useApp.subscribe(
  (state) => state, // whole state or a partial slice
  (next) => { ch.postMessage({ type: 'STATE', payload: next }); },
  { fireImmediately: false }
);

ch.onmessage = (ev) => {
  if (ev.data?.type !== 'STATE') return;
  // merge policy: last-write-wins or smarter merge
  useApp.setState(ev.data.payload, false);
};`}),e.jsxs("p",{children:["This avoids writing to storage on every change. You can still combine this with",e.jsx("code",{children:"persist"})," for reload durability."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Approach C — custom persist storage (advanced)"}),e.jsx("p",{children:"You can plug a custom storage that also notifies peers. Useful for IndexedDB or when you want to attach metadata (timestamp, tabId)."}),e.jsx("pre",{className:"note",children:`const tabId = Math.random().toString(36).slice(2);
const ch = new BroadcastChannel('zustand-app');

const notify = (state) => ch.postMessage({ type: 'STATE', from: tabId, ts: Date.now(), payload: state });

const customStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    try { const parsed = JSON.parse(value); notify(parsed?.state ?? {}); } catch {}
    return Promise.resolve();
  },
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

// then:
persist((set, get) => ({ /* ... */ }), { name: 'app', storage: customStorage });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Conflict policies (pick one)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Last-write wins:"})," compare ",e.jsx("code",{children:"ts"})," (timestamp) and accept newer."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Field-wise merge:"})," merge objects; arrays need a custom strategy."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Versioning:"})," bump ",e.jsx("code",{children:"version"})," on each action; if incoming version is higher, accept."]})]}),e.jsx("pre",{className:"note",children:`// naive versioning sketch
const applyIncoming = (incoming) => {
  const current = useApp.getState();
  if ((incoming.version ?? 0) > (current.version ?? 0)) {
    useApp.setState(incoming, false);
  }
};`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I’d actually sync"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Theme"}),", ",e.jsx("b",{children:"auth"})," (token/user), ",e.jsx("b",{children:"cart"}),", ",e.jsx("b",{children:"feature flags"}),"."]}),e.jsx("li",{children:"Avoid sync for very noisy UI state (dragging, transient inputs)."}),e.jsx("li",{children:"Gate sensitive changes behind user intent (e.g., “Restore from other tab?”)."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Pitfalls"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Infinite loops (tab A updates B which updates A). Use a ",e.jsx("code",{children:"tabId"})," to ignore your own messages."]}),e.jsx("li",{children:"Storage event payload size limits. Keep state lean or use IndexedDB."}),e.jsxs("li",{children:["Race conditions. Prefer a monotonic ",e.jsx("code",{children:"version"})," or ",e.jsx("code",{children:"ts"}),"."]})]}),e.jsx("pre",{className:"bad",children:`// ❌ echoing your own broadcast
ch.onmessage = (ev) => useApp.setState(ev.data.payload);
// Fix:
ch.onmessage = (ev) => { if (ev.data.from !== tabId) useApp.setState(ev.data.payload); };`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add ",e.jsx("code",{children:"persist"})," for reloads; add ",e.jsx("code",{children:"BroadcastChannel"})," for live sync."]}),e.jsxs("li",{children:["Tag messages with ",e.jsx("code",{children:"tabId"})," and ",e.jsx("code",{children:"ts"}),"/",e.jsx("code",{children:"version"}),"."]}),e.jsx("li",{children:"Decide merge policy up front (LWW, merge, versioned)."}),e.jsx("li",{children:"Only sync meaningful slices; skip noisy UI state."})]})]})]});export{i as default};
