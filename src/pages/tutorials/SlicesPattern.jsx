import React from "react";
import { Styled } from "./styled";

const SlicesPattern = () => {
    return (
        <Styled.Page>
            <Styled.Title>Slices Pattern — Store Factories</Styled.Title>
            <Styled.Subtitle>
                How I split state by feature and compose a clean store.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>Why slices help on real projects.</li>
                    <li>Two ways to organize slices (flat vs nested).</li>
                    <li>Composing the final store.</li>
                    <li>Factory pattern for widget-local stores.</li>
                    <li>Reset and testing tips.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Why slices?</h3>
                <ul>
                    <li>Each feature owns its state + actions → fewer accidental couplings.</li>
                    <li>Selectors stay small and readable.</li>
                    <li>Migrations and persistence are easier per feature.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Two organization styles</h3>
                <Styled.Table>
                    <thead>
                        <tr><th>Style</th><th>Shape</th><th>Pros</th><th>Cons</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Flat (my default)</td>
                            <td>keys at root: <code>count, addToCart()</code></td>
                            <td>Shortest selectors, simple actions</td>
                            <td>Name collisions if you don’t prefix action types</td>
                        </tr>
                        <tr>
                            <td>Nested</td>
                            <td><code>counter: &#123; count, inc() &#125;</code></td>
                            <td>Clear visual grouping</td>
                            <td>Selectors a bit longer, extra object layer</td>
                        </tr>
                    </tbody>
                </Styled.Table>
            </Styled.Section>

            <Styled.Section>
                <h3>Minimal slice example (flat)</h3>
                <pre className="good">{`// slices/counterSlice.js
export const createCounterSlice = (set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  resetCount: () => set({ count: 0 }, false, 'counter/reset'),
});

// slices/cartSlice.js
export const createCartSlice = (set, get) => ({
  items: [],
  addToCart: (item) =>
    set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
  removeFromCart: (id) =>
    set((s) => ({ items: s.items.filter(it => it.id !== id) }), false, 'cart/remove'),
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Compose the store</h3>
                <pre className="good">{`// stores/app.js
import { create } from 'zustand';
import { createCounterSlice } from '../slices/counterSlice';
import { createCartSlice } from '../slices/cartSlice';

export const useApp = create((set, get) => ({
  ...createCounterSlice(set, get),
  ...createCartSlice(set, get),
}));

// Component usage (small selectors)
const count = useApp((s) => s.count);
const add = useApp((s) => s.addToCart);`}</pre>
                <Styled.Callout>
                    I keep action type strings namespaced like <code>"counter/increment"</code> so
                    devtools stays readable.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Nested variant (if you prefer grouping)</h3>
                <pre className="note">{`// stores/appNested.js
import { create } from 'zustand';

export const useAppNested = create((set, get) => ({
  counter: {
    count: 0,
    inc: () => set((s) => ({ counter: { ...s.counter, count: s.counter.count + 1 } }), false, 'counter/inc'),
  },
  cart: {
    items: [],
    add: (item) => set((s) => ({ cart: { ...s.cart, items: [...s.cart.items, item] } }), false, 'cart/add'),
  },
}));

// Component selectors become a bit longer:
const count = useAppNested((s) => s.counter.count);
const add   = useAppNested((s) => s.cart.add);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Factory for widget-local state (per-instance)</h3>
                <p>Useful for wizards, modals, and forms that should reset on unmount.</p>
                <pre className="good">{`// factories/makeWizardStore.js
import { create } from 'zustand';

export function makeWizardStore(initialStep = 1) {
  return create((set, get) => ({
    step: initialStep,
    data: {},
    next: () => set((s) => ({ step: s.step + 1 }), false, 'wizard/next'),
    prev: () => set((s) => ({ step: Math.max(1, s.step - 1) }), false, 'wizard/prev'),
    setField: (k, v) => set((s) => ({ data: { ...s.data, [k]: v } }), false, 'wizard/setField'),
    reset: () => set({ step: 1, data: {} }, false, 'wizard/reset'),
  }));
}

// In the component:
const useWizard = React.useMemo(() => makeWizardStore(1), []);
const step = useWizard((s) => s.step);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Reset patterns per slice</h3>
                <pre className="good">{`// slices/counterSlice.js
const initialCounter = { count: 0 };

export const createCounterSlice = (set, get) => ({
  ...initialCounter,
  resetCount: () => set(initialCounter, false, 'counter/reset'),
});`}</pre>
                <p>
                    For a full reset, I keep an <code>initialApp</code> object in the composed store
                    and set it back in one shot.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Testing a slice in isolation</h3>
                <pre className="note">{`import { act, renderHook } from '@testing-library/react';
import { create } from 'zustand';
import { createCounterSlice } from './counterSlice';

test('increments', () => {
  const useTest = create((set, get) => ({ ...createCounterSlice(set, get) }));
  const { result } = renderHook(() => useTest((s) => s));
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Mistakes I watch for</h3>
                <ul>
                    <li>Leaking cross-slice references. If two slices must coordinate, call actions, don’t mutate foreign state directly.</li>
                    <li>Returning fresh objects in selectors without <code>shallow</code>.</li>
                    <li>Putting shared concerns (auth/theme) into a local factory store.</li>
                </ul>
                <pre className="bad">{`// ❌ mutating another slice directly inside a slice
// do: expose an action and call it instead`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>My quick checklist</h3>
                <ul>
                    <li>One slice per feature; actions live next to their data.</li>
                    <li>Keep selectors tiny; prefer primitives or tuples/objects + <code>shallow</code>.</li>
                    <li>Namespace action types for devtools.</li>
                    <li>Use factories for per-instance state.</li>
                    <li>Plan reset and test each slice alone.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default SlicesPattern;
