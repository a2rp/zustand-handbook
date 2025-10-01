import{d as s,j as e}from"./index-Bmr0gcqO.js";const n="var(--card, #111)",o="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",r="var(--border, #222)",i="var(--accent, #22c55e)",c="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${n};
        color: ${o};
        border: 1px solid ${r};
        border-radius: ${l};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${a};
    `,Section:s.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${r};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        pre.good,
        pre.bad,
        pre.note {
            white-space: pre-wrap;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
            border-radius: 10px;
            padding: 12px 14px;
            margin: 8px 0 12px 0;
            border: 1px dashed ${r};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${i};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${c};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        color: ${o};
    `},u=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — TypeScript Basics"}),e.jsx(t.Subtitle,{children:"How I type Zustand stores, actions, and selectors (copy-paste notes, not live)."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What this covers"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Typing a store with ",e.jsx("code",{children:"create<State>()"}),"."]}),e.jsxs("li",{children:["Selectors with proper types (single, tuple, object + ",e.jsx("code",{children:"shallow"}),")."]}),e.jsxs("li",{children:["Typing with middlewares (",e.jsx("code",{children:"persist"}),", ",e.jsx("code",{children:"devtools"}),")."]}),e.jsx("li",{children:"Slice pattern and store factories in TS."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Minimal typed store"}),e.jsx("pre",{className:"good",children:`// counter.ts
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
}));`}),e.jsxs("p",{children:["Type inference flows from ",e.jsx("code",{children:"CounterState"}),". Actions and selectors pick up types automatically."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Typed selectors"}),e.jsx("pre",{className:"good",children:`// CounterCard.tsx
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
}`}),e.jsxs(t.Callout,{children:["For tuples/objects, add ",e.jsx("code",{children:"as const"})," or annotate the selector so TypeScript keeps a stable tuple/object type."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) With middlewares (persist + devtools)"}),e.jsx("pre",{className:"good",children:`// user.ts
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
);`}),e.jsxs("p",{children:["Using ",e.jsx("code",{children:"create<UserState>()"})," keeps full type safety through the middleware chain."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Slice pattern (typed)"}),e.jsx("pre",{className:"note",children:`// app.ts
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
}));`}),e.jsxs("p",{children:["Each slice is a typed ",e.jsx("code",{children:"StateCreator"}),". The final store union (",e.jsx("code",{children:"AppState"}),") is fully typed."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) Store factory (per-component) typing"}),e.jsx("pre",{className:"good",children:`// wizardStore.ts
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
const step = useWizard((s) => s.step); // number`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"6) Testing helpers (types)"}),e.jsx("pre",{className:"note",children:`// Access store type from a useStore
import type { StoreApi, UseBoundStore } from 'zustand';

type CounterStore = UseBoundStore<StoreApi<CounterState>>;

const store: CounterStore = useCounter; // typed handle for tests
store.getState().increment();
expect(store.getState().count).toBe(1);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Cheatsheet"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"create<State>()"})," drives all types (state + actions)."]}),e.jsxs("li",{children:["For tuples/objects in selectors, add ",e.jsx("code",{children:"as const"})," and pass ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Middlewares infer types correctly when you start with ",e.jsx("code",{children:"create<T>()"}),"."]}),e.jsxs("li",{children:["For slices, type each ",e.jsx("code",{children:"StateCreator"})," and union them."]})]})]})]});export{u as default};
