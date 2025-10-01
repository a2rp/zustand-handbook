import React from "react";
import { Styled } from "./styled";

const ExamplePersistPartialize = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Persist (Partialization + Version)</Styled.Title>
            <Styled.Subtitle>
                Save only what matters, and evolve safely when your store shape changes.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Add <code>persist</code> to a store using <code>createJSONStorage</code>.</li>
                    <li>Persist only a subset of state with <code>partialize</code>.</li>
                    <li>Handle schema changes with <code>version</code> + <code>migrate()</code>.</li>
                    <li>Detect hydration to avoid “undefined flicker”.</li>
                    <li>Clear storage & reset state for logout flows.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Basic setup (persist + JSON storage)</h3>
                <pre className="good">{`// stores/app.js
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
);`}</pre>
                <p>
                    <b>Why <code>createJSONStorage</code>?</b> It makes serialization explicit and lets you switch
                    to another storage (e.g., <code>sessionStorage</code>) easily.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Persist only what you need (partialization)</h3>
                <p>
                    Don’t save everything — skip ephemeral UI and recomputable values. Persist just the
                    essentials (e.g., <code>auth</code> and <code>theme.mode</code>).
                </p>
                <pre className="good">{`export const useApp = create(
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
);`}</pre>
                <Styled.Callout>
                    Keep persisted state <b>small and stable</b>. Derive everything else on the fly.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Version & migrate when your shape changes</h3>
                <p>
                    If you rename keys or move data, bump <code>version</code> and write a <code>migrate</code> that
                    converts old saved data into the new shape.
                </p>
                <pre className="good">{`export const useApp = create(
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
);`}</pre>
                <Styled.Callout>
                    Migrations should be <b>pure and defensive</b>. Always handle missing fields from older versions.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Know when hydration is done (UX guard)</h3>
                <p>
                    On first render in the browser, <i>rehydration</i> pulls values from storage. Use
                    <code>onRehydrateStorage</code> to flip a flag so your UI can wait before reading persisted state.
                </p>
                <pre className="good">{`export const useApp = create(
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
);`}</pre>
                <pre className="note">{`// Component example
const hasHydrated = useApp((s) => s.hasHydrated);
if (!hasHydrated) return <Spinner />; // avoid flickers using persisted values`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) “Logout” flow — clear storage and reset</h3>
                <pre className="good">{`// Clear localStorage (for this store key) + reset in-memory state
async function logoutCompletely() {
  await useApp.persist.clearStorage(); // removes the 'app-store' key from localStorage
  useApp.getState().resetAll();        // reset to initial in memory
}`}</pre>
                <p>
                    Clearing storage alone won’t change in-memory state until next page load, so also call a
                    reset action to sync the UI immediately.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Pick a different storage (optional)</h3>
                <pre className="note">{`// Use sessionStorage instead of localStorage
storage: createJSONStorage(() => sessionStorage)`}</pre>
                <pre className="note">{`// Guard for SSR (Next.js): only access storage on the client
storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined))`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Common pitfalls</h3>
                <ul>
                    <li>
                        Persisting huge objects → slow loads & larger storage. <b>Fix:</b> use
                        <code>partialize</code>.
                    </li>
                    <li>
                        Persisting derived/transient values → drift. <b>Fix:</b> persist only source data.
                    </li>
                    <li>
                        Reading persisted values before hydration → <i>undefined flicker</i>. <b>Fix:</b> use a hydration flag.
                    </li>
                    <li>
                        Key collisions across stores. <b>Fix:</b> use unique <code>name</code> keys (e.g., <code>app-store</code>,
                        <code>ui-store</code>).
                    </li>
                    <li>
                        Non-JSON data (Date, Map) won’t survive round-trip. <b>Fix:</b> serialize to primitives or custom encode/decode.
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>8) Quick checklist</h3>
                <ul>
                    <li>Does it need to survive reload? → persist it. If not, keep it volatile.</li>
                    <li>Persist the minimum (auth, theme mode, user prefs).</li>
                    <li>Version + migrate when you change persisted shapes.</li>
                    <li>Expose a hydration flag and a full reset/logout path.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExamplePersistPartialize;
