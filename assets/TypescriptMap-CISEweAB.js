import{j as e}from"./index-D0NhHHfM.js";import{S as t}from"./styled-CBaX45R3.js";const o=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"TypeScript Map — Typing Store & Selectors"}),e.jsx(t.Subtitle,{children:"A practical cheat sheet to type Zustand stores, actions, selectors, and middleware."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Install"}),e.jsx("pre",{className:"good",children:`npm i zustand
# already typed; no extra @types package needed`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Core pattern I use"}),e.jsxs("p",{children:["Define a state shape, then pass it to ",e.jsx("code",{children:"create<T>()"}),". Keep actions typed and named."]}),e.jsx("pre",{className:"good",children:`// store/counter.ts
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
}));`}),e.jsx("pre",{className:"note",children:`// In a component
const count = useCounter((s) => s.count);         // number
const add = useCounter((s) => s.add);             // (n: number) => void`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Typing selectors safely"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Selecting a primitive just infers the type."}),e.jsxs("li",{children:["For multiple values, return a tuple/object and use ",e.jsx("code",{children:"shallow"}),"."]})]}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

// tuple + shallow
const [count, disabled] = useCounter(
  (s) => [s.count, s.count > 10],
  shallow
); // [number, boolean]

// object + shallow
const view = useCounter(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
); // { count: number; disabled: boolean }`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["Using ",e.jsx("code",{children:"set"})," & ",e.jsx("code",{children:"get"})," with types"]}),e.jsxs("p",{children:["When an action needs current state, read it via ",e.jsx("code",{children:"get()"}),". Both forms are typed."]}),e.jsx("pre",{className:"good",children:`type Theme = 'light' | 'dark';

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
}));`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Async actions (thunks)"}),e.jsxs("p",{children:["Return ",e.jsx("code",{children:"Promise<void>"})," for clarity."]}),e.jsx("pre",{className:"good",children:`type User = { id: string; name: string };

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
}));`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["Typing ",e.jsx("code",{children:"persist"})," middleware"]}),e.jsxs("p",{children:["Give your store type to ",e.jsx("code",{children:"create<T>()"}),", then wrap with ",e.jsx("code",{children:"persist"}),"."]}),e.jsx("pre",{className:"good",children:`import { persist, createJSONStorage } from 'zustand/middleware';

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
);`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["Typing ",e.jsx("code",{children:"devtools"})," middleware"]}),e.jsx("pre",{className:"good",children:`import { devtools } from 'zustand/middleware';

type BearState = { bears: number; increase: (by: number) => void };

export const useBears = create<BearState>()(
  devtools((set) => ({
    bears: 0,
    increase: (by) =>
      set((s) => ({ bears: s.bears + by }), false, 'bears/increase'),
  }))
);`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:[e.jsx("code",{children:"subscribeWithSelector"})," (precise subscriptions)"]}),e.jsx("pre",{className:"good",children:`import { subscribeWithSelector } from 'zustand/middleware';

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
);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Deriving types from a store"}),e.jsx("pre",{className:"note",children:`// State type from a bound store
type Counter = ReturnType<typeof useCounter.getState>; // { count: number; ... }

// Action type example
type Inc = ReturnType<typeof useCounter.getState>['increment']; // () => void`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Typed slices (lightweight approach)"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

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
}));`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Headless store for tests"}),e.jsx("pre",{className:"note",children:`import { createStore } from 'zustand/vanilla';

const store = createStore<CounterState>()((set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }));
store.getState().increment();
expect(store.getState().count).toBe(1);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Always type the store: ",e.jsx("code",{children:"create<YourState>()"}),"."]}),e.jsxs("li",{children:["Name actions: ",e.jsx("code",{children:"slice/action"})," helps with devtools."]}),e.jsxs("li",{children:["Selectors infer types; add ",e.jsx("code",{children:"shallow"})," for tuples/objects."]}),e.jsxs("li",{children:["Persist: type comes from your store; use ",e.jsx("code",{children:"partialize"})," for durability."]}),e.jsxs("li",{children:["Async actions return ",e.jsx("code",{children:"Promise<void>"})," (or a typed payload)."]})]})]})]});export{o as default};
