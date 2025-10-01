import { Styled } from "./styled";

const TutorialIntro = () => {
    return (
        <Styled.Page>
            <Styled.Title>Zustand for Beginners — 101 & Mental Model</Styled.Title>

            {/* What & Why */}
            <Styled.Section>
                <h3>What is Zustand?</h3>
                <p>
                    Zustand is a tiny state management library for React. Think of it as a single
                    place (a <b>store</b>) that keeps your app’s data and a few helper functions
                    to read/update that data from any component.
                </p>
                <h3>Why use it?</h3>
                <ul>
                    <li>🧠 Simple API (create, set, get, subscribe)</li>
                    <li>🎯 Components read only what they need (via <b>selectors</b>)</li>
                    <li>⚡ Fewer re-renders with equality checks (e.g., <code>shallow</code>)</li>
                    <li>🧩 Optional middlewares (persist, devtools, subscribeWithSelector)</li>
                </ul>
            </Styled.Section>

            {/* Mental model */}
            <Styled.Section>
                <h3>Mental model (big picture)</h3>
                <ol>
                    <li>You create a <b>store</b> with some initial state and “actions”.</li>
                    <li>Components <b>select</b> the exact piece of state they need.</li>
                    <li>Actions call <code>set()</code> to update state; components re-render if their selected value changes.</li>
                </ol>
                <pre className="note">{`Component
   ↓ uses
useStore(selector)  → subscribes only to what you select
   ↑ gets updates when selected value changes
Store: { state, actions(set, get) } → set() updates; get() reads current state`}</pre>
            </Styled.Section>

            {/* Install & minimal setup */}
            <Styled.Section>
                <h3>Install & minimal setup</h3>
                <pre className="good">{`# install once
npm i zustand

# store file: src/stores/counter.js (example)
import { create } from 'zustand';

export const useCounter = create((set, get) => ({
  count: 0,
  // actions (name them for clarity later with devtools)
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
  reset:     () => set({ count: 0 }),
}));`}</pre>
            </Styled.Section>

            {/* Using inside a component */}
            <Styled.Section>
                <h3>Using it inside a component</h3>
                <pre className="good">{`import React from 'react';
import { useCounter } from '../stores/counter';

export default function CounterCard() {
  // ✅ select only what you need
  const count = useCounter((s) => s.count);
  const increment = useCounter((s) => s.increment);
  const reset = useCounter((s) => s.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`}</pre>
                <p>
                    <b>Why select separately?</b> Each selected value re-renders only when it
                    changes. Selecting the whole store would cause more re-renders.
                </p>
            </Styled.Section>

            {/* Selectors quick intro */}
            <Styled.Section>
                <h3>Selectors (60-second intro)</h3>
                <ul>
                    <li>Select <b>primitives</b> when possible (number, string, boolean).</li>
                    <li>When selecting multiple values, return a tuple/object + <code>shallow</code>.</li>
                </ul>
                <pre className="note">{`// 1) Single primitive
const count = useCounter((s) => s.count);

// 2) Multiple values (tuple) + shallow
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter((s) => [s.count, s.count > 10], shallow);

// 3) Object + shallow (more readable when many fields)
const view = useCounter((s) => ({ c: s.count, disabled: s.count > 10 }), shallow);`}</pre>
                <pre className="bad">{`// ❌ Anti-pattern: returning fresh objects without equality
const view = useCounter((s) => ({ c: s.count })); // new object each time → more renders`}</pre>
            </Styled.Section>

            {/* set() & get() basics */}
            <Styled.Section>
                <h3>set() &amp; get() basics</h3>
                <ul>
                    <li><code>set(object)</code> when the new state doesn’t depend on previous state.</li>
                    <li><code>set((s) =&gt; ...)</code> when it <b>does</b> depend on previous state.</li>
                    <li><code>get()</code> to read the current state inside actions (avoids stale closures).</li>
                </ul>
                <pre className="good">{`// inside create((set, get) => ({ ... }))
toggleDisabled: () => {
  const tooHigh = get().count > 10;       // current value
  set({ disabled: !tooHigh });            // update
}`}</pre>
            </Styled.Section>

            {/* Common gotchas */}
            <Styled.Section>
                <h3>Common gotchas (and fixes)</h3>
                <pre className="bad">{`// ❌ Selecting the whole store in a component
const store = useCounter((s) => s); // many re-renders`}</pre>
                <pre className="good">{`// ✅ Select only what you need
const count = useCounter((s) => s.count);`}</pre>

                <pre className="bad">{`// ❌ Doing heavy computations directly in the selector
const out = useCounter((s) => expensive(s.list));`}</pre>
                <pre className="good">{`// ✅ Select inputs; compute with useMemo in the component
const list = useCounter((s) => s.list);
const out = useMemo(() => expensive(list), [list]);`}</pre>
            </Styled.Section>

            {/* FAQ quick hits */}
            <Styled.Section>
                <h3>FAQ — short & sweet</h3>
                <ul>
                    <li><b>Context vs Zustand?</b> Zustand needs less boilerplate and supports precise subscriptions.</li>
                    <li><b>One store or many?</b> Start global with slices; use local stores for widget-scoped flows.</li>
                    <li><b>Where to keep derived data?</b> Derive in components/selectors unless it’s expensive or reused widely.</li>
                </ul>
            </Styled.Section>

        </Styled.Page>
    );
};

export default TutorialIntro;
