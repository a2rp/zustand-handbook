import{j as e}from"./index-D0NhHHfM.js";import{S as t}from"./styled-9asSRIYq.js";const i=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Slices Pattern — Store Factories"}),e.jsx(t.Subtitle,{children:"How I split state by feature and compose a clean store."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Why slices help on real projects."}),e.jsx("li",{children:"Two ways to organize slices (flat vs nested)."}),e.jsx("li",{children:"Composing the final store."}),e.jsx("li",{children:"Factory pattern for widget-local stores."}),e.jsx("li",{children:"Reset and testing tips."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Why slices?"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Each feature owns its state + actions → fewer accidental couplings."}),e.jsx("li",{children:"Selectors stay small and readable."}),e.jsx("li",{children:"Migrations and persistence are easier per feature."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Two organization styles"}),e.jsxs(t.Table,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Style"}),e.jsx("th",{children:"Shape"}),e.jsx("th",{children:"Pros"}),e.jsx("th",{children:"Cons"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Flat (my default)"}),e.jsxs("td",{children:["keys at root: ",e.jsx("code",{children:"count, addToCart()"})]}),e.jsx("td",{children:"Shortest selectors, simple actions"}),e.jsx("td",{children:"Name collisions if you don’t prefix action types"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Nested"}),e.jsx("td",{children:e.jsx("code",{children:"counter: { count, inc() }"})}),e.jsx("td",{children:"Clear visual grouping"}),e.jsx("td",{children:"Selectors a bit longer, extra object layer"})]})]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Minimal slice example (flat)"}),e.jsx("pre",{className:"good",children:`// slices/counterSlice.js
export const createCounterSlice = (set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  resetCount: () => set({ count: 0 }, false, 'counter/reset'),
});

// slices/cartSlice.js
export const createCartSlice = (set, get) => ({
  items: [],
  addToCart: (item) =>
    set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
  removeFromCart: (id) =>
    set((s) => ({ items: s.items.filter(it => it.id !== id) }), false, 'cart/remove'),
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Compose the store"}),e.jsx("pre",{className:"good",children:`// stores/app.js
import { create } from 'zustand';
import { createCounterSlice } from '../slices/counterSlice';
import { createCartSlice } from '../slices/cartSlice';

export const useApp = create((set, get) => ({
  ...createCounterSlice(set, get),
  ...createCartSlice(set, get),
}));

// Component usage (small selectors)
const count = useApp((s) => s.count);
const add = useApp((s) => s.addToCart);`}),e.jsxs(t.Callout,{children:["I keep action type strings namespaced like ",e.jsx("code",{children:'"counter/increment"'})," so devtools stays readable."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Nested variant (if you prefer grouping)"}),e.jsx("pre",{className:"note",children:`// stores/appNested.js
import { create } from 'zustand';

export const useAppNested = create((set, get) => ({
  counter: {
    count: 0,
    inc: () => set((s) => ({ counter: { ...s.counter, count: s.counter.count + 1 } }), false, 'counter/inc'),
  },
  cart: {
    items: [],
    add: (item) => set((s) => ({ cart: { ...s.cart, items: [...s.cart.items, item] } }), false, 'cart/add'),
  },
}));

// Component selectors become a bit longer:
const count = useAppNested((s) => s.counter.count);
const add   = useAppNested((s) => s.cart.add);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Factory for widget-local state (per-instance)"}),e.jsx("p",{children:"Useful for wizards, modals, and forms that should reset on unmount."}),e.jsx("pre",{className:"good",children:`// factories/makeWizardStore.js
import { create } from 'zustand';

export function makeWizardStore(initialStep = 1) {
  return create((set, get) => ({
    step: initialStep,
    data: {},
    next: () => set((s) => ({ step: s.step + 1 }), false, 'wizard/next'),
    prev: () => set((s) => ({ step: Math.max(1, s.step - 1) }), false, 'wizard/prev'),
    setField: (k, v) => set((s) => ({ data: { ...s.data, [k]: v } }), false, 'wizard/setField'),
    reset: () => set({ step: 1, data: {} }, false, 'wizard/reset'),
  }));
}

// In the component:
const useWizard = React.useMemo(() => makeWizardStore(1), []);
const step = useWizard((s) => s.step);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Reset patterns per slice"}),e.jsx("pre",{className:"good",children:`// slices/counterSlice.js
const initialCounter = { count: 0 };

export const createCounterSlice = (set, get) => ({
  ...initialCounter,
  resetCount: () => set(initialCounter, false, 'counter/reset'),
});`}),e.jsxs("p",{children:["For a full reset, I keep an ",e.jsx("code",{children:"initialApp"})," object in the composed store and set it back in one shot."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Testing a slice in isolation"}),e.jsx("pre",{className:"note",children:`import { act, renderHook } from '@testing-library/react';
import { create } from 'zustand';
import { createCounterSlice } from './counterSlice';

test('increments', () => {
  const useTest = create((set, get) => ({ ...createCounterSlice(set, get) }));
  const { result } = renderHook(() => useTest((s) => s));
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Mistakes I watch for"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Leaking cross-slice references. If two slices must coordinate, call actions, don’t mutate foreign state directly."}),e.jsxs("li",{children:["Returning fresh objects in selectors without ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Putting shared concerns (auth/theme) into a local factory store."})]}),e.jsx("pre",{className:"bad",children:`// ❌ mutating another slice directly inside a slice
// do: expose an action and call it instead`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"My quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"One slice per feature; actions live next to their data."}),e.jsxs("li",{children:["Keep selectors tiny; prefer primitives or tuples/objects + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Namespace action types for devtools."}),e.jsx("li",{children:"Use factories for per-instance state."}),e.jsx("li",{children:"Plan reset and test each slice alone."})]})]})]});export{i as default};
