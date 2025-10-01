import React from "react";
import { Styled } from "./styled";

const AsyncPatterns = () => {
    return (
        <Styled.Page>
            <Styled.Title>Async Patterns — Loading, Error, Optimistic</Styled.Title>
            <Styled.Subtitle>
                Practical patterns I use for network calls and side-effects with Zustand.
            </Styled.Subtitle>

            {/* Shape I reuse */}
            <Styled.Section>
                <h3>My go-to slice shape</h3>
                <pre className="good">{`import { create } from 'zustand';

export const useUsers = create((set, get) => ({
  data: [],                 // the payload
  loading: false,           // global loading
  error: null,              // string or { message, code }
  inflight: false,          // de-dupe guard
  requests: {},             // optional { [key]: AbortController }
  page: 1, hasMore: true,   // pagination sketch

  fetchAll: async () => {
    if (get().inflight) return;
    set({ inflight: true, loading: true, error: null }, false, 'users/fetchStart');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      set({ inflight: false, loading: false, data }, false, 'users/fetchSuccess');
    } catch (e) {
      set({ inflight: false, loading: false, error: String(e) }, false, 'users/fetchError');
    }
  },
}));`}</pre>
                <p>I keep <code>loading</code> and <code>error</code> consistent across slices.</p>
            </Styled.Section>

            {/* Start / Success / Error */}
            <Styled.Section>
                <h3>Start → Success/Error (canonical)</h3>
                <pre className="good">{`set({ loading: true, error: null }, false, 'fetch/start');
try {
  const data = await api();
  set({ loading: false, data }, false, 'fetch/success');
} catch (e) {
  set({ loading: false, error: String(e) }, false, 'fetch/error');
}`}</pre>
                <p>Always clear <code>error</code> on a new attempt.</p>
            </Styled.Section>

            {/* Abort stale requests */}
            <Styled.Section>
                <h3>Cancel stale requests (AbortController)</h3>
                <pre className="good">{`fetchUser: async (id) => {
  // cancel previous by key
  const prev = get().requests[id];
  prev?.abort?.();

  const ctrl = new AbortController();
  set((s) => ({ requests: { ...s.requests, [id]: ctrl }, error: null }), false, 'users/fetchStart');

  try {
    const res = await fetch('/api/users/' + id, { signal: ctrl.signal });
    const user = await res.json();
    set((s) => ({
      data: s.data.some(u => u.id === id) ? s.data.map(u => u.id === id ? user : u) : [...s.data, user]
    }), false, 'users/fetchSuccess');
  } catch (e) {
    if (e.name !== 'AbortError') set({ error: String(e) }, false, 'users/fetchError');
  } finally {
    set((s) => {
      const { [id]: _, ...rest } = s.requests;
      return { requests: rest };
    });
  }
}`}</pre>
            </Styled.Section>

            {/* De-dupe + inflight */}
            <Styled.Section>
                <h3>De-dupe in-flight calls</h3>
                <pre className="note">{`if (get().inflight) return; // guard quickly
set({ inflight: true }, false, 'fetch/start');
// ... do work ...
set({ inflight: false }, false, 'fetch/done');`}</pre>
                <p>For keyed calls (by <code>id</code>/<code>page</code>), keep a <code>Map</code> or object of flags.</p>
            </Styled.Section>

            {/* Optimistic updates */}
            <Styled.Section>
                <h3>Optimistic updates + rollback</h3>
                <pre className="good">{`updateTitle: async (id, title) => {
  const prev = get().data;
  set({ data: prev.map(it => it.id === id ? { ...it, title } : it) }, false, 'users/optimisticUpdate');
  try {
    await api.update(id, { title });
    set({}, false, 'users/commit'); // no-op (trace)
  } catch (e) {
    set({ data: prev, error: String(e) }, false, 'users/rollback'); // rollback
  }
}`}</pre>
                <p>Always snapshot what you need to rollback <i>before</i> mutating.</p>
            </Styled.Section>

            {/* Retry with backoff */}
            <Styled.Section>
                <h3>Retry with exponential backoff</h3>
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

// usage inside a thunk
await retry(() => fetch('/api/users'));`}</pre>
            </Styled.Section>

            {/* Pagination / cursor */}
            <Styled.Section>
                <h3>Pagination (cursor or page)</h3>
                <pre className="good">{`fetchNext: async () => {
  if (!get().hasMore || get().inflight) return;
  set({ inflight: true, error: null }, false, 'users/pageStart');
  try {
    const res = await api.list({ page: get().page + 1 });
    set((s) => ({
      inflight: false,
      page: s.page + 1,
      data: [...s.data, ...res.items],
      hasMore: res.items.length > 0
    }), false, 'users/pageSuccess');
  } catch (e) {
    set({ inflight: false, error: String(e) }, false, 'users/pageError');
  }
}`}</pre>
            </Styled.Section>

            {/* UI tips */}
            <Styled.Section>
                <h3>UI tips I actually use</h3>
                <ul>
                    <li>Prefer skeletons over spinners for list screens.</li>
                    <li>Disable submit buttons while <code>inflight</code> is true.</li>
                    <li>Show toasts on <code>error</code>, but clear errors on new attempts.</li>
                    <li>Keep error messages user-friendly; log raw errors separately.</li>
                </ul>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Name actions (<code>slice/action</code>) for devtools traces.</li>
                    <li>Clear <code>error</code> at start, set on failure only.</li>
                    <li>Guard duplicates with <code>inflight</code> or keyed flags.</li>
                    <li>Abort stale requests for the same key.</li>
                    <li>Snapshot state before optimistic updates; rollback on error.</li>
                    <li>Keep loading/error shape consistent across slices.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default AsyncPatterns;
