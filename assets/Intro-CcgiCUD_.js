import{j as e}from"./index-CpvfKB5t.js";import{S as s}from"./styled-BiXATIDY.js";const o=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Zustand for Beginners — 101 & Mental Model"}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What is Zustand?"}),e.jsxs("p",{children:["Zustand is a tiny state management library for React. Think of it as a single place (a ",e.jsx("b",{children:"store"}),") that keeps your app’s data and a few helper functions to read/update that data from any component."]}),e.jsx("h3",{children:"Why use it?"}),e.jsxs("ul",{children:[e.jsx("li",{children:"🧠 Simple API (create, set, get, subscribe)"}),e.jsxs("li",{children:["🎯 Components read only what they need (via ",e.jsx("b",{children:"selectors"}),")"]}),e.jsxs("li",{children:["⚡ Fewer re-renders with equality checks (e.g., ",e.jsx("code",{children:"shallow"}),")"]}),e.jsx("li",{children:"🧩 Optional middlewares (persist, devtools, subscribeWithSelector)"})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Mental model (big picture)"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["You create a ",e.jsx("b",{children:"store"})," with some initial state and “actions”."]}),e.jsxs("li",{children:["Components ",e.jsx("b",{children:"select"})," the exact piece of state they need."]}),e.jsxs("li",{children:["Actions call ",e.jsx("code",{children:"set()"})," to update state; components re-render if their selected value changes."]})]}),e.jsx("pre",{className:"note",children:`Component
   ↓ uses
useStore(selector)  → subscribes only to what you select
   ↑ gets updates when selected value changes
Store: { state, actions(set, get) } → set() updates; get() reads current state`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Install & minimal setup"}),e.jsx("pre",{className:"good",children:`# install once
npm i zustand

# store file: src/stores/counter.js (example)
import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,
  // actions (name them for clarity later with devtools)
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
  reset:     () => set({ count: 0 }),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Using it inside a component"}),e.jsx("pre",{className:"good",children:`import React from 'react';
import { useCounter } from '../stores/counter';

export default function CounterCard() {
  // ✅ select only what you need
  const count = useCounter((s) => s.count);
  const increment = useCounter((s) => s.increment);
  const reset = useCounter((s) => s.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`}),e.jsxs("p",{children:[e.jsx("b",{children:"Why select separately?"})," Each selected value re-renders only when it changes. Selecting the whole store would cause more re-renders."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selectors (60-second intro)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Select ",e.jsx("b",{children:"primitives"})," when possible (number, string, boolean)."]}),e.jsxs("li",{children:["When selecting multiple values, return a tuple/object + ",e.jsx("code",{children:"shallow"}),"."]})]}),e.jsx("pre",{className:"note",children:`// 1) Single primitive
const count = useCounter((s) => s.count);

// 2) Multiple values (tuple) + shallow
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter((s) => [s.count, s.count > 10], shallow);

// 3) Object + shallow (more readable when many fields)
const view = useCounter((s) => ({ c: s.count, disabled: s.count > 10 }), shallow);`}),e.jsx("pre",{className:"bad",children:`// ❌ Anti-pattern: returning fresh objects without equality
const view = useCounter((s) => ({ c: s.count })); // new object each time → more renders`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"set() & get() basics"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"set(object)"})," when the new state doesn’t depend on previous state."]}),e.jsxs("li",{children:[e.jsx("code",{children:"set((s) => ...)"})," when it ",e.jsx("b",{children:"does"})," depend on previous state."]}),e.jsxs("li",{children:[e.jsx("code",{children:"get()"})," to read the current state inside actions (avoids stale closures)."]})]}),e.jsx("pre",{className:"good",children:`// inside create((set, get) => ({ ... }))
toggleDisabled: () => {
  const tooHigh = get().count > 10;       // current value
  set({ disabled: !tooHigh });            // update
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common gotchas (and fixes)"}),e.jsx("pre",{className:"bad",children:`// ❌ Selecting the whole store in a component
const store = useCounter((s) => s); // many re-renders`}),e.jsx("pre",{className:"good",children:`// ✅ Select only what you need
const count = useCounter((s) => s.count);`}),e.jsx("pre",{className:"bad",children:`// ❌ Doing heavy computations directly in the selector
const out = useCounter((s) => expensive(s.list));`}),e.jsx("pre",{className:"good",children:`// ✅ Select inputs; compute with useMemo in the component
const list = useCounter((s) => s.list);
const out = useMemo(() => expensive(list), [list]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"FAQ — short & sweet"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Context vs Zustand?"})," Zustand needs less boilerplate and supports precise subscriptions."]}),e.jsxs("li",{children:[e.jsx("b",{children:"One store or many?"})," Start global with slices; use local stores for widget-scoped flows."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Where to keep derived data?"})," Derive in components/selectors unless it’s expensive or reused widely."]})]})]})]});export{o as default};
