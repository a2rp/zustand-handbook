import{j as e}from"./index-D0NhHHfM.js";import{S as t}from"./styled-9asSRIYq.js";const a=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Persist Migrations — Versions & Partialization"}),e.jsx(t.Subtitle,{children:"How I evolve persisted state safely when shapes or keys change."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["When to bump ",e.jsx("code",{children:"version"})," and how to write ",e.jsx("code",{children:"migrate"}),"."]}),e.jsxs("li",{children:["How I keep the persisted payload small with ",e.jsx("code",{children:"partialize"}),"."]}),e.jsx("li",{children:"Renaming fields, splitting/merging slices, and adding defaults."}),e.jsx("li",{children:"Common pitfalls that break user data."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Versioning: the mental model"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["The persisted JSON has a ",e.jsx("b",{children:"schema version"}),"."]}),e.jsxs("li",{children:["When I change the shape/field names, I bump ",e.jsx("code",{children:"version"})," and provide a ",e.jsx("code",{children:"migrate"})," function."]}),e.jsxs("li",{children:["Migrations are ",e.jsx("b",{children:"pure"}),": input old JSON → output new JSON."]})]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// v1: { items: [{ id, name, price }] }
// v2: { items: [{ id, title, price }], currency: 'INR' } // 'name' -> 'title', add currency
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      currency: 'INR',
      add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
    }),
    {
      name: 'zh_cart',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, fromVersion) => {
        if (!persisted) return { items: [], currency: 'INR' };
        let state = { ...persisted };

        if (fromVersion < 2) {
          // rename 'name' -> 'title' and add default currency
          const items = (state.items || []).map((it) => ({
            id: it.id,
            title: it.name,
            price: it.price,
          }));
          state = { ...state, items, currency: 'INR' };
        }
        return state;
      },
    }
  )
);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Save only what matters (partialize)"}),e.jsx("p",{children:"Loading flags, errors, and UI-only toggles don’t belong in storage."}),e.jsx("pre",{className:"good",children:`export const useUsers = create(
  persist(
    (set) => ({
      users: [],
      loading: false,  // don't persist
      error: null,     // don't persist
      setUsers: (arr) => set({ users: arr }, false, 'users/set'),
    }),
    {
      name: 'zh_users_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ users: s.users }), // keep payload tiny
    }
  )
);`}),e.jsxs("p",{children:["If I change which keys I persist, I usually bump ",e.jsx("code",{children:"version"})," so older payloads upgrade cleanly."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Field renames and nested shape changes"}),e.jsx("pre",{className:"good",children:`// v3: move cart.total -> totals.{subtotal,tax,total}
export const useCartV3 = create(
  persist(
    (set) => ({
      items: [],
      totals: { subtotal: 0, tax: 0, total: 0 },
      recalc: () => set((s) => {
        const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
        const tax = subtotal * 0.18;
        return { totals: { subtotal, tax, total: subtotal + tax } };
      }, false, 'cart/recalc'),
    }),
    {
      name: 'zh_cart',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, from) => {
        let state = persisted || {};
        if (from < 2) {
          // apply v1->v2 here (rename name->title, add currency) ... or call a helper
        }
        if (from < 3) {
          // move total -> totals.total and add missing parts
          const oldTotal = state.total ?? 0;
          const totals = state.totals || { subtotal: 0, tax: 0, total: oldTotal };
          delete state.total;
          state = { ...state, totals };
        }
        return state;
      },
      partialize: (s) => ({ items: s.items, totals: s.totals }), // skip ephemeral flags
    }
  )
);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Rehydration: knowing when storage is ready"}),e.jsx("pre",{className:"good",children:`export const usePrefs = create(
  persist(
    (set) => ({
      ready: false,
      lang: 'en',
      setLang: (lang) => set({ lang }, false, 'prefs/lang'),
    }),
    {
      name: 'zh_prefs',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        set({ ready: true });
        if (error) console.error('rehydration failed', error);
      },
    }
  )
);

// UI gate:
// const ready = usePrefs((s) => s.ready);
// if (!ready) return <Skeleton />;`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"If I must change the storage key"}),e.jsxs("p",{children:["Changing the ",e.jsx("code",{children:"name"})," option creates a new key and the old data won’t be seen by",e.jsx("code",{children:"migrate"}),". Two options I use:"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Keep the same ",e.jsx("code",{children:"name"})," and rely on ",e.jsx("code",{children:"version + migrate"})," (preferred)."]}),e.jsxs("li",{children:["One-time manual copy on startup via ",e.jsx("code",{children:"onRehydrateStorage"})," (read old key, write new, then clear old)."]})]}),e.jsx("pre",{className:"note",children:`onRehydrateStorage: () => () => {
  try {
    const old = localStorage.getItem('OLD_KEY');
    if (old) {
      const parsed = JSON.parse(old);
      // transform parsed if needed, then merge into current state:
      // set({ ...parsed });
      localStorage.removeItem('OLD_KEY');
    }
  } catch {}
}`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Clearing & forcing rehydrate"}),e.jsx("pre",{className:"note",children:`// clear only this slice
await useCart.persist.clearStorage();

// re-run hydration after changing options
await useCart.persist.rehydrate();`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Pitfalls I watch for"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Forgetting to bump ",e.jsx("code",{children:"version"})," after schema changes."]}),e.jsx("li",{children:"Migrations that rely on browser APIs or throw — keep them pure and defensive."}),e.jsx("li",{children:"Persisting giant blobs — move big data to IndexedDB/localForage."}),e.jsxs("li",{children:["Putting ",e.jsx("code",{children:"loading/error"})," into storage — they should reset on refresh."]})]})]})]});export{a as default};
