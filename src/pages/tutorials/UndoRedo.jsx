import React from "react";
import { Styled } from "./styled";

const UndoRedo = () => {
    return (
        <Styled.Page>
            <Styled.Title>Undo / Redo — Temporal State</Styled.Title>
            <Styled.Subtitle>
                I add a tiny “history layer” so users can step backward and forward safely.
            </Styled.Subtitle>

            {/* What & why */}
            <Styled.Section>
                <h3>Idea in one minute</h3>
                <ul>
                    <li>I keep <b>past → present → future</b> snapshots of the data I care about.</li>
                    <li>Every change records the previous snapshot in <code>past</code> and clears <code>future</code>.</li>
                    <li><b>Undo</b> pops from <code>past</code> and pushes the current state to <code>future</code>.</li>
                    <li><b>Redo</b> shifts from <code>future</code> and pushes the current state to <code>past</code>.</li>
                </ul>
            </Styled.Section>

            {/* Minimal shape */}
            <Styled.Section>
                <h3>Minimal store shape I use</h3>
                <pre className="good">{`// Just the parts I want to time-travel (domain-only)
type Snapshot = {
  text: string;      // or { items: [...] }, form values, canvas, etc.
};

type History = {
  past: Snapshot[];
  future: Snapshot[];
};

type State = Snapshot & History;`}</pre>
                <Styled.Callout>
                    I snapshot only the domain data (not UI flags, not functions). That keeps history
                    small and avoids weirdness when replacing state.
                </Styled.Callout>
            </Styled.Section>

            {/* Simple, readable recipe */}
            <Styled.Section>
                <h3>Simple recipe (notes)</h3>
                <pre className="good">{`import { create } from 'zustand';

const LIMIT = 50; // history size guard

export const useDoc = create((set, get) => ({
  // --- domain (what I want to undo/redo)
  text: '',

  // --- history
  past: [],
  future: [],

  // --- helpers
  _snapshot() {
    const s = get();
    // snapshot only domain fields
    return { text: s.text };
  },

  _pushPast(snap) {
    set((s) => ({
      past: [...s.past, snap].slice(-LIMIT) // keep last LIMIT
    }));
  },

  // --- actions
  type(newText) {
    const prev = get()._snapshot();      // record current before change
    set({ text: newText, future: [] });  // apply change & clear redo
    get()._pushPast(prev);
  },

  undo() {
    const s = get();
    if (s.past.length === 0) return;
    const prev = s.past[s.past.length - 1];
    const curr = s._snapshot();
    set({
      text: prev.text,
      past: s.past.slice(0, -1),
      future: [curr, ...s.future],
    }, false, 'history/undo');
  },

  redo() {
    const s = get();
    if (s.future.length === 0) return;
    const next = s.future[0];
    const curr = s._snapshot();
    set({
      text: next.text,
      past: [...s.past, curr],
      future: s.future.slice(1),
    }, false, 'history/redo');
  },

  canUndo() { return get().past.length > 0 },
  canRedo() { return get().future.length > 0 },

  reset() { set({ text: '', past: [], future: [] }, false, 'history/reset') },
}));`}</pre>
                <ul>
                    <li><code>type()</code> is my “mutating” action. It records a snapshot first, then applies the change.</li>
                    <li>Both <code>undo()</code> and <code>redo()</code> are just array moves of snapshots.</li>
                    <li><code>LIMIT</code> prevents unbounded memory use.</li>
                </ul>
            </Styled.Section>

            {/* Usage example */}
            <Styled.Section>
                <h3>How I consume it in a component</h3>
                <pre className="note">{`import { useDoc } from '../stores/doc';

function Editor() {
  const [text, canUndo, canRedo] = useDoc((s) => [s.text, s.canUndo(), s.canRedo()]);
  const type = useDoc((s) => s.type);
  const undo = useDoc((s) => s.undo);
  const redo = useDoc((s) => s.redo);

  return (
    <div>
      <textarea value={text} onChange={(e) => type(e.target.value)} />
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}`}</pre>
                <Styled.Callout>
                    I select only what I need. For multiple values, a tuple selector works well.
                </Styled.Callout>
            </Styled.Section>

            {/* Patch vs replace */}
            <Styled.Section>
                <h3>Patch vs replace (important)</h3>
                <ul>
                    <li>If I store only domain fields in snapshots, I can <b>patch</b> them back into state.</li>
                    <li>If I store full state objects (including functions), I must <b>replace</b>, which can be risky.</li>
                </ul>
                <pre className="note">{`// Patch style (safe)
const snap = { text: '...' };
set((s) => ({ ...s, ...snap }), false, 'history/apply');`}</pre>
            </Styled.Section>

            {/* Excluding fields */}
            <Styled.Section>
                <h3>What I keep out of history</h3>
                <ul>
                    <li>UI flags like <code>loading</code>, <code>modalOpen</code>, toasts.</li>
                    <li>Server-only data that can be re-fetched.</li>
                    <li>Large caches (I store keys, not the entire cache object).</li>
                </ul>
            </Styled.Section>

            {/* Optimizations & tips */}
            <Styled.Section>
                <h3>Small optimizations I like</h3>
                <ul>
                    <li><b>Coalesce rapid edits:</b> throttle/debounce <code>type()</code> if typing floods history.</li>
                    <li><b>Per-document history:</b> keep a map of histories by <code>docId</code> if needed.</li>
                    <li><b>Persist carefully:</b> if I persist history, I cap <code>LIMIT</code> lower (e.g., 10–20).</li>
                </ul>
            </Styled.Section>

            {/* Testing */}
            <Styled.Section>
                <h3>Quick test outline</h3>
                <pre className="note">{`// Pseudo with your favorite test runner
const s = useDoc.getState();
s.type('A'); s.type('AB'); s.type('ABC');
expect(s.past).toHaveLength(3);

s.undo(); // ABC -> AB
expect(useDoc.getState().text).toBe('AB');

s.redo(); // AB -> ABC
expect(useDoc.getState().text).toBe('ABC');`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default UndoRedo;
