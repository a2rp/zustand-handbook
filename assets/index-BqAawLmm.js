import{d as t,j as e}from"./index-Bmr0gcqO.js";const n="var(--card, #111)",o="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",r="var(--border, #222)",d="var(--accent, #22c55e)",c="var(--danger, #ef4444)",a="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:t.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${n};
        color: ${o};
        border: 1px solid ${r};
        border-radius: ${a};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;
    `,Title:t.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:t.p`
        margin: 0 0 18px 0;
        color: ${i};
    `,Section:t.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${r};
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
            border: 1px dashed ${r};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${d};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${c};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:t.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},u=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Undo / Redo"}),e.jsxs(s.Subtitle,{children:["A tiny history system with ",e.jsx("code",{children:"past"}),", ",e.jsx("code",{children:"present"}),", and ",e.jsx("code",{children:"future"}),"."]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Structure a store with ",e.jsx("b",{children:"past → present → future"})," stacks."]}),e.jsxs("li",{children:["Create a ",e.jsx("code",{children:"commit()"})," helper that records history before updating."]}),e.jsxs("li",{children:["Implement ",e.jsx("code",{children:"undo()"})," and ",e.jsx("code",{children:"redo()"})," with guards."]}),e.jsxs("li",{children:["Expose ",e.jsx("code",{children:"canUndo"})," / ",e.jsx("code",{children:"canRedo"})," selectors for the UI."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Store sketch"}),e.jsxs("p",{children:["We keep the current app data in ",e.jsx("code",{children:"present"}),". Every time we change it, we push the old value into ",e.jsx("code",{children:"past"})," and clear ",e.jsx("code",{children:"future"}),"."]}),e.jsx("pre",{className:"good",children:`// src/stores/history.js
import { create } from 'zustand';

const HISTORY_LIMIT = 50;

export const useHistory = create((set, get) => ({
  // anything you want to edit goes inside "present"
  present: { count: 0, items: [] },

  // stacks
  past: [],
  future: [],

  // ---- helpers
  // commit a partial change to "present" and record history
  commit(partial, type = 'history/commit') {
    set((s) => {
      const prev = s.present;
      const next = { ...prev, ...partial }; // for nested data, create new references where needed
      const newPast = [...s.past, prev].slice(-HISTORY_LIMIT);
      return { past: newPast, present: next, future: [] };
    }, false, type);
  },

  // commit via function: (prev) => next
  commitFn(updater, type = 'history/commitFn') {
    set((s) => {
      const prev = s.present;
      const next = updater(prev);
      const newPast = [...s.past, prev].slice(-HISTORY_LIMIT);
      return { past: newPast, present: next, future: [] };
    }, false, type);
  },

  // undo one step (move last past -> present, and old present -> future)
  undo() {
    set((s) => {
      if (s.past.length === 0) return s; // nothing to do
      const prev = s.past[s.past.length - 1];
      const newPast = s.past.slice(0, -1);
      const newFuture = [s.present, ...s.future];
      return { past: newPast, present: prev, future: newFuture };
    }, false, 'history/undo');
  },

  // redo one step (move first future -> present, and old present -> past)
  redo() {
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      const newFuture = s.future.slice(1);
      const newPast = [...s.past, s.present].slice(-HISTORY_LIMIT);
      return { past: newPast, present: next, future: newFuture };
    }, false, 'history/redo');
  },

  // convenience actions for this example
  inc: () => get().commitFn((prev) => ({ ...prev, count: prev.count + 1 }), 'counter/increment'),
  dec: () => get().commitFn((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }), 'counter/decrement'),
  addItem: (title) =>
    get().commitFn(
      (prev) => ({ ...prev, items: [...prev.items, { id: crypto.randomUUID?.() || Date.now(), title }] }),
      'items/add'
    ),
  removeItem: (id) =>
    get().commitFn(
      (prev) => ({ ...prev, items: prev.items.filter((it) => it.id !== id) }),
      'items/remove'
    ),
}));`}),e.jsxs(s.Callout,{children:["Use ",e.jsx("code",{children:"commit()"})," for shallow merges and ",e.jsx("code",{children:"commitFn()"})," when you need to read the previous value or update nested arrays/objects."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) UI selectors (what components subscribe to)"}),e.jsx("pre",{className:"note",children:`import { shallow } from 'zustand/shallow';
import { useHistory } from '../stores/history';

// single fields
const count = useHistory((s) => s.present.count);
const items = useHistory((s) => s.present.items);

// guards (enable/disable buttons)
const [canUndo, canRedo] = useHistory(
  (s) => [s.past.length > 0, s.future.length > 0],
  shallow
);

// actions
const inc = useHistory((s) => s.inc);
const undo = useHistory((s) => s.undo);
const redo = useHistory((s) => s.redo);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Example button wiring (sketch)"}),e.jsx("pre",{className:"good",children:`function Toolbar() {
  const [canUndo, canRedo] = useHistory(
    (s) => [s.past.length > 0, s.future.length > 0],
    shallow
  );
  const undo = useHistory((s) => s.undo);
  const redo = useHistory((s) => s.redo);

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Keyboard shortcuts (optional)"}),e.jsxs("p",{children:["This sketch listens for ",e.jsx("code",{children:"Ctrl/Cmd+Z"})," and ",e.jsx("code",{children:"Ctrl/Cmd+Shift+Z"}),"."]}),e.jsx("pre",{className:"note",children:`useEffect(() => {
  function onKey(e) {
    const z = e.key.toLowerCase() === 'z';
    const meta = e.ctrlKey || e.metaKey;
    if (!meta || !z) return;

    if (e.shiftKey) {
      useHistory.getState().redo();
    } else {
      useHistory.getState().undo();
    }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Gotchas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["History can grow; use a ",e.jsx("code",{children:"HISTORY_LIMIT"})," to cap memory."]}),e.jsxs("li",{children:["Don’t put non-serializable stuff (DOM nodes, functions) inside ",e.jsx("code",{children:"present"}),"."]}),e.jsxs("li",{children:["If you persist the store, consider ",e.jsx("b",{children:"partializing"})," to save only"," ",e.jsx("code",{children:"present"})," and drop ",e.jsx("code",{children:"past/future"}),":"]})]}),e.jsx("pre",{className:"note",children:`// with persist middleware (sketch)
persist(config, {
  name: 'app',
  partialize: (state) => ({ present: state.present }), // don't save history stacks
  version: 1,
  migrate: (persisted, v) => persisted, // add when shapes change
});`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Keep edits inside a single ",e.jsx("code",{children:"present"})," object."]}),e.jsxs("li",{children:["Wrap changes with ",e.jsx("code",{children:"commit"}),"/",e.jsx("code",{children:"commitFn"})," so history stays consistent."]}),e.jsxs("li",{children:["Clear ",e.jsx("code",{children:"future"})," on new commits (standard editor behavior)."]}),e.jsxs("li",{children:["Guard undo/redo buttons with ",e.jsx("code",{children:"past.length"}),"/",e.jsx("code",{children:"future.length"}),"."]})]})]})]});export{u as default};
