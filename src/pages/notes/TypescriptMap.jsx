import React from "react";
import { Styled } from "./styled";

const TypescriptMap = () => {
    return (
        <Styled.Page>
            <Styled.Title>TypeScript Map — Typing Store & Selectors</Styled.Title>
            <Styled.Subtitle>
                A practical cheat sheet to type Zustand stores, actions, selectors, and middleware.
            </Styled.Subtitle>

            {/* Install */}
            <Styled.Section>
                <h3>Install</h3>
                <pre className="good">{`npm i zustand
# already typed; no extra @types package needed`}</pre>
            </Styled.Section>

            {/* Core pattern */}
            <Styled.Section>
                <h3>Core pattern I use</h3>
                <p>Define a state shape, then pass it to <code>create&lt;T&gt;()</code>. Keep actions typed and named.</p>
                <pre className="good">{`// store/counter.ts
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
  add: (n: number) => void;
  reset: () => void;
};

export const useCounter = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  add: (n) => set((s) => ({ count: s.count + n }), false, 'counter/add'),
  reset: () => set({ count: 0 }, false, 'counter/reset'),
}));`}</pre>
                <pre className="note">{`// In a component
const count = useCounter((s) => s.count);         // number
const add = useCounter((s) => s.add);             // (n: number) => void`}</pre>
            </Styled.Section>

            {/* Selecting safely */}
            <Styled.Section>
                <h3>Typing selectors safely</h3>
                <ul>
                    <li>Selecting a primitive just infers the type.</li>
                    <li>For multiple values, return a tuple/object and use <code>shallow</code>.</li>
                </ul>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

// tuple + shallow
const [count, disabled] = useCounter(
  (s) => [s.count, s.count > 10],
  shallow
); // [number, boolean]

// object + shallow
const view = useCounter(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
); // { count: number; disabled: boolean }`}</pre>
            </Styled.Section>

            {/* Using get() & set() with types */}
            <Styled.Section>
                <h3>Using <code>set</code> &amp; <code>get</code> with types</h3>
                <p>When an action needs current state, read it via <code>get()</code>. Both forms are typed.</p>
                <pre className="good">{`type Theme = 'light' | 'dark';

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useApp = create<AppState>()((set, get) => ({
  theme: 'dark',
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next }, false, 'theme/toggle');
  },
}));`}</pre>
            </Styled.Section>

            {/* Async actions */}
            <Styled.Section>
                <h3>Async actions (thunks)</h3>
                <p>Return <code>Promise&lt;void&gt;</code> for clarity.</p>
                <pre className="good">{`type User = { id: string; name: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,
  async login(email, password) {
    set({ loading: true, error: null }, false, 'auth/loginStart');
    try {
      const user = await apiLogin(email, password);   // pretend API
      set({ user, loading: false }, false, 'auth/loginSuccess');
    } catch (e) {
      set({ error: String(e), loading: false }, false, 'auth/loginError');
    }
  },
  logout: () => set({ user: null }, false, 'auth/logout'),
}));`}</pre>
            </Styled.Section>

            {/* persist middleware */}
            <Styled.Section>
                <h3>Typing <code>persist</code> middleware</h3>
                <p>Give your store type to <code>create&lt;T&gt;()</code>, then wrap with <code>persist</code>.</p>
                <pre className="good">{`import { persist, createJSONStorage } from 'zustand/middleware';

type CartItem = { id: string; qty: number; price: number };
type CartState = {
  items: CartItem[];
  add: (it: CartItem) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (it) =>
        set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
      clear: () => set({ items: [] }, false, 'cart/clear'),
    }),
    {
      name: 'cart',
      version: 1,
      partialize: (s) => ({ items: s.items }), // <== typed from CartState
      storage: createJSONStorage(() => localStorage),
    }
  )
);`}</pre>
            </Styled.Section>

            {/* devtools middleware */}
            <Styled.Section>
                <h3>Typing <code>devtools</code> middleware</h3>
                <pre className="good">{`import { devtools } from 'zustand/middleware';

type BearState = { bears: number; increase: (by: number) => void };

export const useBears = create<BearState>()(
  devtools((set) => ({
    bears: 0,
    increase: (by) =>
      set((s) => ({ bears: s.bears + by }), false, 'bears/increase'),
  }))
);`}</pre>
            </Styled.Section>

            {/* subscribeWithSelector */}
            <Styled.Section>
                <h3><code>subscribeWithSelector</code> (precise subscriptions)</h3>
                <pre className="good">{`import { subscribeWithSelector } from 'zustand/middleware';

type State = { count: number; inc: () => void };

export const useCounterSub = create<State>()(
  subscribeWithSelector((set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
  }))
);

// outside React (or in effects)
const unsubscribe = useCounterSub.subscribe(
  (s) => s.count,                 // selector: number
  (count, prev) => {
    console.log('count changed', { count, prev });
  },
  { equalityFn: Object.is }       // optional
);`}</pre>
            </Styled.Section>

            {/* Deriving types from store */}
            <Styled.Section>
                <h3>Deriving types from a store</h3>
                <pre className="note">{`// State type from a bound store
type Counter = ReturnType<typeof useCounter.getState>; // { count: number; ... }

// Action type example
type Inc = ReturnType<typeof useCounter.getState>['increment']; // () => void`}</pre>
            </Styled.Section>

            {/* Slices (lightweight) */}
            <Styled.Section>
                <h3>Typed slices (lightweight approach)</h3>
                <pre className="good">{`import { create } from 'zustand';

type AuthSlice = {
  auth: { user: null | { id: string } };
  login: (id: string) => void;
  logout: () => void;
};

type UiSlice = {
  ui: { theme: 'light' | 'dark' };
  toggleTheme: () => void;
};

type AppState = AuthSlice & UiSlice;

export const useApp = create<AppState>()((set) => ({
  // auth slice
  auth: { user: null },
  login: (id) => set({ auth: { user: { id } } }, false, 'auth/login'),
  logout: () => set({ auth: { user: null } }, false, 'auth/logout'),

  // ui slice
  ui: { theme: 'dark' },
  toggleTheme: () =>
    set((s) => ({ ui: { theme: s.ui.theme === 'dark' ? 'light' : 'dark' } }), false, 'ui/toggle'),
}));`}</pre>
            </Styled.Section>

            {/* Testing tip */}
            <Styled.Section>
                <h3>Headless store for tests</h3>
                <pre className="note">{`import { createStore } from 'zustand/vanilla';

const store = createStore<CounterState>()((set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }));
store.getState().increment();
expect(store.getState().count).toBe(1);`}</pre>
            </Styled.Section>

            {/* Quick checklist */}
            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Always type the store: <code>create&lt;YourState&gt;()</code>.</li>
                    <li>Name actions: <code>slice/action</code> helps with devtools.</li>
                    <li>Selectors infer types; add <code>shallow</code> for tuples/objects.</li>
                    <li>Persist: type comes from your store; use <code>partialize</code> for durability.</li>
                    <li>Async actions return <code>Promise&lt;void&gt;</code> (or a typed payload).</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default TypescriptMap;
