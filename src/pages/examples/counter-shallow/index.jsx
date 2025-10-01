import React from "react";
import { Styled } from "./styled";

/**
 * Example: Counter with Tuple Selector + shallow
 * Goal: show how to select multiple values efficiently using a tuple + shallow equality.
 * Style: note snippets (non-live) you can copy into your app.
 */
const ExampleCounterShallow = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Counter (Tuple Selector + shallow)</Styled.Title>
            <Styled.Subtitle>
                Select multiple values at once with a tuple and avoid extra re-renders using <code>shallow</code>.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>When to return a tuple/object from a selector.</li>
                    <li>Why you should pass <code>shallow</code> when returning arrays/objects.</li>
                    <li>Alternatives: separate selectors for primitives.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch</h3>
                <pre className="good">{`import { create } from 'zustand';

export const useCounter = create((set) => ({
  count: 0,
  step: 1,
  max: 10,

  inc: () => set((s) => ({ count: Math.min(s.count + s.step, s.max) }), false, 'counter/inc'),
  dec: () => set((s) => ({ count: Math.max(0, s.count - s.step) }), false, 'counter/dec'),
  setStep: (n) => set({ step: n }, false, 'counter/setStep'),
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Tuple selector + <code>shallow</code></h3>
                <p>Return a tuple of values and pass the <code>shallow</code> comparator so React only re-renders when any item actually changes.</p>
                <pre className="good">{`import { shallow } from 'zustand/shallow';
import { useCounter } from '../stores/counter';

function CounterPanel() {
  const [count, max, disabled] = useCounter(
    (s) => [s.count, s.max, s.count >= s.max],
    shallow
  );
  const inc = useCounter((s) => s.inc);
  const dec = useCounter((s) => s.dec);

  return (
    <div>
      <p>Count: {count} / {max}</p>
      <button onClick={inc} disabled={disabled}>+{/* step */}</button>
      <button onClick={dec} disabled={count === 0}>-</button>
    </div>
  );
}`}</pre>
                <Styled.Callout>
                    Without <code>shallow</code>, the array <code>[count, max, disabled]</code> would be a new reference each render,
                    causing the component to re-render even if the values were equal.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Object selector + <code>shallow</code> (more readable)</h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';
const view = useCounter(
  (s) => ({ count: s.count, max: s.max, disabled: s.count >= s.max }),
  shallow
);
// view.count, view.max, view.disabled`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Separate selectors (no shallow needed)</h3>
                <p>Another simple approach: select primitives separately. Each subscription re-renders only when its value changes.</p>
                <pre className="good">{`const count = useCounter((s) => s.count);
const max = useCounter((s) => s.max);
const disabled = useCounter((s) => s.count >= s.max);`}</pre>
                <p>This is perfectly fine for small numbers of values and keeps things very explicit.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Pitfalls</h3>
                <pre className="bad">{`// ❌ Tuple/object without shallow
const values = useCounter((s) => [s.count, s.max, s.count >= s.max]); // new array ref every render`}</pre>
                <pre className="bad">{`// ❌ Doing heavy work in the selector
const view = useCounter((s) => ({ total: expensiveSum(s.items) }));`}</pre>
                <pre className="good">{`// ✅ Select inputs; derive in component with memo
const items = useCounter((s) => s.items);
const total = useMemo(() => expensiveSum(items), [items]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Checklist</h3>
                <ul>
                    <li>Returning array/object from selector? → pass <code>shallow</code>.</li>
                    <li>Only a couple primitives? → separate selectors are fine.</li>
                    <li>Heavy computations? → select inputs and use <code>useMemo</code> or derive in the store once.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleCounterShallow;
