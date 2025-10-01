import React from "react";
import { Styled } from "./styled";

const CheatsheetPrint = () => {
    const handlePrint = () => window.print();

    return (
        <Styled.Page id="print-area">
            {/* Print-only CSS: hide everything except this page; force paper-friendly colors */}
            <style>{`
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
      `}</style>

            <Styled.Title>Zustand Cheatsheet — Print</Styled.Title>
            <Styled.Subtitle>Quick reference for daily work. Copy/paste snippets as needed.</Styled.Subtitle>

            {/* Print action (hidden on paper) */}
            <div id="print-action" style={{ margin: "8px 0 16px 0" }}>
                <button onClick={handlePrint} aria-label="Print this cheatsheet">
                    🖨️ Print
                </button>
            </div>

            {/* Setup */}
            <Styled.Section>
                <h3>Install & minimal store</h3>
                <pre className="good">{`npm i zustand

// src/stores/counter.js
import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) }), false, 'counter/decrement'),
  reset:     () => set({ count: 0 }, false, 'counter/reset'),
}));`}</pre>
            </Styled.Section>

            {/* Core API */}
            <Styled.Section>
                <h3>Core API</h3>
                <ul>
                    <li><code>create(fn)</code> → make a store.</li>
                    <li><code>set(obj)</code> / <code>set((s) =&gt; next)</code> → update.</li>
                    <li><code>get()</code> → read current state inside actions.</li>
                    <li><code>subscribe</code> / <code>subscribeWithSelector</code> → listen to changes (lib/advanced).</li>
                </ul>
            </Styled.Section>

            {/* Using in a component */}
            <Styled.Section>
                <h3>Use in a component</h3>
                <pre className="good">{`import { useCounter } from '../stores/counter';

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
}`}</pre>
            </Styled.Section>

            {/* Selectors */}
            <Styled.Section>
                <h3>Selectors & equality</h3>
                <ul>
                    <li>Select <b>only</b> what you need (avoid whole-store selects).</li>
                    <li>For multiple values, return tuple/object + <code>shallow</code>.</li>
                </ul>
                <pre className="note">{`import { shallow } from 'zustand/shallow';
const count = useCounter((s) => s.count);
const [count, disabled] = useCounter((s) => [s.count, s.count > 10], shallow);
const view = useCounter((s) => ({ c: s.count, disabled: s.count > 10 }), shallow);`}</pre>
                <pre className="bad">{`// ❌ New object every render → re-renders
const v = useCounter((s) => ({ c: s.count }));`}</pre>
            </Styled.Section>

            {/* set/get patterns */}
            <Styled.Section>
                <h3>set() & get() patterns</h3>
                <pre className="good">{`// Object form: no need for previous state
set({ open: true, error: null }, false, 'ui/open');

// Functional form: depends on previous state
set((s) => ({ count: s.count + 1 }), false, 'counter/increment');

// Use get() when action needs current values
toggleTheme: () => {
  const dark = get().theme?.mode === 'dark';
  set({ theme: { mode: dark ? 'light' : 'dark' } }, false, 'theme/toggle');
}`}</pre>
            </Styled.Section>

            {/* Async */}
            <Styled.Section>
                <h3>Async flow (start / success / error)</h3>
                <pre className="good">{`fetchUsers: async () => {
  set({ loading: true, error: null }, false, 'users/fetchStart');
  try {
    const r = await fetch('/api/users'); if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    set({ loading: false, users: data }, false, 'users/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/fetchError');
  }
}`}</pre>
                <pre className="note">{`// Abort stale
const prev = get().controller; prev?.abort?.();
const c = new AbortController();
set({ controller: c }, false, 'users/attachController');
await fetch('/api/users', { signal: c.signal });`}</pre>
            </Styled.Section>

            {/* Persist */}
            <Styled.Section>
                <h3>persist (quick start)</h3>
                <pre className="good">{`import { create } from 'zustand';
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
);`}</pre>
            </Styled.Section>

            {/* Devtools */}
            <Styled.Section>
                <h3>devtools (action names)</h3>
                <pre className="note">{`increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment')`}</pre>
                <ul>
                    <li>Use <code>slice/action</code> style names for readable traces.</li>
                </ul>
            </Styled.Section>

            {/* Local vs global */}
            <Styled.Section>
                <h3>Global vs local quick picks</h3>
                <ul>
                    <li>Auth/theme/cart/permissions → <b>global slice</b>.</li>
                    <li>Wizard/modal/table filters → <b>per-component store</b> (auto reset on unmount).</li>
                </ul>
            </Styled.Section>

            {/* Performance */}
            <Styled.Section>
                <h3>Performance notes</h3>
                <ul>
                    <li>Avoid selecting the whole store.</li>
                    <li>Prefer primitives; for objects/arrays use <code>shallow</code>.</li>
                    <li>Memoize heavy derived values in components.</li>
                    <li>Batch related changes in a single <code>set()</code>.</li>
                </ul>
            </Styled.Section>

            {/* Testing */}
            <Styled.Section>
                <h3>Testing quick notes</h3>
                <ul>
                    <li>Test actions as simple functions (no React needed).</li>
                    <li>For local stores, use a factory and mount per test.</li>
                    <li>Mock fetch/API at the edge; assert store state.</li>
                </ul>
            </Styled.Section>

            {/* Handy snippets */}
            <Styled.Section>
                <h3>Handy snippets</h3>
                <pre className="good">{`// Reset whole store
const initial = { count: 0, items: [] };
resetAll: () => set(initial, false, 'app/reset');`}</pre>
                <pre className="good">{`// Select multiple with shallow
import { shallow } from 'zustand/shallow';
const [user, mode] = useApp((s) => [s.auth.user, s.theme.mode], shallow);`}</pre>
                <pre className="good">{`// Optimistic update with rollback
const prev = get().items;
set({ items: optimistic }, false, 'items/optimistic');
try { await api.update(); } catch (e) { set({ items: prev }, false, 'items/rollback'); }`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default CheatsheetPrint;
