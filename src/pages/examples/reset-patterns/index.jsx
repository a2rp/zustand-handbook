import React from "react";
import { Styled } from "./styled";

/**
 * Example: Reset Patterns
 * What I show:
 * - Slice reset (cart only)
 * - Full reset (replace entire store)
 * - Persist-friendly reset (clear storage + rehydrate)
 * - Logout-style reset that keeps some keys (e.g., theme)
 * - Local/per-component store reset via unmount
 */
const ExampleResetPatterns = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Reset Patterns</Styled.Title>
            <Styled.Subtitle>Practical ways I reset state in real apps.</Styled.Subtitle>

            {/* 1) Slice reset */}
            <Styled.Section>
                <h3>1) Reset a single slice</h3>
                <p>
                    I keep a tiny <code>initial</code> for each slice. To avoid reusing references,
                    I return a <b>fresh object</b> from a small factory function.
                </p>
                <pre className="good">{`// stores/app.js (cart slice only)
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
}));`}</pre>
                <Styled.Callout>
                    Returning a new object prevents “no-op” updates. If you reuse the same
                    reference, components selecting <code>cart</code> might not notice any change.
                </Styled.Callout>
            </Styled.Section>

            {/* 2) Full reset (replace) */}
            <Styled.Section>
                <h3>2) Reset the entire store (replace)</h3>
                <p>
                    For a clean slate, I keep a <code>rootInitial()</code> and use{" "}
                    <code>set(initial, true)</code> with <b>replace = true</b>. That discards keys not
                    in the initial object.
                </p>
                <pre className="good">{`// stores/app.js (full reset)
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
}));`}</pre>
                <pre className="note">{`// In a component (e.g., Settings page)
import { useApp } from '../stores/app';
<button onClick={() => useApp.getState().resetAll()}>Reset App</button>`}</pre>
            </Styled.Section>

            {/* 3) Persist-friendly reset */}
            <Styled.Section>
                <h3>3) Reset with <code>persist</code> (clear storage too)</h3>
                <p>
                    If I use <code>persist</code>, resetting state isn’t enough; the old value may
                    still be in storage. I clear storage then set the initial state.
                </p>
                <pre className="good">{`// stores/app.js with persist
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
}`}</pre>
                <Styled.Callout>
                    I only call <code>persist.clearStorage()</code> when I truly want a clean slate
                    (e.g., logout). Otherwise, a simple in-memory <code>resetAll()</code> is enough.
                </Styled.Callout>
            </Styled.Section>

            {/* 4) Logout that preserves some keys */}
            <Styled.Section>
                <h3>4) Logout reset that keeps some keys (e.g., theme)</h3>
                <p>
                    On logout, I usually keep user’s theme but clear sensitive data. I compute the
                    next state from the <i>current</i> state and replace everything.
                </p>
                <pre className="good">{`// stores/app.js
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
}));`}</pre>
            </Styled.Section>

            {/* 5) Local store = auto reset on unmount */}
            <Styled.Section>
                <h3>5) Local/per-component store resets on unmount</h3>
                <p>
                    For wizards/modals, I prefer a <b>store factory</b>. Each instance has its own
                    state; when the component unmounts, it’s gone — no explicit reset needed.
                </p>
                <pre className="good">{`// WizardStore.js
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
// Unmounting Wizard unmounts its store; state is naturally reset.`}</pre>
            </Styled.Section>

            {/* Pitfalls */}
            <Styled.Section>
                <h3>Pitfalls I watch for</h3>
                <ul>
                    <li>
                        Reusing the <code>same object</code> in a reset (no new reference) — some
                        selectors may not re-render. I return a fresh object for changed slices.
                    </li>
                    <li>
                        Forgetting to <code>clearStorage()</code> with <code>persist</code> when a true
                        wipe is required.
                    </li>
                    <li>
                        Mixing <b>merge</b> vs <b>replace</b>: <code>set(partial)</code> merges;{" "}
                        <code>set(state, true)</code> replaces the whole object.
                    </li>
                </ul>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Keep an <code>initial</code> for each slice (factory function is safest).</li>
                    <li>Use <code>replace=true</code> for clean full resets.</li>
                    <li>With <code>persist</code>, clear storage when needed, then rehydrate.</li>
                    <li>Prefer local store factories for modal/wizard flows; unmount = reset.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleResetPatterns;
