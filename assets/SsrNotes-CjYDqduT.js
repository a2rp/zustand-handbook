import{j as e}from"./index-D0NhHHfM.js";import{S as t}from"./styled-9asSRIYq.js";const n=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"SSR Notes — Next.js + Zustand"}),e.jsx(t.Subtitle,{children:"How I think about SSR and hydration with Zustand in Next.js (App Router or Pages)."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Plain-English idea"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Server"})," renders HTML first (fast first paint)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Client"})," loads JS and “hydrates” the HTML (attaches event handlers)."]}),e.jsxs("li",{children:["UI should look the ",e.jsx("b",{children:"same"})," on server and client during hydration."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Where I keep which state"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Server data"})," (DB/API): fetch on the server, pass to page as props."]}),e.jsxs("li",{children:[e.jsx("b",{children:"UI state"})," (toggles/modals/forms): keep in a client store."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Per-user secrets"}),": don’t leak to client unless necessary."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Mode A — client-only (simplest)"}),e.jsx("p",{children:"If I don’t need server prefetching, I just use a normal store in a client component. No SSR tricks needed."}),e.jsx("pre",{className:"good",children:`// app/components/CounterClient.tsx (or .jsx)
// "use client"
import { create } from 'zustand';

const useCounter = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

export default function CounterClient() {
  const count = useCounter((s) => s.count);
  const inc = useCounter((s) => s.inc);
  return <button onClick={inc}>Count: {count}</button>;
}`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Mode B — SSR with preloaded state (per-request store)"}),e.jsxs("p",{children:["When I want HTML to include data ",e.jsx("i",{children:"from the server"}),", I create a store",e.jsx("b",{children:"per request"}),", preload it on the server, then hydrate the same initial state on the client."]}),e.jsx("pre",{className:"good",children:`// 1) store/makeStore.ts (or .js) — shared between server & client
import { createStore } from 'zustand/vanilla';
import { create } from 'zustand';

export type AppState = {
  users: Array<{ id: number; name: string }>;
  loading: boolean;
  error: string | null;
  setUsers: (u: AppState['users']) => void;
};

const initialState: AppState = {
  users: [],
  loading: false,
  error: null,
  setUsers: () => {},
};

export function makeStore(preloaded?: Partial<AppState>) {
  const store = createStore<AppState>((set) => ({
    ...initialState,
    ...preloaded,
    setUsers: (users) => set({ users }),
  }));
  return store;
}

// Helper: bind a React hook to a vanilla store (client only)
export function bindToHook(store: ReturnType<typeof makeStore>) {
  return create(store);
}`}),e.jsx("pre",{className:"good",children:`// 2) Server Component (Next.js App Router)
// app/users/page.tsx
import { makeStore } from '@/store/makeStore';

export default async function UsersPage() {
  // Server fetch
  const res = await fetch('https://api.example.com/users', { cache: 'no-store' });
  const users = await res.json();

  // Create a *per-request* store and preload it
  const store = makeStore({ users });

  // Pass initial state to a Client component
  return <UsersClient initialState={{ users }} />;
}`}),e.jsx("pre",{className:"good",children:`// 3) Client Component to hydrate the store
// app/users/UsersClient.tsx
"use client";
import React, { useRef } from 'react';
import { makeStore, bindToHook } from '@/store/makeStore';

export default function UsersClient({ initialState }) {
  // Create the store once on the client with the same initial state
  const hookRef = useRef(null);
  if (!hookRef.current) {
    const store = makeStore(initialState);
    hookRef.current = bindToHook(store);
  }
  const useApp = hookRef.current;

  const users = useApp((s) => s.users);
  const setUsers = useApp((s) => s.setUsers);

  return (
    <div>
      <h3>Users</h3>
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
      <button onClick={() => setUsers([...users, { id: Date.now(), name: 'New' }])}>
        Add user (client)
      </button>
    </div>
  );
}`}),e.jsx(t.Callout,{children:"Key idea: don’t use a module-level singleton store for SSR. Make a new store for each request, pass initial state down, and bind it to a hook on the client once."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Persist + SSR (localStorage isn’t on the server)"}),e.jsxs("p",{children:[e.jsx("code",{children:"localStorage"})," doesn’t exist on the server. I enable persist only on the client and rehydrate after mount to avoid hydration mismatches."]}),e.jsx("pre",{className:"good",children:`// store/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth',
      storage: typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined,         // disable on server
      skipHydration: true,   // I'll call rehydrate() manually on the client
    }
  )
);`}),e.jsx("pre",{className:"good",children:`// Hydration gate (client component)
"use client";
import React from 'react';
import { useAuth } from '@/store/auth';

export function Hydrated({ children }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // trigger hydration only on the client
    useAuth.persist?.rehydrate?.();
    // wait a tick so UI doesn't flicker
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return ready ? children : null;
}`}),e.jsx("pre",{className:"note",children:`// Use it
<Hydrated>
  <ProtectedArea />
</Hydrated>`}),e.jsx("p",{children:"This avoids “server shows A, client shows B” mismatches while persisted data loads."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Things I avoid"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Global singleton store during SSR (users can leak data across requests)."}),e.jsxs("li",{children:["Using ",e.jsx("code",{children:"localStorage"})," or ",e.jsx("code",{children:"window"})," in store code that runs on the server."]}),e.jsx("li",{children:"Deriving values differently on server vs client (dates, random, locale)."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"My quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Per-request store for SSR pages, not a singleton."}),e.jsx("li",{children:"Same initial state on server and client to prevent flicker."}),e.jsxs("li",{children:["Wrap ",e.jsx("code",{children:"persist"})," so it’s client-only; call ",e.jsx("code",{children:"rehydrate()"})," after mount."]}),e.jsx("li",{children:"Keep server data on the server; UI state in client stores."})]})]})]});export{n as default};
