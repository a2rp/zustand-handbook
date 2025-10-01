import{d as s,j as e}from"./index-CpvfKB5t.js";const n="var(--card, #111)",t="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",l="var(--border, #222)",d="var(--accent, #22c55e)",r="var(--danger, #ef4444)",a="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",o={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${n};
        color: ${t};
        border: 1px solid ${l};
        border-radius: ${a};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${i};
    `,Section:s.section`
        border-top: 1px dashed ${l};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${l};
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
            border: 1px dashed ${l};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${d};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${r};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 10px;
        padding: 10px 12px;
        border: 1px solid ${l};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        color: ${i};
    `},h=()=>e.jsxs(o.Page,{children:[e.jsx(o.Title,{children:"Example — Modal Manager"}),e.jsx(o.Subtitle,{children:"A tiny global UI slice that opens and closes modals (stacked), with payloads."}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Design a ",e.jsx("b",{children:"UI slice"})," for modals: ",e.jsx("code",{children:"modals: []"})," stack + actions."]}),e.jsxs("li",{children:["Open by ",e.jsx("code",{children:"type"})," with a ",e.jsx("code",{children:"payload"}),"; close top/specific/all."]}),e.jsxs("li",{children:["Render a ",e.jsx("b",{children:"ModalRoot"})," that decides which modal UI to show."]}),e.jsx("li",{children:"Selectors for top modal; keyboard ESC to close."})]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"1) Store: UI slice"}),e.jsxs("p",{children:["Create ",e.jsx("code",{children:"src/stores/ui.js"})," (or merge into your global store):"]}),e.jsx("pre",{className:"good",children:`// src/stores/ui.js
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
}));`}),e.jsxs(o.Callout,{children:["Don’t persist this slice. If you use ",e.jsx("code",{children:"persist"}),", ",e.jsx("b",{children:"exclude"})," ",e.jsx("code",{children:"modals"})," via partialization."]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"2) Opening & closing from any component"}),e.jsx("pre",{className:"good",children:`import { useUI } from '../stores/ui';

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
useUI.getState().closeAllModals();`}),e.jsx("pre",{className:"note",children:`// Optional "promise confirm" helper
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
}`})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"3) ModalRoot (switcher component)"}),e.jsxs("p",{children:["This component maps the stack to UI. Put it near the app root (e.g., in"," ",e.jsx("code",{children:"App.jsx"}),")."]}),e.jsx("pre",{className:"good",children:`// src/components/ModalRoot.jsx
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
}`}),e.jsx("pre",{className:"note",children:`// In App.jsx (near the end of layout)
import ModalRoot from './components/ModalRoot';
...
<ModalRoot />`})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"4) Selectors you’ll use often"}),e.jsx("pre",{className:"note",children:`// is any modal open?
const hasModal = useUI((s) => s.modals.length > 0);

// just the top modal
const top = useUI((s) => s.modals[s.modals.length - 1] ?? null);`})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"5) Accessibility & UX notes"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add ",e.jsx("code",{children:'role="dialog"'})," and ",e.jsx("code",{children:'aria-modal="true"'})," (shown above)."]}),e.jsx("li",{children:"Focus the first focusable element when the modal opens; return focus on close."}),e.jsxs("li",{children:["Trap ",e.jsx("kbd",{children:"Tab"})," inside the modal (or use a small utility)."]}),e.jsxs("li",{children:["Close on ",e.jsx("kbd",{children:"Esc"})," and overlay click (top-most only)."]}),e.jsxs("li",{children:["Prevent background scroll by toggling a ",e.jsx("code",{children:"body.no-scroll"})," class while any modal is open."]})]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"6) Common pitfalls"}),e.jsx("pre",{className:"bad",children:`// ❌ Storing JSX elements inside the store
modals: [<ConfirmModal />]`}),e.jsx("pre",{className:"good",children:`// ✅ Store plain data (type + props), decide UI in ModalRoot
modals: [{ id, type: 'confirm', props: { title, message } }]`}),e.jsx("pre",{className:"bad",children:"// ❌ Persisting the UI slice (modals) with localStorage"}),e.jsx("pre",{className:"good",children:"// ✅ Exclude UI slice in persist(). UI is ephemeral"})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"7) Variations you can add"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Info"})," modal (",e.jsx("code",{children:"type: 'info'"}),") with just an OK button."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Form"})," modal (",e.jsx("code",{children:"type: 'editName'"}),") with fields in props, result via"," ",e.jsx("code",{children:"onResolve"}),"."]}),e.jsxs("li",{children:["Prevent closing when ",e.jsx("code",{children:"busy"})," (disable ESC/overlay based on props)."]}),e.jsx("li",{children:"Animate open/close (CSS or a tiny animation lib)."})]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Global UI slice with a ",e.jsx("b",{children:"stack"})," of plain objects."]}),e.jsxs("li",{children:["Open with ",e.jsx("code",{children:"type"})," + ",e.jsx("code",{children:"props"}),"; close top/specific/all."]}),e.jsxs("li",{children:[e.jsx("b",{children:"ModalRoot"})," maps data → components; no JSX in the store."]}),e.jsx("li",{children:"Don’t persist transient UI state."}),e.jsx("li",{children:"Keyboard and focus handling = good UX."})]})]})]});export{h as default};
