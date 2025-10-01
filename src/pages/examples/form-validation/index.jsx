import React from "react";
import { Styled } from "./styled";

/**
 * Example: Form State + Validation (notes, not live)
 * Goal: show a small, realistic pattern for fields, errors, touched, submit, and resets.
 */
const ExampleFormValidation = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Form Validation</Styled.Title>
            <Styled.Subtitle>
                Model fields, errors, and touched in a Zustand store. Validate on blur/submit. Handle async checks.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>1) Store shape (fields, errors, touched)</h3>
                <p>
                    I keep form state in one slice: <code>fields</code>, <code>errors</code>,{" "}
                    <code>touched</code>, and a few flags like <code>submitting</code>. Each action is named for devtools.
                </p>
                <pre className="good">{`// src/stores/signupForm.js
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
}`}</pre>
                <Styled.Callout>
                    I validate on <code>blur</code> to show feedback at the right time, and I re-validate all fields on submit.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using the store in a form component</h3>
                <p>
                    Subscribe to only what you need in each field (value, error, touched). Derive <code>canSubmit</code> in the component.
                </p>
                <pre className="good">{`import React, { useMemo } from 'react';
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
}`}</pre>
                <Styled.Callout>
                    Each input subscribes to the smallest slice: its own value, its error, and touched flag.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>3) When to validate</h3>
                <ul>
                    <li><b>On blur</b>: show inline messages at the right moment (not while typing).</li>
                    <li><b>On submit</b>: ensure everything is valid; scroll to the first error.</li>
                    <li><b>On change (light)</b>: for derived helpers like “password strength” meters.</li>
                </ul>
                <pre className="note">{`// On submit pattern
const ok = useSignupForm.getState().validateAll();
if (!ok) {
  // focus first invalid field (optional)
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Async checks (debounce or key guards)</h3>
                <p>
                    For fields like username/email availability, either debounce the call or store a per-field
                    <code>inflight</code> flag to avoid duplicate requests. For advanced cases, track a request id and ignore late responses.
                </p>
                <pre className="note">{`// Guarded async (already shown in the store)
// If you need debounce, throttle the action from the component or wrap API calls in a debounce utility.`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Reset patterns</h3>
                <ul>
                    <li><code>resetTouched()</code> after a successful submit to hide old errors.</li>
                    <li><code>resetAll()</code> when leaving the page or pressing a “Reset” button.</li>
                    <li>Keep an <code>initialFields</code> constant so resets are straightforward.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Gotchas</h3>
                <ul>
                    <li>Don’t compute heavy validation inside selectors. Validate in store actions.</li>
                    <li>Don’t select the entire form state in every field; subscribe narrowly.</li>
                    <li>Keep error messages short and consistent; store simple strings or <code>undefined</code>.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Exercise ideas</h3>
                <ul>
                    <li>Add cross-field validation (confirm password matches password).</li>
                    <li>Show password strength as a derived helper while typing.</li>
                    <li>Persist only <code>name</code> and <code>email</code> using <code>persist</code> partialization.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleFormValidation;
