import{d as r,j as e}from"./index-Bmr0gcqO.js";const t="var(--card, #111)",n="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",o="var(--border, #222)",i="var(--accent, #22c55e)",c="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${t};
        color: ${n};
        border: 1px solid ${o};
        border-radius: ${l};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${a};
    `,Section:r.section`
        border-top: 1px dashed ${o};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${o};
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
            border: 1px dashed ${o};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${i};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${c};
            background: rgba(239, 68, 68, 0.08);
        }
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Performance: Over-Selecting"}),e.jsx(s.Subtitle,{children:"Select only what a component needs. Use shallow equality for tuples/objects. Avoid identity churn."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Why ",e.jsx("code",{children:"(s) => s"})," is a re-render trap."]}),e.jsx("li",{children:"How to measure re-renders quickly."}),e.jsxs("li",{children:["Fix patterns: narrow selectors, tuples/objects + ",e.jsx("code",{children:"shallow"}),", and memoization."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Setup: a small global store"}),e.jsx("pre",{className:"good",children:`// stores/app.js
import { create } from 'zustand';

export const useApp = create((set) => ({
  user: { name: 'Riya' },
  theme: { mode: 'dark' },
  cart: { items: [] },
  // actions
  setName: (name) => set((s) => ({ user: { ...s.user, name } }), false, 'user/setName'),
  toggleTheme: () => set((s) => ({ theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' } }), false, 'theme/toggle'),
  addToCart: (item) => set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"The over-selecting anti-pattern"}),e.jsx("pre",{className:"bad",children:`// ❌ Over-selecting the entire store
function ProfileCard() {
  const store = useApp((s) => s);      // re-renders on ANY state change
  return (
    <div>
      <p>Name: {store.user.name}</p>
      <button onClick={() => store.toggleTheme()}>Toggle theme</button>
    </div>
  );
}`}),e.jsxs("p",{children:["If ",e.jsx("code",{children:"cart.items"})," changes, ",e.jsx("b",{children:"ProfileCard"})," re-renders even though it only shows the name."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Measure: quick render counter"}),e.jsx("pre",{className:"note",children:`// Drop this snippet inside any component to count renders
const renders = React.useRef(0); renders.current++;
console.log('ProfileCard renders:', renders.current);`}),e.jsx("p",{children:"Interact with unrelated parts of the store and watch the counter climb on the console."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Fix #1 — narrow selectors"}),e.jsx("pre",{className:"good",children:`// ✅ Select only what you need
function ProfileCard() {
  const name = useApp((s) => s.user.name);
  const setName = useApp((s) => s.setName);
  return (
    <div>
      <p>Name: {name}</p>
      <button onClick={() => setName('Aarav')}>Rename</button>
    </div>
  );
}`}),e.jsxs("p",{children:["Now ProfileCard re-renders only when ",e.jsx("code",{children:"user.name"})," changes."]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["Fix #2 — multiple values with tuple/object + ",e.jsx("code",{children:"shallow"})]}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

// tuple
const [name, mode] = useApp((s) => [s.user.name, s.theme.mode], shallow);

// or object (more readable with many fields)
const view = useApp((s) => ({ name: s.user.name, mode: s.theme.mode }), shallow);`}),e.jsxs("p",{children:["Passing ",e.jsx("code",{children:"shallow"})," ensures the component re-renders only when the selected values change, not when the overall store changes."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Identity trap — fresh objects in selectors"}),e.jsx("pre",{className:"bad",children:`// ❌ New array every time → re-renders even if items are the same reference
const items = useApp((s) => s.cart.items.filter(Boolean));`}),e.jsx("pre",{className:"good",children:`// ✅ Select inputs; derive with useMemo in component
const itemsRaw = useApp((s) => s.cart.items);
const items = React.useMemo(() => itemsRaw.filter(Boolean), [itemsRaw]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Fix #3 — split UI by responsibility"}),e.jsxs("p",{children:["Break components so each one subscribes to the slice it actually needs. You can also wrap stable child components with ",e.jsx("code",{children:"React.memo"})," (after you’ve fixed selectors)."]}),e.jsx("pre",{className:"good",children:`const NameText = React.memo(function NameText() {
  const name = useApp((s) => s.user.name);
  return <span>{name}</span>;
});

function ProfileCard() {
  const setName = useApp((s) => s.setName);
  return (
    <div>
      <NameText />
      <button onClick={() => setName('Aarav')}>Rename</button>
    </div>
  );
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Bonus — action selection is cheap"}),e.jsx("pre",{className:"note",children:`// Actions are stable references from the store.
// Selecting them separately won't cause extra re-renders.
const addToCart = useApp((s) => s.addToCart);
const toggleTheme = useApp((s) => s.toggleTheme);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Avoid ",e.jsx("code",{children:"(s) => s"})," in components."]}),e.jsx("li",{children:"Subscribe to the smallest slice you need."}),e.jsxs("li",{children:["For multiple values, use tuple/object + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Don’t create fresh objects/arrays inside selectors; derive with ",e.jsx("code",{children:"useMemo"})," or inside the store once."]}),e.jsxs("li",{children:["Split components by responsibility; consider ",e.jsx("code",{children:"React.memo"})," after fixing selectors."]})]})]})]});export{p as default};
