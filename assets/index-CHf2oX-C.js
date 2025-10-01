import{d as s,j as e}from"./index-CpvfKB5t.js";const i="var(--card, #111)",r="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",o="var(--border, #222)",d="var(--accent, #22c55e)",n="var(--danger, #ef4444)",l="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${i};
        color: ${r};
        border: 1px solid ${o};
        border-radius: ${l};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${a};
    `,Section:s.section`
        border-top: 1px dashed ${o};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${o};
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
            border: 1px dashed ${o};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${d};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${n};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${o};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},p=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Toast Queue"}),e.jsx(t.Subtitle,{children:"A tiny global UI slice to push toasts, auto-dismiss them, and remove on demand."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Model a global UI slice (",e.jsx("code",{children:"toasts"})," array + actions)."]}),e.jsxs("li",{children:["Auto-dismiss with safe ",e.jsx("code",{children:"setTimeout"})," cleanup."]}),e.jsx("li",{children:"Optional de-duplication by a stable key."}),e.jsxs("li",{children:["Accessible markup: ",e.jsx("code",{children:'role="status"'}),", ",e.jsx("code",{children:"aria-live"}),"."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Store sketch"}),e.jsxs("p",{children:["Create ",e.jsx("code",{children:"src/stores/toast.js"})," (or add to your UI slice):"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

// Small ID helper (use crypto.randomUUID() if available)
const uid = () => (globalThis.crypto?.randomUUID?.() ?? \`t_\${Date.now()}_\${Math.random().toString(16).slice(2)}\`);

export const useToast = create((set, get) => ({
  toasts: [],                // [{ id, type, message, timeout }]
  timersById: {},            // { [id]: timeoutId }

  push: (t) => {
    const id = t.id ?? uid();
    const item = { id, type: t.type ?? 'info', message: t.message ?? '', timeout: t.timeout ?? 3000, key: t.key };
    // optional dedupe by key
    if (item.key && get().toasts.some(x => x.key === item.key)) return;

    set((s) => ({ toasts: [...s.toasts, item] }), false, 'toast/push');

    // auto-dismiss timer
    if (item.timeout && item.timeout > 0) {
      const handle = setTimeout(() => {
        get().remove(id);
      }, item.timeout);
      set((s) => ({ timersById: { ...s.timersById, [id]: handle } }), false, 'toast/timerSet');
    }
  },

  remove: (id) => {
    // clear timer if present
    const { timersById } = get();
    const handle = timersById[id];
    if (handle) {
      clearTimeout(handle);
      const { [id]: _, ...rest } = timersById;
      set({ timersById: rest }, false, 'toast/timerClear');
    }
    set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) }), false, 'toast/remove');
  },

  clearAll: () => {
    // clear all timers
    const { timersById } = get();
    Object.values(timersById).forEach(clearTimeout);
    set({ toasts: [], timersById: {} }, false, 'toast/clearAll');
  },
}));`}),e.jsx(t.Callout,{children:"Keep timer handles in the store (by toast id) so removing/clearing is safe even if the component unmounts or routes change."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Using it in UI"}),e.jsx("p",{children:"Render a simple toast list somewhere near the root layout:"}),e.jsx("pre",{className:"good",children:`// ToastList.jsx
import React from 'react';
import { useToast } from '../stores/toast';

export default function ToastList() {
  const toasts = useToast((s) => s.toasts);
  const remove = useToast((s) => s.remove);

  return (
    <div aria-live="polite" aria-atomic="true" role="status" style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding: 10, borderRadius: 8, border: '1px solid #222', background: 'rgba(255,255,255,0.06)' }}>
          <strong style={{ textTransform: 'capitalize' }}>{t.type}</strong>: {t.message}
          <button onClick={() => remove(t.id)} style={{ marginLeft: 8 }}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}`}),e.jsxs("p",{children:["Mount ",e.jsx("code",{children:"<ToastList />"})," once in your app layout (near ",e.jsx("code",{children:"<Footer />"})," is fine)."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Triggering toasts"}),e.jsx("pre",{className:"note",children:`import { useToast } from '../stores/toast';

// success
useToast.getState().push({ type: 'success', message: 'Saved!', key: 'save-ok' });

// error with longer timeout
useToast.getState().push({ type: 'error', message: 'Network error', timeout: 5000 });

// info without auto-dismiss
useToast.getState().push({ type: 'info', message: 'Sticky toast', timeout: 0 });`}),e.jsxs("p",{children:["Pass a ",e.jsx("code",{children:"key"})," to dedupe the same toast (e.g., keep only one “Saved!” at a time)."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Gotchas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Always clear timers when removing toasts (memory leak otherwise)."}),e.jsx("li",{children:"Don’t keep huge objects in each toast; keep it light (type/message/id)."}),e.jsxs("li",{children:["For theming, map ",e.jsx("code",{children:"type"})," to styles in the component (not in the store)."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) Exercise ideas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Add a progress bar that shrinks until timeout."}),e.jsx("li",{children:"Add positions (top-right, bottom-left…)."}),e.jsx("li",{children:"Group duplicate messages and show a counter."})]})]})]});export{p as default};
