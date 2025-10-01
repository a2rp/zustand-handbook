import React from "react";
import { Styled } from "./styled";

const MultiStores = () => {
    return (
        <Styled.Page>
            <Styled.Title>Multi-stores — Boundaries & Coupling</Styled.Title>
            <Styled.Subtitle>
                How I split state by feature, keep boundaries clean, and make stores talk without tangling them.
            </Styled.Subtitle>

            {/* Why multiple stores */}
            <Styled.Section>
                <h3>When I use multiple stores</h3>
                <ul>
                    <li>Features are independent (auth, cart, ui, notifications).</li>
                    <li>Teams own different areas and ship at different speeds.</li>
                    <li>I want smaller bundles (code-split a feature + its store).</li>
                </ul>
            </Styled.Section>

            {/* Simple layout */}
            <Styled.Section>
                <h3>Typical layout I use</h3>
                <pre className="good">{`src/
  stores/
    auth.js       // user, login/logout
    cart.js       // items, add/remove/clear
    ui.js         // theme, sidebar, toasts
  features/
    auth/...
    cart/...
    ...`}</pre>
            </Styled.Section>

            {/* Example stores */}
            <Styled.Section>
                <h3>Example stores (small & focused)</h3>
                <pre className="good">{`// stores/auth.js
import { create } from 'zustand';
export const useAuth = create((set) => ({
  user: null,
  login: (user) => set({ user }, false, 'auth/login'),
  logout: () => set({ user: null }, false, 'auth/logout'),
}));

// stores/cart.js
import { create } from 'zustand';
export const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
  clear: () => set({ items: [] }, false, 'cart/clear'),
}));`}</pre>
            </Styled.Section>

            {/* Using many stores in a component */}
            <Styled.Section>
                <h3>Using more than one store in a component</h3>
                <p>I subscribe narrowly to each store. Each selector re-renders independently.</p>
                <pre className="note">{`// CartHeader.jsx
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

const user = useAuth((s) => s.user);
const count = useCart((s) => s.items.length);

return <p>{user ? 'Hi ' + user.name : 'Guest'} · Items: {count}</p>;`}</pre>
            </Styled.Section>

            {/* Cross-store reads (safe pattern) */}
            <Styled.Section>
                <h3>Cross-store reads (safe pattern)</h3>
                <p>
                    If I need a one-off read, I use the store’s <code>.getState()</code> method.
                    I avoid keeping references; I read, use, and move on.
                </p>
                <pre className="note">{`// services/checkout.js
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

export async function checkout() {
  const { user } = useAuth.getState();    // one-off read
  const { items } = useCart.getState();
  if (!user) throw new Error('Login required');
  // ... call API with { userId: user.id, items }
}`}</pre>
            </Styled.Section>

            {/* Cross-store writes: orchestrator vs direct coupling */}
            <Styled.Section>
                <h3>Cross-store writes: avoid tight coupling</h3>
                <ul>
                    <li><b>Don’t</b> call one store’s action directly from inside another store’s factory.</li>
                    <li><b>Do</b> orchestrate from a small <i>service</i> function or a top-level effect.</li>
                </ul>
                <pre className="bad">{`// ❌ inside auth store — creates a hard dependency on cart
logout: () => { useCart.getState().clear(); set({ user: null }) }`}</pre>
                <pre className="good">{`// ✅ orchestrate in a service where dependencies are explicit
export function logoutFlow() {
  useCart.getState().clear();
  useAuth.getState().logout();
}`}</pre>
            </Styled.Section>

            {/* Reacting to changes via subscribe */}
            <Styled.Section>
                <h3>Reacting to changes with <code>subscribe</code></h3>
                <p>
                    Sometimes I want an automatic reaction (e.g., clear cart when user logs out).
                    I set up a subscription once during app bootstrap.
                </p>
                <pre className="good">{`// AppBootstrap.jsx (run once)
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

useEffect(() => {
  const unsubscribe = useAuth.subscribe(
    (s) => s.user,                    // selector
    (user, prev) => {
      if (!user && prev) useCart.getState().clear(); // user just logged out
    }
  );
  return unsubscribe;
}, []);`}</pre>
                <Styled.Callout>
                    Subscriptions live outside React render. Remember to unsubscribe. Keep logic small.
                </Styled.Callout>
            </Styled.Section>

            {/* Derived across stores */}
            <Styled.Section>
                <h3>Derived values across stores</h3>
                <p>
                    I derive in the component (with <code>useMemo</code>) when it combines data from
                    multiple stores. No extra coupling and easy to test.
                </p>
                <pre className="note">{`const user = useAuth((s) => s.user);
const items = useCart((s) => s.items);
const summary = useMemo(() => ({
  userName: user?.name ?? 'Guest',
  totalItems: items.length
}), [user, items]);`}</pre>
            </Styled.Section>

            {/* Persist and devtools notes */}
            <Styled.Section>
                <h3>Persist & devtools per store</h3>
                <ul>
                    <li>Each store can opt-in to <code>persist</code> with its own storage key.</li>
                    <li>I name actions as <code>slice/action</code> so devtools stays readable.</li>
                </ul>
                <pre className="note">{`// with persist (sketch)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useCart = create(persist(
  (set) => ({ items: [], add: (it) => set((s) => ({ items: [...s.items, it] })) }),
  { name: 'cart-v1' }  // unique key
));`}</pre>
            </Styled.Section>

            {/* Guardrails */}
            <Styled.Section>
                <h3>Guardrails I follow</h3>
                <ul>
                    <li>No circular imports between stores.</li>
                    <li>Stores expose actions; coordination happens in a tiny service/effect.</li>
                    <li>Components subscribe narrowly; avoid “select entire store”.</li>
                    <li>Prefer deriving in components when mixing data from multiple stores.</li>
                </ul>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Split by feature; keep each store small.</li>
                    <li>Orchestrate cross-store flows in services/effects, not inside store factories.</li>
                    <li>Use <code>subscribe</code> for simple reactions; remember to unsubscribe.</li>
                    <li>Persist per store with unique keys and plan migrations.</li>
                    <li>Name actions like <code>auth/login</code>, <code>cart/add</code> for devtools.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default MultiStores;
