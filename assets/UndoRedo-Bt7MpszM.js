import{j as e}from"./index-D0NhHHfM.js";import{S as s}from"./styled-9asSRIYq.js";const r=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Undo / Redo — Temporal State"}),e.jsx(s.Subtitle,{children:"I add a tiny “history layer” so users can step backward and forward safely."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Idea in one minute"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["I keep ",e.jsx("b",{children:"past → present → future"})," snapshots of the data I care about."]}),e.jsxs("li",{children:["Every change records the previous snapshot in ",e.jsx("code",{children:"past"})," and clears ",e.jsx("code",{children:"future"}),"."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Undo"})," pops from ",e.jsx("code",{children:"past"})," and pushes the current state to ",e.jsx("code",{children:"future"}),"."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Redo"})," shifts from ",e.jsx("code",{children:"future"})," and pushes the current state to ",e.jsx("code",{children:"past"}),"."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Minimal store shape I use"}),e.jsx("pre",{className:"good",children:`// Just the parts I want to time-travel (domain-only)
type Snapshot = {
  text: string;      // or { items: [...] }, form values, canvas, etc.
};

type History = {
  past: Snapshot[];
  future: Snapshot[];
};

type State = Snapshot & History;`}),e.jsx(s.Callout,{children:"I snapshot only the domain data (not UI flags, not functions). That keeps history small and avoids weirdness when replacing state."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Simple recipe (notes)"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

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
}));`}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"type()"})," is my “mutating” action. It records a snapshot first, then applies the change."]}),e.jsxs("li",{children:["Both ",e.jsx("code",{children:"undo()"})," and ",e.jsx("code",{children:"redo()"})," are just array moves of snapshots."]}),e.jsxs("li",{children:[e.jsx("code",{children:"LIMIT"})," prevents unbounded memory use."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"How I consume it in a component"}),e.jsx("pre",{className:"note",children:`import { useDoc } from '../stores/doc';

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
}`}),e.jsx(s.Callout,{children:"I select only what I need. For multiple values, a tuple selector works well."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Patch vs replace (important)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["If I store only domain fields in snapshots, I can ",e.jsx("b",{children:"patch"})," them back into state."]}),e.jsxs("li",{children:["If I store full state objects (including functions), I must ",e.jsx("b",{children:"replace"}),", which can be risky."]})]}),e.jsx("pre",{className:"note",children:`// Patch style (safe)
const snap = { text: '...' };
set((s) => ({ ...s, ...snap }), false, 'history/apply');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I keep out of history"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["UI flags like ",e.jsx("code",{children:"loading"}),", ",e.jsx("code",{children:"modalOpen"}),", toasts."]}),e.jsx("li",{children:"Server-only data that can be re-fetched."}),e.jsx("li",{children:"Large caches (I store keys, not the entire cache object)."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Small optimizations I like"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Coalesce rapid edits:"})," throttle/debounce ",e.jsx("code",{children:"type()"})," if typing floods history."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Per-document history:"})," keep a map of histories by ",e.jsx("code",{children:"docId"})," if needed."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Persist carefully:"})," if I persist history, I cap ",e.jsx("code",{children:"LIMIT"})," lower (e.g., 10–20)."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick test outline"}),e.jsx("pre",{className:"note",children:`// Pseudo with your favorite test runner
const s = useDoc.getState();
s.type('A'); s.type('AB'); s.type('ABC');
expect(s.past).toHaveLength(3);

s.undo(); // ABC -> AB
expect(useDoc.getState().text).toBe('AB');

s.redo(); // AB -> ABC
expect(useDoc.getState().text).toBe('ABC');`})]})]});export{r as default};
