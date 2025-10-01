import{j as e}from"./index-Bmr0gcqO.js";import{S as s}from"./styled-C2dA_KgB.js";const a=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Middleware: persist"}),e.jsx(s.Subtitle,{children:"Save parts of the store to storage so state survives refresh and app restarts."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Why I use it"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Keep user choices across refresh (theme, filters, sort, cart)."}),e.jsx("li",{children:"Restore session after a crash or reload."}),e.jsx("li",{children:"Version + migrate data safely as the app evolves."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Basic setup"}),e.jsx("pre",{className:"good",children:`// stores/theme.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useTheme = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggle: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }, false, 'theme/toggle'),
    }),
    {
      name: 'zh_theme', // ⚠️ unique key per slice
      storage: createJSONStorage(() => localStorage), // sessionStorage also works
    }
  )
);`}),e.jsxs("p",{children:["I always use ",e.jsx("code",{children:"createJSONStorage"})," so values are safely stringified and parsed."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Persist only what matters (partialize)"}),e.jsxs("p",{children:["Volatile fields like ",e.jsx("code",{children:"loading"}),"/",e.jsx("code",{children:"error"})," stay out of storage."]}),e.jsx("pre",{className:"good",children:`// stores/users.js (sketch)
export const useUsers = create(
  persist(
    (set) => ({
      users: [],
      loading: false,
      error: null,
      setUsers: (arr) => set({ users: arr }, false, 'users/set'),
      // ...other actions
    }),
    {
      name: 'zh_users_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }), // only this key is saved
    }
  )
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Versioning & migrations"}),e.jsxs("p",{children:["If I rename fields or change shape, I bump ",e.jsx("code",{children:"version"})," and write a small ",e.jsx("code",{children:"migrate"}),"."]}),e.jsx("pre",{className:"good",children:`export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
    }),
    {
      name: 'zh_cart',
      version: 2, // ← bump when shape changes
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, fromVersion) => {
        if (fromVersion < 2) {
          // v1 -> v2: item { id, name, price } -> { id, title, price }
          const items = (persistedState?.items || []).map((it) => ({
            id: it.id,
            title: it.name, // rename
            price: it.price,
          }));
          return { ...persistedState, items };
        }
        return persistedState;
      },
    }
  )
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Knowing when rehydration finishes"}),e.jsx("p",{children:"I flip a small flag so the UI can show a skeleton while storage loads."}),e.jsx("pre",{className:"good",children:`export const usePrefs = create(
  persist(
    (set) => ({
      ready: false,                 // hydration flag
      lang: 'en',
      setLang: (lang) => set({ lang }, false, 'prefs/lang'),
    }),
    {
      name: 'zh_prefs',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        // called after state is rehydrated (or failed)
        set({ ready: true });
        if (error) console.error('rehydration failed', error);
      },
    }
  )
);

// In a component:
// const ready = usePrefs((s) => s.ready);
// if (!ready) return <Skeleton />;`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Clear stored data / force rehydrate"}),e.jsx("pre",{className:"note",children:`// Clear only this slice's storage (good for "logout" UX)
await usePrefs.persist.clearStorage();

// Re-run hydration manually (after you changed options or storage)
await usePrefs.persist.rehydrate();`}),e.jsxs("p",{children:["These helpers are available on the store returned by ",e.jsx("code",{children:"persist"}),"."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Storage choices I consider"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"localStorage"})," — small key-value, sync across tabs via “storage” events."]}),e.jsxs("li",{children:[e.jsx("b",{children:"sessionStorage"})," — clears when the tab closes."]}),e.jsxs("li",{children:[e.jsx("b",{children:"IndexedDB"})," — for big data; use a tiny wrapper or libraries like localForage."]})]}),e.jsx("pre",{className:"good",children:`// Swap to sessionStorage
storage: createJSONStorage(() => sessionStorage)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Devtools + persist (order I use)"}),e.jsxs("p",{children:["I wrap ",e.jsx("code",{children:"persist"})," with ",e.jsx("code",{children:"devtools"})," so actions show up nicely:"]}),e.jsx("pre",{className:"good",children:`import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      (set, get) => ({ /* state + actions */ }),
      { name: 'zh_store', storage: createJSONStorage(() => localStorage) }
    ),
    { name: 'AppStore' } // devtools options
  )
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I don’t persist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Ephemeral UI state: ",e.jsx("code",{children:"loading"}),", ",e.jsx("code",{children:"error"}),", open/close flags."]}),e.jsx("li",{children:"Derived data that I can recompute."}),e.jsx("li",{children:"Huge arrays/objects unless I’ve moved to IndexedDB."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Pitfalls I watch for"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Key collisions: keep ",e.jsx("code",{children:"name"})," unique per slice."]}),e.jsx("li",{children:"Non-serializable values (functions, Dates/Maps/Sets) — store primitives/raw JSON."}),e.jsxs("li",{children:["SSR: guard access to ",e.jsx("code",{children:"window"}),"; use ",e.jsx("code",{children:"createJSONStorage(() => localStorage)"})," or conditionals."]}),e.jsx("li",{children:"Storage quota: large payloads should move to IndexedDB/localForage."})]})]})]});export{a as default};
