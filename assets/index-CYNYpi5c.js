import{d as s,j as e}from"./index-CpvfKB5t.js";const a="var(--card, #111)",o="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",r="var(--border, #222)",n="var(--accent, #22c55e)",c="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
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
        color: ${i};
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
            border: 1px solid ${n};
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
    `},h=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Reset Patterns"}),e.jsx(t.Subtitle,{children:"Practical ways I reset state in real apps."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Reset a single slice"}),e.jsxs("p",{children:["I keep a tiny ",e.jsx("code",{children:"initial"})," for each slice. To avoid reusing references, I return a ",e.jsx("b",{children:"fresh object"})," from a small factory function."]}),e.jsx("pre",{className:"good",children:`// stores/app.js (cart slice only)
import { create } from 'zustand';

const initialCart = () => ({ items: [], coupon: null });

export const useApp = create((set, get) => ({
  // --- slices ---
  cart: initialCart(),
  ui: { sidebarOpen: true },

  // --- actions ---
  addToCart: (item) =>
    set((s) => ({ cart: { ...s.cart, items: [...s.cart.items, item] } }), false, 'cart/add'),

  // ✅ slice reset => new references for changed objects
  resetCart: () =>
    set((s) => ({ cart: initialCart() }), false, 'cart/reset'),
}));`}),e.jsxs(t.Callout,{children:["Returning a new object prevents “no-op” updates. If you reuse the same reference, components selecting ",e.jsx("code",{children:"cart"})," might not notice any change."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Reset the entire store (replace)"}),e.jsxs("p",{children:["For a clean slate, I keep a ",e.jsx("code",{children:"rootInitial()"})," and use"," ",e.jsx("code",{children:"set(initial, true)"})," with ",e.jsx("b",{children:"replace = true"}),". That discards keys not in the initial object."]}),e.jsx("pre",{className:"good",children:`// stores/app.js (full reset)
const rootInitial = () => ({
  auth: { user: null },
  theme: { mode: 'dark' },
  cart: { items: [] },
  ui: { sidebarOpen: true, toast: null },
});

export const useApp = create((set, get) => ({
  ...rootInitial(),

  // ✅ full reset: replace=true
  resetAll: () => set(rootInitial(), true, 'app/resetAll'),
}));`}),e.jsx("pre",{className:"note",children:`// In a component (e.g., Settings page)
import { useApp } from '../stores/app';
<button onClick={() => useApp.getState().resetAll()}>Reset App</button>`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["3) Reset with ",e.jsx("code",{children:"persist"})," (clear storage too)"]}),e.jsxs("p",{children:["If I use ",e.jsx("code",{children:"persist"}),", resetting state isn’t enough; the old value may still be in storage. I clear storage then set the initial state."]}),e.jsx("pre",{className:"good",children:`// stores/app.js with persist
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const rootInitial = () => ({
  auth: { user: null },
  theme: { mode: 'dark' },
  cart: { items: [] },
});

export const useApp = create(persist(
  (set, get) => ({
    ...rootInitial(),

    // Replace state
    resetAll: () => set(rootInitial(), true, 'app/resetAll'),
  }),
  {
    name: 'app-v1',
    partialize: (s) => ({ auth: s.auth, theme: s.theme, cart: s.cart }),
    version: 1,
  }
));

// Somewhere in UI (logout/settings):
async function hardReset() {
  await useApp.persist.clearStorage();   // 1) clear storage
  useApp.setState(rootInitial(), true);  // 2) reset in memory
  await useApp.persist.rehydrate();      // 3) re-read (optional)
}`}),e.jsxs(t.Callout,{children:["I only call ",e.jsx("code",{children:"persist.clearStorage()"})," when I truly want a clean slate (e.g., logout). Otherwise, a simple in-memory ",e.jsx("code",{children:"resetAll()"})," is enough."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Logout reset that keeps some keys (e.g., theme)"}),e.jsxs("p",{children:["On logout, I usually keep user’s theme but clear sensitive data. I compute the next state from the ",e.jsx("i",{children:"current"})," state and replace everything."]}),e.jsx("pre",{className:"good",children:`// stores/app.js
const rootInitial = () => ({
  auth: { user: null },
  theme: { mode: 'dark' },
  cart: { items: [] },
  ui: { sidebarOpen: true },
});

export const useApp = create((set, get) => ({
  ...rootInitial(),

  logout: () =>
    set((s) => ({
      ...rootInitial(),
      // keep these from current state
      theme: s.theme,
      ui: { ...s.ui, toast: null }, // wipe ephemeral bits
    }), true, 'auth/logout'),
}));`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) Local/per-component store resets on unmount"}),e.jsxs("p",{children:["For wizards/modals, I prefer a ",e.jsx("b",{children:"store factory"}),". Each instance has its own state; when the component unmounts, it’s gone — no explicit reset needed."]}),e.jsx("pre",{className:"good",children:`// WizardStore.js
import { create } from 'zustand';
export const createWizardStore = (initialStep = 1) =>
  create((set) => ({
    step: initialStep,
    data: {},
    next: () => set((s) => ({ step: s.step + 1 })),
    reset: () => set({ step: 1, data: {} }),
  }));

// Wizard.jsx
const useWizard = React.useMemo(() => createWizardStore(1), []);
const step = useWizard((s) => s.step);
const reset = useWizard((s) => s.reset);
// Unmounting Wizard unmounts its store; state is naturally reset.`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Pitfalls I watch for"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Reusing the ",e.jsx("code",{children:"same object"})," in a reset (no new reference) — some selectors may not re-render. I return a fresh object for changed slices."]}),e.jsxs("li",{children:["Forgetting to ",e.jsx("code",{children:"clearStorage()"})," with ",e.jsx("code",{children:"persist"})," when a true wipe is required."]}),e.jsxs("li",{children:["Mixing ",e.jsx("b",{children:"merge"})," vs ",e.jsx("b",{children:"replace"}),": ",e.jsx("code",{children:"set(partial)"})," merges;"," ",e.jsx("code",{children:"set(state, true)"})," replaces the whole object."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Keep an ",e.jsx("code",{children:"initial"})," for each slice (factory function is safest)."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"replace=true"})," for clean full resets."]}),e.jsxs("li",{children:["With ",e.jsx("code",{children:"persist"}),", clear storage when needed, then rehydrate."]}),e.jsx("li",{children:"Prefer local store factories for modal/wizard flows; unmount = reset."})]})]})]});export{h as default};
