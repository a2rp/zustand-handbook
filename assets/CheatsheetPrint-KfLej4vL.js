import{j as e}from"./index-CpvfKB5t.js";import{S as s}from"./styled-cMDggJIW.js";const o=()=>{const t=()=>window.print();return e.jsxs(s.Page,{id:"print-area",children:[e.jsx("style",{children:`
        @media print {
          /* Show only this page */
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }

          /* Paper theme */
          #print-area {
            background: #fff !important;
            color: #111 !important;
            box-shadow: none !important;
            border: 0 !important;
          }
          #print-area code {
            background: #f5f5f5 !important;
            border-color: #ddd !important;
            color: #111 !important;
          }

          /* Remove “Print” button on paper */
          #print-action { display: none !important; }

          /* Avoid page breaks inside code blocks/lists */
          pre, ul, ol, table { break-inside: avoid; }
        }
      `}),e.jsx(s.Title,{children:"Zustand Cheatsheet — Print"}),e.jsx(s.Subtitle,{children:"Quick reference for daily work. Copy/paste snippets as needed."}),e.jsx("div",{id:"print-action",style:{margin:"8px 0 16px 0"},children:e.jsx("button",{onClick:t,"aria-label":"Print this cheatsheet",children:"🖨️ Print"})}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Install & minimal store"}),e.jsx("pre",{className:"good",children:`npm i zustand

// src/stores/counter.js
import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) }), false, 'counter/decrement'),
  reset:     () => set({ count: 0 }, false, 'counter/reset'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Core API"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"create(fn)"})," → make a store."]}),e.jsxs("li",{children:[e.jsx("code",{children:"set(obj)"})," / ",e.jsx("code",{children:"set((s) => next)"})," → update."]}),e.jsxs("li",{children:[e.jsx("code",{children:"get()"})," → read current state inside actions."]}),e.jsxs("li",{children:[e.jsx("code",{children:"subscribe"})," / ",e.jsx("code",{children:"subscribeWithSelector"})," → listen to changes (lib/advanced)."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Use in a component"}),e.jsx("pre",{className:"good",children:`import { useCounter } from '../stores/counter';

function CounterCard() {
  const count = useCounter((s) => s.count);
  const inc   = useCounter((s) => s.increment);
  const reset = useCounter((s) => s.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={inc}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selectors & equality"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Select ",e.jsx("b",{children:"only"})," what you need (avoid whole-store selects)."]}),e.jsxs("li",{children:["For multiple values, return tuple/object + ",e.jsx("code",{children:"shallow"}),"."]})]}),e.jsx("pre",{className:"note",children:`import { shallow } from 'zustand/shallow';
const count = useCounter((s) => s.count);
const [count, disabled] = useCounter((s) => [s.count, s.count > 10], shallow);
const view = useCounter((s) => ({ c: s.count, disabled: s.count > 10 }), shallow);`}),e.jsx("pre",{className:"bad",children:`// ❌ New object every render → re-renders
const v = useCounter((s) => ({ c: s.count }));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"set() & get() patterns"}),e.jsx("pre",{className:"good",children:`// Object form: no need for previous state
set({ open: true, error: null }, false, 'ui/open');

// Functional form: depends on previous state
set((s) => ({ count: s.count + 1 }), false, 'counter/increment');

// Use get() when action needs current values
toggleTheme: () => {
  const dark = get().theme?.mode === 'dark';
  set({ theme: { mode: dark ? 'light' : 'dark' } }, false, 'theme/toggle');
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Async flow (start / success / error)"}),e.jsx("pre",{className:"good",children:`fetchUsers: async () => {
  set({ loading: true, error: null }, false, 'users/fetchStart');
  try {
    const r = await fetch('/api/users'); if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    set({ loading: false, users: data }, false, 'users/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/fetchError');
  }
}`}),e.jsx("pre",{className:"note",children:`// Abort stale
const prev = get().controller; prev?.abort?.();
const c = new AbortController();
set({ controller: c }, false, 'users/attachController');
await fetch('/api/users', { signal: c.signal });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"persist (quick start)"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useTodo = create(
  persist(
    (set, get) => ({
      items: [],
      add: (t) => set((s) => ({ items: [...s.items, t] }), false, 'todo/add'),
    }),
    {
      name: 'todo:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),   // save only what's needed
      version: 1,
      migrate: (persisted, version) => persisted, // future: handle version bumps
    }
  )
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"devtools (action names)"}),e.jsx("pre",{className:"note",children:"increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment')"}),e.jsx("ul",{children:e.jsxs("li",{children:["Use ",e.jsx("code",{children:"slice/action"})," style names for readable traces."]})})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Global vs local quick picks"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Auth/theme/cart/permissions → ",e.jsx("b",{children:"global slice"}),"."]}),e.jsxs("li",{children:["Wizard/modal/table filters → ",e.jsx("b",{children:"per-component store"})," (auto reset on unmount)."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Performance notes"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Avoid selecting the whole store."}),e.jsxs("li",{children:["Prefer primitives; for objects/arrays use ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Memoize heavy derived values in components."}),e.jsxs("li",{children:["Batch related changes in a single ",e.jsx("code",{children:"set()"}),"."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Testing quick notes"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Test actions as simple functions (no React needed)."}),e.jsx("li",{children:"For local stores, use a factory and mount per test."}),e.jsx("li",{children:"Mock fetch/API at the edge; assert store state."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Handy snippets"}),e.jsx("pre",{className:"good",children:`// Reset whole store
const initial = { count: 0, items: [] };
resetAll: () => set(initial, false, 'app/reset');`}),e.jsx("pre",{className:"good",children:`// Select multiple with shallow
import { shallow } from 'zustand/shallow';
const [user, mode] = useApp((s) => [s.auth.user, s.theme.mode], shallow);`}),e.jsx("pre",{className:"good",children:`// Optimistic update with rollback
const prev = get().items;
set({ items: optimistic }, false, 'items/optimistic');
try { await api.update(); } catch (e) { set({ items: prev }, false, 'items/rollback'); }`})]})]})};export{o as default};
