import React from "react";
import { Styled } from "./styled";

const UiPatterns = () => {
    return (
        <Styled.Page>
            <Styled.Title>UI Patterns — Forms, Wizards, Dialogs</Styled.Title>
            <Styled.Subtitle>Practical patterns I use with Zustand in everyday UIs.</Styled.Subtitle>

            {/* What I cover */}
            <Styled.Section>
                <h3>What’s inside</h3>
                <ul>
                    <li>Small forms: field state, touched/errors, validation.</li>
                    <li>Multi-step wizards: step control, reset, isolated state.</li>
                    <li>Dialogs/modals: open/close with optional payload.</li>
                    <li>Gotchas and a quick checklist.</li>
                </ul>
            </Styled.Section>

            {/* Small forms */}
            <Styled.Section>
                <h3>Small forms (controlled inputs)</h3>
                <p>
                    For forms tied to a single screen, I prefer a <b>local store factory</b>. Each mounted form gets its own state and unmount clears it automatically.
                </p>
                <pre className="good">{`// FormStore.js (factory)
import { create } from 'zustand';

export function createFormStore(initial = { name: '', email: '' }) {
  return create((set, get) => ({
    values: { ...initial },
    touched: {},
    errors: {},

    setField: (k, v) =>
      set((s) => ({ values: { ...s.values, [k]: v } }), false, 'form/setField'),

    touch: (k) =>
      set((s) => ({ touched: { ...s.touched, [k]: true } }), false, 'form/touch'),

    validateField: (k) => {
      const v = get().values[k] ?? '';
      let msg = '';
      if (k === 'name' && v.trim().length < 2) msg = 'Too short';
      if (k === 'email' && !/^\\S+@\\S+\\.\\S+$/.test(v)) msg = 'Invalid email';
      set((s) => ({ errors: { ...s.errors, [k]: msg } }), false, 'form/validateField');
      return !msg;
    },

    validateAll: () => {
      const keys = Object.keys(get().values);
      return keys.every((k) => get().validateField(k));
    },

    reset: () => set({ values: { ...initial }, errors: {}, touched: {} }, false, 'form/reset'),
  }));
}`}</pre>
                <pre className="note">{`// ContactForm.jsx (each instance = isolated store)
import { shallow } from 'zustand/shallow';
const useForm = React.useMemo(() => createFormStore(), []);
const [values, errors, touched] = useForm((s) => [s.values, s.errors, s.touched], shallow);
const setField = useForm((s) => s.setField);
const touch = useForm((s) => s.touch);
const validateAll = useForm((s) => s.validateAll);
const reset = useForm((s) => s.reset);

function onSubmit(e) {
  e.preventDefault();
  if (validateAll()) {
    // send values to API
    reset();
  }
}

<input
  value={values.name}
  onChange={(e) => setField('name', e.target.value)}
  onBlur={() => touch('name')}
/>
{touched.name && errors.name && <small>{errors.name}</small>}`}</pre>
                <Styled.Callout>
                    Local form stores keep global state clean and make tests simpler. For cross-page data (e.g., checkout), use a global slice instead.
                </Styled.Callout>
            </Styled.Section>

            {/* Wizards */}
            <Styled.Section>
                <h3>Multi-step wizard</h3>
                <p>Each wizard instance gets its own store. Step logic and data live together.</p>
                <pre className="good">{`// WizardStore.js (factory)
import { create } from 'zustand';
export function createWizardStore(initialStep = 1) {
  return create((set, get) => ({
    step: initialStep,
    data: {},
    canNext: true,

    next: () => set((s) => ({ step: s.step + 1 }), false, 'wizard/next'),
    prev: () => set((s) => ({ step: Math.max(1, s.step - 1) }), false, 'wizard/prev'),
    setData: (k, v) => set((s) => ({ data: { ...s.data, [k]: v } }), false, 'wizard/setData'),

    submit: async () => {
      const payload = get().data;
      // await api.save(payload)
      set({ step: 1, data: {} }, false, 'wizard/submitted');
    },

    reset: () => set({ step: 1, data: {} }, false, 'wizard/reset'),
  }));
}`}</pre>
                <pre className="note">{`// Wizard.jsx
const useWizard = React.useMemo(() => createWizardStore(1), []);
const [step, data] = useWizard((s) => [s.step, s.data]);
const next = useWizard((s) => s.next);
const prev = useWizard((s) => s.prev);
const setData = useWizard((s) => s.setData);
`}</pre>
            </Styled.Section>

            {/* Dialogs */}
            <Styled.Section>
                <h3>Dialogs & modals</h3>
                <p>
                    UI concerns like a modal are a good fit for a small <b>global UI slice</b>. I pass an optional <i>payload</i> to the modal for context.
                </p>
                <pre className="good">{`// uiStore.js (global slice)
import { create } from 'zustand';
export const useUi = create((set) => ({
  modal: null, // { name: 'deleteConfirm', payload: {...} } | null
  openModal: (name, payload) => set({ modal: { name, payload } }, false, 'ui/openModal'),
  closeModal: () => set({ modal: null }, false, 'ui/closeModal'),
}));`}</pre>
                <pre className="note">{`// Somewhere in a list item
const openModal = useUi((s) => s.openModal);
<button onClick={() => openModal('deleteConfirm', { id })}>Delete</button>

// ModalRoot.jsx
const modal = useUi((s) => s.modal);
const close = useUi((s) => s.closeModal);

return (
  <>
    {modal?.name === 'deleteConfirm' && (
      <ConfirmDialog
        id={modal.payload.id}
        onClose={close}
        onConfirm={() => {/* call API, then close() */}}
      />
    )}
  </>
);`}</pre>
                <Styled.Callout>
                    One modal “root” makes it easy to show different dialogs by name and keeps the navigation tree clean.
                </Styled.Callout>
            </Styled.Section>

            {/* Gotchas */}
            <Styled.Section>
                <h3>Gotchas I keep in mind</h3>
                <ul>
                    <li>Don’t mix shared concerns (auth/cart) into a local component store.</li>
                    <li>For inputs, update the store on change; memoize expensive validations.</li>
                    <li>Reset local stores on unmount to avoid stale UI state.</li>
                    <li>When selecting multiple fields, return a tuple/object + <code>shallow</code>.</li>
                    <li>Prefer a single <b>UI slice</b> to coordinate toasts, modals, and spinners.</li>
                </ul>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Form tied to one screen? → local store factory.</li>
                    <li>Dialog shared across app? → global UI slice.</li>
                    <li>Wizard? → per-instance store with <code>next</code>/<code>prev</code>/<code>reset</code>.</li>
                    <li>Validation? → field-level <code>validateField</code> + <code>validateAll</code>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default UiPatterns;
