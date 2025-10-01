import React from "react";
import { Styled } from "./styled";

const Performance = () => {
    return (
        <Styled.Page>
            <Styled.Title>Performance — Over-selecting & Identity</Styled.Title>
            <Styled.Subtitle>
                My simple rules to keep Zustand apps fast and predictable.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What I optimize for</h3>
                <ul>
                    <li>Only re-render components that actually need to change.</li>
                    <li>Keep selectors cheap and stable.</li>
                    <li>Batch updates so UI doesn’t repaint multiple times.</li>
                </ul>
            </Styled.Section>

            {/* Rule 1 */}
            <Styled.Section>
                <h3>1) Select narrowly (don’t grab the whole store)</h3>
                <pre className="bad">{`// ❌ Over-selecting — every change in store will re-render this component
const everything = useApp((s) => s);`}</pre>
                <pre className="good">{`// ✅ Select only what this component needs
const user = useApp((s) => s.auth.user);
const isOpen = useApp((s) => s.ui.sidebarOpen);`}</pre>
                <p>Smaller selections = fewer re-renders.</p>
            </Styled.Section>

            {/* Rule 2 */}
            <Styled.Section>
                <h3>2) When selecting multiple values, use <code>shallow</code></h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

// tuple + shallow
const [count, total] = useCart((s) => [s.count, s.total], shallow);

// object + shallow (nice when you need many fields)
const view = useCart((s) => ({ items: s.items, tax: s.taxRate }), shallow);`}</pre>
                <p>
                    <code>shallow</code> prevents re-renders if the top-level values didn’t actually
                    change.
                </p>
            </Styled.Section>

            {/* Rule 3 */}
            <Styled.Section>
                <h3>3) Avoid identity churn in selectors (objects/arrays)</h3>
                <pre className="bad">{`// ❌ Fresh array each time → new reference → re-render
const filtered = useProducts((s) => s.items.filter(p => p.inStock));`}</pre>
                <pre className="good">{`// ✅ Select inputs, then derive with useMemo
const items = useProducts((s) => s.items);
const filtered = React.useMemo(
  () => items.filter(p => p.inStock),
  [items]
);`}</pre>
                <p>
                    Returning new arrays/objects from a selector creates new references on each run.
                    Derive inside the component with <code>useMemo</code>, or return a tuple/object +
                    <code>shallow</code> if you must.
                </p>
            </Styled.Section>

            {/* Rule 4 */}
            <Styled.Section>
                <h3>4) Batch related updates in a single <code>set()</code></h3>
                <pre className="bad">{`// ❌ multiple set() calls back-to-back
set({ loading: true });
set({ data });
set({ loading: false });`}</pre>
                <pre className="good">{`// ✅ one set() with the final patch
set({ loading: false, data, error: null }, false, 'fetch/success');`}</pre>
                <p>Fewer state patches = fewer render passes.</p>
            </Styled.Section>

            {/* Rule 5 */}
            <Styled.Section>
                <h3>5) Use the functional form when next state depends on current</h3>
                <pre className="good">{`set((s) => ({ count: s.count + 1 }), false, 'counter/increment');`}</pre>
                <p>Prevents stale reads and keeps updates correct under rapid changes.</p>
            </Styled.Section>

            {/* Rule 6 */}
            <Styled.Section>
                <h3>6) Keep expensive work out of selectors</h3>
                <pre className="bad">{`// ❌ heavy compute in selector runs on every store change
const stats = useData((s) => expensiveCompute(s.bigList));`}</pre>
                <pre className="good">{`// ✅ select inputs, compute with memo
const list = useData((s) => s.bigList);
const stats = React.useMemo(() => expensiveCompute(list), [list]);`}</pre>
            </Styled.Section>

            {/* Rule 7 */}
            <Styled.Section>
                <h3>7) Stable references for actions & slices</h3>
                <pre className="good">{`// actions are created once in the store; selecting them is stable
const addToCart = useCart((s) => s.addToCart);
const reset = useCart((s) => s.reset);`}</pre>
                <p>
                    Don’t recreate actions on every render. Define them once in the store and select
                    them like any other field.
                </p>
            </Styled.Section>

            {/* Rule 8 */}
            <Styled.Section>
                <h3>8) Prefer local/ephemeral state for purely UI concerns</h3>
                <pre className="good">{`// keep transient UI (like input text) local
const [query, setQuery] = React.useState('');`}</pre>
                <p>
                    Hot, throw-away UI values don’t need to live in the global store. Less global
                    traffic → fewer subscribers waking up.
                </p>
            </Styled.Section>

            {/* Rule 9 */}
            <Styled.Section>
                <h3>9) Persist only what’s needed</h3>
                <pre className="good">{`// with persist middleware later:
// partialize to avoid saving bulky/ephemeral fields
persistConfig: {
  name: 'app',
  partialize: (s) => ({ auth: s.auth, theme: s.theme }) // skip ui.temp, etc.
}`}</pre>
                <p>
                    Smaller persisted payloads hydrate faster and reduce JSON parse/serialize cost.
                </p>
            </Styled.Section>

            {/* Rule 10 */}
            <Styled.Section>
                <h3>10) One store, feature slices; or multiple stores if truly isolated</h3>
                <pre className="good">{`// global with slices (auth/ui/cart)
const user = useApp((s) => s.auth.user);
const open = useApp((s) => s.ui.sidebarOpen);

// separate local store for a wizard
const useWizard = React.useMemo(() => createWizardStore(1), []);`}</pre>
                <p>
                    The goal is to keep subscriptions small and focused. Slices + narrow selectors
                    already go a long way.
                </p>
            </Styled.Section>

            {/* Debugging */}
            <Styled.Section>
                <h3>How I debug performance</h3>
                <ul>
                    <li>Turn on React Profiler and click around to see who re-rendered.</li>
                    <li>Name actions (<code>slice/action</code>) and watch devtools timeline.</li>
                    <li>Drop a quick <code>console.count()</code> in a noisy component to catch loops.</li>
                </ul>
                <pre className="note">{`useEffect(() => {
  console.count('ProductList rendered');
});`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default Performance;
