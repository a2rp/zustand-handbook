import React from "react";
import { Styled } from "./styled";

const ExampleTypescriptBasic = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — TypeScript Basics</Styled.Title>
            <Styled.Subtitle>
                How I type Zustand stores, actions, and selectors (copy-paste notes, not live).
            </Styled.Subtitle>

            {/* Goals */}
            <Styled.Section>
                <h3>What this covers</h3>
                <ul>
                    <li>Typing a store with <code>create&lt;State&gt;()</code>.</li>
                    <li>Selectors with proper types (single, tuple, object + <code>shallow</code>).</li>
                    <li>Typing with middlewares (<code>persist</code>, <code>devtools</code>).</li>
                    <li>Slice pattern and store factories in TS.</li>
                </ul>
            </Styled.Section>

            {/* Minimal typed store */}
            <Styled.Section>
                <h3>1) Minimal typed store</h3>
                <pre className="good">{`// counter.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  incBy: (n: number) => void;
  reset: () => void;
}

export const useCounter = create<CounterState>()((set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  incBy: (n) => set({ count: get().count + n }, false, 'counter/incBy'),
  reset: () => set({ count: 0 }, false, 'counter/reset'),
}));`}</pre>
                <p>
                    Type inference flows from <code>CounterState</code>. Actions and selectors pick up types automatically.
                </p>
            </Styled.Section>

            {/* Typed selectors */}
            <Styled.Section>
                <h3>2) Typed selectors</h3>
                <pre className="good">{`// CounterCard.tsx
import { useCounter } from '../stores/counter';
import { shallow } from 'zustand/shallow';

export function CounterCard() {
  const count = useCounter((s) => s.count);           // number
  const increment = useCounter((s) => s.increment);   // () => void

  // Tuple selector with proper tuple types
  const selectTuple = (s: ReturnType<typeof useCounter.getState>) =>
    [s.count, s.count >= 10] as const;
  const [value, disabled] = useCounter(selectTuple, shallow); // value: number, disabled: boolean

  // Object selector + shallow
  const view = useCounter(
    (s) => ({ value: s.count, disabled: s.count >= 10 } as const),
    shallow
  ); // { readonly value: number; readonly disabled: boolean }

  return null;
}`}</pre>
                <Styled.Callout>
                    For tuples/objects, add <code>as const</code> or annotate the selector so TypeScript keeps a stable tuple/object type.
                </Styled.Callout>
            </Styled.Section>

            {/* Middlewares typing */}
            <Styled.Section>
                <h3>3) With middlewares (persist + devtools)</h3>
                <pre className="good">{`// user.ts
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  token: string | null;
  name: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}

export const useUser = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        name: null,
        login: (token, name) => set({ token, name }, false, 'user/login'),
        logout: () => set({ token: null, name: null }, false, 'user/logout'),
      }),
      {
        name: 'user-store',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        // persist only what's needed
        partialize: (s) => ({ token: s.token, name: s.name }),
      }
    ),
    { name: 'user' } // devtools name
  )
);`}</pre>
                <p>
                    Using <code>create&lt;UserState&gt;()</code> keeps full type safety through the middleware chain.
                </p>
            </Styled.Section>

            {/* Slice pattern typing */}
            <Styled.Section>
                <h3>4) Slice pattern (typed)</h3>
                <pre className="note">{`// app.ts
import { create, StateCreator } from 'zustand';

type AuthSlice = {
  auth: { user: string | null };
  login: (user: string) => void;
  logout: () => void;
};
type UiSlice = {
  ui: { sidebarOpen: boolean };
  toggleSidebar: () => void;
};
type AppState = AuthSlice & UiSlice;

const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  auth: { user: null },
  login: (user) => set({ auth: { user } }, false, 'auth/login'),
  logout: () => set({ auth: { user: null } }, false, 'auth/logout'),
});

const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set, get) => ({
  ui: { sidebarOpen: true },
  toggleSidebar: () =>
    set(
      (s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }),
      false,
      'ui/toggleSidebar'
    ),
});

export const useApp = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUiSlice(...a),
}));`}</pre>
                <p>
                    Each slice is a typed <code>StateCreator</code>. The final store union (<code>AppState</code>) is fully typed.
                </p>
            </Styled.Section>

            {/* Store factory typing */}
            <Styled.Section>
                <h3>5) Store factory (per-component) typing</h3>
                <pre className="good">{`// wizardStore.ts
import { create } from 'zustand';

export interface WizardState {
  step: number;
  next: () => void;
  reset: () => void;
}

export function createWizardStore(initialStep = 1) {
  return create<WizardState>()((set) => ({
    step: initialStep,
    next: () => set((s) => ({ step: s.step + 1 }), false, 'wizard/next'),
    reset: () => set({ step: initialStep }, false, 'wizard/reset'),
  }));
}

// Wizard.tsx
const useWizard = React.useMemo(() => createWizardStore(1), []);
const step = useWizard((s) => s.step); // number`}</pre>
            </Styled.Section>

            {/* Testing type hints */}
            <Styled.Section>
                <h3>6) Testing helpers (types)</h3>
                <pre className="note">{`// Access store type from a useStore
import type { StoreApi, UseBoundStore } from 'zustand';

type CounterStore = UseBoundStore<StoreApi<CounterState>>;

const store: CounterStore = useCounter; // typed handle for tests
store.getState().increment();
expect(store.getState().count).toBe(1);`}</pre>
            </Styled.Section>

            {/* Cheatsheet */}
            <Styled.Section>
                <h3>Cheatsheet</h3>
                <ul>
                    <li><code>create&lt;State&gt;()</code> drives all types (state + actions).</li>
                    <li>For tuples/objects in selectors, add <code>as const</code> and pass <code>shallow</code>.</li>
                    <li>Middlewares infer types correctly when you start with <code>create&lt;T&gt;()</code>.</li>
                    <li>For slices, type each <code>StateCreator</code> and union them.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleTypescriptBasic;
