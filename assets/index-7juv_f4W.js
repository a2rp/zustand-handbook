import{d as r,j as e}from"./index-Gt8sd0pi.js";const o="var(--card, #111)",i="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",t="var(--border, #222)",c="var(--accent, #22c55e)",d="var(--danger, #ef4444)",n="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${i};
        border: 1px solid ${t};
        border-radius: ${n};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${a};
    `,Section:r.section`
        border-top: 1px dashed ${t};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${t};
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
            border: 1px dashed ${t};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${c};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Devtools Action Patterns"}),e.jsx(s.Subtitle,{children:"How I name actions and structure updates for clear traces."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Basic setup with devtools"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCart = create(
  devtools(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((it) => it.id !== id) }), false, 'cart/remove'),
      clear: () => set({ items: [] }, false, 'cart/clear'),
    }),
    { name: 'cart', enabled: true, trace: true } // trace shows stack (dev only)
  )
);`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Action name:"})," third arg to ",e.jsx("code",{children:"set"})," → ",e.jsx("code",{children:"'slice/action'"}),"."]}),e.jsxs("li",{children:[e.jsx("b",{children:e.jsx("code",{children:"trace"})})," is handy while debugging; turn it off for production."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Naming scheme I use"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Format:"})," ",e.jsx("code",{children:"slice/action"})," (e.g., ",e.jsx("code",{children:"auth/login"}),", ",e.jsx("code",{children:"cart/add"}),", ",e.jsx("code",{children:"ui/toggleSidebar"}),")."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Tense:"})," present (",e.jsx("i",{children:"add"}),", ",e.jsx("i",{children:"toggle"}),", ",e.jsx("i",{children:"fetch"}),")."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Async:"})," ",e.jsx("code",{children:"slice/fetchStart"}),", ",e.jsx("code",{children:"slice/fetchSuccess"}),", ",e.jsx("code",{children:"slice/fetchError"}),"."]})]}),e.jsx("pre",{className:"good",children:`// Good examples
set({ open: true }, false, 'ui/open');
set((s) => ({ count: s.count + 1 }), false, 'counter/increment');
set({ loading: true, error: null }, false, 'users/fetchStart');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Group related updates into a single action"}),e.jsxs("p",{children:["One ",e.jsx("code",{children:"set()"})," → one devtools entry. Group related fields to keep the trace clean."]}),e.jsx("pre",{className:"good",children:`checkoutSuccess: (order) =>
  set((s) => ({
    items: [],
    lastOrder: order,
    ui: { ...s.ui, toast: { type: 'success', msg: 'Order placed!' } },
  }), false, 'checkout/success');`}),e.jsx("pre",{className:"bad",children:`// Multiple set() calls = noisy timeline
set({ items: [] }, false, 'checkout/clearItems');
set({ lastOrder: order }, false, 'checkout/setLastOrder');
set((s) => ({ ui: { ...s.ui, toast: {...} } }), false, 'ui/toast');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Thunks with start/success/error names"}),e.jsx("pre",{className:"good",children:`placeOrder: async () => {
  set({ loading: true, error: null }, false, 'checkout/start');
  try {
    const order = await api.placeOrder(get().items);
    set({ loading: false, lastOrder: order, items: [] }, false, 'checkout/success');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'checkout/error');
  }
}`}),e.jsx("p",{children:"Consistent naming makes the DevTools timeline read like a story."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Layering with persist"}),e.jsxs("p",{children:["Devtools + persist together (I wrap ",e.jsx("code",{children:"persist"})," inside ",e.jsx("code",{children:"devtools"}),")."]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useApp = create(
  devtools(
    persist(
      (set, get) => ({
        auth: { user: null },
        theme: { mode: 'dark' },
        login: (user) => set({ auth: { user } }, false, 'auth/login'),
        toggleTheme: () => set((s) => ({
          theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' }
        }), false, 'theme/toggle'),
      }),
      {
        name: 'app-storage',                     // storage key
        partialize: (s) => ({ auth: s.auth, theme: s.theme }),
        version: 1,
        // migrate: (persisted, ver) => persisted, // add when you change shapes
      }
    ),
    { name: 'app', trace: true }
  )
);`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("b",{children:[e.jsx("code",{children:"name"})," in persist:"]})," storage key; ",e.jsxs("b",{children:[e.jsx("code",{children:"name"})," in devtools:"]})," monitor label."]}),e.jsxs("li",{children:["When state shape changes, bump ",e.jsx("code",{children:"version"})," and add a ",e.jsx("code",{children:"migrate"})," function."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Trace tips & performance"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"trace: true"})," captures stacks; useful during debugging only."]}),e.jsx("li",{children:"Group updates to reduce devtools noise and component re-renders."}),e.jsx("li",{children:"Name important actions; minor UI flips can be anonymous if you prefer less noise."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"7) Quick testing trick"}),e.jsx("pre",{className:"note",children:`// In tests or REPL:
import { useCart } from './stores/cart';
useCart.getState().add({ id: 1, title: 'Pen' });
useCart.getState().remove(1);
useCart.setState({ items: [] }); // force state`})]})]});export{p as default};
