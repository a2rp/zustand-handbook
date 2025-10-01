import{j as e}from"./index-Bmr0gcqO.js";import{S as s}from"./styled-C2dA_KgB.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Middlewares Overview — persist / devtools / subscribeWithSelector / immer"}),e.jsx(s.Subtitle,{children:"What each middleware does, when I use it, and small examples I keep handy."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What problem each one solves"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"persist"})," — save part of the store to storage (e.g., localStorage) and restore on load."]}),e.jsxs("li",{children:[e.jsx("b",{children:"devtools"})," — inspect actions and time-travel via Redux DevTools."]}),e.jsxs("li",{children:[e.jsx("b",{children:"subscribeWithSelector"})," — fine-grained ",e.jsx("code",{children:"store.subscribe(selector)"})," outside React."]}),e.jsxs("li",{children:[e.jsx("b",{children:"immer"})," — write “mutating” updates; Immer turns them into immutable updates for you."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"persist — quick start"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
);`}),e.jsx(s.Callout,{children:"I persist only durable data (e.g., theme, auth tokens, cart), not ephemeral UI flags (like spinners). Version + migrate keeps old users safe."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"SSR/Next"}),": don’t touch ",e.jsx("code",{children:"localStorage"})," on the server. Gate behind a check or run on client."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Partialize"}),": store the minimum slice; big blobs slow down JSON parse/stringify."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"devtools — readable traces"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
);`}),e.jsxs("ul",{children:[e.jsxs("li",{children:["I name actions like ",e.jsx("code",{children:"slice/action"})," so DevTools is easy to scan."]}),e.jsx("li",{children:"Good for debugging in dev; fine to keep in prod too—overhead is small."}),e.jsx("li",{children:"Install the Redux DevTools browser extension to see actions and state."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"subscribeWithSelector — precise subscriptions outside React"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
unsubscribe();`}),e.jsxs("ul",{children:[e.jsx("li",{children:"Great for reacting to a tiny slice without wiring a component."}),e.jsx("li",{children:"Be specific with the selector; broad selectors do extra work every change."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"immer — ergonomic nested updates"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
);`}),e.jsxs("ul",{children:[e.jsxs("li",{children:["I still keep selectors narrow (",e.jsx("code",{children:"shallow"})," for tuples/objects) — Immer doesn’t change that."]}),e.jsx("li",{children:"Immer lets me mutate a draft; it produces the next immutable state behind the scenes."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Composing middlewares"}),e.jsx("pre",{className:"note",children:`import { create } from 'zustand';
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
);`}),e.jsxs("p",{children:["I usually put ",e.jsx("code",{children:"devtools"})," outermost to capture named action logs after other middlewares run. Order can vary, but this layout works well."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Troubleshooting"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"“localStorage is not defined”"})," — you’re on the server. Use ",e.jsx("code",{children:"createJSONStorage(() => localStorage)"})," only on the client."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Nothing rehydrates"})," — check the ",e.jsx("code",{children:"name"})," key and make sure data is JSON-serializable."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Too many updates"})," — narrow selectors; for derived arrays/objects, pass ",e.jsx("code",{children:"shallow"}),"."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cheat sheet"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Need durable data? → ",e.jsx("b",{children:"persist"})," (+ version + partialize)."]}),e.jsxs("li",{children:["Debug flows? → ",e.jsx("b",{children:"devtools"})," + named actions."]}),e.jsxs("li",{children:["React to a tiny change outside React? → ",e.jsx("b",{children:"subscribeWithSelector"}),"."]}),e.jsxs("li",{children:["Nested updates feel noisy? → ",e.jsx("b",{children:"immer"}),"."]})]})]})]});export{i as default};
