import React from "react";
import { Styled } from "./styled";

/**
 * Notes: Selectors & Equality — shallow & custom comparators
 * Goal: pick the right slice and the right comparison to avoid extra renders.
 */
const SelectorsEquality = () => {
    return (
        <Styled.Page>
            <Styled.Title>Selectors &amp; Equality — Quick Notes</Styled.Title>
            <Styled.Subtitle>How I pick slices and equality checks in real projects.</Styled.Subtitle>

            <Styled.Section>
                <h3>TL;DR</h3>
                <ul>
                    <li>Select the smallest value a component needs (prefer primitives).</li>
                    <li>When returning an object/array, pass <code>shallow</code>.</li>
                    <li>Do heavy/derived work with <code>useMemo</code> or inside the store once.</li>
                    <li>Custom equality is rare; use it only when you must.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Single value (best case)</h3>
                <pre className="good">{`// component.jsx
const count = useCounter((s) => s.count); // primitive → fast strict === check
const isDisabled = useCounter((s) => s.count > 10); // derived boolean is also primitive`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Multiple values (tuple) + shallow</h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

const [count, total] = useCart((s) => [s.count, s.total], shallow);
// Re-renders only if count OR total value changes (top-level === check).`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Object selection + shallow (readable for many fields)</h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

const view = useUser((s) => ({
  id: s.id,
  name: s.profile.name,
  plan: s.subscription.plan
}), shallow);`}</pre>
                <Styled.Callout>
                    Returning a new object each render is fine as long as you pass <code>shallow</code>.
                    Without it, every render would trigger an update due to a new reference.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Avoid identity traps</h3>
                <pre className="bad">{`// ❌ filtering/mapping in selector returns a fresh array → always re-renders
const visible = useTodos((s) => s.items.filter(t => !t.done));`}</pre>
                <pre className="good">{`// ✅ select inputs; derive with useMemo in the component
const items = useTodos((s) => s.items);
const visible = useMemo(() => items.filter(t => !t.done), [items]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Equality options (choose wisely)</h3>
                <ul>
                    <li><b>Default</b>: strict <code>===</code> — great for primitives.</li>
                    <li><b>shallow</b>: compares only top-level keys/indices of arrays/objects.</li>
                    <li><b>Custom</b>: supply your own comparator if you really need it.</li>
                </ul>
                <pre className="note">{`// Custom equality example (keep it cheap!)
const userView = useUser(
  (s) => ({ id: s.id, total: s.cart.total }),
  (a, b) => a.id === b.id && a.total === b.total
);`}</pre>
                <Styled.Callout>
                    Custom comparators run on every store change. Keep them very cheap or avoid them.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Selector helpers (reusable)</h3>
                <pre className="good">{`// helpers (pure functions)
export const selectTotals = (s) => {
  const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * s.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

// component.jsx
import { shallow } from 'zustand/shallow';
const totals = useCart(selectTotals, shallow);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Debugging re-renders (quick checks)</h3>
                <ul>
                    <li>Is the selector returning a new object/array each time? Add <code>shallow</code>.</li>
                    <li>Can you select a primitive instead? Split into multiple selectors.</li>
                    <li>Is there heavy work in the selector? Move to <code>useMemo</code> or store.</li>
                </ul>
                <pre className="note">{`// quick log to see rerenders
useEffect(() => { console.log('render <CartTotals/>'); });`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Cheat-sheet</h3>
                <ul>
                    <li>Primitive? → no equality fn needed.</li>
                    <li>Tuple/object? → pass <code>shallow</code>.</li>
                    <li>Filtered/mapped list? → select source, compute with <code>useMemo</code>.</li>
                    <li>Expensive & reused derived value? → compute once in the store or a selector helper.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default SelectorsEquality;
