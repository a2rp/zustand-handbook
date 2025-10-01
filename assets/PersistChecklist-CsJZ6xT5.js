import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-BO5MAwS2.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Persist Checklist — Migrations & Storage"}),e.jsx(s.Subtitle,{children:"Everything I tick through before turning on persistence in a store."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick start (minimal, safe defaults)"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useTodos = create(
  persist(
    (set, get) => ({
      items: [],
      filter: 'all',
      add: (title) =>
        set((s) => ({ items: [...s.items, { id: crypto.randomUUID(), title, done: false }] }), false, 'todos/add'),
      toggle: (id) =>
        set((s) => ({
          items: s.items.map(it => it.id === id ? { ...it, done: !it.done } : it)
        }), false, 'todos/toggle'),
      clearDone: () =>
        set((s) => ({ items: s.items.filter(it => !it.done) }), false, 'todos/clearDone'),
    }),
    {
      name: 'todos-v1',                        // unique key in storage
      version: 1,                              // bump when you change shape
      storage: createJSONStorage(() => localStorage), // or sessionStorage / custom
      partialize: (state) => ({                // save only what I need
        items: state.items,
        filter: state.filter
      }),
    }
  )
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Before I enable persist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Pick a stable ",e.jsx("code",{children:"name"})," key (e.g., ",e.jsx("code",{children:"todos-v1"}),")."]}),e.jsxs("li",{children:["Decide which fields truly need saving → set ",e.jsx("code",{children:"partialize"}),"."]}),e.jsxs("li",{children:["Plan a ",e.jsx("b",{children:"version number"})," and a ",e.jsx("b",{children:"migrate"})," function for future changes."]}),e.jsxs("li",{children:["Confirm storage choice: ",e.jsx("code",{children:"localStorage"})," (default), ",e.jsx("code",{children:"sessionStorage"}),", or IndexedDB via a custom driver."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"When I change state shape → migrations"}),e.jsxs("p",{children:["I bump ",e.jsx("code",{children:"version"})," and write a tiny ",e.jsx("code",{children:"migrate"})," to transform old data."]}),e.jsx("pre",{className:"good",children:`export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      // ...
    }),
    {
      name: 'cart',
      version: 2, // ⬅️ new version
      migrate: (persistedState, fromVersion) => {
        // v1 -> v2: rename "products" -> "items"
        if (fromVersion < 2) {
          const { products, ...rest } = persistedState || {};
          return { ...rest, items: Array.isArray(products) ? products : (persistedState?.items || []) };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
    }
  )
);`}),e.jsx("pre",{className:"note",children:`Tips:
- Migrations should be idempotent and small.
- Keep defaults if a field is missing (defensive coding).
- Test migration with sample old payloads.`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Hydration lifecycle (showing a loader, handling errors)"}),e.jsxs("p",{children:["I tap ",e.jsx("code",{children:"onRehydrateStorage"})," to set flags around hydration."]}),e.jsx("pre",{className:"good",children:`export const useProfile = create(
  persist(
    (set, get) => ({
      ready: false,
      error: null,
      name: '',
      setName: (name) => set({ name }, false, 'profile/setName'),
    }),
    {
      name: 'profile',
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        // after hydration (or if it fails)
        if (error) set({ error: String(error) });
        set({ ready: true });
      },
    }
  )
);

// In a component:
const ready = useProfile((s) => s.ready);
if (!ready) return <Spinner />;`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I usually persist (and what I don't)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"✅ User preferences (theme, layout, filters)"}),e.jsx("li",{children:"✅ Non-sensitive app state (cart, drafts)"}),e.jsx("li",{children:"❌ Highly volatile caches (recompute or refetch)"}),e.jsx("li",{children:"❌ Secrets/tokens (use HTTP-only cookies or secure storage)"})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Storage choices"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"localStorage"})," — simple, sync, 5–10MB, string-only (JSON serialize)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"sessionStorage"})," — clears on tab close."]}),e.jsxs("li",{children:[e.jsx("b",{children:"IndexedDB"})," — larger, async. Use a tiny wrapper that exposes ",e.jsx("code",{children:"getItem"}),"/",e.jsx("code",{children:"setItem"}),"/",e.jsx("code",{children:"removeItem"}),"."]})]}),e.jsx("pre",{className:"note",children:`// Custom storage (sketch). Must implement getItem/setItem/removeItem
const myStorage = {
  getItem: async (key) => (await idb.get('store', key)) ?? null,
  setItem: async (key, value) => { await idb.set('store', key, value); },
  removeItem: async (key) => { await idb.del('store', key); },
};

// use it:
storage: createJSONStorage(() => myStorage)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selective persist (partialize)"}),e.jsx("p",{children:"I keep the saved payload tight to avoid bloat and accidental leaks."}),e.jsx("pre",{className:"good",children:`partialize: (state) => ({
  // only what I need at boot
  theme: state.theme,
  sidebar: state.ui.sidebar,
  // skip huge lists or ephemeral flags
})`}),e.jsx("pre",{className:"bad",children:`// ❌ persisting the whole store
partialize: (s) => s // leads to large payloads & brittle migrations`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cross-tab behavior"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["localStorage emits a ",e.jsx("code",{children:"storage"})," event in other tabs when a key changes."]}),e.jsxs("li",{children:["Persist will rehydrate on load; if you need live cross-tab sync, listen to ",e.jsx("code",{children:"storage"})," and refresh slices appropriately."]})]}),e.jsx("pre",{className:"note",children:`// Optional: react to changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'todos-v1') {
    // e.newValue has the JSON string; you can trigger a manual refresh if needed.
  }
});`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Testing checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Mock storage in tests; start with a clean slate per test."}),e.jsx("li",{children:"Assert that migrations transform old payloads correctly."}),e.jsxs("li",{children:["Verify that only the intended fields are saved (via ",e.jsx("code",{children:"partialize"}),")."]}),e.jsxs("li",{children:["Simulate rehydrate and check the UI waits for ",e.jsx("code",{children:"ready"}),"."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common pitfalls"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Saving the entire store (payload explodes, migrations become risky)."}),e.jsxs("li",{children:["Changing shape without bumping ",e.jsx("code",{children:"version"})," + ",e.jsx("code",{children:"migrate"}),"."]}),e.jsx("li",{children:"Persisting secrets or very large arrays."}),e.jsx("li",{children:"Assuming hydration is instant — guard early renders with a ready flag when needed."})]})]})]});export{i as default};
