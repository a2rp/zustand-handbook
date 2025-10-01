import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const l=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"UI Patterns — Forms, Wizards, Dialogs"}),e.jsx(s.Subtitle,{children:"Practical patterns I use with Zustand in everyday UIs."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What’s inside"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Small forms: field state, touched/errors, validation."}),e.jsx("li",{children:"Multi-step wizards: step control, reset, isolated state."}),e.jsx("li",{children:"Dialogs/modals: open/close with optional payload."}),e.jsx("li",{children:"Gotchas and a quick checklist."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Small forms (controlled inputs)"}),e.jsxs("p",{children:["For forms tied to a single screen, I prefer a ",e.jsx("b",{children:"local store factory"}),". Each mounted form gets its own state and unmount clears it automatically."]}),e.jsx("pre",{className:"good",children:`// FormStore.js (factory)
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
}`}),e.jsx("pre",{className:"note",children:`// ContactForm.jsx (each instance = isolated store)
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
{touched.name && errors.name && <small>{errors.name}</small>}`}),e.jsx(s.Callout,{children:"Local form stores keep global state clean and make tests simpler. For cross-page data (e.g., checkout), use a global slice instead."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Multi-step wizard"}),e.jsx("p",{children:"Each wizard instance gets its own store. Step logic and data live together."}),e.jsx("pre",{className:"good",children:`// WizardStore.js (factory)
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
}`}),e.jsx("pre",{className:"note",children:`// Wizard.jsx
const useWizard = React.useMemo(() => createWizardStore(1), []);
const [step, data] = useWizard((s) => [s.step, s.data]);
const next = useWizard((s) => s.next);
const prev = useWizard((s) => s.prev);
const setData = useWizard((s) => s.setData);
`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Dialogs & modals"}),e.jsxs("p",{children:["UI concerns like a modal are a good fit for a small ",e.jsx("b",{children:"global UI slice"}),". I pass an optional ",e.jsx("i",{children:"payload"})," to the modal for context."]}),e.jsx("pre",{className:"good",children:`// uiStore.js (global slice)
import { create } from 'zustand';
export const useUi = create((set) => ({
  modal: null, // { name: 'deleteConfirm', payload: {...} } | null
  openModal: (name, payload) => set({ modal: { name, payload } }, false, 'ui/openModal'),
  closeModal: () => set({ modal: null }, false, 'ui/closeModal'),
}));`}),e.jsx("pre",{className:"note",children:`// Somewhere in a list item
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
);`}),e.jsx(s.Callout,{children:"One modal “root” makes it easy to show different dialogs by name and keeps the navigation tree clean."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Gotchas I keep in mind"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Don’t mix shared concerns (auth/cart) into a local component store."}),e.jsx("li",{children:"For inputs, update the store on change; memoize expensive validations."}),e.jsx("li",{children:"Reset local stores on unmount to avoid stale UI state."}),e.jsxs("li",{children:["When selecting multiple fields, return a tuple/object + ",e.jsx("code",{children:"shallow"}),"."]}),e.jsxs("li",{children:["Prefer a single ",e.jsx("b",{children:"UI slice"})," to coordinate toasts, modals, and spinners."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Form tied to one screen? → local store factory."}),e.jsx("li",{children:"Dialog shared across app? → global UI slice."}),e.jsxs("li",{children:["Wizard? → per-instance store with ",e.jsx("code",{children:"next"}),"/",e.jsx("code",{children:"prev"}),"/",e.jsx("code",{children:"reset"}),"."]}),e.jsxs("li",{children:["Validation? → field-level ",e.jsx("code",{children:"validateField"})," + ",e.jsx("code",{children:"validateAll"}),"."]})]})]})]});export{l as default};
