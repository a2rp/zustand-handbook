import React from "react";
import { Styled } from "./styled";

const Selectors = () => {
    return (
        <Styled.Page>
            <Styled.Title>Selectors — Slices & Equality</Styled.Title>
            <Styled.Subtitle>Subscribe to only what a component needs, nothing more.</Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>How I pick the right slice for a component.</li>
                    <li>When to use tuples/objects with <code>shallow</code>.</li>
                    <li>Identity traps (fresh objects/arrays) and simple fixes.</li>
                    <li>Selector helpers I reuse across components.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>My one-line rule</h3>
                <p>
                    <b>Select the smallest value that lets the component render correctly.</b>
                    Smaller slice ⇒ fewer re-renders ⇒ simpler components.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Pick a single primitive when possible</h3>
                <pre className="good">{`// Counter.jsx
const count = useCounter((s) => s.count);     // primitive -> cheap and clean
// render with {count}`}</pre>
                <p>With primitives (number/string/boolean) you usually don’t need any custom equality.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Need multiple values? Tuple or object + <code>shallow</code></h3>
                <pre className="good">{`// Tuple pattern (compact)
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter(
  (s) => [s.count, s.count > 10],
  shallow
);`}</pre>
                <pre className="good">{`// Object pattern (more readable with many fields)
import { shallow } from 'zustand/shallow';
const view = useCounter(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
);`}</pre>
                <p>
                    <code>shallow</code> avoids re-rendering when the top-level values haven’t changed,
                    even if a new object/array reference is created.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Identity traps I avoid</h3>
                <pre className="bad">{`// fresh array every time -> will re-render often
const filtered = useStore((s) => s.items.filter(Boolean));`}</pre>
                <pre className="good">{`// select input, derive with useMemo inside the component
const items = useStore((s) => s.items);
const filtered = useMemo(() => items.filter(Boolean), [items]);`}</pre>

                <pre className="bad">{`// selecting the whole store -> too many re-renders
const all = useStore((s) => s);`}</pre>
                <pre className="good">{`// select narrowly
const theme = useStore((s) => s.theme.mode);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Selector helpers I reuse</h3>
                <pre className="good">{`// helpers (pure functions)
export const selectUser = (s) => s.auth.user;
export const selectTotals = (s) => {
  const subtotal = s.items.reduce((n, it) => n + it.qty * it.price, 0);
  const tax = subtotal * s.taxRate;
  return { subtotal, tax, total: subtotal + tax };
};

// usage
const user   = useApp(selectUser);
const totals = useCart(selectTotals, shallow);`}</pre>
                <p>
                    Helpers keep components tidy and make it easy to audit who depends on what.
                    When helpers return objects, I pair them with <code>shallow</code>.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Custom equality (rarely needed)</h3>
                <pre className="note">{`// Only when shallow isn't enough and data is tiny
const person = usePeople(
  (s) => s.selected,
  (a, b) => a?.id === b?.id && a?.name === b?.name
);`}</pre>
                <p>
                    Most of the time, primitives or <code>shallow</code> are enough. I keep custom
                    comparators for tiny objects that truly need it.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Primitive available? Select that.</li>
                    <li>Multiple values? Tuple/object + <code>shallow</code>.</li>
                    <li>Heavy work in selector? Move to <code>useMemo</code> or a helper.</li>
                    <li>Seeing extra renders? Check for fresh objects/arrays.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default Selectors;
