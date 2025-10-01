import{d as r,j as e}from"./index-Bmr0gcqO.js";const a="var(--card, #111)",i="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",s="var(--border, #222)",o="var(--accent, #22c55e)",d="var(--danger, #ef4444)",c="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
        color: ${i};
        border: 1px solid ${s};
        border-radius: ${c};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:r.section`
        border-top: 1px dashed ${s};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${s};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        pre.good,
        pre.bad,
        pre.note {
            white-space: pre-wrap;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
            border-radius: 10px;
            padding: 12px 14px;
            margin: 8px 0 12px 0;
            border: 1px dashed ${s};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${o};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:r.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${s};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},x=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Wizard Factory"}),e.jsx(t.Subtitle,{children:"Per-component Zustand store that resets on unmount."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Make a ",e.jsx("b",{children:"store factory"})," with ",e.jsx("code",{children:"create()"}),"."]}),e.jsxs("li",{children:["Give each component its ",e.jsx("b",{children:"own"})," store instance via ",e.jsx("code",{children:"useMemo"}),"."]}),e.jsxs("li",{children:["Keep actions and data local: ",e.jsx("code",{children:"next"}),", ",e.jsx("code",{children:"prev"}),", ",e.jsx("code",{children:"setField"}),", ",e.jsx("code",{children:"reset"}),"."]}),e.jsx("li",{children:"Avoid leaks and accidental sharing across multiple wizards."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Store factory"}),e.jsxs("p",{children:["Put this in ",e.jsx("code",{children:"src/stores/wizardFactory.js"})," (or near the component):"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

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
}`}),e.jsxs(t.Callout,{children:["The factory returns a ",e.jsx("b",{children:"hook"})," (e.g., ",e.jsx("code",{children:"useWizard"}),") with extras like ",e.jsx("code",{children:"getState()"}),", ",e.jsx("code",{children:"setState()"}),", and ",e.jsx("code",{children:"subscribe()"}),"."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Using the factory inside a component"}),e.jsx("p",{children:"Each instance gets its own store by calling the factory once (memoized):"}),e.jsx("pre",{className:"good",children:`import React from 'react';
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
}`}),e.jsx(t.Callout,{children:"When the component unmounts, the hook reference is dropped and the store can be garbage collected — no global cleanup."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Multiple independent instances"}),e.jsx("p",{children:"Each child calls the factory; state is isolated:"}),e.jsx("pre",{className:"note",children:`function TwoWizardsSideBySide() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProfileWizard />  {/* store A */}
      <ProfileWizard />  {/* store B */}
    </div>
  );
}`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Testing the store (sketch)"}),e.jsx("pre",{className:"note",children:`import { createWizardStore } from '../stores/wizardFactory';

test('wizard next/prev', () => {
  const useWizard = createWizardStore({ initialStep: 1, maxStep: 2 });
  expect(useWizard.getState().step).toBe(1);
  useWizard.getState().next();
  expect(useWizard.getState().step).toBe(2);
  useWizard.getState().prev();
  expect(useWizard.getState().step).toBe(1);
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Gotchas & fixes"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Don’t create the store on every render."})," Wrap the factory call in"," ",e.jsx("code",{children:"useMemo(() => createWizardStore(...), [])"}),"."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Don’t use one global wizard store"})," if you need multiple independent wizards. Use a factory per instance."]}),e.jsxs("li",{children:["If steps are heavy, select narrowly (e.g., ",e.jsx("code",{children:"(s) => s.step"})," and specific fields)."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Extensions"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add a ",e.jsx("code",{children:"validate(step)"})," function and block ",e.jsx("code",{children:"next()"})," until valid."]}),e.jsxs("li",{children:["Persist partial state (e.g., ",e.jsx("code",{children:"data"}),") with ",e.jsx("code",{children:"persist"})," if the flow spans routes."]}),e.jsxs("li",{children:["Track ",e.jsx("code",{children:"history"})," for undo/redo per wizard instance."]})]})]})]});export{x as default};
