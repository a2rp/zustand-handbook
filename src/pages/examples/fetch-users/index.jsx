import React from "react";
import { Styled } from "./styled";

/**
 * Example: Fetch Users (notes, not live)
 * Teaches: start/success/error pattern, thunks with set/get, abort, and de-dupe.
 */
const ExampleFetchUsers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Fetch Users</Styled.Title>
            <Styled.Subtitle>
                A clean async flow: start → success/error. Then optional abort + de-dupe.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Model async state: <code>loading</code>, <code>error</code>, <code>users</code>.</li>
                    <li>Write a thunk action using <code>set</code> and <code>get</code>.</li>
                    <li>Name actions for devtools (e.g., <code>users/fetchStart</code>).</li>
                    <li>Optional: cancel stale requests with <code>AbortController</code>.</li>
                    <li>Optional: prevent duplicate in-flight requests.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch — canonical start / success / error</h3>
                <pre className="good">{`// stores/users.js
import { create } from 'zustand';

export const useUsers = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null }, false, 'users/fetchStart');
    try {
      const res = await fetch('/api/users'); // replace with your endpoint
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      set({ loading: false, users: data }, false, 'users/fetchSuccess');
    } catch (e) {
      set({ loading: false, error: String(e) }, false, 'users/fetchError');
    }
  },
}));`}</pre>
                <Styled.Callout>
                    Keep <code>loading</code>/<code>error</code> shape consistent across features. It makes UI wiring predictable.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using it in a component</h3>
                <pre className="good">{`import React, { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useUsers } from '../stores/users';

export default function UsersPanel() {
  // select exactly what the component needs
  const [users, loading, error, fetchUsers] = useUsers(
    (s) => [s.users, s.loading, s.error, s.fetchUsers],
    shallow
  );

  // optionally fetch on mount
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'tomato' }}>{error}</p>;
  if (!users.length) return <p>No users yet.</p>;

  return (
    <div>
      <button onClick={fetchUsers}>Reload</button>
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  );
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Variant — abort stale requests</h3>
                <p>
                    If the user triggers multiple searches quickly, older responses can “arrive late” and overwrite newer state. Cancel the previous request.
                </p>
                <pre className="note">{`export const useUsers = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  controller: null, // keep the current abort controller

  fetchUsersAbortable: async () => {
    // cancel previous in-flight
    get().controller?.abort?.();

    const controller = new AbortController();
    set({ controller, loading: true, error: null }, false, 'users/fetchStart');

    try {
      const res = await fetch('/api/users', { signal: controller.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      set({ controller: null, loading: false, users: data }, false, 'users/fetchSuccess');
    } catch (e) {
      if (e.name === 'AbortError') return; // ignore cancels
      set({ controller: null, loading: false, error: String(e) }, false, 'users/fetchError');
    }
  },
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Variant — de-dupe in-flight</h3>
                <p>Guard the action so repeated clicks don’t send duplicates.</p>
                <pre className="note">{`export const useUsers = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  inflight: false,

  fetchOnce: async () => {
    if (get().inflight) return; // guard
    set({ inflight: true, error: null }, false, 'users/fetchStart');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      set({ inflight: false, users: data }, false, 'users/fetchSuccess');
    } catch (e) {
      set({ inflight: false, error: String(e) }, false, 'users/fetchError');
    }
  },
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Error display pattern I reuse</h3>
                <pre className="good">{`function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return (
    <div role="alert" style={{ border: '1px solid #333', padding: 8, borderRadius: 8 }}>
      <div style={{ color: 'tomato' }}>{error}</div>
      {onRetry && <button onClick={onRetry} style={{ marginTop: 6 }}>Retry</button>}
    </div>
  );
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Name actions for devtools: <code>users/fetchStart</code>, <code>users/fetchSuccess</code>, <code>users/fetchError</code>.</li>
                    <li>Reset <code>error</code> when starting a new attempt.</li>
                    <li>Consider <b>abort</b> for searches and rapid refetch scenarios.</li>
                    <li>Add an <b>inflight</b> flag to de-dupe repeated clicks.</li>
                    <li>Keep the component selector narrow; use <code>shallow</code> for tuples.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Try next</h3>
                <ul>
                    <li>Attach query params: <code>fetchUsers(q)</code> and key in a cache map.</li>
                    <li>Paginate: store <code>page</code>/<code>pageSize</code> and fetch by key.</li>
                    <li>Add optimistic “create user” with rollback on error.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleFetchUsers;
