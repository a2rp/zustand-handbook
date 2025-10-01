import{d as o,j as e}from"./index-Bmr0gcqO.js";const s="var(--card, #111)",r="var(--text, #e9e9e9)",c="var(--muted, #b7b7b7)",t="var(--border, #222)",a="var(--accent, #22c55e)",i="var(--danger, #ef4444)",d="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",n={Page:o.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${s};
        color: ${r};
        border: 1px solid ${t};
        border-radius: ${d};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;
    `,Title:o.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:o.p`
        margin: 0 0 18px 0;
        color: ${c};
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
            border: 1px solid ${a};
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
    `},h=()=>e.jsxs(n.Page,{children:[e.jsx(n.Title,{children:"Example — Counter"}),e.jsx(n.Subtitle,{children:"Start here: create a store, read a value, update it."}),e.jsxs(n.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Make a tiny store with ",e.jsx("code",{children:"create()"}),"."]}),e.jsxs("li",{children:["Update state with ",e.jsx("code",{children:"set()"})," (object vs functional form)."]}),e.jsxs("li",{children:["Read state in components with ",e.jsx("b",{children:"selectors"})," (subscribe to only what you need)."]})]})]}),e.jsxs(n.Section,{children:[e.jsx("h3",{children:"1) Store file (counter store)"}),e.jsxs("p",{children:["Create a file like ",e.jsx("code",{children:"src/stores/counter.js"}),":"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,

  // actions
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) }), false, 'counter/decrement'),
  reset: () => set({ count: 0 }, false, 'counter/reset'),

  // sometimes you need current state inside actions:
  incBy: (n = 1) => {
    const current = get().count; // safe read of current value
    set({ count: current + n }, false, 'counter/incBy');
  },
}));`}),e.jsxs(n.Callout,{children:["Use the ",e.jsx("b",{children:"functional form"})," when next value depends on the previous one:",e.jsx("code",{children:"set((s) => (…))"}),". Name actions like ",e.jsx("code",{children:"slice/action"})," for cleaner devtools."]})]}),e.jsxs(n.Section,{children:[e.jsx("h3",{children:"2) Using it in a component"}),e.jsx("pre",{className:"good",children:`import React from 'react';
import { useCounter } from '../stores/counter';

export default function CounterCard() {
  // select only what the component needs
  const count = useCounter((s) => s.count);
  const increment = useCounter((s) => s.increment);
  const decrement = useCounter((s) => s.decrement);
  const reset = useCounter((s) => s.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={() => useCounter.getState().incBy(5)}>+5 (via getState)</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`}),e.jsxs("p",{children:["Selecting the whole store (e.g., ",e.jsx("code",{children:"(s) => s"}),") causes extra re-renders. Select only the pieces you use (like ",e.jsx("code",{children:"count"})," and actions)."]})]}),e.jsxs(n.Section,{children:[e.jsx("h3",{children:"3) Multiple values with a tuple selector"}),e.jsxs("p",{children:["When you need two or more values, return a tuple and pass ",e.jsx("code",{children:"shallow"})," so React re-renders only when those values actually change."]}),e.jsx("pre",{className:"note",children:`import { shallow } from 'zustand/shallow';

const [count, disabled] = useCounter(
  (s) => [s.count, s.count >= 10],
  shallow
);`})]}),e.jsxs(n.Section,{children:[e.jsx("h3",{children:"4) Common gotchas"}),e.jsx("pre",{className:"bad",children:`// ❌ Over-selecting
const all = useCounter((s) => s); // triggers more re-renders than needed`}),e.jsx("pre",{className:"good",children:`// ✅ Narrow selection
const count = useCounter((s) => s.count);`}),e.jsx("pre",{className:"bad",children:`// ❌ Deriving heavy values in selector (runs on every state change)
const view = useCounter((s) => expensiveCompute(s.count));`}),e.jsx("pre",{className:"good",children:`// ✅ Select inputs; compute in component with useMemo
const count = useCounter((s) => s.count);
const view = useMemo(() => expensiveCompute(count), [count]);`})]}),e.jsxs(n.Section,{children:[e.jsx("h3",{children:"5) Exercise ideas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add a ",e.jsx("code",{children:"min"})," and ",e.jsx("code",{children:"max"})," to clamp the counter."]}),e.jsxs("li",{children:["Expose ",e.jsx("code",{children:"setTo(n)"})," action (",e.jsxs("code",{children:["set(","count: n ",")"]}),")."]}),e.jsxs("li",{children:["Track ",e.jsx("code",{children:"history"})," in an array and add a ",e.jsx("code",{children:"resetToLast()"})," action."]})]})]})]});export{h as default};
