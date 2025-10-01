import React from "react";
import { Styled } from "./styled";

/**
 * Example: Modal Manager (Global UI)
 * Goal: Open/close stacked modals from anywhere, pass payload, close top, close specific, close all.
 * Style: note-style snippets you can copy into your app.
 */
const ExampleModalManager = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Modal Manager</Styled.Title>
            <Styled.Subtitle>
                A tiny global UI slice that opens and closes modals (stacked), with payloads.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>
                        Design a <b>UI slice</b> for modals: <code>modals: []</code> stack + actions.
                    </li>
                    <li>
                        Open by <code>type</code> with a <code>payload</code>; close top/specific/all.
                    </li>
                    <li>
                        Render a <b>ModalRoot</b> that decides which modal UI to show.
                    </li>
                    <li>Selectors for top modal; keyboard ESC to close.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store: UI slice</h3>
                <p>Create <code>src/stores/ui.js</code> (or merge into your global store):</p>
                <pre className="good">{`// src/stores/ui.js
import { create } from 'zustand';

export const useUI = create((set, get) => ({
  // stack of { id, type, props }
  modals: [],
  _seq: 0,

  openModal: (type, props = {}) => {
    const id = get()._seq + 1;
    set({ _seq: id }, false, 'ui/modal/seq');
    set((s) => ({ modals: [...s.modals, { id, type, props }] }), false, 'ui/modal/open');
    return id; // useful if you want to close by id later
  },

  // if id omitted, close the topmost modal
  closeModal: (id) =>
    set((s) => {
      if (!s.modals.length) return {};
      if (!id) return { modals: s.modals.slice(0, -1) };
      return { modals: s.modals.filter((m) => m.id !== id) };
    }, false, 'ui/modal/close'),

  closeAllModals: () => set({ modals: [] }, false, 'ui/modal/closeAll'),

  // convenience read helpers (not required)
  isOpen: (type) => get().modals.some((m) => m.type === type),
  topModal: () => get().modals[get().modals.length - 1] ?? null,
}));`}</pre>
                <Styled.Callout>
                    Don’t persist this slice. If you use <code>persist</code>, <b>exclude</b>{" "}
                    <code>modals</code> via partialization.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Opening &amp; closing from any component</h3>
                <pre className="good">{`import { useUI } from '../stores/ui';

// Open a confirm modal with payload
const id = useUI.getState().openModal('confirm', {
  title: 'Delete item?',
  message: 'This action cannot be undone.',
  onConfirm: () => console.log('confirmed'),
});

// Close the top-most modal
useUI.getState().closeModal();

// Close a specific modal by id
useUI.getState().closeModal(id);

// Close all
useUI.getState().closeAllModals();`}</pre>
                <pre className="note">{`// Optional "promise confirm" helper
export function confirm(opts) {
  return new Promise((resolve) => {
    const id = useUI.getState().openModal('confirm', {
      ...opts,
      onResolve: (ok) => {
        resolve(!!ok);
        useUI.getState().closeModal(id);
      },
    });
  });
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) ModalRoot (switcher component)</h3>
                <p>
                    This component maps the stack to UI. Put it near the app root (e.g., in{" "}
                    <code>App.jsx</code>).
                </p>
                <pre className="good">{`// src/components/ModalRoot.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUI } from '../stores/ui';

function ConfirmModal({ id, title, message, onConfirm, onResolve }) {
  const close = () => useUI.getState().closeModal(id);
  const confirm = () => { onConfirm?.(); onResolve?.(true); close(); };
  const cancel = () => { onResolve?.(false); close(); };

  // Close on ESC if this is the top-most (handled by parent too; shown here for clarity)
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') close(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [id]);

  return (
    <div role="dialog" aria-modal="true" className="modal">
      <div className="card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="row">
          <button onClick={confirm}>Confirm</button>
          <button onClick={cancel}>Cancel</button>
        </div>
      </div>
      <div className="overlay" onClick={close} />
    </div>
  );
}

export default function ModalRoot() {
  const modals = useUI((s) => s.modals); // render all (stacked)
  if (!modals.length) return null;

  return createPortal(
    <div className="modal-layer">
      {modals.map(({ id, type, props }, i) => {
        const z = 1000 + i * 2; // simple stacking
        if (type === 'confirm') {
          return <div key={id} style={{ zIndex: z }}>
            <ConfirmModal id={id} {...props} />
          </div>;
        }
        // other modal types...
        return null;
      })}
    </div>,
    document.body
  );
}`}</pre>
                <pre className="note">{`// In App.jsx (near the end of layout)
import ModalRoot from './components/ModalRoot';
...
<ModalRoot />`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Selectors you’ll use often</h3>
                <pre className="note">{`// is any modal open?
const hasModal = useUI((s) => s.modals.length > 0);

// just the top modal
const top = useUI((s) => s.modals[s.modals.length - 1] ?? null);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Accessibility &amp; UX notes</h3>
                <ul>
                    <li>
                        Add <code>role="dialog"</code> and <code>aria-modal="true"</code> (shown above).
                    </li>
                    <li>Focus the first focusable element when the modal opens; return focus on close.</li>
                    <li>Trap <kbd>Tab</kbd> inside the modal (or use a small utility).</li>
                    <li>Close on <kbd>Esc</kbd> and overlay click (top-most only).</li>
                    <li>
                        Prevent background scroll by toggling a <code>body.no-scroll</code> class while any
                        modal is open.
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Common pitfalls</h3>
                <pre className="bad">{`// ❌ Storing JSX elements inside the store
modals: [<ConfirmModal />]`}</pre>
                <pre className="good">{`// ✅ Store plain data (type + props), decide UI in ModalRoot
modals: [{ id, type: 'confirm', props: { title, message } }]`}</pre>
                <pre className="bad">{`// ❌ Persisting the UI slice (modals) with localStorage`}</pre>
                <pre className="good">{`// ✅ Exclude UI slice in persist(). UI is ephemeral`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Variations you can add</h3>
                <ul>
                    <li>
                        <b>Info</b> modal (<code>type: 'info'</code>) with just an OK button.
                    </li>
                    <li>
                        <b>Form</b> modal (<code>type: 'editName'</code>) with fields in props, result via{" "}
                        <code>onResolve</code>.
                    </li>
                    <li>Prevent closing when <code>busy</code> (disable ESC/overlay based on props).</li>
                    <li>Animate open/close (CSS or a tiny animation lib).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>
                        Global UI slice with a <b>stack</b> of plain objects.
                    </li>
                    <li>
                        Open with <code>type</code> + <code>props</code>; close top/specific/all.
                    </li>
                    <li>
                        <b>ModalRoot</b> maps data → components; no JSX in the store.
                    </li>
                    <li>Don’t persist transient UI state.</li>
                    <li>Keyboard and focus handling = good UX.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleModalManager;
