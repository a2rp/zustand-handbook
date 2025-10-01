import React from "react";
import { Styled } from "./styled";

/**
 * subscribe vs subscribeWithSelector
 * When to use the hook selector, when to use subscriptions,
 * and how to make subscriptions precise with the middleware.
 */
const SubscribeVsSelector = () => {
    return (
        <Styled.Page>
            <Styled.Title>subscribe vs subscribeWithSelector</Styled.Title>
            <Styled.Subtitle>
                Picking between the React hook selector and imperative subscriptions.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>TL;DR</h3>
                <ul>
                    <li><b>useStore(selector)</b>: for UI. Re-renders the component when the selected value changes.</li>
                    <li><b>store.subscribe(listener)</b>: for non-UI side effects or code outside React. Runs a callback; doesn’t re-render.</li>
                    <li><b>subscribeWithSelector</b> (middleware): lets you subscribe to a <i>slice</i> with an equality function and options.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>useStore(selector) — the normal React way</h3>
                <pre className="good">{`// Component reads only what it needs; re-renders on change
const count = useCounter((s) => s.count);
const inc   = useCounter((s) => s.increment);`}</pre>
                <p>Use this for rendering UI. It’s simple and efficient when you pick small slices.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>store.subscribe — imperative listener (no re-render)</h3>
                <p>
                    Useful for logging, analytics, syncing to storage manually, or reacting to state
                    <i>outside</i> React components.
                </p>
                <pre className="good">{`// Basic subscribe (no middleware)
import { useCounterStore } from '../stores/counter'; // the store function from create()
const unsub = useCounterStore.subscribe((state, prev) => {
  if (state.count !== prev.count) {
    console.log('count changed:', state.count);
  }
});
// later (cleanup)
unsub();`}</pre>
                <pre className="note">{`// In React: setup/cleanup inside useEffect
useEffect(() => {
  const unsub = useCounterStore.subscribe((s, p) => {
    if (s.count !== p.count) {
      window.localStorage.setItem('lastCount', String(s.count));
    }
  });
  return unsub; // important
}, []);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>subscribeWithSelector — precise subscriptions</h3>
                <p>
                    Add the middleware to make <code>subscribe</code> selector-aware and pass an equality function or options.
                </p>
                <pre className="good">{`// store: create with middleware
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useCart = create(subscribeWithSelector((set, get) => ({
  items: [],
  taxRate: 0.1,
  add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
})));`}</pre>

                <pre className="good">{`// subscribe to a slice + equality + options
import { shallow } from 'zustand/shallow';

const unsub = useCart.subscribe(
  (s) => [s.items.length, s.taxRate],    // selector (tuple)
  ([len, tax], [prevLen, prevTax]) => {  // listener
    console.log('cart changed → items:', len, 'tax:', tax);
  },
  { equalityFn: shallow, fireImmediately: true }
);

// later
unsub();`}</pre>
                <p>
                    This fires only when the selected slice changes according to the equality
                    function (here, <code>shallow</code>), and it can fire immediately once on setup.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Practical patterns I use</h3>
                <ul>
                    <li>
                        <b>Debounced side effects</b> for chatty slices:
                        <pre className="note">{`const unsub = useSearch.subscribe(
  (s) => s.query,
  debounce((q) => analytics.track('search', { q }), 300),
  { fireImmediately: false }
);`}</pre>
                    </li>
                    <li>
                        <b>Drive services without UI re-renders</b>:
                        <pre className="note">{`// keep URL in sync with filters
useEffect(() => {
  const unsub = useFilters.subscribe(
    (s) => s.serialized, // string
    (val) => window.history.replaceState(null, '', '?f=' + encodeURIComponent(val)),
    { fireImmediately: true }
  );
  return unsub;
}, []);`}</pre>
                    </li>
                    <li>
                        <b>One-off reactions</b> with <code>fireImmediately</code> to initialize:
                        <pre className="note">{`const unsub = useAuth.subscribe(
  (s) => s.user?.id ?? null,
  (id) => id && preloadUserStuff(id),
  { fireImmediately: true }
);`}</pre>
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Common mistakes (and fixes)</h3>
                <pre className="bad">{`// ❌ Forgetting to unsubscribe
useEffect(() => {
  useStore.subscribe(() => { /* ... */ });
}, []);`}</pre>
                <pre className="good">{`// ✅ Always cleanup
useEffect(() => {
  const unsub = useStore.subscribe(() => { /* ... */ });
  return unsub;
}, []);`}</pre>

                <pre className="bad">{`// ❌ Using subscribe to drive UI updates
useStore.subscribe((s) => rerenderManually(s));`}</pre>
                <pre className="good">{`// ✅ Use the hook for UI
const value = useStore((s) => s.value);`}</pre>

                <pre className="bad">{`// ❌ Heavy work inside the subscriber (runs on every relevant change)
useStore.subscribe((s) => doExpensiveThing(s.bigList));`}</pre>
                <pre className="good">{`// ✅ Throttle/debounce or move heavy work to a worker/memo
useStore.subscribe((s) => throttleSync(s.bigList), { fireImmediately: true });`}</pre>

                <pre className="bad">{`// ❌ Mutating state inside a subscribe listener triggered by the same mutation (risk of loops)
useStore.subscribe((s) => { useStore.setState({ triggered: true }) });`}</pre>
                <pre className="good">{`// ✅ Guard, or schedule outside the tick
useStore.subscribe((s, p) => {
  if (!p.triggered && s.needsTrigger) queueMicrotask(() => useStore.setState({ triggered: true }));
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Rendering UI? → <code>useStore(selector)</code>.</li>
                    <li>Non-UI side effects or usage outside React? → <code>subscribe</code>.</li>
                    <li>Need to listen to a specific slice? → add <code>subscribeWithSelector</code>.</li>
                    <li>Always unsubscribe; consider <code>fireImmediately</code> for initial sync.</li>
                    <li>Use <code>shallow</code> (or a custom equality) for tuples/objects.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default SubscribeVsSelector;
