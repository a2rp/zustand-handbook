import{d as r,j as e}from"./index-CpvfKB5t.js";const a="var(--card, #111)",o="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",t="var(--border, #222)",n="var(--accent, #22c55e)",d="var(--danger, #ef4444)",l="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
        color: ${o};
        border: 1px solid ${t};
        border-radius: ${l};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${i};
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
            border: 1px solid ${n};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:r.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Persist (Partialization + Version)"}),e.jsx(s.Subtitle,{children:"Save only what matters, and evolve safely when your store shape changes."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add ",e.jsx("code",{children:"persist"})," to a store using ",e.jsx("code",{children:"createJSONStorage"}),"."]}),e.jsxs("li",{children:["Persist only a subset of state with ",e.jsx("code",{children:"partialize"}),"."]}),e.jsxs("li",{children:["Handle schema changes with ",e.jsx("code",{children:"version"})," + ",e.jsx("code",{children:"migrate()"}),"."]}),e.jsx("li",{children:"Detect hydration to avoid “undefined flicker”."}),e.jsx("li",{children:"Clear storage & reset state for logout flows."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Basic setup (persist + JSON storage)"}),e.jsx("pre",{className:"good",children:`// stores/app.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initial = {
  auth: { user: null, token: null },
  theme: { mode: 'light' },
  cart:  { items: [] },
  hasHydrated: false,
};

export const useApp = create(
  persist(
    (set, get) => ({
      ...initial,

      // actions
      setTheme: (mode) => set((s) => ({ theme: { ...s.theme, mode } }), false, 'theme/set'),
      login: (user, token) => set({ auth: { user, token } }, false, 'auth/login'),
      logout: () => set({ auth: { user: null, token: null } }, false, 'auth/logout'),
      addToCart: (item) => set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
      resetAll: () => set(initial, false, 'app/reset'),

      // mark when storage rehydration has completed (useful for UX)
      _setHydrated: (v) => set({ hasHydrated: v }, false, 'app/hydrated'),
    }),
    {
      name: 'app-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);`}),e.jsxs("p",{children:[e.jsxs("b",{children:["Why ",e.jsx("code",{children:"createJSONStorage"}),"?"]})," It makes serialization explicit and lets you switch to another storage (e.g., ",e.jsx("code",{children:"sessionStorage"}),") easily."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Persist only what you need (partialization)"}),e.jsxs("p",{children:["Don’t save everything — skip ephemeral UI and recomputable values. Persist just the essentials (e.g., ",e.jsx("code",{children:"auth"})," and ",e.jsx("code",{children:"theme.mode"}),")."]}),e.jsx("pre",{className:"good",children:`export const useApp = create(
  persist(
    (set, get) => ({ /* ...state & actions... */ }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),

      // 👇 Persist only a subset
      partialize: (state) => ({
        auth:  state.auth,            // user & token
        theme: { mode: state.theme.mode }, // only 'mode' (not all theme settings)
        // cart intentionally NOT persisted to keep it volatile
      }),
    }
  )
);`}),e.jsxs(s.Callout,{children:["Keep persisted state ",e.jsx("b",{children:"small and stable"}),". Derive everything else on the fly."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Version & migrate when your shape changes"}),e.jsxs("p",{children:["If you rename keys or move data, bump ",e.jsx("code",{children:"version"})," and write a ",e.jsx("code",{children:"migrate"})," that converts old saved data into the new shape."]}),e.jsx("pre",{className:"good",children:`export const useApp = create(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'app-store',
      version: 2, // 🔁 bump when persisted shape changes
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ auth: s.auth, theme: { mode: s.theme.mode } }),

      migrate: (persistedState, fromVersion) => {
        if (fromVersion < 2) {
          // before: auth: { userId, name } → after: auth: { user: { id, name }, token }
          const prev = persistedState?.auth || {};
          return {
            ...persistedState,
            auth: {
              user: prev.user ? prev.user : { id: prev.userId ?? null, name: prev.name ?? null },
              token: null, // no token existed previously
            },
          };
        }
        return persistedState;
      },
    }
  )
);`}),e.jsxs(s.Callout,{children:["Migrations should be ",e.jsx("b",{children:"pure and defensive"}),". Always handle missing fields from older versions."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Know when hydration is done (UX guard)"}),e.jsxs("p",{children:["On first render in the browser, ",e.jsx("i",{children:"rehydration"})," pulls values from storage. Use",e.jsx("code",{children:"onRehydrateStorage"})," to flip a flag so your UI can wait before reading persisted state."]}),e.jsx("pre",{className:"good",children:`export const useApp = create(
  persist(
    (set, get) => ({
      ...initial,
      _setHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        // runs before rehydration
        return (state, error) => {
          // runs after rehydration (or error)
          if (!error) set({ hasHydrated: true });
        };
      },
    }
  )
);`}),e.jsx("pre",{className:"note",children:`// Component example
const hasHydrated = useApp((s) => s.hasHydrated);
if (!hasHydrated) return <Spinner />; // avoid flickers using persisted values`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) “Logout” flow — clear storage and reset"}),e.jsx("pre",{className:"good",children:`// Clear localStorage (for this store key) + reset in-memory state
async function logoutCompletely() {
  await useApp.persist.clearStorage(); // removes the 'app-store' key from localStorage
  useApp.getState().resetAll();        // reset to initial in memory
}`}),e.jsx("p",{children:"Clearing storage alone won’t change in-memory state until next page load, so also call a reset action to sync the UI immediately."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Pick a different storage (optional)"}),e.jsx("pre",{className:"note",children:`// Use sessionStorage instead of localStorage
storage: createJSONStorage(() => sessionStorage)`}),e.jsx("pre",{className:"note",children:`// Guard for SSR (Next.js): only access storage on the client
storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined))`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"7) Common pitfalls"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Persisting huge objects → slow loads & larger storage. ",e.jsx("b",{children:"Fix:"})," use",e.jsx("code",{children:"partialize"}),"."]}),e.jsxs("li",{children:["Persisting derived/transient values → drift. ",e.jsx("b",{children:"Fix:"})," persist only source data."]}),e.jsxs("li",{children:["Reading persisted values before hydration → ",e.jsx("i",{children:"undefined flicker"}),". ",e.jsx("b",{children:"Fix:"})," use a hydration flag."]}),e.jsxs("li",{children:["Key collisions across stores. ",e.jsx("b",{children:"Fix:"})," use unique ",e.jsx("code",{children:"name"})," keys (e.g., ",e.jsx("code",{children:"app-store"}),",",e.jsx("code",{children:"ui-store"}),")."]}),e.jsxs("li",{children:["Non-JSON data (Date, Map) won’t survive round-trip. ",e.jsx("b",{children:"Fix:"})," serialize to primitives or custom encode/decode."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"8) Quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Does it need to survive reload? → persist it. If not, keep it volatile."}),e.jsx("li",{children:"Persist the minimum (auth, theme mode, user prefs)."}),e.jsx("li",{children:"Version + migrate when you change persisted shapes."}),e.jsx("li",{children:"Expose a hydration flag and a full reset/logout path."})]})]})]});export{p as default};
