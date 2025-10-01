import React from "react";
import { Styled } from "./styled";

const MiddlewareDevtools = () => {
    return (
        <Styled.Page>
            <Styled.Title>Middleware: devtools — time-travel & trace</Styled.Title>
            <Styled.Subtitle>
                How I wire Zustand to Redux DevTools for action logs, time-travel, and stack traces.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What I use it for</h3>
                <ul>
                    <li>See each action in a timeline (who changed what).</li>
                    <li>Jump back in time to a previous state.</li>
                    <li>Inspect state diffs when debugging.</li>
                    <li>Optional stack traces for tricky flows.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick setup (once)</h3>
                <ul>
                    <li>Install the <b>Redux DevTools</b> browser extension.</li>
                    <li>Wrap the store with the <code>devtools</code> middleware.</li>
                </ul>
                <pre className="good">{`// stores/counter.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCounter = create(
  devtools(
    (set, get) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
      reset: () => set({ count: 0 }, false, 'counter/reset'),
    }),
    { name: 'counter', /* optional */ trace: false }
  )
);`}</pre>
                <Styled.Callout>
                    I give each store a unique <code>name</code> so it’s easy to find in the DevTools list.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Enable only in development</h3>
                <p>Devtools add tiny overhead. I keep them off in production.</p>
                <pre className="good">{`export const useApp = create(
  devtools(
    (set, get) => ({ /* state & actions */ }),
    { name: 'app', enabled: import.meta.env.DEV, trace: import.meta.env.DEV }
  )
);`}</pre>
                <pre className="note">{`// Alternative: wrap conditionally
const withDevtools = (fn) =>
  import.meta.env.DEV ? devtools(fn, { name: 'app' }) : fn;

export const useApp = create(withDevtools((set, get) => ({ /* ... */ })));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Action names that read well</h3>
                <p>I always name actions like <code>slice/action</code> using the 3rd argument to <code>set</code>.</p>
                <pre className="good">{`addToCart: (item) =>
  set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),

applyCoupon: (code) =>
  set((s) => ({ cart: { ...s.cart, coupon: code } }), false, 'cart/applyCoupon'),`}</pre>
                <pre className="bad">{`// shows up as "anonymous" in DevTools
addToCart: (item) => set((s) => ({ cart: { items: [...s.cart.items, item] } })),`}</pre>
                <pre className="note">{`// Tiny helper I sometimes use:
const setWith = (type, recipe) => set(recipe, false, type);
// usage:
increment: () => setWith('counter/increment', (s) => ({ count: s.count + 1 })),`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Time-travel: what actually happens</h3>
                <ul>
                    <li>DevTools can jump to any previous action; Zustand swaps the store state.</li>
                    <li>External side-effects (network requests, timers) are not rewound.</li>
                    <li>If you use persistence, jumping around won’t write to storage unless your actions do.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Tracing (optional)</h3>
                <p>
                    When I’m lost, I turn on <code>trace: true</code> so DevTools shows a stack trace
                    for each action entry. It’s heavier, so I keep it dev-only.
                </p>
                <pre className="good">{`export const useApp = create(
  devtools((set, get) => ({ /* ... */ }), { name: 'app', enabled: import.meta.env.DEV, trace: true })
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Multiple stores</h3>
                <ul>
                    <li>Give each store a unique <code>name</code>.</li>
                    <li>Stick to consistent action naming across stores.</li>
                    <li>Too much noise? Disable devtools for tiny per-component stores.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Pitfalls I avoid</h3>
                <ul>
                    <li>Forgetting to wrap with <code>devtools</code> and wondering why nothing shows.</li>
                    <li>Not naming actions → hard-to-read “anonymous” timeline.</li>
                    <li>Logging huge objects every keystroke (e.g., form state) — I debounce or skip devtools for that slice.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Copy-paste mini example</h3>
                <pre className="good">{`// stores/app.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useApp = create(
  devtools(
    (set, get) => ({
      user: null,
      theme: 'dark',
      login: (u) => set({ user: u }, false, 'auth/login'),
      logout: () => set({ user: null }, false, 'auth/logout'),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' }), false, 'ui/toggleTheme'),
    }),
    { name: 'app', enabled: import.meta.env.DEV }
  )
);`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default MiddlewareDevtools;
