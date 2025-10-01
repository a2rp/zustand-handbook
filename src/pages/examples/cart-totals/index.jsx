import React from "react";
import { Styled } from "./styled";

/**
 * Example: Cart Totals (Derived vs Stored)
 * Goal: learn when to compute totals on the fly vs store them in the state.
 * Style: notes + copy-paste sketches (not live).
 */
const ExampleCartTotals = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Cart Totals (Derived vs Stored)</Styled.Title>
            <Styled.Subtitle>
                Totals are often <i>derived</i> from items + tax. Sometimes it’s worth
                <i>storing</i> totals. Here’s how I decide and implement both.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Deriving totals in a component with <code>useMemo</code>.</li>
                    <li>Storing totals in the store and keeping a single source of truth.</li>
                    <li>Where equality and selectors help with re-renders.</li>
                </ul>
            </Styled.Section>

            {/* A) Derive totals on the fly */}
            <Styled.Section>
                <h3>A) Derive totals in the component (default, simple &amp; cheap)</h3>
                <Styled.Callout>
                    I start here. If it’s cheap to compute, don’t store it. Avoids duplicate sources of truth.
                </Styled.Callout>
                <pre className="good">{`// stores/cart.js
import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],               // [{ id, title, price, qty }]
  taxRate: 0.1,            // 10%

  add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
  remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) }), false, 'cart/remove'),
  setQty: (id, qty) =>
    set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, qty } : i) }), false, 'cart/setQty'),
  setTax: (rate) => set({ taxRate: rate }, false, 'cart/setTax'),
}));`}</pre>

                <pre className="good">{`// CartSummary.jsx (derive with useMemo)
import React, { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { useCart } from '../stores/cart';

export default function CartSummary() {
  // select only inputs needed (tuple + shallow)
  const [items, taxRate] = useCart((s) => [s.items, s.taxRate], shallow);

  const totals = useMemo(() => {
    const subtotal = items.reduce((n, it) => n + it.qty * it.price, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items, taxRate]);

  return (
    <div>
      <p>Subtotal: {totals.subtotal.toFixed(2)}</p>
      <p>Tax: {totals.tax.toFixed(2)}</p>
      <p><b>Total: {totals.total.toFixed(2)}</b></p>
    </div>
  );
}`}</pre>

                <Styled.Callout>
                    Works great for small/medium carts. Components stay in control, store stays lean.
                </Styled.Callout>
            </Styled.Section>

            {/* B) Store totals in state */}
            <Styled.Section>
                <h3>B) Store totals in the state (when it’s worth it)</h3>
                <ul>
                    <li>Computation is expensive and used in many places.</li>
                    <li>Totals must be persisted/synced with a server.</li>
                    <li>Several actions inside the store depend on totals immediately.</li>
                </ul>
                <pre className="good">{`// stores/cart.js (store totals + keep them in sync)
import { create } from 'zustand';

const initial = {
  items: [],
  taxRate: 0.1,
  totals: { subtotal: 0, tax: 0, total: 0 },
};

export const useCart = create((set, get) => ({
  ...initial,

  recalcTotals: () => {
    const { items, taxRate } = get();
    // fast loop to avoid needless allocations
    let subtotal = 0;
    for (const it of items) subtotal += it.qty * it.price;
    const tax = subtotal * taxRate;
    set({ totals: { subtotal, tax, total: subtotal + tax } }, false, 'cart/recalcTotals');
  },

  add: (it) => {
    set((s) => ({ items: [...s.items, it] }), false, 'cart/add');
    get().recalcTotals();
  },
  remove: (id) => {
    set((s) => ({ items: s.items.filter(i => i.id !== id) }), false, 'cart/remove');
    get().recalcTotals();
  },
  setQty: (id, qty) => {
    set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, qty } : i) }), false, 'cart/setQty');
    get().recalcTotals();
  },
  setTax: (rate) => {
    set({ taxRate: rate }, false, 'cart/setTax');
    get().recalcTotals();
  },

  reset: () => set(initial, false, 'cart/reset'),
}));`}</pre>

                <pre className="note">{`// CartSummary.jsx (just read totals)
import { useCart } from '../stores/cart';
export default function CartSummary() {
  const totals = useCart((s) => s.totals);
  return (
    <>
      <p>Subtotal: {totals.subtotal.toFixed(2)}</p>
      <p>Tax: {totals.tax.toFixed(2)}</p>
      <p><b>Total: {totals.total.toFixed(2)}</b></p>
    </>
  );
}`}</pre>

                <Styled.Callout>
                    If you store totals, every action that affects <code>items</code> or <code>taxRate</code> must call{" "}
                    <code>recalcTotals()</code>. This keeps a single source of truth.
                </Styled.Callout>
            </Styled.Section>

            {/* DRY helper */}
            <Styled.Section>
                <h3>Keeping it DRY</h3>
                <p>Wrap mutations so totals are always recalculated without repeating yourself.</p>
                <pre className="note">{`// inside create((set, get) => ({ ... }))
const applyAndRecalc = (updater, action) => {
  set(updater, false, action);
  get().recalcTotals();
};
// usage:
add: (it) => applyAndRecalc((s) => ({ items: [...s.items, it] }), 'cart/add')`}</pre>
            </Styled.Section>

            {/* Pitfalls */}
            <Styled.Section>
                <h3>Pitfalls (and fixes)</h3>
                <pre className="bad">{`// ❌ Two sources of truth: both 'totals' and 'items' change but totals not updated
set((s) => ({ items: s.items.concat(newItem) }), false, 'cart/add');
// forgot to call recalcTotals()`}</pre>
                <pre className="good">{`// ✅ Always recalc right after mutations
set((s) => ({ items: s.items.concat(newItem) }), false, 'cart/add');
get().recalcTotals();`}</pre>

                <pre className="bad">{`// ❌ Heavy compute in selector → runs on unrelated changes
const totals = useCart((s) => expensiveTotalsCompute(s.items, s.taxRate));`}</pre>
                <pre className="good">{`// ✅ Either compute in component with useMemo (derived approach)
// or compute once in an action and store the result (stored approach)`}</pre>
            </Styled.Section>

            {/* Perf notes */}
            <Styled.Section>
                <h3>Performance notes</h3>
                <ul>
                    <li>Select the smallest inputs you need; for multiple values use tuples + <code>shallow</code>.</li>
                    <li>When storing totals, avoid rebuilding big arrays/objects unnecessarily.</li>
                    <li>If nested updates get clumsy, consider <code>immer</code> middleware later.</li>
                </ul>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Cheap to compute? → derive in component with <code>useMemo</code>.</li>
                    <li>Expensive or widely reused/persisted? → store totals + <code>recalcTotals()</code>.</li>
                    <li>Keep a single source of truth; never leave derived copies stale.</li>
                    <li>Name actions like <code>cart/add</code> for clean devtools traces.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Try this</h3>
                <ul>
                    <li>Add discount codes and compute <code>discount</code> in the same totals pass.</li>
                    <li>Split taxes (CGST/SGST) and show both values in the summary.</li>
                    <li>Persist <code>items</code> + <code>taxRate</code> (not <code>totals</code>) and recompute on load.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleCartTotals;
