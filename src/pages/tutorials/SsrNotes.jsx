import React, { useEffect, useState, useRef } from "react";
import { Styled } from "./styled";

const SsrNotes = () => {
    return (
        <Styled.Page>
            <Styled.Title>SSR Notes — Next.js + Zustand</Styled.Title>
            <Styled.Subtitle>
                How I think about SSR and hydration with Zustand in Next.js (App Router or Pages).
            </Styled.Subtitle>

            {/* What & why */}
            <Styled.Section>
                <h3>Plain-English idea</h3>
                <ul>
                    <li><b>Server</b> renders HTML first (fast first paint).</li>
                    <li><b>Client</b> loads JS and “hydrates” the HTML (attaches event handlers).</li>
                    <li>UI should look the <b>same</b> on server and client during hydration.</li>
                </ul>
            </Styled.Section>

            {/* What belongs where */}
            <Styled.Section>
                <h3>Where I keep which state</h3>
                <ul>
                    <li><b>Server data</b> (DB/API): fetch on the server, pass to page as props.</li>
                    <li><b>UI state</b> (toggles/modals/forms): keep in a client store.</li>
                    <li><b>Per-user secrets</b>: don’t leak to client unless necessary.</li>
                </ul>
            </Styled.Section>

            {/* Mode A: client-only */}
            <Styled.Section>
                <h3>Mode A — client-only (simplest)</h3>
                <p>
                    If I don’t need server prefetching, I just use a normal store in a client component.
                    No SSR tricks needed.
                </p>
                <pre className="good">{`// app/components/CounterClient.tsx (or .jsx)
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
}`}</pre>
            </Styled.Section>

            {/* Mode B: SSR preloaded state */}
            <Styled.Section>
                <h3>Mode B — SSR with preloaded state (per-request store)</h3>
                <p>
                    When I want HTML to include data <i>from the server</i>, I create a store
                    <b>per request</b>, preload it on the server, then hydrate the same initial state on the client.
                </p>

                <pre className="good">{`// 1) store/makeStore.ts (or .js) — shared between server & client
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
}`}</pre>

                <pre className="good">{`// 2) Server Component (Next.js App Router)
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
}`}</pre>

                <pre className="good">{`// 3) Client Component to hydrate the store
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
}`}</pre>

                <Styled.Callout>
                    Key idea: don’t use a module-level singleton store for SSR. Make a new store for each request,
                    pass initial state down, and bind it to a hook on the client once.
                </Styled.Callout>
            </Styled.Section>

            {/* Persist + SSR */}
            <Styled.Section>
                <h3>Persist + SSR (localStorage isn’t on the server)</h3>
                <p>
                    <code>localStorage</code> doesn’t exist on the server. I enable persist only on the client and
                    rehydrate after mount to avoid hydration mismatches.
                </p>
                <pre className="good">{`// store/auth.ts
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
);`}</pre>

                <pre className="good">{`// Hydration gate (client component)
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
}`}</pre>

                <pre className="note">{`// Use it
<Hydrated>
  <ProtectedArea />
</Hydrated>`}</pre>
                <p>
                    This avoids “server shows A, client shows B” mismatches while persisted data loads.
                </p>
            </Styled.Section>

            {/* Common pitfalls */}
            <Styled.Section>
                <h3>Things I avoid</h3>
                <ul>
                    <li>Global singleton store during SSR (users can leak data across requests).</li>
                    <li>Using <code>localStorage</code> or <code>window</code> in store code that runs on the server.</li>
                    <li>Deriving values differently on server vs client (dates, random, locale).</li>
                </ul>
            </Styled.Section>

            {/* Quick checklist */}
            <Styled.Section>
                <h3>My quick checklist</h3>
                <ul>
                    <li>Per-request store for SSR pages, not a singleton.</li>
                    <li>Same initial state on server and client to prevent flicker.</li>
                    <li>Wrap <code>persist</code> so it’s client-only; call <code>rehydrate()</code> after mount.</li>
                    <li>Keep server data on the server; UI state in client stores.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default SsrNotes;
