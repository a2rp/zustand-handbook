import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const r=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Selectors — Slices & Equality"}),e.jsx(s.Subtitle,{children:"Subscribe to only what a component needs, nothing more."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsx("li",{children:"How I pick the right slice for a component."}),e.jsxs("li",{children:["When to use tuples/objects with ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Identity traps (fresh objects/arrays) and simple fixes."}),e.jsx("li",{children:"Selector helpers I reuse across components."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"My one-line rule"}),e.jsxs("p",{children:[e.jsx("b",{children:"Select the smallest value that lets the component render correctly."}),"Smaller slice ⇒ fewer re-renders ⇒ simpler components."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Pick a single primitive when possible"}),e.jsx("pre",{className:"good",children:`// Counter.jsx
const count = useCounter((s) => s.count);     // primitive -> cheap and clean
// render with {count}`}),e.jsx("p",{children:"With primitives (number/string/boolean) you usually don’t need any custom equality."})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["Need multiple values? Tuple or object + ",e.jsx("code",{children:"shallow"})]}),e.jsx("pre",{className:"good",children:`// Tuple pattern (compact)
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter(
  (s) => [s.count, s.count > 10],
  shallow
);`}),e.jsx("pre",{className:"good",children:`// Object pattern (more readable with many fields)
import { shallow } from 'zustand/shallow';
const view = useCounter(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
);`}),e.jsxs("p",{children:[e.jsx("code",{children:"shallow"})," avoids re-rendering when the top-level values haven’t changed, even if a new object/array reference is created."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Identity traps I avoid"}),e.jsx("pre",{className:"bad",children:`// fresh array every time -> will re-render often
const filtered = useStore((s) => s.items.filter(Boolean));`}),e.jsx("pre",{className:"good",children:`// select input, derive with useMemo inside the component
const items = useStore((s) => s.items);
const filtered = useMemo(() => items.filter(Boolean), [items]);`}),e.jsx("pre",{className:"bad",children:`// selecting the whole store -> too many re-renders
const all = useStore((s) => s);`}),e.jsx("pre",{className:"good",children:`// select narrowly
const theme = useStore((s) => s.theme.mode);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selector helpers I reuse"}),e.jsx("pre",{className:"good",children:`// helpers (pure functions)
export const selectUser = (s) => s.auth.user;
export const selectTotals = (s) => {
  const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * s.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

// usage
const user   = useApp(selectUser);
const totals = useCart(selectTotals, shallow);`}),e.jsxs("p",{children:["Helpers keep components tidy and make it easy to audit who depends on what. When helpers return objects, I pair them with ",e.jsx("code",{children:"shallow"}),"."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Custom equality (rarely needed)"}),e.jsx("pre",{className:"note",children:`// Only when shallow isn't enough and data is tiny
const person = usePeople(
  (s) => s.selected,
  (a, b) => a?.id === b?.id && a?.name === b?.name
);`}),e.jsxs("p",{children:["Most of the time, primitives or ",e.jsx("code",{children:"shallow"})," are enough. I keep custom comparators for tiny objects that truly need it."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Primitive available? Select that."}),e.jsxs("li",{children:["Multiple values? Tuple/object + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Heavy work in selector? Move to ",e.jsx("code",{children:"useMemo"})," or a helper."]}),e.jsx("li",{children:"Seeing extra renders? Check for fresh objects/arrays."})]})]})]});export{r as default};
