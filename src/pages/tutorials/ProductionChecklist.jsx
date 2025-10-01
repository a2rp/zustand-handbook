import React from "react";
import { Styled } from "./styled";

const ProductionChecklist = () => {
    return (
        <Styled.Page>
            <Styled.Title>Production Checklist — Zustand Apps</Styled.Title>
            <Styled.Subtitle>My pre-flight checks before I ship.</Styled.Subtitle>

            {/* 1. State shape & init */}
            <Styled.Section>
                <h3>State shape & initialization</h3>
                <ul>
                    <li>Keep a small, predictable initial state. Export it if you need resets.</li>
                    <li>Group state by feature (slices) and expose actions near that data.</li>
                    <li>Avoid storing things that can be derived (counts, totals, formatted labels).</li>
                </ul>
                <pre className="good">{`// stores/app.js
export const initialApp = {
  auth: { user: null },
  ui: { sidebarOpen: true, theme: 'dark' },
  cart: { items: [] },
};

export const useApp = create((set, get) => ({
  ...initialApp,
  resetAll: () => set(initialApp, false, 'app/reset'),
}));`}</pre>
            </Styled.Section>

            {/* 2. Selector discipline */}
            <Styled.Section>
                <h3>Selector discipline (avoid extra renders)</h3>
                <ul>
                    <li>Select only what the component needs (prefer primitives).</li>
                    <li>When selecting multiple values, use tuple/object + <code>shallow</code>.</li>
                    <li>Memoize heavy derived values in the component or create selector helpers.</li>
                </ul>
                <pre className="bad">{`// ❌ over-selecting
const all = useApp((s) => s);`}</pre>
                <pre className="good">{`// ✅ narrow subscriptions
import { shallow } from 'zustand/shallow';
const [items, theme] = useApp((s) => [s.cart.items, s.ui.theme], shallow);`}</pre>
            </Styled.Section>

            {/* 3. Action naming & patterns */}
            <Styled.Section>
                <h3>Action naming & update patterns</h3>
                <ul>
                    <li>Name actions like <code>slice/action</code> for clean devtools traces.</li>
                    <li>Use the functional form when next state depends on previous state.</li>
                    <li>Batch related updates in a single <code>set()</code>.</li>
                </ul>
                <pre className="good">{`addToCart: (item) =>
  set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add')`}</pre>
            </Styled.Section>

            {/* 4. Async flows */}
            <Styled.Section>
                <h3>Async flows (start → success/error)</h3>
                <ul>
                    <li>Keep a consistent <code>loading</code> and <code>error</code> shape.</li>
                    <li>De-dupe in-flight requests and abort stale ones.</li>
                    <li>For optimistic updates, snapshot and rollback on error.</li>
                </ul>
                <pre className="good">{`fetchCart: async () => {
  set({ loading: true, error: null }, false, 'cart/fetchStart');
  try {
    const res = await fetch('/api/cart');
    const data = await res.json();
    set({ loading: false, cart: { items: data } }, false, 'cart/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'cart/fetchError');
  }
}`}</pre>
            </Styled.Section>

            {/* 5. Persist + migrations */}
            <Styled.Section>
                <h3>Persist + migrations (versioned)</h3>
                <ul>
                    <li>Persist only what’s worth restoring (partialize).</li>
                    <li>Always set a <b>version</b>; bump it when the stored shape changes.</li>
                    <li>Write a <code>migrate()</code> that upgrades old data safely.</li>
                </ul>
                <pre className="good">{`import { create } from 'zustand';
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
);`}</pre>
                <pre className="bad">{`// ❌ Anti-pattern: persist the whole store blindly
persist((set) => ({ ...everything }))`}</pre>
            </Styled.Section>

            {/* 6. Devtools usage */}
            <Styled.Section>
                <h3>Devtools in production</h3>
                <ul>
                    <li>Enable devtools in development; keep it off in production or behind a flag.</li>
                    <li>Name actions so time-travel history reads well.</li>
                </ul>
                <pre className="good">{`import { devtools } from 'zustand/middleware';
const isDev = import.meta.env.DEV;

export const useApp = create(
  isDev
    ? devtools((set, get) => ({ /* state & actions */ }), { name: 'AppStore' })
    : (set, get) => ({ /* state & actions */ })
);`}</pre>
            </Styled.Section>

            {/* 7. Performance sweep */}
            <Styled.Section>
                <h3>Performance sweep</h3>
                <ul>
                    <li>Run React Profiler on heavy pages; check selector churn.</li>
                    <li>Prefer small, read-only selectors; avoid returning fresh objects without equality.</li>
                    <li>Move hot computations to <code>useMemo</code> or compute once in actions.</li>
                </ul>
                <pre className="bad">{`// ❌ Heavy work inside selector (reruns often)
const out = useStore((s) => expensiveTransform(s.bigList));`}</pre>
                <pre className="good">{`// ✅ Select inputs, derive with useMemo
const bigList = useStore((s) => s.bigList);
const out = useMemo(() => expensiveTransform(bigList), [bigList]);`}</pre>
            </Styled.Section>

            {/* 8. Reset & logout flows */}
            <Styled.Section>
                <h3>Reset flows (logout, teardown)</h3>
                <ul>
                    <li>Expose <code>reset()</code> per slice or a global <code>resetAll()</code>.</li>
                    <li>Clear persisted keys on logout (e.g., <code>localStorage.removeItem</code> of that store).</li>
                </ul>
                <pre className="good">{`logout: () => {
  set(initialApp, false, 'auth/logout');
  localStorage.removeItem('settings-v1'); // persisted slice key
}`}</pre>
            </Styled.Section>

            {/* 9. Testing mindset */}
            <Styled.Section>
                <h3>Testing mindset</h3>
                <ul>
                    <li>Unit test actions (input → state change).</li>
                    <li>Test derived selectors/helpers if they contain logic.</li>
                    <li>For local stores, mount the component with its store factory in tests.</li>
                </ul>
                <pre className="note">{`// Example: action test sketch (pseudo)
useApp.getState().addToCart({ id: 1 });
expect(useApp.getState().cart.items).toHaveLength(1);`}</pre>
            </Styled.Section>

            {/* 10. Safety & privacy */}
            <Styled.Section>
                <h3>Safety & privacy</h3>
                <ul>
                    <li>Don’t persist secrets/tokens; keep them in memory or use HTTP-only cookies.</li>
                    <li>When sharing state to the UI, expose only what the UI needs.</li>
                </ul>
            </Styled.Section>

            {/* 11. Runtime checks (optional, dev only) */}
            <Styled.Section>
                <h3>Optional runtime checks (dev only)</h3>
                <ul>
                    <li>Subscribe to log changes while building; remove or guard in prod.</li>
                </ul>
                <pre className="note">{`// Dev trace (remove in prod)
const unsub = useApp.subscribe((state, prev) => {
  console.debug('[app changed]', { state, prev });
});`}</pre>
            </Styled.Section>

            {/* Anti-patterns summary */}
            <Styled.Section>
                <h3>Anti-patterns summary</h3>
                <ul>
                    <li>One giant global store with unrelated concerns.</li>
                    <li>Selecting the entire store in components.</li>
                    <li>Storing derived/formatting data that can be computed.</li>
                    <li>Persisting everything, no version/migration plan.</li>
                    <li>Anonymous <code>set()</code> calls (no action names in devtools).</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ProductionChecklist;
