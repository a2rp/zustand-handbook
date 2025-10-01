import React from "react";
import { Styled } from "./styled";

/**
 * Example: Counter
 * Goal: smallest possible store to learn create(), set(), get(), and selectors.
 * Style: note-style examples (non-live) you can copy into your app.
 */
const ExampleCounter = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Counter</Styled.Title>
            <Styled.Subtitle>Start here: create a store, read a value, update it.</Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Make a tiny store with <code>create()</code>.</li>
                    <li>Update state with <code>set()</code> (object vs functional form).</li>
                    <li>Read state in components with <b>selectors</b> (subscribe to only what you need).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store file (counter store)</h3>
                <p>Create a file like <code>src/stores/counter.js</code>:</p>
                <pre className="good">{`import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,

  // actions
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) }), false, 'counter/decrement'),
  reset: () => set({ count: 0 }, false, 'counter/reset'),

  // sometimes you need current state inside actions:
  incBy: (n = 1) => {
    const current = get().count; // safe read of current value
    set({ count: current + n }, false, 'counter/incBy');
  },
}));`}</pre>
                <Styled.Callout>
                    Use the <b>functional form</b> when next value depends on the previous one:
                    <code>set((s) =&gt; (…))</code>. Name actions like <code>slice/action</code> for cleaner devtools.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using it in a component</h3>
                <pre className="good">{`import React from 'react';
import { useCounter } from '../stores/counter';

export default function CounterCard() {
  // select only what the component needs
  const count = useCounter((s) => s.count);
  const increment = useCounter((s) => s.increment);
  const decrement = useCounter((s) => s.decrement);
  const reset = useCounter((s) => s.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={() => useCounter.getState().incBy(5)}>+5 (via getState)</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`}</pre>
                <p>
                    Selecting the whole store (e.g., <code>(s) =&gt; s</code>) causes extra re-renders. Select
                    only the pieces you use (like <code>count</code> and actions).
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Multiple values with a tuple selector</h3>
                <p>
                    When you need two or more values, return a tuple and pass <code>shallow</code> so React
                    re-renders only when those values actually change.
                </p>
                <pre className="note">{`import { shallow } from 'zustand/shallow';

const [count, disabled] = useCounter(
  (s) => [s.count, s.count >= 10],
  shallow
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Common gotchas</h3>
                <pre className="bad">{`// ❌ Over-selecting
const all = useCounter((s) => s); // triggers more re-renders than needed`}</pre>
                <pre className="good">{`// ✅ Narrow selection
const count = useCounter((s) => s.count);`}</pre>

                <pre className="bad">{`// ❌ Deriving heavy values in selector (runs on every state change)
const view = useCounter((s) => expensiveCompute(s.count));`}</pre>
                <pre className="good">{`// ✅ Select inputs; compute in component with useMemo
const count = useCounter((s) => s.count);
const view = useMemo(() => expensiveCompute(count), [count]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Exercise ideas</h3>
                <ul>
                    <li>Add a <code>min</code> and <code>max</code> to clamp the counter.</li>
                    <li>Expose <code>setTo(n)</code> action (<code>set({`count: n `})</code>).</li>
                    <li>Track <code>history</code> in an array and add a <code>resetToLast()</code> action.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleCounter;
