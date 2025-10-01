import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-BO5MAwS2.js";const a=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Async Patterns — Loading, Error, Optimistic"}),e.jsx(s.Subtitle,{children:"Practical patterns I use for network calls and side-effects with Zustand."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"My go-to slice shape"}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

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
}));`}),e.jsxs("p",{children:["I keep ",e.jsx("code",{children:"loading"})," and ",e.jsx("code",{children:"error"})," consistent across slices."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Start → Success/Error (canonical)"}),e.jsx("pre",{className:"good",children:`set({ loading: true, error: null }, false, 'fetch/start');
try {
  const data = await api();
  set({ loading: false, data }, false, 'fetch/success');
} catch (e) {
  set({ loading: false, error: String(e) }, false, 'fetch/error');
}`}),e.jsxs("p",{children:["Always clear ",e.jsx("code",{children:"error"})," on a new attempt."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cancel stale requests (AbortController)"}),e.jsx("pre",{className:"good",children:`fetchUser: async (id) => {
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
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"De-dupe in-flight calls"}),e.jsx("pre",{className:"note",children:`if (get().inflight) return; // guard quickly
set({ inflight: true }, false, 'fetch/start');
// ... do work ...
set({ inflight: false }, false, 'fetch/done');`}),e.jsxs("p",{children:["For keyed calls (by ",e.jsx("code",{children:"id"}),"/",e.jsx("code",{children:"page"}),"), keep a ",e.jsx("code",{children:"Map"})," or object of flags."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Optimistic updates + rollback"}),e.jsx("pre",{className:"good",children:`updateTitle: async (id, title) => {
  const prev = get().data;
  set({ data: prev.map(it => it.id === id ? { ...it, title } : it) }, false, 'users/optimisticUpdate');
  try {
    await api.update(id, { title });
    set({}, false, 'users/commit'); // no-op (trace)
  } catch (e) {
    set({ data: prev, error: String(e) }, false, 'users/rollback'); // rollback
  }
}`}),e.jsxs("p",{children:["Always snapshot what you need to rollback ",e.jsx("i",{children:"before"})," mutating."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Retry with exponential backoff"}),e.jsx("pre",{className:"note",children:`async function retry(fn, times = 3) {
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
await retry(() => fetch('/api/users'));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Pagination (cursor or page)"}),e.jsx("pre",{className:"good",children:`fetchNext: async () => {
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
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"UI tips I actually use"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Prefer skeletons over spinners for list screens."}),e.jsxs("li",{children:["Disable submit buttons while ",e.jsx("code",{children:"inflight"})," is true."]}),e.jsxs("li",{children:["Show toasts on ",e.jsx("code",{children:"error"}),", but clear errors on new attempts."]}),e.jsx("li",{children:"Keep error messages user-friendly; log raw errors separately."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Name actions (",e.jsx("code",{children:"slice/action"}),") for devtools traces."]}),e.jsxs("li",{children:["Clear ",e.jsx("code",{children:"error"})," at start, set on failure only."]}),e.jsxs("li",{children:["Guard duplicates with ",e.jsx("code",{children:"inflight"})," or keyed flags."]}),e.jsx("li",{children:"Abort stale requests for the same key."}),e.jsx("li",{children:"Snapshot state before optimistic updates; rollback on error."}),e.jsx("li",{children:"Keep loading/error shape consistent across slices."})]})]})]});export{a as default};
