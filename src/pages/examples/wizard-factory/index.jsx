import React from "react";
import { Styled } from "./styled";

/**
 * Example: Wizard Factory (per-component store)
 * Goal: create a store factory so every wizard instance has isolated state
 * and resets automatically on unmount.
 */
const ExampleWizardFactory = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Wizard Factory</Styled.Title>
            <Styled.Subtitle>Per-component Zustand store that resets on unmount.</Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Make a <b>store factory</b> with <code>create()</code>.</li>
                    <li>Give each component its <b>own</b> store instance via <code>useMemo</code>.</li>
                    <li>Keep actions and data local: <code>next</code>, <code>prev</code>, <code>setField</code>, <code>reset</code>.</li>
                    <li>Avoid leaks and accidental sharing across multiple wizards.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store factory</h3>
                <p>Put this in <code>src/stores/wizardFactory.js</code> (or near the component):</p>
                <pre className="good">{`import { create } from 'zustand';

// Factory returns a bound store hook (a new store per call)
export function createWizardStore({ initialStep = 1, maxStep = 3 } = {}) {
  return create((set, get) => ({
    step: initialStep,
    maxStep,
    data: {},

    canNext: () => get().step < get().maxStep,
    canPrev: () => get().step > 1,

    next: () =>
      set((s) => (s.step < s.maxStep ? { step: s.step + 1 } : s), false, 'wizard/next'),

    prev: () =>
      set((s) => (s.step > 1 ? { step: s.step - 1 } : s), false, 'wizard/prev'),

    setField: (key, value) =>
      set((s) => ({ data: { ...s.data, [key]: value } }), false, 'wizard/setField'),

    reset: () => set({ step: initialStep, data: {} }, false, 'wizard/reset'),
  }));
}`}</pre>
                <Styled.Callout>
                    The factory returns a <b>hook</b> (e.g., <code>useWizard</code>) with extras like <code>getState()</code>, <code>setState()</code>, and <code>subscribe()</code>.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using the factory inside a component</h3>
                <p>Each instance gets its own store by calling the factory once (memoized):</p>
                <pre className="good">{`import React from 'react';
import { createWizardStore } from '../stores/wizardFactory';

export default function ProfileWizard() {
  // a brand-new store for THIS instance
  const useWizard = React.useMemo(() => createWizardStore({ initialStep: 1, maxStep: 3 }), []);

  const step = useWizard((s) => s.step);
  const canNext = useWizard((s) => s.canNext());
  const canPrev = useWizard((s) => s.canPrev());
  const next = useWizard((s) => s.next);
  const prev = useWizard((s) => s.prev);
  const setField = useWizard((s) => s.setField);
  const reset = useWizard((s) => s.reset);

  return (
    <div>
      <h4>Step {step} of 3</h4>

      {step === 1 && (
        <input
          placeholder="Full name"
          onChange={(e) => setField('name', e.target.value)}
        />
      )}
      {step === 2 && (
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setField('email', e.target.value)}
        />
      )}
      {step === 3 && <p>Review & Submit</p>}

      <div style={{ marginTop: 8 }}>
        <button onClick={prev} disabled={!canPrev()}>Prev</button>
        <button onClick={next} disabled={!canNext()}>Next</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}`}</pre>
                <Styled.Callout>
                    When the component unmounts, the hook reference is dropped and the store can be garbage collected — no global cleanup.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Multiple independent instances</h3>
                <p>Each child calls the factory; state is isolated:</p>
                <pre className="note">{`function TwoWizardsSideBySide() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProfileWizard />  {/* store A */}
      <ProfileWizard />  {/* store B */}
    </div>
  );
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Testing the store (sketch)</h3>
                <pre className="note">{`import { createWizardStore } from '../stores/wizardFactory';

test('wizard next/prev', () => {
  const useWizard = createWizardStore({ initialStep: 1, maxStep: 2 });
  expect(useWizard.getState().step).toBe(1);
  useWizard.getState().next();
  expect(useWizard.getState().step).toBe(2);
  useWizard.getState().prev();
  expect(useWizard.getState().step).toBe(1);
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Gotchas & fixes</h3>
                <ul>
                    <li>
                        <b>Don’t create the store on every render.</b> Wrap the factory call in{" "}
                        <code>useMemo(() =&gt; createWizardStore(...), [])</code>.
                    </li>
                    <li>
                        <b>Don’t use one global wizard store</b> if you need multiple independent wizards.
                        Use a factory per instance.
                    </li>
                    <li>
                        If steps are heavy, select narrowly (e.g., <code>(s) =&gt; s.step</code> and specific fields).
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Extensions</h3>
                <ul>
                    <li>Add a <code>validate(step)</code> function and block <code>next()</code> until valid.</li>
                    <li>Persist partial state (e.g., <code>data</code>) with <code>persist</code> if the flow spans routes.</li>
                    <li>Track <code>history</code> for undo/redo per wizard instance.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleWizardFactory;
