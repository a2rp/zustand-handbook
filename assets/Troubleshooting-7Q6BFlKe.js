import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-BO5MAwS2.js";const o=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Troubleshooting — Common Errors & Fixes"}),e.jsx(s.Subtitle,{children:"Quick, practical fixes for the issues I see most often."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Component re-renders on every change"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Cause: selecting the whole store."}),e.jsx("li",{children:"Cause: returning a fresh object/array from the selector."}),e.jsxs("li",{children:["Fix: select primitives, or use tuple/object + ",e.jsx("code",{children:"shallow"}),"."]})]}),e.jsx("pre",{className:"bad",children:`// ❌ over-selecting
const all = useStore((s) => s);`}),e.jsx("pre",{className:"good",children:`// ✅ select just what you need
const count = useStore((s) => s.count);`}),e.jsx("pre",{className:"bad",children:`// ❌ new object each render → always re-renders
const view = useStore((s) => ({ count: s.count }));`}),e.jsx("pre",{className:"good",children:`// ✅ object/tuple + shallow equality
import { shallow } from 'zustand/shallow';
const view = useStore((s) => ({ count: s.count, max: s.max }), shallow);
// or
const [count, max] = useStore((s) => [s.count, s.max], shallow);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: State doesn't update or feels “stuck”"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Cause: mutating nested objects instead of creating a new reference."}),e.jsx("li",{children:"Cause: using object form when the next value depends on previous state."})]}),e.jsx("pre",{className:"bad",children:`// ❌ mutation (same reference)
set((s) => { s.user.name = 'Ashish'; return s; });`}),e.jsx("pre",{className:"good",children:`// ✅ immutable update (new reference)
set((s) => ({ user: { ...s.user, name: 'Ashish' } }));`}),e.jsx("pre",{className:"bad",children:`// ❌ previous value needed, but object form used
set({ count: count + 1 }); // "count" here may be stale`}),e.jsx("pre",{className:"good",children:`// ✅ use functional form when next depends on previous
set((s) => ({ count: s.count + 1 }));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Actions read stale values"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"get()"})," inside actions instead of capturing values from component scope."]}),e.jsx("pre",{className:"bad",children:`// ❌ captures "theme" from outer scope
toggleTheme: () => set({ theme: { mode: theme === 'dark' ? 'light' : 'dark' } });`}),e.jsx("pre",{className:"good",children:`// ✅ read fresh value via get()
toggleTheme: () => {
  const next = get().theme.mode === 'dark' ? 'light' : 'dark';
  set({ theme: { mode: next } }, false, 'theme/toggle');
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Async results overwrite newer state"}),e.jsx("p",{children:"Abort stale requests or guard duplicates."}),e.jsx("pre",{className:"good",children:`// Keep an AbortController in state
fetchUsers: async () => {
  get().controller?.abort?.();
  const controller = new AbortController();
  set({ controller, loading: true, error: null }, false, 'users/fetchStart');
  try {
    const res = await fetch('/api/users', { signal: controller.signal });
    const data = await res.json();
    set({ loading: false, users: data, controller: null }, false, 'users/fetchSuccess');
  } catch (e) {
    if (e.name !== 'AbortError')
      set({ loading: false, error: String(e), controller: null }, false, 'users/fetchError');
  }
}`}),e.jsx("pre",{className:"note",children:`// Simple de-dupe
if (get().inflight) return;
set({ inflight: true }); /* ... */ set({ inflight: false });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Devtools shows unnamed actions"}),e.jsxs("p",{children:["Name actions (3rd arg of ",e.jsx("code",{children:"set"}),") or use the devtools middleware."]}),e.jsx("pre",{className:"good",children:"increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment')"}),e.jsx("pre",{className:"note",children:`// with devtools middleware
import { devtools } from 'zustand/middleware';
export const useStore = create(devtools((set) => ({
  /* ... */
}), { name: 'app' }));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Persisted data doesn't restore or breaks on changes"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Use a stable key and partialize what you persist."}),e.jsxs("li",{children:["Bump ",e.jsx("code",{children:"version"})," and write a ",e.jsx("code",{children:"migrate"})," when shape changes."]})]}),e.jsx("pre",{className:"good",children:`import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuth = create(persist(
  (set) => ({
    user: null,
    login: (user) => set({ user }, false, 'auth/login'),
    logout: () => set({ user: null }, false, 'auth/logout'),
  }),
  {
    name: 'auth',               // storage key
    version: 2,                 // bump when shape changes
    partialize: (s) => ({ user: s.user }), // don't persist volatile flags
    migrate: (state, version) => {
      if (version < 2) return { ...state, user: state.user ?? null };
      return state;
    },
    storage: createJSONStorage(() => localStorage),
  }
));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Memory leak after using subscribe()"}),e.jsx("p",{children:"Always unsubscribe in cleanup."}),e.jsx("pre",{className:"bad",children:`useEffect(() => {
  useStore.subscribe((s) => console.log(s.count));
}, []); // ❌ no cleanup`}),e.jsx("pre",{className:"good",children:`useEffect(() => {
  const unsub = useStore.subscribe((s) => s.count, (count) => console.log(count));
  return () => unsub(); // ✅ cleanup
}, []);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: SSR hydration mismatch or duplicate stores in dev"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Don’t read ",e.jsx("code",{children:"window"}),"/",e.jsx("code",{children:"localStorage"})," during initial state on the server."]}),e.jsx("li",{children:"Define stores outside components so Fast Refresh doesn’t recreate them."})]}),e.jsx("pre",{className:"good",children:`// store is a module singleton, not inside a component
export const useApp = create((set) => ({ /* ... */ }));`}),e.jsx("pre",{className:"note",children:`// If you must read browser APIs, do it in useEffect and then set(...)
useEffect(() => {
  const theme = localStorage.getItem('theme') || 'dark';
  setTheme(theme);
}, []);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Problem: Store state leaks between tests"}),e.jsx("p",{children:"Expose a reset function or helper to restore initial state per test."}),e.jsx("pre",{className:"good",children:`const initial = { count: 0, items: [] };
export const useStore = create((set) => ({ ...initial, reset: () => set(initial) }));
// test setup
afterEach(() => { useStore.getState().reset(); });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Select the smallest slice; use ",e.jsx("code",{children:"shallow"})," for tuples/objects."]}),e.jsxs("li",{children:["Use functional ",e.jsx("code",{children:"set"})," when next depends on previous."]}),e.jsxs("li",{children:["Read current values with ",e.jsx("code",{children:"get()"})," inside actions."]}),e.jsxs("li",{children:["Name actions for devtools (",e.jsx("code",{children:"slice/action"}),")."]}),e.jsx("li",{children:"Persist only what you need; version + migrate."}),e.jsx("li",{children:"Unsubscribe in effects; abort/de-dupe async work."})]})]})]});export{o as default};
