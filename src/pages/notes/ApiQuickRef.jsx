import React from "react";
// Reuse the same look as tutorials:
import { Styled } from "../tutorials/styled";

const ApiQuickRef = () => {
    return (
        <Styled.Page>
            <Styled.Title>Zustand — API Quick Reference</Styled.Title>
            <Styled.Subtitle>
                The daily-use surface: create, set, get, subscribe, selectors, and key middlewares.
            </Styled.Subtitle>

            {/* Core API */}
            <Styled.Section>
                <h3>Core API at a glance</h3>
                <ul>
                    <li><b>create(fn)</b> — builds a store hook.</li>
                    <li><b>set</b> — update state (object or functional form).</li>
                    <li><b>get</b> — read current state inside actions.</li>
                    <li><b>subscribe</b> — listen to changes (optionally to a selector).</li>
                    <li><b>Selectors</b> — subscribe to just what a component needs.</li>
                </ul>
                <pre className="good">{`import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  reset: () => set({ count: 0 }, false, 'counter/reset'),
}));`}</pre>
            </Styled.Section>

            {/* Selecting state */}
            <Styled.Section>
                <h3>Selecting state</h3>
                <ul>
                    <li>Select <b>primitives</b> when possible (number, string, boolean).</li>
                    <li>For multiple values, return a tuple/object + <code>shallow</code>.</li>
                    <li>Don’t select the whole store unless you really need everything.</li>
                </ul>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

// 1) Single value
const count = useCounter((s) => s.count);

// 2) Multiple (tuple) + shallow
const [count, canReset] = useCounter((s) => [s.count, s.count > 0], shallow);

// 3) Object + shallow (more readable with many fields)
const view = useCounter((s) => ({ c: s.count, canReset: s.count > 0 }), shallow);`}</pre>
                <pre className="bad">{`// ❌ Fresh object every time → extra renders
const view = useCounter((s) => ({ c: s.count }));`}</pre>
            </Styled.Section>

            {/* set & get */}
            <Styled.Section>
                <h3>set() &amp; get()</h3>
                <ul>
                    <li><code>set({`... `})</code> when the next state does <b>not</b> depend on previous.</li>
                    <li><code>set((s) =&gt; ...)</code> when it <b>does</b> depend on previous.</li>
                    <li>Use <code>get()</code> inside actions to read the latest value (avoid stale closures).</li>
                </ul>
                <pre className="good">{`// Object form
set({ open: true, error: null }, false, 'dialog/open');

// Functional form
set((s) => ({ page: s.page + 1 }), false, 'pager/next');

// Read + write
toggleTheme: () => {
  const mode = get().theme === 'dark' ? 'light' : 'dark';
  set({ theme: mode }, false, 'theme/toggle');
}`}</pre>
            </Styled.Section>

            {/* subscribe */}
            <Styled.Section>
                <h3>subscribe()</h3>
                <p>Use in non-React code or for side effects (logs, storage, analytics).</p>
                <pre className="note">{`// Basic subscription (entire state)
const unsub = useCounter.subscribe((state) => {
  console.log('count is', state.count);
});

// With selector
const unsubSel = useCounter.subscribe((s) => s.count, (count) => {
  console.log('count changed to', count);
});

// Later
unsub();
unsubSel();`}</pre>
            </Styled.Section>

            {/* Async thunks */}
            <Styled.Section>
                <h3>Async actions (thunks)</h3>
                <ul>
                    <li>Use the <b>start → success/error</b> pattern.</li>
                    <li>Keep <code>loading</code> and <code>error</code> shapes consistent.</li>
                </ul>
                <pre className="good">{`fetchUsers: async () => {
  set({ loading: true, error: null }, false, 'users/fetchStart');
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    set({ loading: false, users: data }, false, 'users/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/fetchError');
  }
}`}</pre>
            </Styled.Section>

            {/* Middlewares */}
            <Styled.Section>
                <h3>Middlewares (quick tour)</h3>
                <ul>
                    <li><b>persist</b> — save part of the state to storage with versioning.</li>
                    <li><b>devtools</b> — action names, time-travel (works best with named actions).</li>
                    <li><b>subscribeWithSelector</b> — subscribe precisely outside components.</li>
                    <li><b>immer</b> — optional ergonomic nested updates.</li>
                </ul>
                <pre className="good">{`import { create } from 'zustand';
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
);`}</pre>
            </Styled.Section>

            {/* Patterns */}
            <Styled.Section>
                <h3>Common patterns</h3>
                <ul>
                    <li><b>Named actions:</b> <code>'slice/action'</code> in the 3rd <code>set</code> arg for better devtools traces.</li>
                    <li><b>Slice by feature:</b> auth, ui, cart, etc. Keep actions near their data.</li>
                    <li><b>Reset:</b> keep an <code>initialState</code> and set it back on logout/teardown.</li>
                    <li><b>Optimistic updates:</b> snapshot previous value; rollback on error.</li>
                    <li><b>Avoid identity churn:</b> use <code>shallow</code> when returning arrays/objects from selectors.</li>
                </ul>
                <pre className="note">{`const initial = { count: 0, items: [] };
resetAll: () => set(initial, false, 'app/reset');`}</pre>
            </Styled.Section>

            {/* Don’ts */}
            <Styled.Section>
                <h3>Don’ts (quick)</h3>
                <ul>
                    <li>Don’t select the entire store in components if you can avoid it.</li>
                    <li>Don’t persist everything — partialize and version.</li>
                    <li>Don’t compute heavy values inside selectors; memoize in components or centralize.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ApiQuickRef;
