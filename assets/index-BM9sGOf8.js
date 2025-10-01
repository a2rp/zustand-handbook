import{d as r,j as e}from"./index-Bmr0gcqO.js";const o="var(--card, #111)",n="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",t="var(--border, #222)",c="var(--accent, #22c55e)",d="var(--danger, #ef4444)",a="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${n};
        border: 1px solid ${t};
        border-radius: ${a};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${i};
    `,Section:r.section`
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
            border: 1px solid ${c};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:r.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Selector Identity (Trap & Fixes)"}),e.jsx(s.Subtitle,{children:"Why returning fresh objects/arrays from a selector causes extra re-renders, and how I avoid it."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Default equality is ",e.jsx("code",{children:"==="})," on the selector’s return value."]}),e.jsx("li",{children:"New object/array references → React treats it as “changed” → re-render."}),e.jsxs("li",{children:["Use primitives, stable refs, tuples/objects with ",e.jsx("code",{children:"shallow"}),", or derive in the component."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"The trap"}),e.jsxs("p",{children:["If a selector returns a fresh object/array each render, React will re-render even if the",e.jsx("i",{children:"data"})," didn’t semantically change—because the ",e.jsx("b",{children:"reference"})," is different."]}),e.jsx("pre",{className:"bad",children:`// ❌ Fresh object every time (new reference)
const view = useStore((s) => ({ count: s.count })); // re-renders on any store change

// ❌ Fresh array every time (new reference)
const list = useStore((s) => s.items.filter(it => it.done));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Fix #1 — Select primitives or stable references"}),e.jsx("p",{children:"Subscribing to primitives is the safest and cheapest option."}),e.jsx("pre",{className:"good",children:`// ✅ Select primitives
const count = useStore((s) => s.count);

// ✅ Select stable reference (if the store doesn't recreate it unnecessarily)
const items = useStore((s) => s.items);`})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["Fix #2 — Return a tuple/object + ",e.jsx("code",{children:"shallow"})]}),e.jsx("p",{children:"When you need multiple primitives or stable references, return them together and compare shallowly so React re-renders only when a member actually changes."}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

// ✅ Tuple + shallow (fast & compact)
const [count, total] = useStore((s) => [s.count, s.total], shallow);

// ✅ Object + shallow (more readable for many fields)
const view = useStore(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
);`}),e.jsxs(s.Callout,{children:[e.jsx("b",{children:"Note:"})," ",e.jsx("code",{children:"shallow"})," compares top-level keys (or tuple entries) with",e.jsx("code",{children:"==="}),". It doesn’t “fix” nested identity churn (e.g., a new array each render)."]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["Fix #3 — Derive in the component with ",e.jsx("code",{children:"useMemo"})]}),e.jsxs("p",{children:["For computed arrays/objects like ",e.jsx("code",{children:"filter"}),", select the raw inputs and derive locally."]}),e.jsx("pre",{className:"good",children:`// Store shape (sketch)
const useTodos = create(() => ({ items: [] }));

// Component
const items = useTodos((s) => s.items);           // stable ref from store
const done = React.useMemo(
  () => items.filter(it => it.done),
  [items]
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Fix #4 — Precompute in the store (when truly needed)"}),e.jsx("p",{children:"If the computation is expensive and reused across screens, centralize it in the store and update it via a named action whenever inputs change."}),e.jsx("pre",{className:"note",children:`// In store
recalcDone: () => {
  const src = get().items;
  const done = src.filter(it => it.done);
  set({ done }, false, 'todos/recalcDone');
};

// Component: subscribe to the precomputed slice (stable reference if unchanged)
const done = useTodos((s) => s.done);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Custom equality (advanced)"}),e.jsx("p",{children:"For special cases, supply a custom comparator to the selector subscription. Keep it cheap—this runs often."}),e.jsx("pre",{className:"note",children:`// Watch a single todo by id without re-rendering needlessly
const selectById = (id) => (s) => s.items.find(t => t.id === id);
const sameByUpdatedAt = (a, b) => (a?.updatedAt === b?.updatedAt);

const todo = useTodos(selectById(props.id), sameByUpdatedAt);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Return primitives or stable references from selectors."}),e.jsxs("li",{children:["Need multiple values? Use tuple/object + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Don’t run ",e.jsx("code",{children:"filter/map/sort"})," inside selectors—derive with ",e.jsx("code",{children:"useMemo"})," or precompute in store."]}),e.jsxs("li",{children:["Name actions like ",e.jsx("code",{children:"slice/action"})," for clean devtools traces."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Small exercise"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Start with a ",e.jsx("code",{children:"todos"})," store: ",e.jsx("code",{children:"items"}),", ",e.jsx("code",{children:"add"}),", ",e.jsx("code",{children:"toggle"}),"."]}),e.jsx("li",{children:"In a component, show a “Completed (N)” badge."}),e.jsxs("li",{children:["First do it the wrong way (selector with ",e.jsx("code",{children:"filter"}),"), then fix it via ",e.jsx("code",{children:"useMemo"}),"."]})]})]})]});export{p as default};
