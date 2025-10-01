import React from "react";
import { Styled } from "./styled";

const Troubleshooting = () => {
    return (
        <Styled.Page>
            <Styled.Title>Troubleshooting — Common Errors & Fixes</Styled.Title>
            <Styled.Subtitle>Quick, practical fixes for the issues I see most often.</Styled.Subtitle>

            {/* Renders too often */}
            <Styled.Section>
                <h3>Problem: Component re-renders on every change</h3>
                <ul>
                    <li>Cause: selecting the whole store.</li>
                    <li>Cause: returning a fresh object/array from the selector.</li>
                    <li>Fix: select primitives, or use tuple/object + <code>shallow</code>.</li>
                </ul>
                <pre className="bad">{`// ❌ over-selecting
const all = useStore((s) => s);`}</pre>
                <pre className="good">{`// ✅ select just what you need
const count = useStore((s) => s.count);`}</pre>
                <pre className="bad">{`// ❌ new object each render → always re-renders
const view = useStore((s) => ({ count: s.count }));`}</pre>
                <pre className="good">{`// ✅ object/tuple + shallow equality
import { shallow } from 'zustand/shallow';
const view = useStore((s) => ({ count: s.count, max: s.max }), shallow);
// or
const [count, max] = useStore((s) => [s.count, s.max], shallow);`}</pre>
            </Styled.Section>

            {/* Nothing updates */}
            <Styled.Section>
                <h3>Problem: State doesn't update or feels “stuck”</h3>
                <ul>
                    <li>Cause: mutating nested objects instead of creating a new reference.</li>
                    <li>Cause: using object form when the next value depends on previous state.</li>
                </ul>
                <pre className="bad">{`// ❌ mutation (same reference)
set((s) => { s.user.name = 'Ashish'; return s; });`}</pre>
                <pre className="good">{`// ✅ immutable update (new reference)
set((s) => ({ user: { ...s.user, name: 'Ashish' } }));`}</pre>
                <pre className="bad">{`// ❌ previous value needed, but object form used
set({ count: count + 1 }); // "count" here may be stale`}</pre>
                <pre className="good">{`// ✅ use functional form when next depends on previous
set((s) => ({ count: s.count + 1 }));`}</pre>
            </Styled.Section>

            {/* Stale closures */}
            <Styled.Section>
                <h3>Problem: Actions read stale values</h3>
                <p>Use <code>get()</code> inside actions instead of capturing values from component scope.</p>
                <pre className="bad">{`// ❌ captures "theme" from outer scope
toggleTheme: () => set({ theme: { mode: theme === 'dark' ? 'light' : 'dark' } });`}</pre>
                <pre className="good">{`// ✅ read fresh value via get()
toggleTheme: () => {
  const next = get().theme.mode === 'dark' ? 'light' : 'dark';
  set({ theme: { mode: next } }, false, 'theme/toggle');
}`}</pre>
            </Styled.Section>

            {/* Async/race conditions */}
            <Styled.Section>
                <h3>Problem: Async results overwrite newer state</h3>
                <p>Abort stale requests or guard duplicates.</p>
                <pre className="good">{`// Keep an AbortController in state
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
}`}</pre>
                <pre className="note">{`// Simple de-dupe
if (get().inflight) return;
set({ inflight: true }); /* ... */ set({ inflight: false });`}</pre>
            </Styled.Section>

            {/* Devtools */}
            <Styled.Section>
                <h3>Problem: Devtools shows unnamed actions</h3>
                <p>Name actions (3rd arg of <code>set</code>) or use the devtools middleware.</p>
                <pre className="good">{`increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment')`}</pre>
                <pre className="note">{`// with devtools middleware
import { devtools } from 'zustand/middleware';
export const useStore = create(devtools((set) => ({
  /* ... */
}), { name: 'app' }));`}</pre>
            </Styled.Section>

            {/* Persist */}
            <Styled.Section>
                <h3>Problem: Persisted data doesn't restore or breaks on changes</h3>
                <ul>
                    <li>Use a stable key and partialize what you persist.</li>
                    <li>Bump <code>version</code> and write a <code>migrate</code> when shape changes.</li>
                </ul>
                <pre className="good">{`import { persist, createJSONStorage } from 'zustand/middleware';

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
));`}</pre>
            </Styled.Section>

            {/* Subscriptions */}
            <Styled.Section>
                <h3>Problem: Memory leak after using subscribe()</h3>
                <p>Always unsubscribe in cleanup.</p>
                <pre className="bad">{`useEffect(() => {
  useStore.subscribe((s) => console.log(s.count));
}, []); // ❌ no cleanup`}</pre>
                <pre className="good">{`useEffect(() => {
  const unsub = useStore.subscribe((s) => s.count, (count) => console.log(count));
  return () => unsub(); // ✅ cleanup
}, []);`}</pre>
            </Styled.Section>

            {/* SSR / Next.js */}
            <Styled.Section>
                <h3>Problem: SSR hydration mismatch or duplicate stores in dev</h3>
                <ul>
                    <li>Don’t read <code>window</code>/<code>localStorage</code> during initial state on the server.</li>
                    <li>Define stores outside components so Fast Refresh doesn’t recreate them.</li>
                </ul>
                <pre className="good">{`// store is a module singleton, not inside a component
export const useApp = create((set) => ({ /* ... */ }));`}</pre>
                <pre className="note">{`// If you must read browser APIs, do it in useEffect and then set(...)
useEffect(() => {
  const theme = localStorage.getItem('theme') || 'dark';
  setTheme(theme);
}, []);`}</pre>
            </Styled.Section>

            {/* Testing */}
            <Styled.Section>
                <h3>Problem: Store state leaks between tests</h3>
                <p>Expose a reset function or helper to restore initial state per test.</p>
                <pre className="good">{`const initial = { count: 0, items: [] };
export const useStore = create((set) => ({ ...initial, reset: () => set(initial) }));
// test setup
afterEach(() => { useStore.getState().reset(); });`}</pre>
            </Styled.Section>

            {/* Quick checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Select the smallest slice; use <code>shallow</code> for tuples/objects.</li>
                    <li>Use functional <code>set</code> when next depends on previous.</li>
                    <li>Read current values with <code>get()</code> inside actions.</li>
                    <li>Name actions for devtools (<code>slice/action</code>).</li>
                    <li>Persist only what you need; version + migrate.</li>
                    <li>Unsubscribe in effects; abort/de-dupe async work.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default Troubleshooting;
