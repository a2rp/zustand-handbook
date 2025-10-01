import{j as e}from"./index-D0NhHHfM.js";import{S as t}from"./styled-9asSRIYq.js";const r=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"TypeScript Readiness — Typing the Store"}),e.jsx(t.Subtitle,{children:"How I type Zustand stores, selectors, and common middlewares."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What you’ll get"}),e.jsxs("ul",{children:[e.jsx("li",{children:"A minimal typed store you can reuse."}),e.jsx("li",{children:"Typed selectors (single, tuple, object)."}),e.jsxs("li",{children:["Typed middlewares (",e.jsx("code",{children:"persist"}),", ",e.jsx("code",{children:"devtools"}),")."]}),e.jsx("li",{children:"Simple slice composition patterns."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Minimal typed store (starter)"}),e.jsx("pre",{className:"good",children:`// src/stores/counter.ts
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
}));`}),e.jsx("pre",{className:"note",children:`// In a component
const count = useCounter((s) => s.count);
const increment = useCounter((s) => s.increment);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Typed selectors (single, tuple, object)"}),e.jsx("pre",{className:"good",children:`// 1) Single primitive
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
);`}),e.jsx("pre",{className:"bad",children:"// Without `as const`, TypeScript widens the tuple → (number | boolean)[]\n// and you lose positional types:\nconst pair = useCounter((s) => [s.count, s.count > 10]);"})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"set() & get() with types"}),e.jsx("pre",{className:"good",children:`// set(object) if no dependency on previous state
set({ loading: true });

// set(fn) when next state depends on current state
set((s) => ({ count: s.count + 1 }));

// get() to read current typed state inside actions
toggle: () => {
  const next = get().mode === 'dark' ? 'light' : 'dark';
  set({ mode: next });
};`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["Typing ",e.jsx("code",{children:"persist"})," (simple, works out of the box)"]}),e.jsx("pre",{className:"good",children:`// src/stores/theme.ts
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
);`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["Typing ",e.jsx("code",{children:"devtools"})," (basic)"]}),e.jsx("pre",{className:"good",children:`import { devtools } from 'zustand/middleware';

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
);`}),e.jsx("pre",{className:"note",children:`// Want named actions in devtools (3rd arg of set)?
// See the "advanced devtools + persist typing" section below.`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Advanced: action names with devtools + persist"}),e.jsxs("p",{children:["If you want ",e.jsx("code",{children:"set(partial, replace?, 'slice/action')"})," for named actions, help TypeScript understand the middleware chain."]}),e.jsx("pre",{className:"good",children:`import { create, StateCreator } from 'zustand';
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
);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Composing slices (simple typing)"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
}));`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Selector helpers (typed)"}),e.jsx("pre",{className:"good",children:`// file: selectors.ts
import type { StoreState } from './wherever'; // or import the specific state (e.g., CounterState)
export const selectUser = (s: StoreState) => s.user;
export const selectMode = (s: { mode: 'light' | 'dark' }) => s.mode;

// usage
const user = useApp(selectUser);
const mode = useTheme(selectMode);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Common TS pitfalls"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Tuple selectors without ",e.jsx("code",{children:"as const"})," → widened array type."]}),e.jsx("li",{children:"Forgetting middleware generics → devtools action name arg looks “invalid”."}),e.jsxs("li",{children:["Returning fresh objects from selectors without ",e.jsx("code",{children:"shallow"})," → extra renders."]}),e.jsxs("li",{children:["Using ",e.jsx("code",{children:"any"})," in state → you lose completion and safety."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Define a clear ",e.jsx("code",{children:"State"})," type per store."]}),e.jsxs("li",{children:["Prefer primitive selectors; tuples use ",e.jsx("code",{children:"as const"}),"."]}),e.jsxs("li",{children:["Add ",e.jsx("code",{children:"shallow"})," for object/tuple selectors."]}),e.jsxs("li",{children:["For ",e.jsx("code",{children:"persist"}),"/",e.jsx("code",{children:"devtools"}),", start simple; add advanced types only if needed."]}),e.jsx("li",{children:"Compose larger stores from typed slices."})]})]})]});export{r as default};
