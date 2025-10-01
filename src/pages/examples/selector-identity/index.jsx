import React from "react";
import { Styled } from "./styled";

const ExampleSelectorIdentity = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Selector Identity (Trap & Fixes)</Styled.Title>
            <Styled.Subtitle>
                Why returning fresh objects/arrays from a selector causes extra re-renders, and how I avoid it.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Default equality is <code>===</code> on the selector’s return value.</li>
                    <li>New object/array references → React treats it as “changed” → re-render.</li>
                    <li>Use primitives, stable refs, tuples/objects with <code>shallow</code>, or derive in the component.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>The trap</h3>
                <p>
                    If a selector returns a fresh object/array each render, React will re-render even if the
                    <i>data</i> didn’t semantically change—because the <b>reference</b> is different.
                </p>
                <pre className="bad">{`// ❌ Fresh object every time (new reference)
const view = useStore((s) => ({ count: s.count })); // re-renders on any store change

// ❌ Fresh array every time (new reference)
const list = useStore((s) => s.items.filter(it => it.done));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #1 — Select primitives or stable references</h3>
                <p>Subscribing to primitives is the safest and cheapest option.</p>
                <pre className="good">{`// ✅ Select primitives
const count = useStore((s) => s.count);

// ✅ Select stable reference (if the store doesn't recreate it unnecessarily)
const items = useStore((s) => s.items);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #2 — Return a tuple/object + <code>shallow</code></h3>
                <p>
                    When you need multiple primitives or stable references, return them together and compare
                    shallowly so React re-renders only when a member actually changes.
                </p>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

// ✅ Tuple + shallow (fast & compact)
const [count, total] = useStore((s) => [s.count, s.total], shallow);

// ✅ Object + shallow (more readable for many fields)
const view = useStore(
  (s) => ({ count: s.count, disabled: s.count > 10 }),
  shallow
);`}</pre>
                <Styled.Callout>
                    <b>Note:</b> <code>shallow</code> compares top-level keys (or tuple entries) with
                    <code>===</code>. It doesn’t “fix” nested identity churn (e.g., a new array each render).
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #3 — Derive in the component with <code>useMemo</code></h3>
                <p>
                    For computed arrays/objects like <code>filter</code>, select the raw inputs and derive locally.
                </p>
                <pre className="good">{`// Store shape (sketch)
const useTodos = create(() => ({ items: [] }));

// Component
const items = useTodos((s) => s.items);           // stable ref from store
const done = React.useMemo(
  () => items.filter(it => it.done),
  [items]
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #4 — Precompute in the store (when truly needed)</h3>
                <p>
                    If the computation is expensive and reused across screens, centralize it in the store and update
                    it via a named action whenever inputs change.
                </p>
                <pre className="note">{`// In store
recalcDone: () => {
  const src = get().items;
  const done = src.filter(it => it.done);
  set({ done }, false, 'todos/recalcDone');
};

// Component: subscribe to the precomputed slice (stable reference if unchanged)
const done = useTodos((s) => s.done);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Custom equality (advanced)</h3>
                <p>
                    For special cases, supply a custom comparator to the selector subscription.
                    Keep it cheap—this runs often.
                </p>
                <pre className="note">{`// Watch a single todo by id without re-rendering needlessly
const selectById = (id) => (s) => s.items.find(t => t.id === id);
const sameByUpdatedAt = (a, b) => (a?.updatedAt === b?.updatedAt);

const todo = useTodos(selectById(props.id), sameByUpdatedAt);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Return primitives or stable references from selectors.</li>
                    <li>Need multiple values? Use tuple/object + <code>shallow</code>.</li>
                    <li>Don’t run <code>filter/map/sort</code> inside selectors—derive with <code>useMemo</code> or precompute in store.</li>
                    <li>Name actions like <code>slice/action</code> for clean devtools traces.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Small exercise</h3>
                <ul>
                    <li>Start with a <code>todos</code> store: <code>items</code>, <code>add</code>, <code>toggle</code>.</li>
                    <li>In a component, show a “Completed (N)” badge.</li>
                    <li>First do it the wrong way (selector with <code>filter</code>), then fix it via <code>useMemo</code>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSelectorIdentity;
