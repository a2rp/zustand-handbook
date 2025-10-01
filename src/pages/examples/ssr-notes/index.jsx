import React from "react";
import { Styled } from "./styled";

const ExampleSsrNotes = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — SSR Notes (Next.js friendly)</Styled.Title>
            <Styled.Subtitle>
                How I set up a per-request store on the server and hydrate it safely on the client.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>Goal</h3>
                <ul>
                    <li>Create a <b>new store per request</b> during SSR (no singletons).</li>
                    <li>Send HTML + initial state; <b>hydrate</b> the same state on the client.</li>
                    <li>Avoid cross-request leaks, rehydration mismatch, and storage issues.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Mental model</h3>
                <pre className="note">{`Server (each HTTP request)
  -> create store with initial state for *this* request
  -> render HTML
  -> embed initialState into HTML (as JSON)

Client (browser)
  -> read initialState
  -> create the same store once
  -> React hydrates; selected values match markup`}</pre>
                <Styled.Callout>
                    Never export a module-level singleton store when doing SSR. Each request needs its
                    own store instance.
                </Styled.Callout>
            </Styled.Section>

            {/* ----------------------------------------------------- */}
            {/* Pattern A: Next.js App Router (RSC)                  */}
            {/* ----------------------------------------------------- */}
            <Styled.Section>
                <h3>Pattern A — Next.js App Router</h3>
                <p>
                    I create a vanilla store on the server, pass it through a context
                    provider, and read it via a small helper hook in client components.
                </p>

                <pre className="good">{`// stores/appStore.ts (or .js)
import { createStore } from 'zustand/vanilla';

export type AppState = {
  user: { id: string | null };
  theme: { mode: 'light' | 'dark' };
};

export type AppActions = {
  login: (id: string) => void;
  toggleTheme: () => void;
};

export type AppStore = ReturnType<typeof createAppStore>;

export function createAppStore(initial?: Partial<AppState>) {
  const initialState: AppState = {
    user: { id: null },
    theme: { mode: 'dark' },
    ...initial,
  };

  return createStore<AppState & AppActions>()((set, get) => ({
    ...initialState,

    login: (id) => set({ user: { id } }, false, 'auth/login'),
    toggleTheme: () =>
      set((s) => ({ theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' } }), false, 'theme/toggle'),
  }));
}`}</pre>

                <pre className="good">{`// app/StoreProvider.tsx (client component)
'use client';
import React, { createContext, useContext, useRef } from 'react';
import type { AppStore } from '@/stores/appStore';
import { createAppStore } from '@/stores/appStore';
import { useStore as useZustandStore } from 'zustand';

const StoreContext = createContext<AppStore | null>(null);

export function StoreProvider({ children, initialState }: { children: React.ReactNode; initialState?: any }) {
  // create the store once on the client
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) storeRef.current = createAppStore(initialState);
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}

// helper to access the store with a selector
export function useAppStore(selector, equalityFn) {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useAppStore must be used inside <StoreProvider/>');
  return useZustandStore(store, selector, equalityFn);
}`}</pre>

                <pre className="good">{`// app/layout.tsx (server component)
import { StoreProvider } from '@/app/StoreProvider';

export default async function RootLayout({ children }) {
  // compute per-request initial state on the server
  const initialState = {
    user: { id: null }, // e.g., from cookies/auth
    theme: { mode: 'dark' },
  };

  return (
    <html>
      <body>
        {/* Provider is a client component; we pass initialState once */}
        <StoreProvider initialState={initialState}>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}`}</pre>

                <pre className="note">{`// Any client component
'use client';
import { useAppStore } from '@/app/StoreProvider';

export default function ThemeToggle() {
  const mode = useAppStore((s) => s.theme.mode);
  const toggle = useAppStore((s) => s.toggleTheme);
  return <button onClick={toggle}>Theme: {mode}</button>;
}`}</pre>

                <p>
                    Persist middleware is <b>client-only</b>. If needed, conditionally initialize it
                    (see “Persist + SSR” below).
                </p>
            </Styled.Section>

            {/* ----------------------------------------------------- */}
            {/* Pattern B: Next.js Pages Router (getServerSideProps) */}
            {/* ----------------------------------------------------- */}
            <Styled.Section>
                <h3>Pattern B — Pages Router</h3>
                <p>Classic approach: create initial state in <code>getServerSideProps</code>, pass as prop, and hydrate.</p>

                <pre className="good">{`// stores/appStore.ts (client-side hook)
import { create } from 'zustand';

let _store; // kept only on client

const initial = { user: { id: null }, theme: { mode: 'dark' } };

const initStore = (preloaded = {}) =>
  create((set, get) => ({
    ...initial,
    ...preloaded,
    login: (id) => set({ user: { id } }, false, 'auth/login'),
    toggleTheme: () =>
      set((s) => ({ theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' } }), false, 'theme/toggle'),
  }));

export function useAppStore(selector, equalityFn) {
  if (typeof window === 'undefined') {
    // SSR render (no singleton): make a fresh, short-lived store
    const store = initStore(); // no cross-request sharing
    return selector(store.getState()); // read-only on server render
  }
  // CSR: create the store once
  _store = _store ?? initStore(window.__APP_STATE__ || {});
  return _store(selector, equalityFn);
}`}</pre>

                <pre className="note">{`// pages/_app.tsx
function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* hydrate window.__APP_STATE__ so the client can initialize the store */}
      <script
        dangerouslySetInnerHTML={{
          __html: 'window.__APP_STATE__ = ' + JSON.stringify(pageProps.initialState || {}),
        }}
      />
      <Component {...pageProps} />
    </>
  );
}`}</pre>

                <pre className="note">{`// pages/index.tsx
export async function getServerSideProps() {
  // build per-request initial state
  const initialState = { user: { id: null }, theme: { mode: 'light' } };
  return { props: { initialState } };
}

export default function Home({ initialState }) {
  // components read via useAppStore((s)=>...)
  return <main>...</main>;
}`}</pre>

                <Styled.Callout>
                    In SSR render passes (server), avoid module-level singletons. In the browser,
                    create the store once and reuse it.
                </Styled.Callout>
            </Styled.Section>

            {/* ----------------------------------------------------- */}
            {/* Persist + SSR                                        */}
            {/* ----------------------------------------------------- */}
            <Styled.Section>
                <h3>Persist + SSR (what works for me)</h3>
                <ul>
                    <li>Only touch <code>localStorage</code> on the client.</li>
                    <li>Gate storage calls with <code>typeof window !== 'undefined'</code>.</li>
                    <li>Use <code>createJSONStorage(() =&gt; localStorage)</code> so the server never runs it.</li>
                    <li>For critical values (e.g., theme), also seed a server default to avoid flash.</li>
                </ul>
                <pre className="good">{`import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

export const useTheme = create(
  persist(
    (set) => ({
      mode: 'dark',
      toggle: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' }), false, 'theme/toggle'),
    }),
    {
      name: 'theme', // storage key
      storage: typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined, // SSR: disable storage
      // optional: partialize, version, migrate
    }
  )
);`}</pre>
            </Styled.Section>

            {/* ----------------------------------------------------- */}
            {/* Pitfalls checklist                                   */}
            {/* ----------------------------------------------------- */}
            <Styled.Section>
                <h3>Pitfalls I watch for</h3>
                <ul>
                    <li>
                        <b>Cross-request leaks:</b> exporting a singleton store from a module during SSR.
                        <br />Fix: always create a new store per request on the server.
                    </li>
                    <li>
                        <b>Hydration mismatch:</b> server HTML shows “dark” but client store starts “light”.
                        <br />Fix: pass the same <code>initialState</code> to the client and initialize once.
                    </li>
                    <li>
                        <b>Storage on server:</b> accessing <code>localStorage</code> while rendering on the server.
                        <br />Fix: guard with <code>typeof window</code> and inject storage via factory.
                    </li>
                    <li>
                        <b>RSC boundaries:</b> reading Zustand in a server component with hooks.
                        <br />Fix: call store hooks only in <b>client</b> components (<code>'use client'</code>).
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick recap</h3>
                <ul>
                    <li>Per-request store on the server, single store instance on the client.</li>
                    <li>Embed/receive the same initial state to avoid hydration glitches.</li>
                    <li>Keep persistence client-only and guarded.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSsrNotes;
