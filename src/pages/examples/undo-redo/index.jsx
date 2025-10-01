import React from "react";
import { Styled } from "./styled";

/**
 * Example: Undo / Redo (temporal state)
 * Goal: keep a history of "present" states so we can step backward/forward.
 * Style: note-style examples you can copy into your project (not live).
 */
const ExampleUndoRedo = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Undo / Redo</Styled.Title>
            <Styled.Subtitle>
                A tiny history system with <code>past</code>, <code>present</code>, and <code>future</code>.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Structure a store with <b>past → present → future</b> stacks.</li>
                    <li>Create a <code>commit()</code> helper that records history before updating.</li>
                    <li>Implement <code>undo()</code> and <code>redo()</code> with guards.</li>
                    <li>Expose <code>canUndo</code> / <code>canRedo</code> selectors for the UI.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch</h3>
                <p>
                    We keep the current app data in <code>present</code>. Every time we change it, we push the
                    old value into <code>past</code> and clear <code>future</code>.
                </p>
                <pre className="good">{`// src/stores/history.js
import { create } from 'zustand';

const HISTORY_LIMIT = 50;

export const useHistory = create((set, get) => ({
  // anything you want to edit goes inside "present"
  present: { count: 0, items: [] },

  // stacks
  past: [],
  future: [],

  // ---- helpers
  // commit a partial change to "present" and record history
  commit(partial, type = 'history/commit') {
    set((s) => {
      const prev = s.present;
      const next = { ...prev, ...partial }; // for nested data, create new references where needed
      const newPast = [...s.past, prev].slice(-HISTORY_LIMIT);
      return { past: newPast, present: next, future: [] };
    }, false, type);
  },

  // commit via function: (prev) => next
  commitFn(updater, type = 'history/commitFn') {
    set((s) => {
      const prev = s.present;
      const next = updater(prev);
      const newPast = [...s.past, prev].slice(-HISTORY_LIMIT);
      return { past: newPast, present: next, future: [] };
    }, false, type);
  },

  // undo one step (move last past -> present, and old present -> future)
  undo() {
    set((s) => {
      if (s.past.length === 0) return s; // nothing to do
      const prev = s.past[s.past.length - 1];
      const newPast = s.past.slice(0, -1);
      const newFuture = [s.present, ...s.future];
      return { past: newPast, present: prev, future: newFuture };
    }, false, 'history/undo');
  },

  // redo one step (move first future -> present, and old present -> past)
  redo() {
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      const newFuture = s.future.slice(1);
      const newPast = [...s.past, s.present].slice(-HISTORY_LIMIT);
      return { past: newPast, present: next, future: newFuture };
    }, false, 'history/redo');
  },

  // convenience actions for this example
  inc: () => get().commitFn((prev) => ({ ...prev, count: prev.count + 1 }), 'counter/increment'),
  dec: () => get().commitFn((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }), 'counter/decrement'),
  addItem: (title) =>
    get().commitFn(
      (prev) => ({ ...prev, items: [...prev.items, { id: crypto.randomUUID?.() || Date.now(), title }] }),
      'items/add'
    ),
  removeItem: (id) =>
    get().commitFn(
      (prev) => ({ ...prev, items: prev.items.filter((it) => it.id !== id) }),
      'items/remove'
    ),
}));`}</pre>
                <Styled.Callout>
                    Use <code>commit()</code> for shallow merges and <code>commitFn()</code> when you need to
                    read the previous value or update nested arrays/objects.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) UI selectors (what components subscribe to)</h3>
                <pre className="note">{`import { shallow } from 'zustand/shallow';
import { useHistory } from '../stores/history';

// single fields
const count = useHistory((s) => s.present.count);
const items = useHistory((s) => s.present.items);

// guards (enable/disable buttons)
const [canUndo, canRedo] = useHistory(
  (s) => [s.past.length > 0, s.future.length > 0],
  shallow
);

// actions
const inc = useHistory((s) => s.inc);
const undo = useHistory((s) => s.undo);
const redo = useHistory((s) => s.redo);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Example button wiring (sketch)</h3>
                <pre className="good">{`function Toolbar() {
  const [canUndo, canRedo] = useHistory(
    (s) => [s.past.length > 0, s.future.length > 0],
    shallow
  );
  const undo = useHistory((s) => s.undo);
  const redo = useHistory((s) => s.redo);

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Keyboard shortcuts (optional)</h3>
                <p>
                    This sketch listens for <code>Ctrl/Cmd+Z</code> and <code>Ctrl/Cmd+Shift+Z</code>.
                </p>
                <pre className="note">{`useEffect(() => {
  function onKey(e) {
    const z = e.key.toLowerCase() === 'z';
    const meta = e.ctrlKey || e.metaKey;
    if (!meta || !z) return;

    if (e.shiftKey) {
      useHistory.getState().redo();
    } else {
      useHistory.getState().undo();
    }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Gotchas</h3>
                <ul>
                    <li>History can grow; use a <code>HISTORY_LIMIT</code> to cap memory.</li>
                    <li>Don’t put non-serializable stuff (DOM nodes, functions) inside <code>present</code>.</li>
                    <li>
                        If you persist the store, consider <b>partializing</b> to save only{" "}
                        <code>present</code> and drop <code>past/future</code>:
                    </li>
                </ul>
                <pre className="note">{`// with persist middleware (sketch)
persist(config, {
  name: 'app',
  partialize: (state) => ({ present: state.present }), // don't save history stacks
  version: 1,
  migrate: (persisted, v) => persisted, // add when shapes change
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Checklist</h3>
                <ul>
                    <li>Keep edits inside a single <code>present</code> object.</li>
                    <li>Wrap changes with <code>commit</code>/<code>commitFn</code> so history stays consistent.</li>
                    <li>Clear <code>future</code> on new commits (standard editor behavior).</li>
                    <li>Guard undo/redo buttons with <code>past.length</code>/<code>future.length</code>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleUndoRedo;
