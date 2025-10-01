import React, { useEffect } from "react";
import { Styled } from "./styled";

/**
 * Example: Subscribe + Selector
 * Goal: show the difference between component selectors and subscribeWithSelector,
 * and how to listen outside React (or in effects) with equality.
 */
const ExampleSubscribeSelector = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Subscribe + Selector</Styled.Title>
            <Styled.Subtitle>
                Select in components with <code>useStore(selector)</code>. For non-React listeners or
                effect-style taps, use <code>subscribeWithSelector</code>.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>1) Store sketch (with subscribeWithSelector)</h3>
                <pre className="good">{`// src/stores/cart.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useCart = create(
  subscribeWithSelector((set, get) => ({
    items: [],

    add: (item) =>
      set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),

    remove: (id) =>
      set((s) => ({ items: s.items.filter(it => it.id !== id) }), false, 'cart/remove'),

    clear: () => set({ items: [] }, false, 'cart/clear'),
  }))
);`}</pre>
                <p>
                    <b>Why this middleware?</b> It lets us subscribe with a selector, equality function,
                    and get precise change notifications <i>outside</i> React components.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Selecting in React components</h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';
import { useCart } from '../stores/cart';

function CartSummary() {
  // subscribe only to what you need
  const [count, ids] = useCart((s) => [s.items.length, s.items.map(it => it.id)], shallow);
  const add = useCart((s) => s.add);

  return (
    <div>
      <p>Items: {count}</p>
      <button onClick={() => add({ id: crypto.randomUUID?.() || Date.now(), title: 'Apple', price: 1 })}>
        Add Apple
      </button>
    </div>
  );
}`}</pre>
                <p>
                    Returning tuples/objects? Pass <code>shallow</code> so React re-renders only when those
                    values actually change.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Subscribing outside React (or in an effect)</h3>
                <p>Great for logging, analytics, or syncing other systems.</p>
                <pre className="note">{`// plain JS (outside components)
import { useCart } from '../stores/cart';

const unsubscribe = useCart.subscribe(
  (s) => s.items.length,                      // selector
  (len, prevLen) => {                         // listener
    console.log('cart size', prevLen, '→', len);
  },
  { equalityFn: Object.is, fireImmediately: true }
);

// later, stop listening:
unsubscribe();`}</pre>

                <pre className="good">{`// inside a React component effect
import { useEffect } from 'react';
import { useCart } from '../stores/cart';

function CartLogger() {
  useEffect(() => {
    const unsub = useCart.subscribe(
      (s) => s.items.length,
      (len, prev) => console.log('[CartLogger] size', prev, '→', len),
      { equalityFn: Object.is, fireImmediately: true }
    );
    return () => unsub();
  }, []);
  return null;
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Common mistakes</h3>
                <pre className="bad">{`// ❌ subscribe(selector, listener) without subscribeWithSelector middleware
// store.subscribe will only support (listener) in vanilla mode, not selector+listener.`}</pre>
                <pre className="good">{`// ✅ wrap store with subscribeWithSelector middleware (see store sketch above)`}</pre>

                <pre className="bad">{`// ❌ Selecting entire store in components
const all = useCart((s) => s); // causes extra re-renders`}</pre>
                <pre className="good">{`// ✅ Select the smallest slice you need
const count = useCart((s) => s.items.length);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Checklist</h3>
                <ul>
                    <li>In components: <code>useStore(selector)</code> + <code>shallow</code> when returning tuples/objects.</li>
                    <li>Outside React or for effects: <code>subscribeWithSelector</code> then <code>store.subscribe(selector, listener, opts)</code>.</li>
                    <li>Always <code>unsubscribe()</code> when done.</li>
                    <li>Name actions (<code>slice/action</code>) to keep devtools traces clean.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSubscribeSelector;
