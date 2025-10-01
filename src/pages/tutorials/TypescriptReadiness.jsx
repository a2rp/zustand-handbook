import React from "react";
import { Styled } from "./styled";

/**
 * TypeScript Readiness — Typing the Store
 * Goal: get solid types without fighting the compiler.
 * All examples are note-style snippets you can paste and adapt.
 */
const TypescriptReadiness = () => {
    return (
        <Styled.Page>
            <Styled.Title>TypeScript Readiness — Typing the Store</Styled.Title>
            <Styled.Subtitle>
                How I type Zustand stores, selectors, and common middlewares.
            </Styled.Subtitle>

            {/* Goals */}
            <Styled.Section>
                <h3>What you’ll get</h3>
                <ul>
                    <li>A minimal typed store you can reuse.</li>
                    <li>Typed selectors (single, tuple, object).</li>
                    <li>Typed middlewares (<code>persist</code>, <code>devtools</code>).</li>
                    <li>Simple slice composition patterns.</li>
                </ul>
            </Styled.Section>

            {/* Minimal typed store */}
            <Styled.Section>
                <h3>Minimal typed store (starter)</h3>
                <pre className="good">{`// src/stores/counter.ts
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
  reset:     () => set({ count: 0 }),
}));`}</pre>
                <pre className="note">{`// In a component
const count = useCounter((s) => s.count);
const increment = useCounter((s) => s.increment);`}</pre>
            </Styled.Section>

            {/* Typed selectors */}
            <Styled.Section>
                <h3>Typed selectors (single, tuple, object)</h3>
                <pre className="good">{`// 1) Single primitive
const count = useCounter((s) => s.count);

// 2) Tuple of values (use \`as const\` to keep the tuple shape)
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter(
  (s) => [s.count, s.count > 10] as const,
  shallow
);

// 3) Object selector (use shallow to avoid extra renders)
const view = useCounter(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
);`}</pre>
                <pre className="bad">{`// Without \`as const\`, TypeScript widens the tuple → (number | boolean)[]
// and you lose positional types:
const pair = useCounter((s) => [s.count, s.count > 10]);`}</pre>
            </Styled.Section>

            {/* set/get tips */}
            <Styled.Section>
                <h3>set() &amp; get() with types</h3>
                <pre className="good">{`// set(object) if no dependency on previous state
set({ loading: true });

// set(fn) when next state depends on current state
set((s) => ({ count: s.count + 1 }));

// get() to read current typed state inside actions
toggle: () => {
  const next = get().mode === 'dark' ? 'light' : 'dark';
  set({ mode: next });
};`}</pre>
            </Styled.Section>

            {/* persist middleware */}
            <Styled.Section>
                <h3>Typing <code>persist</code> (simple, works out of the box)</h3>
                <pre className="good">{`// src/stores/theme.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeState = {
  mode: 'light' | 'dark';
  toggle: () => void;
};

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      toggle: () =>
        set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // optional: pick what to persist
      // partialize: (s) => ({ mode: s.mode }),
      // migrate: (persisted, version) => persisted,
    }
  )
);`}</pre>
            </Styled.Section>

            {/* devtools middleware basic */}
            <Styled.Section>
                <h3>Typing <code>devtools</code> (basic)</h3>
                <pre className="good">{`import { devtools } from 'zustand/middleware';

type CartState = {
  items: { id: string; title: string; qty: number }[];
  add: (it: { id: string; title: string }) => void;
};

export const useCart = create<CartState>()(
  devtools((set) => ({
    items: [],
    add: (it) =>
      set((s) => ({ items: [...s.items, { ...it, qty: 1 }] })),
  }), { name: 'cart' })
);`}</pre>
                <pre className="note">{`// Want named actions in devtools (3rd arg of set)?
// See the "advanced devtools + persist typing" section below.`}</pre>
            </Styled.Section>

            {/* advanced devtools + persist typing */}
            <Styled.Section>
                <h3>Advanced: action names with devtools + persist</h3>
                <p>
                    If you want <code>set(partial, replace?, 'slice/action')</code> for named
                    actions, help TypeScript understand the middleware chain.
                </p>
                <pre className="good">{`import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type UserState = {
  user: { id: string; name: string } | null;
  login: (u: { id: string; name: string }) => void;
  logout: () => void;
};

// Tell TS which middlewares are applied (order matters)
type WithDevtoolsPersist = [['zustand/devtools', never], ['zustand/persist', unknown]];

// Strongly-typed state creator so "set(..., 'action/name')" is allowed
const creator: StateCreator<UserState, WithDevtoolsPersist> = (set, get) => ({
  user: null,
  login: (u) => set({ user: u }, false, 'auth/login'),
  logout: () => set({ user: null }, false, 'auth/logout'),
});

export const useUser = create<UserState>()(
  devtools(
    persist(creator, { name: 'user' }),
    { name: 'user' }
  )
);`}</pre>
            </Styled.Section>

            {/* slice composition */}
            <Styled.Section>
                <h3>Composing slices (simple typing)</h3>
                <pre className="good">{`import { create } from 'zustand';
import type { StateCreator } from 'zustand';

type AuthSlice = {
  user: string | null;
  login: (u: string) => void;
  logout: () => void;
};
type UiSlice = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

type StoreState = AuthSlice & UiSlice;

// slice creators
const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set) => ({
  user: null,
  login: (u) => set({ user: u }),
  logout: () => set({ user: null }),
});

const createUiSlice: StateCreator<StoreState, [], [], UiSlice> = (set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
});

export const useApp = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUiSlice(...a),
}));`}</pre>
            </Styled.Section>

            {/* selector helpers in TS */}
            <Styled.Section>
                <h3>Selector helpers (typed)</h3>
                <pre className="good">{`// file: selectors.ts
import type { StoreState } from './wherever'; // or import the specific state (e.g., CounterState)
export const selectUser = (s: StoreState) => s.user;
export const selectMode = (s: { mode: 'light' | 'dark' }) => s.mode;

// usage
const user = useApp(selectUser);
const mode = useTheme(selectMode);`}</pre>
            </Styled.Section>

            {/* common TS pitfalls */}
            <Styled.Section>
                <h3>Common TS pitfalls</h3>
                <ul>
                    <li>
                        Tuple selectors without <code>as const</code> → widened array type.
                    </li>
                    <li>
                        Forgetting middleware generics → devtools action name arg looks “invalid”.
                    </li>
                    <li>
                        Returning fresh objects from selectors without <code>shallow</code> → extra renders.
                    </li>
                    <li>
                        Using <code>any</code> in state → you lose completion and safety.
                    </li>
                </ul>
            </Styled.Section>

            {/* checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Define a clear <code>State</code> type per store.</li>
                    <li>Prefer primitive selectors; tuples use <code>as const</code>.</li>
                    <li>Add <code>shallow</code> for object/tuple selectors.</li>
                    <li>For <code>persist</code>/<code>devtools</code>, start simple; add advanced types only if needed.</li>
                    <li>Compose larger stores from typed slices.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default TypescriptReadiness;
