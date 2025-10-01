import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const n=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Zustand — API Quick Reference"}),e.jsx(s.Subtitle,{children:"The daily-use surface: create, set, get, subscribe, selectors, and key middlewares."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Core API at a glance"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"create(fn)"})," — builds a store hook."]}),e.jsxs("li",{children:[e.jsx("b",{children:"set"})," — update state (object or functional form)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"get"})," — read current state inside actions."]}),e.jsxs("li",{children:[e.jsx("b",{children:"subscribe"})," — listen to changes (optionally to a selector)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Selectors"})," — subscribe to just what a component needs."]})]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  reset: () => set({ count: 0 }, false, 'counter/reset'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selecting state"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Select ",e.jsx("b",{children:"primitives"})," when possible (number, string, boolean)."]}),e.jsxs("li",{children:["For multiple values, return a tuple/object + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Don’t select the whole store unless you really need everything."})]}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

// 1) Single value
const count = useCounter((s) => s.count);

// 2) Multiple (tuple) + shallow
const [count, canReset] = useCounter((s) => [s.count, s.count > 0], shallow);

// 3) Object + shallow (more readable with many fields)
const view = useCounter((s) => ({ c: s.count, canReset: s.count > 0 }), shallow);`}),e.jsx("pre",{className:"bad",children:`// ❌ Fresh object every time → extra renders
const view = useCounter((s) => ({ c: s.count }));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"set() & get()"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("code",{children:["set(","... ",")"]})," when the next state does ",e.jsx("b",{children:"not"})," depend on previous."]}),e.jsxs("li",{children:[e.jsx("code",{children:"set((s) => ...)"})," when it ",e.jsx("b",{children:"does"})," depend on previous."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"get()"})," inside actions to read the latest value (avoid stale closures)."]})]}),e.jsx("pre",{className:"good",children:`// Object form
set({ open: true, error: null }, false, 'dialog/open');

// Functional form
set((s) => ({ page: s.page + 1 }), false, 'pager/next');

// Read + write
toggleTheme: () => {
  const mode = get().theme === 'dark' ? 'light' : 'dark';
  set({ theme: mode }, false, 'theme/toggle');
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"subscribe()"}),e.jsx("p",{children:"Use in non-React code or for side effects (logs, storage, analytics)."}),e.jsx("pre",{className:"note",children:`// Basic subscription (entire state)
const unsub = useCounter.subscribe((state) => {
  console.log('count is', state.count);
});

// With selector
const unsubSel = useCounter.subscribe((s) => s.count, (count) => {
  console.log('count changed to', count);
});

// Later
unsub();
unsubSel();`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Async actions (thunks)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Use the ",e.jsx("b",{children:"start → success/error"})," pattern."]}),e.jsxs("li",{children:["Keep ",e.jsx("code",{children:"loading"})," and ",e.jsx("code",{children:"error"})," shapes consistent."]})]}),e.jsx("pre",{className:"good",children:`fetchUsers: async () => {
  set({ loading: true, error: null }, false, 'users/fetchStart');
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    set({ loading: false, users: data }, false, 'users/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/fetchError');
  }
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Middlewares (quick tour)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"persist"})," — save part of the state to storage with versioning."]}),e.jsxs("li",{children:[e.jsx("b",{children:"devtools"})," — action names, time-travel (works best with named actions)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"subscribeWithSelector"})," — subscribe precisely outside components."]}),e.jsxs("li",{children:[e.jsx("b",{children:"immer"})," — optional ergonomic nested updates."]})]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export const useTheme = create(
  devtools(
    persist(
      (set) => ({
        mode: 'dark',
        toggle: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' }), false, 'theme/toggle'),
      }),
      {
        name: 'theme',                // storage key
        version: 1,                   // bump on migrations
        partialize: (s) => ({ mode: s.mode }), // save only what you need
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'theme-store' }
  )
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common patterns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Named actions:"})," ",e.jsx("code",{children:"'slice/action'"})," in the 3rd ",e.jsx("code",{children:"set"})," arg for better devtools traces."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Slice by feature:"})," auth, ui, cart, etc. Keep actions near their data."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Reset:"})," keep an ",e.jsx("code",{children:"initialState"})," and set it back on logout/teardown."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Optimistic updates:"})," snapshot previous value; rollback on error."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Avoid identity churn:"})," use ",e.jsx("code",{children:"shallow"})," when returning arrays/objects from selectors."]})]}),e.jsx("pre",{className:"note",children:`const initial = { count: 0, items: [] };
resetAll: () => set(initial, false, 'app/reset');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Don’ts (quick)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Don’t select the entire store in components if you can avoid it."}),e.jsx("li",{children:"Don’t persist everything — partialize and version."}),e.jsx("li",{children:"Don’t compute heavy values inside selectors; memoize in components or centralize."})]})]})]});export{n as default};
