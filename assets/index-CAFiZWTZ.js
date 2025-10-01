import{d as o,j as e}from"./index-Gt8sd0pi.js";const n="var(--card, #111)",t="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",r="var(--border, #222)",c="var(--accent, #22c55e)",i="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:o.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${n};
        color: ${t};
        border: 1px solid ${r};
        border-radius: ${l};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:o.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:o.p`
        margin: 0 0 18px 0;
        color: ${a};
    `,Section:o.section`
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
            border: 1px solid ${c};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${i};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:o.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Counter (Tuple Selector + shallow)"}),e.jsxs(s.Subtitle,{children:["Select multiple values at once with a tuple and avoid extra re-renders using ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsx("li",{children:"When to return a tuple/object from a selector."}),e.jsxs("li",{children:["Why you should pass ",e.jsx("code",{children:"shallow"})," when returning arrays/objects."]}),e.jsx("li",{children:"Alternatives: separate selectors for primitives."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Store sketch"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

export const useCounter = create((set) => ({
  count: 0,
  step: 1,
  max: 10,

  inc: () => set((s) => ({ count: Math.min(s.count + s.step, s.max) }), false, 'counter/inc'),
  dec: () => set((s) => ({ count: Math.max(0, s.count - s.step) }), false, 'counter/dec'),
  setStep: (n) => set({ step: n }, false, 'counter/setStep'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["2) Tuple selector + ",e.jsx("code",{children:"shallow"})]}),e.jsxs("p",{children:["Return a tuple of values and pass the ",e.jsx("code",{children:"shallow"})," comparator so React only re-renders when any item actually changes."]}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';
import { useCounter } from '../stores/counter';

function CounterPanel() {
  const [count, max, disabled] = useCounter(
    (s) => [s.count, s.max, s.count >= s.max],
    shallow
  );
  const inc = useCounter((s) => s.inc);
  const dec = useCounter((s) => s.dec);

  return (
    <div>
      <p>Count: {count} / {max}</p>
      <button onClick={inc} disabled={disabled}>+{/* step */}</button>
      <button onClick={dec} disabled={count === 0}>-</button>
    </div>
  );
}`}),e.jsxs(s.Callout,{children:["Without ",e.jsx("code",{children:"shallow"}),", the array ",e.jsx("code",{children:"[count, max, disabled]"})," would be a new reference each render, causing the component to re-render even if the values were equal."]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["3) Object selector + ",e.jsx("code",{children:"shallow"})," (more readable)"]}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';
const view = useCounter(
  (s) => ({ count: s.count, max: s.max, disabled: s.count >= s.max }),
  shallow
);
// view.count, view.max, view.disabled`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Separate selectors (no shallow needed)"}),e.jsx("p",{children:"Another simple approach: select primitives separately. Each subscription re-renders only when its value changes."}),e.jsx("pre",{className:"good",children:`const count = useCounter((s) => s.count);
const max = useCounter((s) => s.max);
const disabled = useCounter((s) => s.count >= s.max);`}),e.jsx("p",{children:"This is perfectly fine for small numbers of values and keeps things very explicit."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Pitfalls"}),e.jsx("pre",{className:"bad",children:`// ❌ Tuple/object without shallow
const values = useCounter((s) => [s.count, s.max, s.count >= s.max]); // new array ref every render`}),e.jsx("pre",{className:"bad",children:`// ❌ Doing heavy work in the selector
const view = useCounter((s) => ({ total: expensiveSum(s.items) }));`}),e.jsx("pre",{className:"good",children:`// ✅ Select inputs; derive in component with memo
const items = useCounter((s) => s.items);
const total = useMemo(() => expensiveSum(items), [items]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Returning array/object from selector? → pass ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Only a couple primitives? → separate selectors are fine."}),e.jsxs("li",{children:["Heavy computations? → select inputs and use ",e.jsx("code",{children:"useMemo"})," or derive in the store once."]})]})]})]});export{h as default};
