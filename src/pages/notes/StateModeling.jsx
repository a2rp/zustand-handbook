import React from "react";
import { Styled } from "./styled";

const StateModeling = () => {
    return (
        <Styled.Page>
            <Styled.Title>State Modeling — Slices, Normalization, Factories</Styled.Title>
            <Styled.Subtitle>How I shape stores so they stay simple as features grow.</Styled.Subtitle>

            {/* Quick map */}
            <Styled.Section>
                <h3>Quick map</h3>
                <ul>
                    <li><b>Slices:</b> group state + actions by feature (auth, ui, cart).</li>
                    <li><b>Normalization:</b> store lists as <code>byId</code> + <code>allIds</code> for fast updates.</li>
                    <li><b>Factories:</b> build small, local stores for widgets (filters, wizards, modals).</li>
                </ul>
            </Styled.Section>

            {/* Slices */}
            <Styled.Section>
                <h3>Slices (feature-oriented)</h3>
                <p>Each slice owns its data and actions. Components subscribe to just their slice.</p>
                <pre className="good">{`// stores/app.js (sketch)
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
}));`}</pre>
                <pre className="note">{`// Component usage (narrow subscriptions)
const user = useApp((s) => s.auth.user);
const items = useApp((s) => s.cart.items);`}</pre>
            </Styled.Section>

            {/* Normalization */}
            <Styled.Section>
                <h3>Normalization (byId + allIds)</h3>
                <p>For growing lists, use a map for O(1) reads/updates and a stable id list for order.</p>
                <pre className="good">{`// stores/todos.js
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
}));`}</pre>
                <pre className="note">{`// Denormalize for rendering (selector or component memo)
const ids = useTodos((s) => s.todos.allIds);
const byId = useTodos((s) => s.todos.byId);
const list = React.useMemo(() => ids.map((id) => byId[id]), [ids, byId]);`}</pre>
            </Styled.Section>

            {/* Factories */}
            <Styled.Section>
                <h3>Store factories (local/isolated)</h3>
                <p>Great for per-widget state: each instance gets its own store and resets on unmount.</p>
                <pre className="good">{`// stores/tableFilterFactory.js
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
}`}</pre>
                <pre className="note">{`// Table.jsx
const useFilter = React.useMemo(() => createTableFilterStore({ q: '' }), []);
const q = useFilter((s) => s.q);
const setQuery = useFilter((s) => s.setQuery);`}</pre>
            </Styled.Section>

            {/* Cross-slice composition */}
            <Styled.Section>
                <h3>Cross-slice composition</h3>
                <p>Read other slices with <code>get()</code> inside actions, but keep boundaries clean.</p>
                <pre className="note">{`// inside useApp
checkout: async () => {
  const { cart, auth } = get();
  if (!auth.user) return set({ ui: { ...get().ui, toast: 'Please login' } }, false, 'ui/toast');
  // ...place order with "cart.items"
}`}</pre>
            </Styled.Section>

            {/* Reset & initial state */}
            <Styled.Section>
                <h3>Reset patterns</h3>
                <ul>
                    <li>Keep a constant <code>initial</code> per slice for easy full reset.</li>
                    <li>Expose <code>reset()</code> actions where it makes sense.</li>
                </ul>
                <pre className="good">{`const initialCart = { items: [] };
resetCart: () => set({ cart: initialCart }, false, 'cart/reset')`}</pre>
            </Styled.Section>

            {/* Persist + versions */}
            <Styled.Section>
                <h3>Persist & migrations (heads-up)</h3>
                <ul>
                    <li>Persist only the slice you really need (partialize).</li>
                    <li>Version your persisted shape and add migration steps.</li>
                </ul>
                <pre className="note">{`// later with persist middleware (sketch)
persist(
  (set, get) => ({ ... }),
  {
    name: 'app',
    version: 2,
    partialize: (s) => ({ auth: s.auth, cart: s.cart }),
    migrate: (state, from) => (from < 2 ? { ...state, ui: { sidebarOpen: false } } : state),
  }
)`}</pre>
            </Styled.Section>

            {/* Do / Don't */}
            <Styled.Section>
                <h3>Do / Don’t</h3>
                <ul>
                    <li><b>Do</b> slice by feature; keep actions near data.</li>
                    <li><b>Do</b> normalize growing lists; denormalize at the edge.</li>
                    <li><b>Do</b> use factories for widget-scoped state.</li>
                    <li><b>Don’t</b> select the whole store in components.</li>
                    <li><b>Don’t</b> duplicate derived data; compute or centralize carefully.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default StateModeling;
