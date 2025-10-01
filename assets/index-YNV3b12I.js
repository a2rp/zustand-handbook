import{d as r,j as e}from"./index-Bmr0gcqO.js";const t="var(--card, #111)",a="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",i="var(--border, #222)",o="var(--accent, #22c55e)",l="var(--danger, #ef4444)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${t};
        color: ${a};
        border: 1px solid ${i};
        border-radius: ${d};
        box-shadow: ${c};
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
        border-top: 1px dashed ${i};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${i};
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
            border: 1px dashed ${i};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${o};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${l};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:r.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${i};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},m=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Form Validation"}),e.jsx(s.Subtitle,{children:"Model fields, errors, and touched in a Zustand store. Validate on blur/submit. Handle async checks."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Store shape (fields, errors, touched)"}),e.jsxs("p",{children:["I keep form state in one slice: ",e.jsx("code",{children:"fields"}),", ",e.jsx("code",{children:"errors"}),","," ",e.jsx("code",{children:"touched"}),", and a few flags like ",e.jsx("code",{children:"submitting"}),". Each action is named for devtools."]}),e.jsx("pre",{className:"good",children:`// src/stores/signupForm.js
import { create } from 'zustand';

const initialFields = {
  name: '',
  email: '',
  username: '',
  password: '',
};

export const useSignupForm = create((set, get) => ({
  fields: initialFields,
  errors: {},         // { name?: string, email?: string, ... }
  touched: {},        // { name?: true, email?: true, ... }
  submitting: false,
  inflightChecks: {}, // keyed async validators (e.g., username)

  // --- field updates ---
  setField: (key, value) =>
    set((s) => ({ fields: { ...s.fields, [key]: value } }), false, 'form/setField'),

  blurField: (key) =>
    set((s) => ({ touched: { ...s.touched, [key]: true } }), false, 'form/blurField'),

  // --- sync validation ---
  validateField: (key) => {
    const { fields } = get();
    const msg = syncValidate(key, fields);
    set((s) => ({ errors: { ...s.errors, [key]: msg || undefined } }), false, 'form/validateField');
    return !msg;
  },

  validateAll: () => {
    const { fields } = get();
    const nextErrors = Object.fromEntries(
      Object.keys(fields).map((k) => [k, syncValidate(k, fields) || undefined])
    );
    set({ errors: nextErrors }, false, 'form/validateAll');
    // return overall validity
    return Object.values(nextErrors).every((v) => v == null);
  },

  // --- async validation example (username availability) ---
  checkUsername: async () => {
    const username = get().fields.username?.trim();
    if (!username) return;

    // De-dupe: one check per key
    if (get().inflightChecks['username']) return;
    set((s) => ({
      inflightChecks: { ...s.inflightChecks, username: true }
    }), false, 'form/usernameCheckStart');

    try {
      const ok = await fakeUsernameApi(username); // pretend API
      const msg = ok ? undefined : 'Username is taken';
      set((s) => ({
        errors: { ...s.errors, username: msg },
        inflightChecks: { ...s.inflightChecks, username: false }
      }), false, 'form/usernameCheckDone');
    } catch (e) {
      set((s) => ({
        errors: { ...s.errors, username: 'Could not verify username' },
        inflightChecks: { ...s.inflightChecks, username: false }
      }), false, 'form/usernameCheckError');
    }
  },

  // --- submit flow ---
  submit: async () => {
    const ok = get().validateAll();
    if (!ok) return false;

    set({ submitting: true }, false, 'form/submitStart');
    try {
      // fake API call
      await new Promise((r) => setTimeout(r, 400));
      set({ submitting: false }, false, 'form/submitSuccess');
      return true;
    } catch (e) {
      set({ submitting: false }, false, 'form/submitError');
      return false;
    }
  },

  // --- reset patterns ---
  resetTouched: () => set({ touched: {} }, false, 'form/resetTouched'),
  resetErrors: () => set({ errors: {} }, false, 'form/resetErrors'),
  resetAll: () => set({ fields: initialFields, errors: {}, touched: {}, submitting: false }, false, 'form/resetAll'),
}));

// --- simple sync validators ---
function syncValidate(key, fields) {
  const v = (s) => (s || '').trim();
  if (key === 'name' && v(fields.name).length < 2) return 'Name is too short';
  if (key === 'email' && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(v(fields.email))) return 'Enter a valid email';
  if (key === 'username' && v(fields.username).length < 3) return 'Username must be 3+ chars';
  if (key === 'password' && v(fields.password).length < 6) return 'Password must be 6+ chars';
  return undefined;
}

// --- mock async API ---
async function fakeUsernameApi(username) {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  // pseudo rule: disallow "admin" and "test"
  return !['admin', 'test'].includes(username.toLowerCase());
}`}),e.jsxs(s.Callout,{children:["I validate on ",e.jsx("code",{children:"blur"})," to show feedback at the right time, and I re-validate all fields on submit."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Using the store in a form component"}),e.jsxs("p",{children:["Subscribe to only what you need in each field (value, error, touched). Derive ",e.jsx("code",{children:"canSubmit"})," in the component."]}),e.jsx("pre",{className:"good",children:`import React, { useMemo } from 'react';
import { useSignupForm } from '../../stores/signupForm'; // path as in your project
import { shallow } from 'zustand/shallow';

export default function SignupFormCard() {
  const [fields, errors, touched, submitting] = useSignupForm(
    (s) => [s.fields, s.errors, s.touched, s.submitting],
    shallow
  );
  const setField = useSignupForm((s) => s.setField);
  const blurField = useSignupForm((s) => s.blurField);
  const checkUsername = useSignupForm((s) => s.checkUsername);
  const submit = useSignupForm((s) => s.submit);
  const resetAll = useSignupForm((s) => s.resetAll);

  const canSubmit = useMemo(() => {
    // simple heuristic: all required fields filled & no visible errors
    const required = ['name', 'email', 'username', 'password'];
    const filled = required.every((k) => String(fields[k] || '').trim().length > 0);
    const hasErrors = Object.values(errors).some(Boolean);
    return filled && !hasErrors && !submitting;
  }, [fields, errors, submitting]);

  return (
    <div>
      {/* name */}
      <label>Name</label>
      <input
        value={fields.name}
        onChange={(e) => setField('name', e.target.value)}
        onBlur={() => blurField('name')}
      />
      {touched.name && errors.name && <span className="error">{errors.name}</span>}

      {/* email */}
      <label>Email</label>
      <input
        value={fields.email}
        onChange={(e) => setField('email', e.target.value)}
        onBlur={() => blurField('email')}
      />
      {touched.email && errors.email && <span className="error">{errors.email}</span>}

      {/* username (with async check) */}
      <label>Username</label>
      <input
        value={fields.username}
        onChange={(e) => setField('username', e.target.value)}
        onBlur={() => { blurField('username'); checkUsername(); }}
      />
      {touched.username && errors.username && <span className="error">{errors.username}</span>}

      {/* password */}
      <label>Password</label>
      <input
        type="password"
        value={fields.password}
        onChange={(e) => setField('password', e.target.value)}
        onBlur={() => blurField('password')}
      />
      {touched.password && errors.password && <span className="error">{errors.password}</span>}

      <div className="row">
        <button disabled={!canSubmit} onClick={submit}>Create account</button>
        <button type="button" onClick={resetAll}>Reset</button>
      </div>
    </div>
  );
}`}),e.jsx(s.Callout,{children:"Each input subscribes to the smallest slice: its own value, its error, and touched flag."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) When to validate"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"On blur"}),": show inline messages at the right moment (not while typing)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"On submit"}),": ensure everything is valid; scroll to the first error."]}),e.jsxs("li",{children:[e.jsx("b",{children:"On change (light)"}),": for derived helpers like “password strength” meters."]})]}),e.jsx("pre",{className:"note",children:`// On submit pattern
const ok = useSignupForm.getState().validateAll();
if (!ok) {
  // focus first invalid field (optional)
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Async checks (debounce or key guards)"}),e.jsxs("p",{children:["For fields like username/email availability, either debounce the call or store a per-field",e.jsx("code",{children:"inflight"})," flag to avoid duplicate requests. For advanced cases, track a request id and ignore late responses."]}),e.jsx("pre",{className:"note",children:`// Guarded async (already shown in the store)
// If you need debounce, throttle the action from the component or wrap API calls in a debounce utility.`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Reset patterns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"resetTouched()"})," after a successful submit to hide old errors."]}),e.jsxs("li",{children:[e.jsx("code",{children:"resetAll()"})," when leaving the page or pressing a “Reset” button."]}),e.jsxs("li",{children:["Keep an ",e.jsx("code",{children:"initialFields"})," constant so resets are straightforward."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Gotchas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Don’t compute heavy validation inside selectors. Validate in store actions."}),e.jsx("li",{children:"Don’t select the entire form state in every field; subscribe narrowly."}),e.jsxs("li",{children:["Keep error messages short and consistent; store simple strings or ",e.jsx("code",{children:"undefined"}),"."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"7) Exercise ideas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Add cross-field validation (confirm password matches password)."}),e.jsx("li",{children:"Show password strength as a derived helper while typing."}),e.jsxs("li",{children:["Persist only ",e.jsx("code",{children:"name"})," and ",e.jsx("code",{children:"email"})," using ",e.jsx("code",{children:"persist"})," partialization."]})]})]})]});export{m as default};
