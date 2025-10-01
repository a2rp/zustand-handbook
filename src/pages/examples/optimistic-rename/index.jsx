import React from "react";
import { Styled } from "./styled";

/**
 * Example: Optimistic Rename + Rollback
 * Goal: update UI instantly, then commit on success or rollback on failure.
 * Style: note-style examples (non-live) you can paste into your app.
 */
const ExampleOptimisticRename = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Optimistic Rename + Rollback</Styled.Title>
            <Styled.Subtitle>
                Update the item title immediately for a snappy UI. If the server fails, restore the previous state.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Snapshot previous state before mutating.</li>
                    <li>Apply an optimistic update and mark the item as <code>inflight</code>.</li>
                    <li>Commit on success, rollback on failure.</li>
                    <li>Keep a simple <code>error</code> shape and disable duplicate requests per item.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch (items with inflight map)</h3>
                <pre className="good">{`import { create } from 'zustand';

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
}`}</pre>
                <Styled.Callout>
                    Name actions like <code>items/rename/optimistic</code>, <code>/commit</code>, and <code>/rollback</code> for clean devtools traces.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Component usage (disable while inflight)</h3>
                <pre className="good">{`import React, { useState } from 'react';
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
}`}</pre>
                <p>
                    The <code>inflightById</code> map prevents duplicate requests for the same item and lets you show a
                    per-row “Saving…” state.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Edge cases I handle</h3>
                <ul>
                    <li>
                        <b>Concurrent edits:</b> if user hits save twice quickly, the inflight guard blocks the second until the first finishes.
                    </li>
                    <li>
                        <b>Server canonical fields:</b> merge <code>updatedAt</code>, <code>version</code>, or other server-calculated fields on commit.
                    </li>
                    <li>
                        <b>Not found / validation errors:</b> rollback and show an error; keep input text so users can retry.
                    </li>
                    <li>
                        <b>Undo button (optional):</b> keep a small <code>lastSnapshot</code> stack if you want manual undo.
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Pitfalls & fixes</h3>
                <pre className="bad">{`// ❌ Mutating "prevItems" directly (breaks referential integrity)
const prevItems = get().items;
prevItems.find(i => i.id === id).title = title; // mutation!`}</pre>
                <pre className="good">{`// ✅ Create a new array/object
const nextItems = prevItems.map(it => it.id === id ? { ...it, title } : it);`}</pre>

                <pre className="bad">{`// ❌ No rollback path (UI stays wrong if server fails)
try { await api(); set({ items: optimistic }); } catch (e) { /* nothing */ }`}</pre>
                <pre className="good">{`// ✅ Always rollback on error
const snapshot = get().items;
try { await api(); /* commit */ } catch (e) { set({ items: snapshot }) }`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Testing ideas</h3>
                <ul>
                    <li>Mock <code>apiUpdateTitle</code> to resolve → assert commit state.</li>
                    <li>Mock it to reject → assert items rolled back and <code>error</code> set.</li>
                    <li>Assert <code>inflightById[id]</code> toggles true → false through the flow.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Snapshot before mutating.</li>
                    <li>Mark inflight per key (e.g., <code>id</code>).</li>
                    <li>Commit with server’s canonical fields.</li>
                    <li>Rollback on failure and show an error.</li>
                    <li>Never mutate the existing arrays/objects.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleOptimisticRename;
