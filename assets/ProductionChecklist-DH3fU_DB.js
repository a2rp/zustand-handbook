import{j as e}from"./index-Bmr0gcqO.js";import{S as s}from"./styled-C2dA_KgB.js";const r=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Production Checklist — Zustand Apps"}),e.jsx(s.Subtitle,{children:"My pre-flight checks before I ship."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"State shape & initialization"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Keep a small, predictable initial state. Export it if you need resets."}),e.jsx("li",{children:"Group state by feature (slices) and expose actions near that data."}),e.jsx("li",{children:"Avoid storing things that can be derived (counts, totals, formatted labels)."})]}),e.jsx("pre",{className:"good",children:`// stores/app.js
export const initialApp = {
  auth: { user: null },
  ui: { sidebarOpen: true, theme: 'dark' },
  cart: { items: [] },
};

export const useApp = create((set, get) => ({
  ...initialApp,
  resetAll: () => set(initialApp, false, 'app/reset'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selector discipline (avoid extra renders)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Select only what the component needs (prefer primitives)."}),e.jsxs("li",{children:["When selecting multiple values, use tuple/object + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Memoize heavy derived values in the component or create selector helpers."})]}),e.jsx("pre",{className:"bad",children:`// ❌ over-selecting
const all = useApp((s) => s);`}),e.jsx("pre",{className:"good",children:`// ✅ narrow subscriptions
import { shallow } from 'zustand/shallow';
const [items, theme] = useApp((s) => [s.cart.items, s.ui.theme], shallow);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Action naming & update patterns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Name actions like ",e.jsx("code",{children:"slice/action"})," for clean devtools traces."]}),e.jsx("li",{children:"Use the functional form when next state depends on previous state."}),e.jsxs("li",{children:["Batch related updates in a single ",e.jsx("code",{children:"set()"}),"."]})]}),e.jsx("pre",{className:"good",children:`addToCart: (item) =>
  set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add')`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Async flows (start → success/error)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Keep a consistent ",e.jsx("code",{children:"loading"})," and ",e.jsx("code",{children:"error"})," shape."]}),e.jsx("li",{children:"De-dupe in-flight requests and abort stale ones."}),e.jsx("li",{children:"For optimistic updates, snapshot and rollback on error."})]}),e.jsx("pre",{className:"good",children:`fetchCart: async () => {
  set({ loading: true, error: null }, false, 'cart/fetchStart');
  try {
    const res = await fetch('/api/cart');
    const data = await res.json();
    set({ loading: false, cart: { items: data } }, false, 'cart/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'cart/fetchError');
  }
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Persist + migrations (versioned)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Persist only what’s worth restoring (partialize)."}),e.jsxs("li",{children:["Always set a ",e.jsx("b",{children:"version"}),"; bump it when the stored shape changes."]}),e.jsxs("li",{children:["Write a ",e.jsx("code",{children:"migrate()"})," that upgrades old data safely."]})]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettings = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      locale: 'en',
      setTheme: (t) => set({ theme: t }, false, 'settings/setTheme'),
    }),
    {
      name: 'settings-v1',
      version: 2,
      partialize: (s) => ({ theme: s.theme, locale: s.locale }),
      migrate: (state, ver) => {
        if (ver < 2) {
          // e.g., rename 'lang' -> 'locale'
          return { ...state, locale: state.lang ?? 'en' };
        }
        return state;
      },
    }
  )
);`}),e.jsx("pre",{className:"bad",children:`// ❌ Anti-pattern: persist the whole store blindly
persist((set) => ({ ...everything }))`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Devtools in production"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Enable devtools in development; keep it off in production or behind a flag."}),e.jsx("li",{children:"Name actions so time-travel history reads well."})]}),e.jsx("pre",{className:"good",children:`import { devtools } from 'zustand/middleware';
const isDev = import.meta.env.DEV;

export const useApp = create(
  isDev
    ? devtools((set, get) => ({ /* state & actions */ }), { name: 'AppStore' })
    : (set, get) => ({ /* state & actions */ })
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Performance sweep"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Run React Profiler on heavy pages; check selector churn."}),e.jsx("li",{children:"Prefer small, read-only selectors; avoid returning fresh objects without equality."}),e.jsxs("li",{children:["Move hot computations to ",e.jsx("code",{children:"useMemo"})," or compute once in actions."]})]}),e.jsx("pre",{className:"bad",children:`// ❌ Heavy work inside selector (reruns often)
const out = useStore((s) => expensiveTransform(s.bigList));`}),e.jsx("pre",{className:"good",children:`// ✅ Select inputs, derive with useMemo
const bigList = useStore((s) => s.bigList);
const out = useMemo(() => expensiveTransform(bigList), [bigList]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Reset flows (logout, teardown)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Expose ",e.jsx("code",{children:"reset()"})," per slice or a global ",e.jsx("code",{children:"resetAll()"}),"."]}),e.jsxs("li",{children:["Clear persisted keys on logout (e.g., ",e.jsx("code",{children:"localStorage.removeItem"})," of that store)."]})]}),e.jsx("pre",{className:"good",children:`logout: () => {
  set(initialApp, false, 'auth/logout');
  localStorage.removeItem('settings-v1'); // persisted slice key
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Testing mindset"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Unit test actions (input → state change)."}),e.jsx("li",{children:"Test derived selectors/helpers if they contain logic."}),e.jsx("li",{children:"For local stores, mount the component with its store factory in tests."})]}),e.jsx("pre",{className:"note",children:`// Example: action test sketch (pseudo)
useApp.getState().addToCart({ id: 1 });
expect(useApp.getState().cart.items).toHaveLength(1);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Safety & privacy"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Don’t persist secrets/tokens; keep them in memory or use HTTP-only cookies."}),e.jsx("li",{children:"When sharing state to the UI, expose only what the UI needs."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Optional runtime checks (dev only)"}),e.jsx("ul",{children:e.jsx("li",{children:"Subscribe to log changes while building; remove or guard in prod."})}),e.jsx("pre",{className:"note",children:`// Dev trace (remove in prod)
const unsub = useApp.subscribe((state, prev) => {
  console.debug('[app changed]', { state, prev });
});`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Anti-patterns summary"}),e.jsxs("ul",{children:[e.jsx("li",{children:"One giant global store with unrelated concerns."}),e.jsx("li",{children:"Selecting the entire store in components."}),e.jsx("li",{children:"Storing derived/formatting data that can be computed."}),e.jsx("li",{children:"Persisting everything, no version/migration plan."}),e.jsxs("li",{children:["Anonymous ",e.jsx("code",{children:"set()"})," calls (no action names in devtools)."]})]})]})]});export{r as default};
