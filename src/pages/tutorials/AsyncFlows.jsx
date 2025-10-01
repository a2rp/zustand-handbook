import React from "react";
import { Styled } from "./styled";

const AsyncFlows = () => {
    return (
        <Styled.Page>
            <Styled.Title>Async Flows — Fetching &amp; Thunks</Styled.Title>
            <Styled.Subtitle>
                How I structure start → success/error, cancel stale requests, de-dupe calls, and do optimistic updates.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>Simple state shape I reuse for async work.</li>
                    <li>The canonical <b>start / success / error</b> pattern.</li>
                    <li>Thunks with <code>set</code> and <code>get</code>.</li>
                    <li><code>AbortController</code> to cancel stale requests.</li>
                    <li>De-duping in-flight calls.</li>
                    <li>Optimistic updates with rollback.</li>
                    <li>Retry with exponential backoff.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Baseline state shape I use</h3>
                <pre className="good">{`// stores/users.js
import { create } from 'zustand';

export const useUsers = create((set, get) => ({
  users: [],
  loading: false,
  error: null,          // string | null
  inflight: false,      // de-dupe guard
  controller: null,     // AbortController (optional)

  // actions (more below)
}));`}</pre>
                <p>This keeps every async slice predictable across the app.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Canonical start / success / error</h3>
                <pre className="good">{`// inside create((set, get) => ({ ... }))
fetchUsers: async () => {
  set({ loading: true, error: null }, false, 'users/fetchStart');
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    set({ loading: false, users: data }, false, 'users/fetchSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/fetchError');
  }
},`}</pre>
                <p>I always clear <code>error</code> at the start so the UI doesn’t show stale errors.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Thunks: read safely with <code>get()</code></h3>
                <pre className="good">{`addUser: async (user) => {
  const before = get().users; // fresh snapshot
  set({ loading: true, error: null }, false, 'users/addStart');
  try {
    const res = await fetch('/api/users', { method: 'POST', body: JSON.stringify(user) });
    const saved = await res.json();
    set({ loading: false, users: [...before, saved] }, false, 'users/addSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/addError');
  }
},`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Cancel stale requests (avoid races)</h3>
                <pre className="good">{`fetchUsersAbortable: async () => {
  // cancel any previous request
  get().controller?.abort?.();

  const controller = new AbortController();
  set({ controller, loading: true, error: null }, false, 'users/fetchStart');

  try {
    const res = await fetch('/api/users', { signal: controller.signal });
    const data = await res.json();
    set({ loading: false, users: data, controller: null }, false, 'users/fetchSuccess');
  } catch (e) {
    if (e.name === 'AbortError') { set({ controller: null, loading: false }); return; }
    set({ loading: false, error: String(e), controller: null }, false, 'users/fetchError');
  }
},`}</pre>
                <p>This prevents an older response from overwriting newer state.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>De-dupe in-flight calls</h3>
                <pre className="good">{`fetchOnce: async () => {
  if (get().inflight) return;         // guard
  set({ inflight: true, error: null }, false, 'data/fetchStart');
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    set({ inflight: false, data }, false, 'data/fetchSuccess');
  } catch (e) {
    set({ inflight: false, error: String(e) }, false, 'data/fetchError');
  }
},`}</pre>
                <p>If I need per-key de-dupe, I keep a small map in the store keyed by URL or ID.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Optimistic update + rollback</h3>
                <pre className="good">{`updateTitle: async (id, title) => {
  const prev = get().users; // snapshot for rollback
  // optimistic
  set({ users: prev.map(u => u.id === id ? { ...u, title } : u) }, false, 'users/optimistic');

  try {
    const res = await fetch('/api/users/' + id, { method: 'PATCH', body: JSON.stringify({ title }) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    set({}, false, 'users/commit'); // no-op; UI already updated
  } catch (e) {
    // rollback on failure
    set({ users: prev, error: String(e) }, false, 'users/rollback');
  }
},`}</pre>
                <p>I always snapshot before the optimistic change so rollback is trivial.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>Retry with exponential backoff (utility)</h3>
                <pre className="note">{`async function retry(fn, times = 3) {
  let delay = 300;
  for (let i = 0; i < times; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === times - 1) throw e;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

// usage inside a thunk:
await retry(() => fetch('/api/slow').then(r => {
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Error shape &amp; UI</h3>
                <ul>
                    <li>I keep <code>error</code> as <code>string | null</code> (or a tiny object).</li>
                    <li>Clear it at the start of every new attempt.</li>
                    <li>Surface errors in a toast or inline alert; never leave the user guessing.</li>
                </ul>
                <pre className="note">{`// toast example (conceptually)
// if (error) toast.error(error)`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Start → Success/Error is the backbone.</li>
                    <li>Use <code>get()</code> for fresh reads inside thunks.</li>
                    <li>Abort stale requests to avoid race conditions.</li>
                    <li>Guard duplicates with an <code>inflight</code> flag or per-key map.</li>
                    <li>Snapshot before optimistic updates; rollback on failure.</li>
                    <li>Keep loading/error shape consistent across slices.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default AsyncFlows;
