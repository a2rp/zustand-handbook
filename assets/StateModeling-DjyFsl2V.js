import{j as e}from"./index-CpvfKB5t.js";import{S as s}from"./styled-cMDggJIW.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"State Modeling — Slices, Normalization, Factories"}),e.jsx(s.Subtitle,{children:"How I shape stores so they stay simple as features grow."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick map"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Slices:"})," group state + actions by feature (auth, ui, cart)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Normalization:"})," store lists as ",e.jsx("code",{children:"byId"})," + ",e.jsx("code",{children:"allIds"})," for fast updates."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Factories:"})," build small, local stores for widgets (filters, wizards, modals)."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Slices (feature-oriented)"}),e.jsx("p",{children:"Each slice owns its data and actions. Components subscribe to just their slice."}),e.jsx("pre",{className:"good",children:`// stores/app.js (sketch)
import { create } from 'zustand';

export const useApp = create((set, get) => ({
  // auth slice
  auth: { user: null },
  login: (user) => set({ auth: { user } }, false, 'auth/login'),
  logout: () => set({ auth: { user: null } }, false, 'auth/logout'),

  // ui slice
  ui: { sidebarOpen: false, toast: null },
  toggleSidebar: () =>
    set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }), false, 'ui/toggleSidebar'),

  // cart slice
  cart: { items: [] },
  addToCart: (item) =>
    set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
}));`}),e.jsx("pre",{className:"note",children:`// Component usage (narrow subscriptions)
const user = useApp((s) => s.auth.user);
const items = useApp((s) => s.cart.items);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Normalization (byId + allIds)"}),e.jsx("p",{children:"For growing lists, use a map for O(1) reads/updates and a stable id list for order."}),e.jsx("pre",{className:"good",children:`// stores/todos.js
import { create } from 'zustand';

const initial = { byId: {}, allIds: [] };

export const useTodos = create((set, get) => ({
  todos: initial,

  add: (todo) => set((s) => {
    const id = todo.id;
    return {
      todos: {
        byId: { ...s.todos.byId, [id]: todo },
        allIds: [...s.todos.allIds, id]
      }
    };
  }, false, 'todos/add'),

  toggle: (id) => set((s) => {
    const t = s.todos.byId[id];
    return {
      todos: {
        ...s.todos,
        byId: { ...s.todos.byId, [id]: { ...t, done: !t.done } }
      }
    };
  }, false, 'todos/toggle'),

  remove: (id) => set((s) => {
    const { [id]: _, ...rest } = s.todos.byId;
    return {
      todos: { byId: rest, allIds: s.todos.allIds.filter((x) => x !== id) }
    };
  }, false, 'todos/remove'),
}));`}),e.jsx("pre",{className:"note",children:`// Denormalize for rendering (selector or component memo)
const ids = useTodos((s) => s.todos.allIds);
const byId = useTodos((s) => s.todos.byId);
const list = React.useMemo(() => ids.map((id) => byId[id]), [ids, byId]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Store factories (local/isolated)"}),e.jsx("p",{children:"Great for per-widget state: each instance gets its own store and resets on unmount."}),e.jsx("pre",{className:"good",children:`// stores/tableFilterFactory.js
import { create } from 'zustand';

export function createTableFilterStore(defaults) {
  return create((set) => ({
    q: defaults?.q ?? '',
    sort: defaults?.sort ?? 'createdAt:desc',
    page: 1,
    setQuery: (q) => set({ q }, false, 'filter/setQuery'),
    setSort: (sort) => set({ sort }, false, 'filter/setSort'),
    setPage: (page) => set({ page }, false, 'filter/setPage'),
    reset: () => set({ q: '', sort: 'createdAt:desc', page: 1 }, false, 'filter/reset'),
  }));
}`}),e.jsx("pre",{className:"note",children:`// Table.jsx
const useFilter = React.useMemo(() => createTableFilterStore({ q: '' }), []);
const q = useFilter((s) => s.q);
const setQuery = useFilter((s) => s.setQuery);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cross-slice composition"}),e.jsxs("p",{children:["Read other slices with ",e.jsx("code",{children:"get()"})," inside actions, but keep boundaries clean."]}),e.jsx("pre",{className:"note",children:`// inside useApp
checkout: async () => {
  const { cart, auth } = get();
  if (!auth.user) return set({ ui: { ...get().ui, toast: 'Please login' } }, false, 'ui/toast');
  // ...place order with "cart.items"
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Reset patterns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Keep a constant ",e.jsx("code",{children:"initial"})," per slice for easy full reset."]}),e.jsxs("li",{children:["Expose ",e.jsx("code",{children:"reset()"})," actions where it makes sense."]})]}),e.jsx("pre",{className:"good",children:`const initialCart = { items: [] };
resetCart: () => set({ cart: initialCart }, false, 'cart/reset')`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Persist & migrations (heads-up)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Persist only the slice you really need (partialize)."}),e.jsx("li",{children:"Version your persisted shape and add migration steps."})]}),e.jsx("pre",{className:"note",children:`// later with persist middleware (sketch)
persist(
  (set, get) => ({ ... }),
  {
    name: 'app',
    version: 2,
    partialize: (s) => ({ auth: s.auth, cart: s.cart }),
    migrate: (state, from) => (from < 2 ? { ...state, ui: { sidebarOpen: false } } : state),
  }
)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Do / Don’t"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Do"})," slice by feature; keep actions near data."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Do"})," normalize growing lists; denormalize at the edge."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Do"})," use factories for widget-scoped state."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Don’t"})," select the whole store in components."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Don’t"})," duplicate derived data; compute or centralize carefully."]})]})]})]});export{i as default};
