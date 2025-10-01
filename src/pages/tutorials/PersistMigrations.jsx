import React from "react";
import { Styled } from "./styled";

const PersistMigrations = () => {
    return (
        <Styled.Page>
            <Styled.Title>Persist Migrations — Versions & Partialization</Styled.Title>
            <Styled.Subtitle>
                How I evolve persisted state safely when shapes or keys change.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>When to bump <code>version</code> and how to write <code>migrate</code>.</li>
                    <li>How I keep the persisted payload small with <code>partialize</code>.</li>
                    <li>Renaming fields, splitting/merging slices, and adding defaults.</li>
                    <li>Common pitfalls that break user data.</li>
                </ul>
            </Styled.Section>

            {/* Versioning basics */}
            <Styled.Section>
                <h3>Versioning: the mental model</h3>
                <ul>
                    <li>The persisted JSON has a <b>schema version</b>.</li>
                    <li>When I change the shape/field names, I bump <code>version</code> and provide a <code>migrate</code> function.</li>
                    <li>Migrations are <b>pure</b>: input old JSON → output new JSON.</li>
                </ul>
                <pre className="good">{`import { create } from 'zustand';
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
);`}</pre>
            </Styled.Section>

            {/* Partialize */}
            <Styled.Section>
                <h3>Save only what matters (partialize)</h3>
                <p>Loading flags, errors, and UI-only toggles don’t belong in storage.</p>
                <pre className="good">{`export const useUsers = create(
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
);`}</pre>
                <p>If I change which keys I persist, I usually bump <code>version</code> so older payloads upgrade cleanly.</p>
            </Styled.Section>

            {/* Field rename & nested changes */}
            <Styled.Section>
                <h3>Field renames and nested shape changes</h3>
                <pre className="good">{`// v3: move cart.total -> totals.{subtotal,tax,total}
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
);`}</pre>
            </Styled.Section>

            {/* Rehydration flags */}
            <Styled.Section>
                <h3>Rehydration: knowing when storage is ready</h3>
                <pre className="good">{`export const usePrefs = create(
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
// if (!ready) return <Skeleton />;`}</pre>
            </Styled.Section>

            {/* Storage key rename */}
            <Styled.Section>
                <h3>If I must change the storage key</h3>
                <p>
                    Changing the <code>name</code> option creates a new key and the old data won’t be seen by
                    <code>migrate</code>. Two options I use:
                </p>
                <ol>
                    <li>Keep the same <code>name</code> and rely on <code>version + migrate</code> (preferred).</li>
                    <li>One-time manual copy on startup via <code>onRehydrateStorage</code> (read old key, write new, then clear old).</li>
                </ol>
                <pre className="note">{`onRehydrateStorage: () => () => {
  try {
    const old = localStorage.getItem('OLD_KEY');
    if (old) {
      const parsed = JSON.parse(old);
      // transform parsed if needed, then merge into current state:
      // set({ ...parsed });
      localStorage.removeItem('OLD_KEY');
    }
  } catch {}
}`}</pre>
            </Styled.Section>

            {/* Clearing & forcing */}
            <Styled.Section>
                <h3>Clearing & forcing rehydrate</h3>
                <pre className="note">{`// clear only this slice
await useCart.persist.clearStorage();

// re-run hydration after changing options
await useCart.persist.rehydrate();`}</pre>
            </Styled.Section>

            {/* Pitfalls */}
            <Styled.Section>
                <h3>Pitfalls I watch for</h3>
                <ul>
                    <li>Forgetting to bump <code>version</code> after schema changes.</li>
                    <li>Migrations that rely on browser APIs or throw — keep them pure and defensive.</li>
                    <li>Persisting giant blobs — move big data to IndexedDB/localForage.</li>
                    <li>Putting <code>loading/error</code> into storage — they should reset on refresh.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default PersistMigrations;
