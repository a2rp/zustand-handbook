import{d as i,j as e}from"./index-Gt8sd0pi.js";const r="var(--card, #111)",a="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",s="var(--border, #222)",o="var(--accent, #22c55e)",l="var(--danger, #ef4444)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:i.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${r};
        color: ${a};
        border: 1px solid ${s};
        border-radius: ${d};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:i.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:i.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:i.section`
        border-top: 1px dashed ${s};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${s};
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
            border: 1px dashed ${s};
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
    `,Callout:i.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${s};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Optimistic Rename + Rollback"}),e.jsx(t.Subtitle,{children:"Update the item title immediately for a snappy UI. If the server fails, restore the previous state."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Snapshot previous state before mutating."}),e.jsxs("li",{children:["Apply an optimistic update and mark the item as ",e.jsx("code",{children:"inflight"}),"."]}),e.jsx("li",{children:"Commit on success, rollback on failure."}),e.jsxs("li",{children:["Keep a simple ",e.jsx("code",{children:"error"})," shape and disable duplicate requests per item."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Store sketch (items with inflight map)"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

export const useItems = create((set, get) => ({
  items: [
    { id: 'a1', title: 'Milk' },
    { id: 'b2', title: 'Bread' },
  ],
  inflightById: {},           // e.g., { 'a1': true }
  error: null,                // string | null

  // Optimistic rename with rollback
  renameTitleOptimistic: async (id, title) => {
    const prevItems = get().items;
    const target = prevItems.find((it) => it.id === id);
    if (!target) return; // nothing to do

    // 1) optimistic update + mark inflight
    const nextItems = prevItems.map((it) =>
      it.id === id ? { ...it, title } : it
    );
    set((s) => ({
      items: nextItems,
      error: null,
      inflightById: { ...s.inflightById, [id]: true }
    }), false, 'items/rename/optimistic');

    try {
      // 2) server call (replace with your API)
      const saved = await apiUpdateTitle(id, title); // returns { id, title, ...maybe server fields }

      // 3) commit: merge any canonical fields from server (e.g., updatedAt)
      set((s) => ({
        items: s.items.map((it) =>
          it.id === id ? { ...it, ...saved } : it
        ),
        inflightById: { ...s.inflightById, [id]: false }
      }), false, 'items/rename/commit');
    } catch (e) {
      // 4) rollback
      set((s) => ({
        items: prevItems,
        inflightById: { ...s.inflightById, [id]: false },
        error: String(e)
      }), false, 'items/rename/rollback');
    }
  },
}));

// Mock API (replace in real app)
async function apiUpdateTitle(id, title) {
  await new Promise((r) => setTimeout(r, 400)); // latency
  // Randomly fail to demonstrate rollback
  if (Math.random() < 0.3) throw new Error('Network error while renaming');
  return { id, title, updatedAt: Date.now() };
}`}),e.jsxs(t.Callout,{children:["Name actions like ",e.jsx("code",{children:"items/rename/optimistic"}),", ",e.jsx("code",{children:"/commit"}),", and ",e.jsx("code",{children:"/rollback"})," for clean devtools traces."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Component usage (disable while inflight)"}),e.jsx("pre",{className:"good",children:`import React, { useState } from 'react';
import { useItems } from '../stores/items';

function Row({ item }) {
  const inflight = useItems((s) => !!s.inflightById[item.id]);
  const rename = useItems((s) => s.renameTitleOptimistic);
  const [local, setLocal] = useState(item.title);

  const onSave = () => {
    if (!local.trim() || inflight) return;
    rename(item.id, local.trim());
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        disabled={inflight}
      />
      <button onClick={onSave} disabled={inflight}>
        {inflight ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}

export default function ItemsList() {
  const items = useItems((s) => s.items);
  const error = useItems((s) => s.error);
  return (
    <div>
      {items.map((it) => <Row key={it.id} item={it} />)}
      {error && <p style={{ color: 'salmon' }}>Error: {error}</p>}
    </div>
  );
}`}),e.jsxs("p",{children:["The ",e.jsx("code",{children:"inflightById"})," map prevents duplicate requests for the same item and lets you show a per-row “Saving…” state."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Edge cases I handle"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Concurrent edits:"})," if user hits save twice quickly, the inflight guard blocks the second until the first finishes."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Server canonical fields:"})," merge ",e.jsx("code",{children:"updatedAt"}),", ",e.jsx("code",{children:"version"}),", or other server-calculated fields on commit."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Not found / validation errors:"})," rollback and show an error; keep input text so users can retry."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Undo button (optional):"})," keep a small ",e.jsx("code",{children:"lastSnapshot"})," stack if you want manual undo."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Pitfalls & fixes"}),e.jsx("pre",{className:"bad",children:`// ❌ Mutating "prevItems" directly (breaks referential integrity)
const prevItems = get().items;
prevItems.find(i => i.id === id).title = title; // mutation!`}),e.jsx("pre",{className:"good",children:`// ✅ Create a new array/object
const nextItems = prevItems.map(it => it.id === id ? { ...it, title } : it);`}),e.jsx("pre",{className:"bad",children:`// ❌ No rollback path (UI stays wrong if server fails)
try { await api(); set({ items: optimistic }); } catch (e) { /* nothing */ }`}),e.jsx("pre",{className:"good",children:`// ✅ Always rollback on error
const snapshot = get().items;
try { await api(); /* commit */ } catch (e) { set({ items: snapshot }) }`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) Testing ideas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Mock ",e.jsx("code",{children:"apiUpdateTitle"})," to resolve → assert commit state."]}),e.jsxs("li",{children:["Mock it to reject → assert items rolled back and ",e.jsx("code",{children:"error"})," set."]}),e.jsxs("li",{children:["Assert ",e.jsx("code",{children:"inflightById[id]"})," toggles true → false through the flow."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Snapshot before mutating."}),e.jsxs("li",{children:["Mark inflight per key (e.g., ",e.jsx("code",{children:"id"}),")."]}),e.jsx("li",{children:"Commit with server’s canonical fields."}),e.jsx("li",{children:"Rollback on failure and show an error."}),e.jsx("li",{children:"Never mutate the existing arrays/objects."})]})]})]});export{h as default};
