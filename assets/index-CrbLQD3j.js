import{d as o,j as e}from"./index-Gt8sd0pi.js";const r="var(--card, #111)",n="var(--text, #e9e9e9)",l="var(--muted, #b7b7b7)",t="var(--border, #222)",d="var(--accent, #22c55e)",i="var(--danger, #ef4444)",c="var(--radius, 16px)",a="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:o.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${r};
        color: ${n};
        border: 1px solid ${t};
        border-radius: ${c};
        box-shadow: ${a};
        padding: 24px;
        line-height: 1.6;
    `,Title:o.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:o.p`
        margin: 0 0 18px 0;
        color: ${l};
    `,Section:o.section`
        border-top: 1px dashed ${t};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${t};
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
            border: 1px dashed ${t};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${d};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${i};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:o.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Derived Badge"}),e.jsxs(s.Subtitle,{children:["Compute quick values like ",e.jsx("b",{children:"completed count"})," or ",e.jsx("b",{children:"progress %"})," without storing them."]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Select only the inputs you need from the store."}),e.jsxs("li",{children:["Derive badges/labels with ",e.jsx("code",{children:"useMemo"})," in the component."]}),e.jsxs("li",{children:["Use tuple selectors + ",e.jsx("code",{children:"shallow"})," for multiple inputs."]}),e.jsx("li",{children:"When to keep things derived vs stored."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Store sketch (todos)"}),e.jsx("p",{children:"Keep only the source of truth in the store — no duplicated totals."}),e.jsx("pre",{className:"good",children:`// stores/todos.js
import { create } from 'zustand';

export const useTodos = create((set, get) => ({
  items: [
    { id: 1, title: 'Read docs', done: true },
    { id: 2, title: 'Write notes', done: false },
  ],

  add: (title) =>
    set((s) => ({ items: [...s.items, { id: Date.now(), title, done: false }] }), false, 'todos/add'),

  toggle: (id) =>
    set((s) => ({
      items: s.items.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }), false, 'todos/toggle'),

  clearDone: () =>
    set((s) => ({ items: s.items.filter((t) => !t.done) }), false, 'todos/clearDone'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Component: select inputs, derive outputs"}),e.jsxs("p",{children:["Select only the ",e.jsx("code",{children:"items"}),". Compute ",e.jsx("b",{children:"completed"}),", ",e.jsx("b",{children:"total"}),", and ",e.jsx("b",{children:"progress"})," with"," ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsx("pre",{className:"good",children:`import React, { useMemo } from 'react';
import { useTodos } from '../stores/todos';

function TodoBadge() {
  const items = useTodos((s) => s.items); // narrow selection

  const { completed, total, progress } = useMemo(() => {
    const total = items.length;
    const completed = items.reduce((n, t) => n + (t.done ? 1 : 0), 0);
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, progress };
  }, [items]);

  return (
    <span>
      {completed}/{total} done ({progress}%)
    </span>
  );
}`}),e.jsx(s.Callout,{children:"Quick formatting/aggregation is best derived in the component. No need to store it."})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["3) Multiple inputs? Use a tuple + ",e.jsx("code",{children:"shallow"})]}),e.jsxs("p",{children:["If your component needs more than one input (e.g., ",e.jsx("code",{children:"items"})," and a"," ",e.jsx("code",{children:"filter"}),"), subscribe with a tuple and pass ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("pre",{className:"note",children:`import { shallow } from 'zustand/shallow';

const [items, filter] = useTodos((s) => [s.items, s.filter], shallow);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Reusable selector helper (optional)"}),e.jsxs("p",{children:["For repeated computations, create a ",e.jsx("b",{children:"selector helper"}),". Return an object and pass"," ",e.jsx("code",{children:"shallow"})," to avoid re-renders when values are equal."]}),e.jsx("pre",{className:"good",children:`// selectors/todos.js
export const selectProgress = (s) => {
  const total = s.items.length;
  const completed = s.items.reduce((n, t) => n + (t.done ? 1 : 0), 0);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, progress };
};

// usage in component
const { completed, total, progress } = useTodos(selectProgress, shallow);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) When would I store the derived value?"}),e.jsxs("ul",{children:[e.jsx("li",{children:"The computation is expensive and used in many places."}),e.jsx("li",{children:"Multiple store actions depend on the result internally."}),e.jsx("li",{children:"You need to persist/sync the computed data as-is."})]}),e.jsx("pre",{className:"note",children:`// If you decide to store it, keep a single point of update:
recalcProgress: () => {
  const { items } = get();
  const total = items.length;
  const completed = items.reduce((n, t) => n + (t.done ? 1 : 0), 0);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  set({ badge: { completed, total, progress } }, false, 'todos/recalcProgress');
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Pitfalls & fixes"}),e.jsx("pre",{className:"bad",children:`// ❌ Returning a fresh object from the selector without equality
const derived = useTodos((s) => ({ total: s.items.length })); // new object each time`}),e.jsx("pre",{className:"good",children:`// ✅ Return tuple/object + shallow OR derive in component
import { shallow } from 'zustand/shallow';
const derived = useTodos((s) => [s.items.length], shallow); // tuple
// or
const items = useTodos((s) => s.items);
const total = useMemo(() => items.length, [items]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"7) Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Select minimal inputs from the store."}),e.jsxs("li",{children:["Compute quick badges/labels with ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsxs("li",{children:["Use tuple/object + ",e.jsx("code",{children:"shallow"})," for multi-input subscriptions."]}),e.jsx("li",{children:"Store derived values only if they’re expensive or widely reused."})]})]})]});export{h as default};
