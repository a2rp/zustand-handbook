import{d as s,j as e}from"./index-Gt8sd0pi.js";const o="var(--card, #111)",r="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",a="var(--border, #222)",l="var(--accent, #22c55e)",n="var(--danger, #ef4444)",c="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${r};
        border: 1px solid ${a};
        border-radius: ${c};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${i};
    `,Section:s.section`
        border-top: 1px dashed ${a};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${a};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        pre.good,
        pre.bad,
        pre.note {
            white-space: pre-wrap;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
            border-radius: 10px;
            padding: 12px 14px;
            margin: 8px 0 12px 0;
            border: 1px dashed ${a};
            background: rgba(255, 255, 255, 0.04);
        }

        pre.good {
            border: 1px solid ${l};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${n};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${a};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},p=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Cart Totals (Derived vs Stored)"}),e.jsxs(t.Subtitle,{children:["Totals are often ",e.jsx("i",{children:"derived"})," from items + tax. Sometimes it’s worth",e.jsx("i",{children:"storing"})," totals. Here’s how I decide and implement both."]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Deriving totals in a component with ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsx("li",{children:"Storing totals in the store and keeping a single source of truth."}),e.jsx("li",{children:"Where equality and selectors help with re-renders."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"A) Derive totals in the component (default, simple & cheap)"}),e.jsx(t.Callout,{children:"I start here. If it’s cheap to compute, don’t store it. Avoids duplicate sources of truth."}),e.jsx("pre",{className:"good",children:`// stores/cart.js
import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],               // [{ id, title, price, qty }]
  taxRate: 0.1,            // 10%

  add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
  remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) }), false, 'cart/remove'),
  setQty: (id, qty) =>
    set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, qty } : i) }), false, 'cart/setQty'),
  setTax: (rate) => set({ taxRate: rate }, false, 'cart/setTax'),
}));`}),e.jsx("pre",{className:"good",children:`// CartSummary.jsx (derive with useMemo)
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
}`}),e.jsx(t.Callout,{children:"Works great for small/medium carts. Components stay in control, store stays lean."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"B) Store totals in the state (when it’s worth it)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Computation is expensive and used in many places."}),e.jsx("li",{children:"Totals must be persisted/synced with a server."}),e.jsx("li",{children:"Several actions inside the store depend on totals immediately."})]}),e.jsx("pre",{className:"good",children:`// stores/cart.js (store totals + keep them in sync)
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
}));`}),e.jsx("pre",{className:"note",children:`// CartSummary.jsx (just read totals)
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
}`}),e.jsxs(t.Callout,{children:["If you store totals, every action that affects ",e.jsx("code",{children:"items"})," or ",e.jsx("code",{children:"taxRate"})," must call"," ",e.jsx("code",{children:"recalcTotals()"}),". This keeps a single source of truth."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Keeping it DRY"}),e.jsx("p",{children:"Wrap mutations so totals are always recalculated without repeating yourself."}),e.jsx("pre",{className:"note",children:`// inside create((set, get) => ({ ... }))
const applyAndRecalc = (updater, action) => {
  set(updater, false, action);
  get().recalcTotals();
};
// usage:
add: (it) => applyAndRecalc((s) => ({ items: [...s.items, it] }), 'cart/add')`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Pitfalls (and fixes)"}),e.jsx("pre",{className:"bad",children:`// ❌ Two sources of truth: both 'totals' and 'items' change but totals not updated
set((s) => ({ items: s.items.concat(newItem) }), false, 'cart/add');
// forgot to call recalcTotals()`}),e.jsx("pre",{className:"good",children:`// ✅ Always recalc right after mutations
set((s) => ({ items: s.items.concat(newItem) }), false, 'cart/add');
get().recalcTotals();`}),e.jsx("pre",{className:"bad",children:`// ❌ Heavy compute in selector → runs on unrelated changes
const totals = useCart((s) => expensiveTotalsCompute(s.items, s.taxRate));`}),e.jsx("pre",{className:"good",children:`// ✅ Either compute in component with useMemo (derived approach)
// or compute once in an action and store the result (stored approach)`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Performance notes"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Select the smallest inputs you need; for multiple values use tuples + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"When storing totals, avoid rebuilding big arrays/objects unnecessarily."}),e.jsxs("li",{children:["If nested updates get clumsy, consider ",e.jsx("code",{children:"immer"})," middleware later."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Cheap to compute? → derive in component with ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsxs("li",{children:["Expensive or widely reused/persisted? → store totals + ",e.jsx("code",{children:"recalcTotals()"}),"."]}),e.jsx("li",{children:"Keep a single source of truth; never leave derived copies stale."}),e.jsxs("li",{children:["Name actions like ",e.jsx("code",{children:"cart/add"})," for clean devtools traces."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Try this"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add discount codes and compute ",e.jsx("code",{children:"discount"})," in the same totals pass."]}),e.jsx("li",{children:"Split taxes (CGST/SGST) and show both values in the summary."}),e.jsxs("li",{children:["Persist ",e.jsx("code",{children:"items"})," + ",e.jsx("code",{children:"taxRate"})," (not ",e.jsx("code",{children:"totals"}),") and recompute on load."]})]})]})]});export{p as default};
