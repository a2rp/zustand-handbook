import React, { useMemo } from "react";
import { Styled } from "./styled";

/**
 * Example: Derived Badge (cheap compute)
 * Goal: select raw inputs from the store and compute small UI values in the component.
 * Teaches: selectors, shallow tuple, useMemo, and when NOT to store derived state.
 */
const ExampleDerivedBadge = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Derived Badge</Styled.Title>
            <Styled.Subtitle>
                Compute quick values like <b>completed count</b> or <b>progress %</b> without storing them.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Select only the inputs you need from the store.</li>
                    <li>Derive badges/labels with <code>useMemo</code> in the component.</li>
                    <li>Use tuple selectors + <code>shallow</code> for multiple inputs.</li>
                    <li>When to keep things derived vs stored.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch (todos)</h3>
                <p>Keep only the source of truth in the store — no duplicated totals.</p>
                <pre className="good">{`// stores/todos.js
import { create } from 'zustand';

export const useTodos = create((set, get) => ({
  items: [
    { id: 1, title: 'Read docs', done: true },
    { id: 2, title: 'Write notes', done: false },
  ],

  add: (title) =>
    set((s) => ({ items: [...s.items, { id: Date.now(), title, done: false }] }), false, 'todos/add'),

  toggle: (id) =>
    set((s) => ({
      items: s.items.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }), false, 'todos/toggle'),

  clearDone: () =>
    set((s) => ({ items: s.items.filter((t) => !t.done) }), false, 'todos/clearDone'),
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Component: select inputs, derive outputs</h3>
                <p>
                    Select only the <code>items</code>. Compute <b>completed</b>, <b>total</b>, and <b>progress</b> with{" "}
                    <code>useMemo</code>.
                </p>
                <pre className="good">{`import React, { useMemo } from 'react';
import { useTodos } from '../stores/todos';

function TodoBadge() {
  const items = useTodos((s) => s.items); // narrow selection

  const { completed, total, progress } = useMemo(() => {
    const total = items.length;
    const completed = items.reduce((n, t) => n + (t.done ? 1 : 0), 0);
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, progress };
  }, [items]);

  return (
    <span>
      {completed}/{total} done ({progress}%)
    </span>
  );
}`}</pre>
                <Styled.Callout>
                    Quick formatting/aggregation is best derived in the component. No need to store it.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Multiple inputs? Use a tuple + <code>shallow</code></h3>
                <p>
                    If your component needs more than one input (e.g., <code>items</code> and a{" "}
                    <code>filter</code>), subscribe with a tuple and pass <code>shallow</code>.
                </p>
                <pre className="note">{`import { shallow } from 'zustand/shallow';

const [items, filter] = useTodos((s) => [s.items, s.filter], shallow);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Reusable selector helper (optional)</h3>
                <p>
                    For repeated computations, create a <b>selector helper</b>. Return an object and pass{" "}
                    <code>shallow</code> to avoid re-renders when values are equal.
                </p>
                <pre className="good">{`// selectors/todos.js
export const selectProgress = (s) => {
  const total = s.items.length;
  const completed = s.items.reduce((n, t) => n + (t.done ? 1 : 0), 0);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, progress };
};

// usage in component
const { completed, total, progress } = useTodos(selectProgress, shallow);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) When would I store the derived value?</h3>
                <ul>
                    <li>The computation is expensive and used in many places.</li>
                    <li>Multiple store actions depend on the result internally.</li>
                    <li>You need to persist/sync the computed data as-is.</li>
                </ul>
                <pre className="note">{`// If you decide to store it, keep a single point of update:
recalcProgress: () => {
  const { items } = get();
  const total = items.length;
  const completed = items.reduce((n, t) => n + (t.done ? 1 : 0), 0);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  set({ badge: { completed, total, progress } }, false, 'todos/recalcProgress');
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Pitfalls & fixes</h3>
                <pre className="bad">{`// ❌ Returning a fresh object from the selector without equality
const derived = useTodos((s) => ({ total: s.items.length })); // new object each time`}</pre>
                <pre className="good">{`// ✅ Return tuple/object + shallow OR derive in component
import { shallow } from 'zustand/shallow';
const derived = useTodos((s) => [s.items.length], shallow); // tuple
// or
const items = useTodos((s) => s.items);
const total = useMemo(() => items.length, [items]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Checklist</h3>
                <ul>
                    <li>Select minimal inputs from the store.</li>
                    <li>Compute quick badges/labels with <code>useMemo</code>.</li>
                    <li>Use tuple/object + <code>shallow</code> for multi-input subscriptions.</li>
                    <li>Store derived values only if they’re expensive or widely reused.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleDerivedBadge;
