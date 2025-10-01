import React from "react";
// Reuse the shared styles from tutorials
import { Styled } from "../tutorials/styled";

const MiddlewaresOverview = () => {
    return (
        <Styled.Page>
            <Styled.Title>Middlewares Overview — persist / devtools / subscribeWithSelector / immer</Styled.Title>
            <Styled.Subtitle>
                What each middleware does, when I use it, and small examples I keep handy.
            </Styled.Subtitle>

            {/* What & when */}
            <Styled.Section>
                <h3>What problem each one solves</h3>
                <ul>
                    <li><b>persist</b> — save part of the store to storage (e.g., localStorage) and restore on load.</li>
                    <li><b>devtools</b> — inspect actions and time-travel via Redux DevTools.</li>
                    <li><b>subscribeWithSelector</b> — fine-grained <code>store.subscribe(selector)</code> outside React.</li>
                    <li><b>immer</b> — write “mutating” updates; Immer turns them into immutable updates for you.</li>
                </ul>
            </Styled.Section>

            {/* persist */}
            <Styled.Section>
                <h3>persist — quick start</h3>
                <pre className="good">{`import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useTheme = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggle: () =>
        set({ mode: get().mode === 'dark' ? 'light' : 'dark' }, false, 'theme/toggle'),
    }),
    {
      name: 'theme',                 // storage key
      version: 1,                    // bump on shape change
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ mode: s.mode }), // save only what I need
      migrate: (persisted, fromVersion) => {
        // transform old data if needed
        return persisted;
      },
      // Optional: lifecycle hook
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error('rehydration failed', error);
        // called after state is rehydrated
      },
    }
  )
);`}</pre>
                <Styled.Callout>
                    I persist only durable data (e.g., theme, auth tokens, cart), not ephemeral UI
                    flags (like spinners). Version + migrate keeps old users safe.
                </Styled.Callout>
                <ul>
                    <li><b>SSR/Next</b>: don’t touch <code>localStorage</code> on the server. Gate behind a check or run on client.</li>
                    <li><b>Partialize</b>: store the minimum slice; big blobs slow down JSON parse/stringify.</li>
                </ul>
            </Styled.Section>

            {/* devtools */}
            <Styled.Section>
                <h3>devtools — readable traces</h3>
                <pre className="good">{`import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCounter = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
      reset: () => set({ count: 0 }, false, 'counter/reset'),
    }),
    { name: 'CounterStore' }
  )
);`}</pre>
                <ul>
                    <li>I name actions like <code>slice/action</code> so DevTools is easy to scan.</li>
                    <li>Good for debugging in dev; fine to keep in prod too—overhead is small.</li>
                    <li>Install the Redux DevTools browser extension to see actions and state.</li>
                </ul>
            </Styled.Section>

            {/* subscribeWithSelector */}
            <Styled.Section>
                <h3>subscribeWithSelector — precise subscriptions outside React</h3>
                <pre className="good">{`import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useCart = create(
  subscribeWithSelector((set) => ({
    items: [],
    add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
  }))
);

// Outside React (services, effects, adapters)
const unsubscribe = useCart.subscribe(
  (s) => s.items.length,                          // selector
  (nextLen, prevLen) => {
    console.log('cart size', prevLen, '→', nextLen);
  },
  { equalityFn: Object.is, fireImmediately: true } // optional
);

// later
unsubscribe();`}</pre>
                <ul>
                    <li>Great for reacting to a tiny slice without wiring a component.</li>
                    <li>Be specific with the selector; broad selectors do extra work every change.</li>
                </ul>
            </Styled.Section>

            {/* immer */}
            <Styled.Section>
                <h3>immer — ergonomic nested updates</h3>
                <pre className="good">{`import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useTodos = create(
  immer((set) => ({
    todos: [],
    add: (title) =>
      set((s) => { s.todos.push({ id: Date.now(), title, done: false }); }, false, 'todos/add'),
    toggle: (id) =>
      set((s) => {
        const t = s.todos.find((x) => x.id === id);
        if (t) t.done = !t.done;
      }, false, 'todos/toggle'),
  }))
);`}</pre>
                <ul>
                    <li>I still keep selectors narrow (<code>shallow</code> for tuples/objects) — Immer doesn’t change that.</li>
                    <li>Immer lets me mutate a draft; it produces the next immutable state behind the scenes.</li>
                </ul>
            </Styled.Section>

            {/* Composition */}
            <Styled.Section>
                <h3>Composing middlewares</h3>
                <pre className="note">{`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useApp = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // ...state & actions
        }))
      ),
      { name: 'app', version: 1 }
    ),
    { name: 'AppStore' }
  )
);`}</pre>
                <p>
                    I usually put <code>devtools</code> outermost to capture named action logs after
                    other middlewares run. Order can vary, but this layout works well.
                </p>
            </Styled.Section>

            {/* Troubleshooting */}
            <Styled.Section>
                <h3>Troubleshooting</h3>
                <ul>
                    <li><b>“localStorage is not defined”</b> — you’re on the server. Use <code>createJSONStorage(() =&gt; localStorage)</code> only on the client.</li>
                    <li><b>Nothing rehydrates</b> — check the <code>name</code> key and make sure data is JSON-serializable.</li>
                    <li><b>Too many updates</b> — narrow selectors; for derived arrays/objects, pass <code>shallow</code>.</li>
                </ul>
            </Styled.Section>

            {/* Quick picker */}
            <Styled.Section>
                <h3>Cheat sheet</h3>
                <ul>
                    <li>Need durable data? → <b>persist</b> (+ version + partialize).</li>
                    <li>Debug flows? → <b>devtools</b> + named actions.</li>
                    <li>React to a tiny change outside React? → <b>subscribeWithSelector</b>.</li>
                    <li>Nested updates feel noisy? → <b>immer</b>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default MiddlewaresOverview;
