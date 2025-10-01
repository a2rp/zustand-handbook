import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const n=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Middleware: devtools — time-travel & trace"}),e.jsx(s.Subtitle,{children:"How I wire Zustand to Redux DevTools for action logs, time-travel, and stack traces."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I use it for"}),e.jsxs("ul",{children:[e.jsx("li",{children:"See each action in a timeline (who changed what)."}),e.jsx("li",{children:"Jump back in time to a previous state."}),e.jsx("li",{children:"Inspect state diffs when debugging."}),e.jsx("li",{children:"Optional stack traces for tricky flows."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick setup (once)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Install the ",e.jsx("b",{children:"Redux DevTools"})," browser extension."]}),e.jsxs("li",{children:["Wrap the store with the ",e.jsx("code",{children:"devtools"})," middleware."]})]}),e.jsx("pre",{className:"good",children:`// stores/counter.js
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
);`}),e.jsxs(s.Callout,{children:["I give each store a unique ",e.jsx("code",{children:"name"})," so it’s easy to find in the DevTools list."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Enable only in development"}),e.jsx("p",{children:"Devtools add tiny overhead. I keep them off in production."}),e.jsx("pre",{className:"good",children:`export const useApp = create(
  devtools(
    (set, get) => ({ /* state & actions */ }),
    { name: 'app', enabled: import.meta.env.DEV, trace: import.meta.env.DEV }
  )
);`}),e.jsx("pre",{className:"note",children:`// Alternative: wrap conditionally
const withDevtools = (fn) =>
  import.meta.env.DEV ? devtools(fn, { name: 'app' }) : fn;

export const useApp = create(withDevtools((set, get) => ({ /* ... */ })));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Action names that read well"}),e.jsxs("p",{children:["I always name actions like ",e.jsx("code",{children:"slice/action"})," using the 3rd argument to ",e.jsx("code",{children:"set"}),"."]}),e.jsx("pre",{className:"good",children:`addToCart: (item) =>
  set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),

applyCoupon: (code) =>
  set((s) => ({ cart: { ...s.cart, coupon: code } }), false, 'cart/applyCoupon'),`}),e.jsx("pre",{className:"bad",children:`// shows up as "anonymous" in DevTools
addToCart: (item) => set((s) => ({ cart: { items: [...s.cart.items, item] } })),`}),e.jsx("pre",{className:"note",children:`// Tiny helper I sometimes use:
const setWith = (type, recipe) => set(recipe, false, type);
// usage:
increment: () => setWith('counter/increment', (s) => ({ count: s.count + 1 })),`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Time-travel: what actually happens"}),e.jsxs("ul",{children:[e.jsx("li",{children:"DevTools can jump to any previous action; Zustand swaps the store state."}),e.jsx("li",{children:"External side-effects (network requests, timers) are not rewound."}),e.jsx("li",{children:"If you use persistence, jumping around won’t write to storage unless your actions do."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Tracing (optional)"}),e.jsxs("p",{children:["When I’m lost, I turn on ",e.jsx("code",{children:"trace: true"})," so DevTools shows a stack trace for each action entry. It’s heavier, so I keep it dev-only."]}),e.jsx("pre",{className:"good",children:`export const useApp = create(
  devtools((set, get) => ({ /* ... */ }), { name: 'app', enabled: import.meta.env.DEV, trace: true })
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Multiple stores"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Give each store a unique ",e.jsx("code",{children:"name"}),"."]}),e.jsx("li",{children:"Stick to consistent action naming across stores."}),e.jsx("li",{children:"Too much noise? Disable devtools for tiny per-component stores."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Pitfalls I avoid"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Forgetting to wrap with ",e.jsx("code",{children:"devtools"})," and wondering why nothing shows."]}),e.jsx("li",{children:"Not naming actions → hard-to-read “anonymous” timeline."}),e.jsx("li",{children:"Logging huge objects every keystroke (e.g., form state) — I debounce or skip devtools for that slice."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Copy-paste mini example"}),e.jsx("pre",{className:"good",children:`// stores/app.js
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
);`})]})]});export{n as default};
