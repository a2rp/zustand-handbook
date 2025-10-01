import React from "react";
import { Styled } from "./styled";

/**
 * Example: Performance — Over-Selecting
 * Goal: show why selecting the whole store causes extra re-renders and how to fix it.
 * Notes only (non-live); copy snippets into your app to try.
 */
const ExamplePerfOverselect = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Performance: Over-Selecting</Styled.Title>
            <Styled.Subtitle>
                Select only what a component needs. Use shallow equality for tuples/objects. Avoid identity churn.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Why <code>(s) =&gt; s</code> is a re-render trap.</li>
                    <li>How to measure re-renders quickly.</li>
                    <li>Fix patterns: narrow selectors, tuples/objects + <code>shallow</code>, and memoization.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Setup: a small global store</h3>
                <pre className="good">{`// stores/app.js
import { create } from 'zustand';

export const useApp = create((set) => ({
  user: { name: 'Riya' },
  theme: { mode: 'dark' },
  cart: { items: [] },
  // actions
  setName: (name) => set((s) => ({ user: { ...s.user, name } }), false, 'user/setName'),
  toggleTheme: () => set((s) => ({ theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' } }), false, 'theme/toggle'),
  addToCart: (item) => set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>The over-selecting anti-pattern</h3>
                <pre className="bad">{`// ❌ Over-selecting the entire store
function ProfileCard() {
  const store = useApp((s) => s);      // re-renders on ANY state change
  return (
    <div>
      <p>Name: {store.user.name}</p>
      <button onClick={() => store.toggleTheme()}>Toggle theme</button>
    </div>
  );
}`}</pre>
                <p>
                    If <code>cart.items</code> changes, <b>ProfileCard</b> re-renders even though it only shows the name.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Measure: quick render counter</h3>
                <pre className="note">{`// Drop this snippet inside any component to count renders
const renders = React.useRef(0); renders.current++;
console.log('ProfileCard renders:', renders.current);`}</pre>
                <p>Interact with unrelated parts of the store and watch the counter climb on the console.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #1 — narrow selectors</h3>
                <pre className="good">{`// ✅ Select only what you need
function ProfileCard() {
  const name = useApp((s) => s.user.name);
  const setName = useApp((s) => s.setName);
  return (
    <div>
      <p>Name: {name}</p>
      <button onClick={() => setName('Aarav')}>Rename</button>
    </div>
  );
}`}</pre>
                <p>Now ProfileCard re-renders only when <code>user.name</code> changes.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #2 — multiple values with tuple/object + <code>shallow</code></h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';

// tuple
const [name, mode] = useApp((s) => [s.user.name, s.theme.mode], shallow);

// or object (more readable with many fields)
const view = useApp((s) => ({ name: s.user.name, mode: s.theme.mode }), shallow);`}</pre>
                <p>
                    Passing <code>shallow</code> ensures the component re-renders only when the selected values change,
                    not when the overall store changes.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Identity trap — fresh objects in selectors</h3>
                <pre className="bad">{`// ❌ New array every time → re-renders even if items are the same reference
const items = useApp((s) => s.cart.items.filter(Boolean));`}</pre>
                <pre className="good">{`// ✅ Select inputs; derive with useMemo in component
const itemsRaw = useApp((s) => s.cart.items);
const items = React.useMemo(() => itemsRaw.filter(Boolean), [itemsRaw]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Fix #3 — split UI by responsibility</h3>
                <p>
                    Break components so each one subscribes to the slice it actually needs. You can also wrap
                    stable child components with <code>React.memo</code> (after you’ve fixed selectors).
                </p>
                <pre className="good">{`const NameText = React.memo(function NameText() {
  const name = useApp((s) => s.user.name);
  return <span>{name}</span>;
});

function ProfileCard() {
  const setName = useApp((s) => s.setName);
  return (
    <div>
      <NameText />
      <button onClick={() => setName('Aarav')}>Rename</button>
    </div>
  );
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Bonus — action selection is cheap</h3>
                <pre className="note">{`// Actions are stable references from the store.
// Selecting them separately won't cause extra re-renders.
const addToCart = useApp((s) => s.addToCart);
const toggleTheme = useApp((s) => s.toggleTheme);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Avoid <code>(s) =&gt; s</code> in components.</li>
                    <li>Subscribe to the smallest slice you need.</li>
                    <li>For multiple values, use tuple/object + <code>shallow</code>.</li>
                    <li>Don’t create fresh objects/arrays inside selectors; derive with <code>useMemo</code> or inside the store once.</li>
                    <li>Split components by responsibility; consider <code>React.memo</code> after fixing selectors.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExamplePerfOverselect;
