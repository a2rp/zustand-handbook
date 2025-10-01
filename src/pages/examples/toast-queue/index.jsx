import React from "react";
import { Styled } from "./styled";

/**
 * Example: Toast Queue (global UI slice)
 * Goal: enqueue → auto-dismiss → remove, with safe timers and dedupe.
 * Style: note-style examples to copy (not live).
 */
const ExampleToastQueue = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Toast Queue</Styled.Title>
            <Styled.Subtitle>
                A tiny global UI slice to push toasts, auto-dismiss them, and remove on demand.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>Model a global UI slice (<code>toasts</code> array + actions).</li>
                    <li>Auto-dismiss with safe <code>setTimeout</code> cleanup.</li>
                    <li>Optional de-duplication by a stable key.</li>
                    <li>Accessible markup: <code>role="status"</code>, <code>aria-live</code>.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch</h3>
                <p>Create <code>src/stores/toast.js</code> (or add to your UI slice):</p>
                <pre className="good">{`import { create } from 'zustand';

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
}));`}</pre>
                <Styled.Callout>
                    Keep timer handles in the store (by toast id) so removing/clearing is safe even if
                    the component unmounts or routes change.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using it in UI</h3>
                <p>Render a simple toast list somewhere near the root layout:</p>
                <pre className="good">{`// ToastList.jsx
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
}`}</pre>
                <p>Mount <code>&lt;ToastList /&gt;</code> once in your app layout (near <code>&lt;Footer /&gt;</code> is fine).</p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Triggering toasts</h3>
                <pre className="note">{`import { useToast } from '../stores/toast';

// success
useToast.getState().push({ type: 'success', message: 'Saved!', key: 'save-ok' });

// error with longer timeout
useToast.getState().push({ type: 'error', message: 'Network error', timeout: 5000 });

// info without auto-dismiss
useToast.getState().push({ type: 'info', message: 'Sticky toast', timeout: 0 });`}</pre>
                <p>
                    Pass a <code>key</code> to dedupe the same toast (e.g., keep only one “Saved!” at a time).
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Gotchas</h3>
                <ul>
                    <li>Always clear timers when removing toasts (memory leak otherwise).</li>
                    <li>Don’t keep huge objects in each toast; keep it light (type/message/id).</li>
                    <li>For theming, map <code>type</code> to styles in the component (not in the store).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Exercise ideas</h3>
                <ul>
                    <li>Add a progress bar that shrinks until timeout.</li>
                    <li>Add positions (top-right, bottom-left…).</li>
                    <li>Group duplicate messages and show a counter.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleToastQueue;
