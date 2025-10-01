import React from "react";
import { Styled } from "./styled";

const DerivedState = () => {
    return (
        <Styled.Page>
            <Styled.Title>Derived State — Computed Values</Styled.Title>
            <Styled.Subtitle>Compute what you can, store what you must.</Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>When I compute a value vs when I store it.</li>
                    <li>Deriving in the component with <code>useMemo</code>.</li>
                    <li>Selector helpers I reuse across files.</li>
                    <li>Identity traps with arrays/objects and how I avoid them.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>My golden rule</h3>
                <Styled.Callout>
                    I don’t store anything that can be cheaply derived from existing state.
                    Two sources of truth go out of sync easily.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Derive in the component (fast & local)</h3>
                <p>Perfect for quick math, sums, and flags that depend on a few fields.</p>
                <pre className="good">{`// cart store exposes raw inputs
const [items, taxRate] = useCart((s) => [s.items, s.taxRate], shallow);

const totals = useMemo(() => {
  const subtotal = items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * taxRate;
  return { subtotal, tax, total: subtotal + tax };
}, [items, taxRate]);`}</pre>
                <p>Components re-render only when <code>items</code> or <code>taxRate</code> actually change.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Selector helpers I reuse (shareable)</h3>
                <pre className="good">{`// selectors/cart.js
export const selectItems = (s) => s.items;
export const selectTotals = (s) => {
  const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * s.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

// in a component
import { shallow } from 'zustand/shallow';
import { selectTotals } from '../selectors/cart';

const totals = useCart(selectTotals, shallow);`}</pre>
                <p>
                    When a helper returns an object, I pair it with <code>shallow</code> so equal values don’t
                    re-render just because a new object reference was created.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Identity traps I avoid</h3>
                <pre className="bad">{`// fresh array every time -> causes re-renders
const filtered = useStore((s) => s.items.filter(Boolean));`}</pre>
                <pre className="good">{`// select the input, derive with useMemo
const items = useStore((s) => s.items);
const filtered = useMemo(() => items.filter(Boolean), [items]);`}</pre>

                <pre className="bad">{`// sorting inside the selector -> new reference on each render
const sorted = useStore((s) => [...s.items].sort(byPrice));`}</pre>
                <pre className="good">{`// sort after selecting
const items = useStore((s) => s.items);
const sorted = useMemo(() => [...items].sort(byPrice), [items]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>When I actually store a derived value</h3>
                <ul>
                    <li>The computation is expensive and used in many places.</li>
                    <li>I need to persist or sync the computed output.</li>
                    <li>Multiple store actions depend on it internally.</li>
                </ul>
                <pre className="good">{`// inside create((set, get) => ({ ... }))
recalcTotals: () => {
  const { items, taxRate } = get();
  let subtotal = 0;
  for (const it of items) subtotal += it.qty * it.price;
  const tax = subtotal * taxRate;
  set({ totals: { subtotal, tax, total: subtotal + tax } }, false, 'cart/recalcTotals');
},`}</pre>
                <Styled.Callout>
                    If I store it, I make sure every mutation of <code>items</code> or <code>taxRate</code> also updates
                    <code> totals</code> in the same action path. One owner of truth.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Formatting is also “derived”</h3>
                <p>
                    Currency strings, date labels, and UI-only text stay outside the store. I compute
                    them in components or selectors so the store holds raw data only.
                </p>
                <pre className="good">{`const total = totals.total; // number in store
const label = useMemo(() => total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), [total]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Cheap to recompute? → derive in component or selector.</li>
                    <li>Expensive or reused everywhere? → consider a store action to compute once.</li>
                    <li>Never persist a value you can rebuild from inputs unless you must.</li>
                    <li>When returning objects/arrays, use <code>shallow</code>.</li>
                    <li>Memoize sorts/filters/maps; avoid doing them inside the selector.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default DerivedState;
