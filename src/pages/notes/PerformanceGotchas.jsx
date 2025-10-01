import React from "react";
import { Styled } from "./styled";

const PerformanceGotchas = () => {
    return (
        <Styled.Page>
            <Styled.Title>Performance Gotchas — Identity Traps</Styled.Title>
            <Styled.Subtitle>
                Simple rules to avoid extra re-renders and accidental work.
            </Styled.Subtitle>

            {/* One-liner */}
            <Styled.Section>
                <h3>In one line</h3>
                <p>
                    Select the smallest slice, avoid returning fresh objects/arrays from selectors, and
                    use <code>shallow</code> when you must return a collection.
                </p>
            </Styled.Section>

            {/* Biggest culprits */}
            <Styled.Section>
                <h3>Biggest culprits I watch for</h3>
                <ul>
                    <li>Selecting the <b>entire store</b> in a component.</li>
                    <li>Selectors that return a <b>new object/array</b> every render.</li>
                    <li>Heavy computations done <b>inside</b> the selector.</li>
                    <li>Updating nested objects without creating a <b>new reference</b>.</li>
                    <li>Multiple <code>set()</code> calls where one batched call would do.</li>
                </ul>
            </Styled.Section>

            {/* Over-selecting */}
            <Styled.Section>
                <h3>Over-selecting the store</h3>
                <pre className="bad">{`// ❌ causes re-render whenever *anything* in the store changes
const all = useApp((s) => s);`}</pre>
                <pre className="good">{`// ✅ subscribe to just what this component needs
const user = useApp((s) => s.auth.user);
const mode = useApp((s) => s.theme.mode);`}</pre>
            </Styled.Section>

            {/* Fresh objects from selector */}
            <Styled.Section>
                <h3>Returning fresh objects/arrays from the selector</h3>
                <pre className="bad">{`// ❌ new object each time → re-renders even if values are same
const view = useCart((s) => ({ items: s.items, total: s.total }));`}</pre>
                <pre className="good">{`// ✅ tuple + shallow (fast)
import { shallow } from 'zustand/shallow';
const [items, total] = useCart((s) => [s.items, s.total], shallow);

// ✅ object + shallow (more readable for many fields)
const view = useCart((s) => ({ items: s.items, total: s.total }), shallow);`}</pre>
            </Styled.Section>

            {/* Heavy work inside selector */}
            <Styled.Section>
                <h3>Heavy work inside the selector</h3>
                <pre className="bad">{`// ❌ selector runs on every store change; creates a new array each time
const visible = useTodos((s) => s.items.filter(t => !t.done));`}</pre>
                <pre className="good">{`// ✅ select inputs; compute with useMemo
const items = useTodos((s) => s.items);
const visible = React.useMemo(
  () => items.filter(t => !t.done),
  [items]
);`}</pre>
            </Styled.Section>

            {/* Nested updates & identity */}
            <Styled.Section>
                <h3>Nested updates must create new references</h3>
                <pre className="bad">{`// ❌ mutates nested object; selectors reading user won't see a new reference
set((s) => { s.user.name = 'Ashish'; return s; }); // (also breaks immutability assumptions)`}</pre>
                <pre className="good">{`// ✅ create a new object for changed branch
set((s) => ({ user: { ...s.user, name: 'Ashish' } }), false, 'user/rename');`}</pre>
                <p>
                    If nested updates are frequent, consider the <i>immer</i> middleware later; the
                    idea stays the same: always produce a new reference for the changed branch.
                </p>
            </Styled.Section>

            {/* Batching related updates */}
            <Styled.Section>
                <h3>Batch related updates</h3>
                <pre className="bad">{`// ❌ two separate updates → two chances to re-render
set({ loading: true }, false, 'fetch/start');
set({ loading: false, data }, false, 'fetch/success');`}</pre>
                <pre className="good">{`// ✅ group related fields in one set()
set({ loading: false, data, error: null }, false, 'fetch/success');`}</pre>
            </Styled.Section>

            {/* Selecting unstable functions */}
            <Styled.Section>
                <h3>Selecting functions vs using actions directly</h3>
                <pre className="bad">{`// ❌ selector returns an inline function each time (new identity)
const doThing = useApp(() => (x) => console.log(x));`}</pre>
                <pre className="good">{`// ✅ read stable action references from the store
const addToCart = useApp((s) => s.addToCart);`}</pre>
                <p>
                    Actions you define in the store are stable across renders; returning new inline
                    functions from the selector creates new identities.
                </p>
            </Styled.Section>

            {/* Deriving lots of fields when only one is needed */}
            <Styled.Section>
                <h3>Deriving more than the component needs</h3>
                <pre className="bad">{`// ❌ selecting a big object when only count is needed
const view = useCounter((s) => ({ count: s.count, disabled: s.count > 10 }), shallow);`}</pre>
                <pre className="good">{`// ✅ keep it tiny
const count = useCounter((s) => s.count);`}</pre>
            </Styled.Section>

            {/* Debugging renders */}
            <Styled.Section>
                <h3>How I debug renders quickly</h3>
                <ul>
                    <li>Enable “Highlight updates” in React DevTools.</li>
                    <li>Use the devtools middleware and name actions: <code>slice/action</code>.</li>
                    <li>Temporarily log re-renders in a component to spot noisy selectors.</li>
                </ul>
                <pre className="note">{`// quick re-render counter
const renderCount = React.useRef(0);
React.useEffect(() => { renderCount.current += 1; console.log('renders:', renderCount.current); });`}</pre>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Smallest slice possible; avoid <code>(s) =&gt; s</code> in components.</li>
                    <li>Return tuple/object + <code>shallow</code> when selecting multiple values.</li>
                    <li>Do heavy work in <code>useMemo</code> or a selector helper, not inline.</li>
                    <li>Create new references for changed nested branches.</li>
                    <li>Batch related updates in a single <code>set()</code>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default PerformanceGotchas;
