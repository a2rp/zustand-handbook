import React from "react";
import { Styled } from "./styled";

const PersistChecklist = () => {
    return (
        <Styled.Page>
            <Styled.Title>Persist Checklist — Migrations & Storage</Styled.Title>
            <Styled.Subtitle>
                Everything I tick through before turning on persistence in a store.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>Quick start (minimal, safe defaults)</h3>
                <pre className="good">{`import { create } from 'zustand';
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
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Before I enable persist</h3>
                <ul>
                    <li>Pick a stable <code>name</code> key (e.g., <code>todos-v1</code>).</li>
                    <li>Decide which fields truly need saving → set <code>partialize</code>.</li>
                    <li>Plan a <b>version number</b> and a <b>migrate</b> function for future changes.</li>
                    <li>Confirm storage choice: <code>localStorage</code> (default), <code>sessionStorage</code>, or IndexedDB via a custom driver.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>When I change state shape → migrations</h3>
                <p>I bump <code>version</code> and write a tiny <code>migrate</code> to transform old data.</p>
                <pre className="good">{`export const useCart = create(
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
);`}</pre>
                <pre className="note">{`Tips:
- Migrations should be idempotent and small.
- Keep defaults if a field is missing (defensive coding).
- Test migration with sample old payloads.`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Hydration lifecycle (showing a loader, handling errors)</h3>
                <p>I tap <code>onRehydrateStorage</code> to set flags around hydration.</p>
                <pre className="good">{`export const useProfile = create(
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
if (!ready) return <Spinner />;`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>What I usually persist (and what I don't)</h3>
                <ul>
                    <li>✅ User preferences (theme, layout, filters)</li>
                    <li>✅ Non-sensitive app state (cart, drafts)</li>
                    <li>❌ Highly volatile caches (recompute or refetch)</li>
                    <li>❌ Secrets/tokens (use HTTP-only cookies or secure storage)</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Storage choices</h3>
                <ul>
                    <li><b>localStorage</b> — simple, sync, 5–10MB, string-only (JSON serialize).</li>
                    <li><b>sessionStorage</b> — clears on tab close.</li>
                    <li><b>IndexedDB</b> — larger, async. Use a tiny wrapper that exposes <code>getItem</code>/<code>setItem</code>/<code>removeItem</code>.</li>
                </ul>
                <pre className="note">{`// Custom storage (sketch). Must implement getItem/setItem/removeItem
const myStorage = {
  getItem: async (key) => (await idb.get('store', key)) ?? null,
  setItem: async (key, value) => { await idb.set('store', key, value); },
  removeItem: async (key) => { await idb.del('store', key); },
};

// use it:
storage: createJSONStorage(() => myStorage)`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Selective persist (partialize)</h3>
                <p>I keep the saved payload tight to avoid bloat and accidental leaks.</p>
                <pre className="good">{`partialize: (state) => ({
  // only what I need at boot
  theme: state.theme,
  sidebar: state.ui.sidebar,
  // skip huge lists or ephemeral flags
})`}</pre>
                <pre className="bad">{`// ❌ persisting the whole store
partialize: (s) => s // leads to large payloads & brittle migrations`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Cross-tab behavior</h3>
                <ul>
                    <li>localStorage emits a <code>storage</code> event in other tabs when a key changes.</li>
                    <li>Persist will rehydrate on load; if you need live cross-tab sync, listen to <code>storage</code> and refresh slices appropriately.</li>
                </ul>
                <pre className="note">{`// Optional: react to changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'todos-v1') {
    // e.newValue has the JSON string; you can trigger a manual refresh if needed.
  }
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Testing checklist</h3>
                <ul>
                    <li>Mock storage in tests; start with a clean slate per test.</li>
                    <li>Assert that migrations transform old payloads correctly.</li>
                    <li>Verify that only the intended fields are saved (via <code>partialize</code>).</li>
                    <li>Simulate rehydrate and check the UI waits for <code>ready</code>.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Common pitfalls</h3>
                <ul>
                    <li>Saving the entire store (payload explodes, migrations become risky).</li>
                    <li>Changing shape without bumping <code>version</code> + <code>migrate</code>.</li>
                    <li>Persisting secrets or very large arrays.</li>
                    <li>Assuming hydration is instant — guard early renders with a ready flag when needed.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default PersistChecklist;
