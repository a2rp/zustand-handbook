import React from "react";
import { Styled } from "./styled";

/**
 * Example: Devtools Action Patterns
 * Goal: clean action names, grouped updates, thunk naming, layering with persist.
 * Notes only (non-live) you can copy into your app.
 */
const ExampleDevtoolsActions = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Devtools Action Patterns</Styled.Title>
            <Styled.Subtitle>How I name actions and structure updates for clear traces.</Styled.Subtitle>

            <Styled.Section>
                <h3>1) Basic setup with devtools</h3>
                <pre className="good">{`import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCart = create(
  devtools(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((it) => it.id !== id) }), false, 'cart/remove'),
      clear: () => set({ items: [] }, false, 'cart/clear'),
    }),
    { name: 'cart', enabled: true, trace: true } // trace shows stack (dev only)
  )
);`}</pre>
                <ul>
                    <li><b>Action name:</b> third arg to <code>set</code> → <code>'slice/action'</code>.</li>
                    <li><b><code>trace</code></b> is handy while debugging; turn it off for production.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Naming scheme I use</h3>
                <ul>
                    <li><b>Format:</b> <code>slice/action</code> (e.g., <code>auth/login</code>, <code>cart/add</code>, <code>ui/toggleSidebar</code>).</li>
                    <li><b>Tense:</b> present (<i>add</i>, <i>toggle</i>, <i>fetch</i>).</li>
                    <li><b>Async:</b> <code>slice/fetchStart</code>, <code>slice/fetchSuccess</code>, <code>slice/fetchError</code>.</li>
                </ul>
                <pre className="good">{`// Good examples
set({ open: true }, false, 'ui/open');
set((s) => ({ count: s.count + 1 }), false, 'counter/increment');
set({ loading: true, error: null }, false, 'users/fetchStart');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Group related updates into a single action</h3>
                <p>One <code>set()</code> → one devtools entry. Group related fields to keep the trace clean.</p>
                <pre className="good">{`checkoutSuccess: (order) =>
  set((s) => ({
    items: [],
    lastOrder: order,
    ui: { ...s.ui, toast: { type: 'success', msg: 'Order placed!' } },
  }), false, 'checkout/success');`}</pre>
                <pre className="bad">{`// Multiple set() calls = noisy timeline
set({ items: [] }, false, 'checkout/clearItems');
set({ lastOrder: order }, false, 'checkout/setLastOrder');
set((s) => ({ ui: { ...s.ui, toast: {...} } }), false, 'ui/toast');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Thunks with start/success/error names</h3>
                <pre className="good">{`placeOrder: async () => {
  set({ loading: true, error: null }, false, 'checkout/start');
  try {
    const order = await api.placeOrder(get().items);
    set({ loading: false, lastOrder: order, items: [] }, false, 'checkout/success');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'checkout/error');
  }
}`}</pre>
                <p>Consistent naming makes the DevTools timeline read like a story.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Layering with persist</h3>
                <p>Devtools + persist together (I wrap <code>persist</code> inside <code>devtools</code>).</p>
                <pre className="good">{`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useApp = create(
  devtools(
    persist(
      (set, get) => ({
        auth: { user: null },
        theme: { mode: 'dark' },
        login: (user) => set({ auth: { user } }, false, 'auth/login'),
        toggleTheme: () => set((s) => ({
          theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' }
        }), false, 'theme/toggle'),
      }),
      {
        name: 'app-storage',                     // storage key
        partialize: (s) => ({ auth: s.auth, theme: s.theme }),
        version: 1,
        // migrate: (persisted, ver) => persisted, // add when you change shapes
      }
    ),
    { name: 'app', trace: true }
  )
);`}</pre>
                <ul>
                    <li><b><code>name</code> in persist:</b> storage key; <b><code>name</code> in devtools:</b> monitor label.</li>
                    <li>When state shape changes, bump <code>version</code> and add a <code>migrate</code> function.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Trace tips & performance</h3>
                <ul>
                    <li><code>trace: true</code> captures stacks; useful during debugging only.</li>
                    <li>Group updates to reduce devtools noise and component re-renders.</li>
                    <li>Name important actions; minor UI flips can be anonymous if you prefer less noise.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Quick testing trick</h3>
                <pre className="note">{`// In tests or REPL:
import { useCart } from './stores/cart';
useCart.getState().add({ id: 1, title: 'Pen' });
useCart.getState().remove(1);
useCart.setState({ items: [] }); // force state`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleDevtoolsActions;
