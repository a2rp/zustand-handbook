import{j as e}from"./index-D0NhHHfM.js";import{S as s}from"./styled-9asSRIYq.js";const l=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Async Flows — Fetching & Thunks"}),e.jsx(s.Subtitle,{children:"How I structure start → success/error, cancel stale requests, de-dupe calls, and do optimistic updates."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Simple state shape I reuse for async work."}),e.jsxs("li",{children:["The canonical ",e.jsx("b",{children:"start / success / error"})," pattern."]}),e.jsxs("li",{children:["Thunks with ",e.jsx("code",{children:"set"})," and ",e.jsx("code",{children:"get"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"AbortController"})," to cancel stale requests."]}),e.jsx("li",{children:"De-duping in-flight calls."}),e.jsx("li",{children:"Optimistic updates with rollback."}),e.jsx("li",{children:"Retry with exponential backoff."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Baseline state shape I use"}),e.jsx("pre",{className:"good",children:`// stores/users.js
import { create } from 'zustand';

export const useUsers = create((set, get) => ({
  users: [],
  loading: false,
  error: null,          // string | null
  inflight: false,      // de-dupe guard
  controller: null,     // AbortController (optional)

  // actions (more below)
}));`}),e.jsx("p",{children:"This keeps every async slice predictable across the app."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Canonical start / success / error"}),e.jsx("pre",{className:"good",children:`// inside create((set, get) => ({ ... }))
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
},`}),e.jsxs("p",{children:["I always clear ",e.jsx("code",{children:"error"})," at the start so the UI doesn’t show stale errors."]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["Thunks: read safely with ",e.jsx("code",{children:"get()"})]}),e.jsx("pre",{className:"good",children:`addUser: async (user) => {
  const before = get().users; // fresh snapshot
  set({ loading: true, error: null }, false, 'users/addStart');
  try {
    const res = await fetch('/api/users', { method: 'POST', body: JSON.stringify(user) });
    const saved = await res.json();
    set({ loading: false, users: [...before, saved] }, false, 'users/addSuccess');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'users/addError');
  }
},`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cancel stale requests (avoid races)"}),e.jsx("pre",{className:"good",children:`fetchUsersAbortable: async () => {
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
},`}),e.jsx("p",{children:"This prevents an older response from overwriting newer state."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"De-dupe in-flight calls"}),e.jsx("pre",{className:"good",children:`fetchOnce: async () => {
  if (get().inflight) return;         // guard
  set({ inflight: true, error: null }, false, 'data/fetchStart');
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    set({ inflight: false, data }, false, 'data/fetchSuccess');
  } catch (e) {
    set({ inflight: false, error: String(e) }, false, 'data/fetchError');
  }
},`}),e.jsx("p",{children:"If I need per-key de-dupe, I keep a small map in the store keyed by URL or ID."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Optimistic update + rollback"}),e.jsx("pre",{className:"good",children:`updateTitle: async (id, title) => {
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
},`}),e.jsx("p",{children:"I always snapshot before the optimistic change so rollback is trivial."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Retry with exponential backoff (utility)"}),e.jsx("pre",{className:"note",children:`async function retry(fn, times = 3) {
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
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Error shape & UI"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["I keep ",e.jsx("code",{children:"error"})," as ",e.jsx("code",{children:"string | null"})," (or a tiny object)."]}),e.jsx("li",{children:"Clear it at the start of every new attempt."}),e.jsx("li",{children:"Surface errors in a toast or inline alert; never leave the user guessing."})]}),e.jsx("pre",{className:"note",children:`// toast example (conceptually)
// if (error) toast.error(error)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Start → Success/Error is the backbone."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"get()"})," for fresh reads inside thunks."]}),e.jsx("li",{children:"Abort stale requests to avoid race conditions."}),e.jsxs("li",{children:["Guard duplicates with an ",e.jsx("code",{children:"inflight"})," flag or per-key map."]}),e.jsx("li",{children:"Snapshot before optimistic updates; rollback on failure."}),e.jsx("li",{children:"Keep loading/error shape consistent across slices."})]})]})]});export{l as default};
