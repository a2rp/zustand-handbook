import React from "react";
import { Styled } from "./styled";

/**
 * Example: Toggle & Label
 * Goal: learn a boolean store, a toggle action, and a small derived label.
 * Style: note-style snippets you can copy into your app.
 */
const ExampleToggleLabel = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Toggle &amp; Label</Styled.Title>
            <Styled.Subtitle>
                Smallest real-world pattern: a boolean with a readable label.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Create a tiny store with a boolean flag.</li>
                    <li>Write a <code>toggle()</code> action using the functional <code>set()</code> form.</li>
                    <li>Derive a label (<code>"On"</code> / <code>"Off"</code>) without causing extra renders.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store file (toggle store)</h3>
                <p>Create a file like <code>src/stores/toggle.js</code>:</p>
                <pre className="good">{`import { create } from 'zustand';

export const useToggle = create((set, get) => ({
  on: false,

  // actions
  turnOn:  () => set({ on: true },  false, 'toggle/turnOn'),
  turnOff: () => set({ on: false }, false, 'toggle/turnOff'),
  toggle:  () => set((s) => ({ on: !s.on }), false, 'toggle/toggle'),

  // sometimes you need to read current state
  setTo: (value) => set({ on: !!value }, false, 'toggle/setTo'),
}));`}</pre>
                <Styled.Callout>
                    If next state depends on previous (<code>!s.on</code>), prefer the <b>functional</b> form:
                    <code>set((s) =&gt; …)</code>.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using it inside a component</h3>
                <pre className="good">{`import React, { useMemo } from 'react';
import { useToggle } from '../stores/toggle';

export default function ToggleCard() {
  // subscribe narrowly
  const on = useToggle((s) => s.on);
  const toggle = useToggle((s) => s.toggle);

  // derive a label locally (cheap compute)
  const label = useMemo(() => (on ? 'On' : 'Off'), [on]);

  return (
    <div>
      <p>Status: {label}</p>
      <button onClick={toggle}>{on ? 'Turn Off' : 'Turn On'}</button>
    </div>
  );
}`}</pre>
                <p>
                    Deriving <code>label</code> in the component avoids storing duplicates in the store and
                    keeps re-renders precise (the component only subscribes to <code>on</code>).
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Alternative: select multiple values with a tuple + shallow</h3>
                <p>If you prefer to return both values at once, use a tuple and <code>shallow</code>:</p>
                <pre className="note">{`import { shallow } from 'zustand/shallow';

const [on, label] = useToggle(
  (s) => [s.on, s.on ? 'On' : 'Off'],
  shallow
);`}</pre>
                <p>
                    Tuples/objects without an equality function cause re-renders any time the reference
                    changes. <code>shallow</code> makes it compare individual items instead.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Common gotchas</h3>
                <pre className="bad">{`// ❌ Over-selecting the whole store
const store = useToggle((s) => s); // more re-renders than needed`}</pre>
                <pre className="good">{`// ✅ Select narrowly
const on = useToggle((s) => s.on);`}</pre>

                <pre className="bad">{`// ❌ Returning a fresh object without shallow
const view = useToggle((s) => ({ on: s.on, label: s.on ? 'On' : 'Off' })); // new object each render`}</pre>
                <pre className="good">{`// ✅ Use a tuple + shallow OR derive in component
import { shallow } from 'zustand/shallow';
const [on, label] = useToggle((s) => [s.on, s.on ? 'On' : 'Off'], shallow);
// or: select 'on' and compute label with useMemo`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Extras you can try</h3>
                <ul>
                    <li>Expose <code>turnOn()</code> and <code>turnOff()</code> in the UI.</li>
                    <li>Persist the flag with the <code>persist</code> middleware (only the <code>on</code> key).</li>
                    <li>Render different icons for on/off and memoize them.</li>
                </ul>
                <pre className="note">{`// Persist sketch (partialize just 'on')
import { persist } from 'zustand/middleware';
export const useToggle = create(persist(
  (set) => ({ on: false, toggle: () => set((s) => ({ on: !s.on })) }),
  { name: 'toggle', partialize: (s) => ({ on: s.on }) }
));`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleToggleLabel;
