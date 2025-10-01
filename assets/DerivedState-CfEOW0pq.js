import{j as e}from"./index-Bmr0gcqO.js";import{S as t}from"./styled-C2dA_KgB.js";const r=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Derived State — Computed Values"}),e.jsx(t.Subtitle,{children:"Compute what you can, store what you must."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsx("li",{children:"When I compute a value vs when I store it."}),e.jsxs("li",{children:["Deriving in the component with ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsx("li",{children:"Selector helpers I reuse across files."}),e.jsx("li",{children:"Identity traps with arrays/objects and how I avoid them."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"My golden rule"}),e.jsx(t.Callout,{children:"I don’t store anything that can be cheaply derived from existing state. Two sources of truth go out of sync easily."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Derive in the component (fast & local)"}),e.jsx("p",{children:"Perfect for quick math, sums, and flags that depend on a few fields."}),e.jsx("pre",{className:"good",children:`// cart store exposes raw inputs
const [items, taxRate] = useCart((s) => [s.items, s.taxRate], shallow);

const totals = useMemo(() => {
  const subtotal = items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * taxRate;
  return { subtotal, tax, total: subtotal + tax };
}, [items, taxRate]);`}),e.jsxs("p",{children:["Components re-render only when ",e.jsx("code",{children:"items"})," or ",e.jsx("code",{children:"taxRate"})," actually change."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Selector helpers I reuse (shareable)"}),e.jsx("pre",{className:"good",children:`// selectors/cart.js
export const selectItems = (s) => s.items;
export const selectTotals = (s) => {
  const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * s.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

// in a component
import { shallow } from 'zustand/shallow';
import { selectTotals } from '../selectors/cart';

const totals = useCart(selectTotals, shallow);`}),e.jsxs("p",{children:["When a helper returns an object, I pair it with ",e.jsx("code",{children:"shallow"})," so equal values don’t re-render just because a new object reference was created."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Identity traps I avoid"}),e.jsx("pre",{className:"bad",children:`// fresh array every time -> causes re-renders
const filtered = useStore((s) => s.items.filter(Boolean));`}),e.jsx("pre",{className:"good",children:`// select the input, derive with useMemo
const items = useStore((s) => s.items);
const filtered = useMemo(() => items.filter(Boolean), [items]);`}),e.jsx("pre",{className:"bad",children:`// sorting inside the selector -> new reference on each render
const sorted = useStore((s) => [...s.items].sort(byPrice));`}),e.jsx("pre",{className:"good",children:`// sort after selecting
const items = useStore((s) => s.items);
const sorted = useMemo(() => [...items].sort(byPrice), [items]);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"When I actually store a derived value"}),e.jsxs("ul",{children:[e.jsx("li",{children:"The computation is expensive and used in many places."}),e.jsx("li",{children:"I need to persist or sync the computed output."}),e.jsx("li",{children:"Multiple store actions depend on it internally."})]}),e.jsx("pre",{className:"good",children:`// inside create((set, get) => ({ ... }))
recalcTotals: () => {
  const { items, taxRate } = get();
  let subtotal = 0;
  for (const it of items) subtotal += it.qty * it.price;
  const tax = subtotal * taxRate;
  set({ totals: { subtotal, tax, total: subtotal + tax } }, false, 'cart/recalcTotals');
},`}),e.jsxs(t.Callout,{children:["If I store it, I make sure every mutation of ",e.jsx("code",{children:"items"})," or ",e.jsx("code",{children:"taxRate"})," also updates",e.jsx("code",{children:" totals"})," in the same action path. One owner of truth."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Formatting is also “derived”"}),e.jsx("p",{children:"Currency strings, date labels, and UI-only text stay outside the store. I compute them in components or selectors so the store holds raw data only."}),e.jsx("pre",{className:"good",children:`const total = totals.total; // number in store
const label = useMemo(() => total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), [total]);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Cheap to recompute? → derive in component or selector."}),e.jsx("li",{children:"Expensive or reused everywhere? → consider a store action to compute once."}),e.jsx("li",{children:"Never persist a value you can rebuild from inputs unless you must."}),e.jsxs("li",{children:["When returning objects/arrays, use ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Memoize sorts/filters/maps; avoid doing them inside the selector."})]})]})]});export{r as default};
