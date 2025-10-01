import{j as e}from"./index-CpvfKB5t.js";import{S as s}from"./styled-cMDggJIW.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Selectors & Equality — Quick Notes"}),e.jsx(s.Subtitle,{children:"How I pick slices and equality checks in real projects."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"TL;DR"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Select the smallest value a component needs (prefer primitives)."}),e.jsxs("li",{children:["When returning an object/array, pass ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Do heavy/derived work with ",e.jsx("code",{children:"useMemo"})," or inside the store once."]}),e.jsx("li",{children:"Custom equality is rare; use it only when you must."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Single value (best case)"}),e.jsx("pre",{className:"good",children:`// component.jsx
const count = useCounter((s) => s.count); // primitive → fast strict === check
const isDisabled = useCounter((s) => s.count > 10); // derived boolean is also primitive`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Multiple values (tuple) + shallow"}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

const [count, total] = useCart((s) => [s.count, s.total], shallow);
// Re-renders only if count OR total value changes (top-level === check).`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Object selection + shallow (readable for many fields)"}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

const view = useUser((s) => ({
  id: s.id,
  name: s.profile.name,
  plan: s.subscription.plan
}), shallow);`}),e.jsxs(s.Callout,{children:["Returning a new object each render is fine as long as you pass ",e.jsx("code",{children:"shallow"}),". Without it, every render would trigger an update due to a new reference."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Avoid identity traps"}),e.jsx("pre",{className:"bad",children:`// ❌ filtering/mapping in selector returns a fresh array → always re-renders
const visible = useTodos((s) => s.items.filter(t => !t.done));`}),e.jsx("pre",{className:"good",children:`// ✅ select inputs; derive with useMemo in the component
const items = useTodos((s) => s.items);
const visible = useMemo(() => items.filter(t => !t.done), [items]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Equality options (choose wisely)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Default"}),": strict ",e.jsx("code",{children:"==="})," — great for primitives."]}),e.jsxs("li",{children:[e.jsx("b",{children:"shallow"}),": compares only top-level keys/indices of arrays/objects."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Custom"}),": supply your own comparator if you really need it."]})]}),e.jsx("pre",{className:"note",children:`// Custom equality example (keep it cheap!)
const userView = useUser(
  (s) => ({ id: s.id, total: s.cart.total }),
  (a, b) => a.id === b.id && a.total === b.total
);`}),e.jsx(s.Callout,{children:"Custom comparators run on every store change. Keep them very cheap or avoid them."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selector helpers (reusable)"}),e.jsx("pre",{className:"good",children:`// helpers (pure functions)
export const selectTotals = (s) => {
  const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * s.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

// component.jsx
import { shallow } from 'zustand/shallow';
const totals = useCart(selectTotals, shallow);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Debugging re-renders (quick checks)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Is the selector returning a new object/array each time? Add ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Can you select a primitive instead? Split into multiple selectors."}),e.jsxs("li",{children:["Is there heavy work in the selector? Move to ",e.jsx("code",{children:"useMemo"})," or store."]})]}),e.jsx("pre",{className:"note",children:`// quick log to see rerenders
useEffect(() => { console.log('render <CartTotals/>'); });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cheat-sheet"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Primitive? → no equality fn needed."}),e.jsxs("li",{children:["Tuple/object? → pass ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Filtered/mapped list? → select source, compute with ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsx("li",{children:"Expensive & reused derived value? → compute once in the store or a selector helper."})]})]})]});export{i as default};
