import React from "react";
import { Styled } from "./styled";

const MiddlewarePersist = () => {
    return (
        <Styled.Page>
            <Styled.Title>Middleware: persist</Styled.Title>
            <Styled.Subtitle>
                Save parts of the store to storage so state survives refresh and app restarts.
            </Styled.Subtitle>

            {/* Why & when */}
            <Styled.Section>
                <h3>Why I use it</h3>
                <ul>
                    <li>Keep user choices across refresh (theme, filters, sort, cart).</li>
                    <li>Restore session after a crash or reload.</li>
                    <li>Version + migrate data safely as the app evolves.</li>
                </ul>
            </Styled.Section>

            {/* Getting started */}
            <Styled.Section>
                <h3>Basic setup</h3>
                <pre className="good">{`// stores/theme.js
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
);`}</pre>
                <p>
                    I always use <code>createJSONStorage</code> so values are safely stringified and parsed.
                </p>
            </Styled.Section>

            {/* Partialize */}
            <Styled.Section>
                <h3>Persist only what matters (partialize)</h3>
                <p>Volatile fields like <code>loading</code>/<code>error</code> stay out of storage.</p>
                <pre className="good">{`// stores/users.js (sketch)
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
);`}</pre>
            </Styled.Section>

            {/* Versioning & migrations */}
            <Styled.Section>
                <h3>Versioning & migrations</h3>
                <p>If I rename fields or change shape, I bump <code>version</code> and write a small <code>migrate</code>.</p>
                <pre className="good">{`export const useCart = create(
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
);`}</pre>
            </Styled.Section>

            {/* Rehydration (UI ready) */}
            <Styled.Section>
                <h3>Knowing when rehydration finishes</h3>
                <p>I flip a small flag so the UI can show a skeleton while storage loads.</p>
                <pre className="good">{`export const usePrefs = create(
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
// if (!ready) return <Skeleton />;`}</pre>
            </Styled.Section>

            {/* Clearing & force refresh */}
            <Styled.Section>
                <h3>Clear stored data / force rehydrate</h3>
                <pre className="note">{`// Clear only this slice's storage (good for "logout" UX)
await usePrefs.persist.clearStorage();

// Re-run hydration manually (after you changed options or storage)
await usePrefs.persist.rehydrate();`}</pre>
                <p>
                    These helpers are available on the store returned by <code>persist</code>.
                </p>
            </Styled.Section>

            {/* Storage choices */}
            <Styled.Section>
                <h3>Storage choices I consider</h3>
                <ul>
                    <li><b>localStorage</b> — small key-value, sync across tabs via “storage” events.</li>
                    <li><b>sessionStorage</b> — clears when the tab closes.</li>
                    <li><b>IndexedDB</b> — for big data; use a tiny wrapper or libraries like localForage.</li>
                </ul>
                <pre className="good">{`// Swap to sessionStorage
storage: createJSONStorage(() => sessionStorage)`}</pre>
            </Styled.Section>

            {/* Devtools + persist order */}
            <Styled.Section>
                <h3>Devtools + persist (order I use)</h3>
                <p>
                    I wrap <code>persist</code> with <code>devtools</code> so actions show up nicely:
                </p>
                <pre className="good">{`import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      (set, get) => ({ /* state + actions */ }),
      { name: 'zh_store', storage: createJSONStorage(() => localStorage) }
    ),
    { name: 'AppStore' } // devtools options
  )
);`}</pre>
            </Styled.Section>

            {/* What NOT to persist */}
            <Styled.Section>
                <h3>What I don’t persist</h3>
                <ul>
                    <li>Ephemeral UI state: <code>loading</code>, <code>error</code>, open/close flags.</li>
                    <li>Derived data that I can recompute.</li>
                    <li>Huge arrays/objects unless I’ve moved to IndexedDB.</li>
                </ul>
            </Styled.Section>

            {/* Pitfalls */}
            <Styled.Section>
                <h3>Pitfalls I watch for</h3>
                <ul>
                    <li>Key collisions: keep <code>name</code> unique per slice.</li>
                    <li>Non-serializable values (functions, Dates/Maps/Sets) — store primitives/raw JSON.</li>
                    <li>SSR: guard access to <code>window</code>; use <code>createJSONStorage(() =&gt; localStorage)</code> or conditionals.</li>
                    <li>Storage quota: large payloads should move to IndexedDB/localForage.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default MiddlewarePersist;
