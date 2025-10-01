import{d as s,j as e}from"./index-Gt8sd0pi.js";const o="var(--card, #111)",n="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",t="var(--border, #222)",l="var(--accent, #22c55e)",c="var(--danger, #ef4444)",i="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",r={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${n};
        border: 1px solid ${t};
        border-radius: ${i};
        box-shadow: ${d};
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
        border-top: 1px dashed ${t};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${t};
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
            border: 1px dashed ${t};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${l};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${c};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},u=()=>e.jsxs(r.Page,{children:[e.jsx(r.Title,{children:"Example — Fetch Users"}),e.jsx(r.Subtitle,{children:"A clean async flow: start → success/error. Then optional abort + de-dupe."}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Model async state: ",e.jsx("code",{children:"loading"}),", ",e.jsx("code",{children:"error"}),", ",e.jsx("code",{children:"users"}),"."]}),e.jsxs("li",{children:["Write a thunk action using ",e.jsx("code",{children:"set"})," and ",e.jsx("code",{children:"get"}),"."]}),e.jsxs("li",{children:["Name actions for devtools (e.g., ",e.jsx("code",{children:"users/fetchStart"}),")."]}),e.jsxs("li",{children:["Optional: cancel stale requests with ",e.jsx("code",{children:"AbortController"}),"."]}),e.jsx("li",{children:"Optional: prevent duplicate in-flight requests."})]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"1) Store sketch — canonical start / success / error"}),e.jsx("pre",{className:"good",children:`// stores/users.js
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
}));`}),e.jsxs(r.Callout,{children:["Keep ",e.jsx("code",{children:"loading"}),"/",e.jsx("code",{children:"error"})," shape consistent across features. It makes UI wiring predictable."]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"2) Using it in a component"}),e.jsx("pre",{className:"good",children:`import React, { useEffect } from 'react';
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
}`})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"3) Variant — abort stale requests"}),e.jsx("p",{children:"If the user triggers multiple searches quickly, older responses can “arrive late” and overwrite newer state. Cancel the previous request."}),e.jsx("pre",{className:"note",children:`export const useUsers = create((set, get) => ({
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
}));`})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"4) Variant — de-dupe in-flight"}),e.jsx("p",{children:"Guard the action so repeated clicks don’t send duplicates."}),e.jsx("pre",{className:"note",children:`export const useUsers = create((set, get) => ({
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
}));`})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"5) Error display pattern I reuse"}),e.jsx("pre",{className:"good",children:`function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return (
    <div role="alert" style={{ border: '1px solid #333', padding: 8, borderRadius: 8 }}>
      <div style={{ color: 'tomato' }}>{error}</div>
      {onRetry && <button onClick={onRetry} style={{ marginTop: 6 }}>Retry</button>}
    </div>
  );
}`})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Name actions for devtools: ",e.jsx("code",{children:"users/fetchStart"}),", ",e.jsx("code",{children:"users/fetchSuccess"}),", ",e.jsx("code",{children:"users/fetchError"}),"."]}),e.jsxs("li",{children:["Reset ",e.jsx("code",{children:"error"})," when starting a new attempt."]}),e.jsxs("li",{children:["Consider ",e.jsx("b",{children:"abort"})," for searches and rapid refetch scenarios."]}),e.jsxs("li",{children:["Add an ",e.jsx("b",{children:"inflight"})," flag to de-dupe repeated clicks."]}),e.jsxs("li",{children:["Keep the component selector narrow; use ",e.jsx("code",{children:"shallow"})," for tuples."]})]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"Try next"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Attach query params: ",e.jsx("code",{children:"fetchUsers(q)"})," and key in a cache map."]}),e.jsxs("li",{children:["Paginate: store ",e.jsx("code",{children:"page"}),"/",e.jsx("code",{children:"pageSize"})," and fetch by key."]}),e.jsx("li",{children:"Add optimistic “create user” with rollback on error."})]})]})]});export{u as default};
