import{d as r,j as e}from"./index-Gt8sd0pi.js";const s="var(--card, #111)",i="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",o="var(--border, #222)",a="var(--accent, #22c55e)",l="var(--danger, #ef4444)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${s};
        color: ${i};
        border: 1px solid ${o};
        border-radius: ${d};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:r.section`
        border-top: 1px dashed ${o};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${o};
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
            border: 1px dashed ${o};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${a};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${l};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:r.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${o};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — SSR Notes (Next.js friendly)"}),e.jsx(t.Subtitle,{children:"How I set up a per-request store on the server and hydrate it safely on the client."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Goal"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Create a ",e.jsx("b",{children:"new store per request"})," during SSR (no singletons)."]}),e.jsxs("li",{children:["Send HTML + initial state; ",e.jsx("b",{children:"hydrate"})," the same state on the client."]}),e.jsx("li",{children:"Avoid cross-request leaks, rehydration mismatch, and storage issues."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Mental model"}),e.jsx("pre",{className:"note",children:`Server (each HTTP request)
  -> create store with initial state for *this* request
  -> render HTML
  -> embed initialState into HTML (as JSON)

Client (browser)
  -> read initialState
  -> create the same store once
  -> React hydrates; selected values match markup`}),e.jsx(t.Callout,{children:"Never export a module-level singleton store when doing SSR. Each request needs its own store instance."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Pattern A — Next.js App Router"}),e.jsx("p",{children:"I create a vanilla store on the server, pass it through a context provider, and read it via a small helper hook in client components."}),e.jsx("pre",{className:"good",children:`// stores/appStore.ts (or .js)
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
}`}),e.jsx("pre",{className:"good",children:`// app/StoreProvider.tsx (client component)
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
}`}),e.jsx("pre",{className:"good",children:`// app/layout.tsx (server component)
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
}`}),e.jsx("pre",{className:"note",children:`// Any client component
'use client';
import { useAppStore } from '@/app/StoreProvider';

export default function ThemeToggle() {
  const mode = useAppStore((s) => s.theme.mode);
  const toggle = useAppStore((s) => s.toggleTheme);
  return <button onClick={toggle}>Theme: {mode}</button>;
}`}),e.jsxs("p",{children:["Persist middleware is ",e.jsx("b",{children:"client-only"}),". If needed, conditionally initialize it (see “Persist + SSR” below)."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Pattern B — Pages Router"}),e.jsxs("p",{children:["Classic approach: create initial state in ",e.jsx("code",{children:"getServerSideProps"}),", pass as prop, and hydrate."]}),e.jsx("pre",{className:"good",children:`// stores/appStore.ts (client-side hook)
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
}`}),e.jsx("pre",{className:"note",children:`// pages/_app.tsx
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
}`}),e.jsx("pre",{className:"note",children:`// pages/index.tsx
export async function getServerSideProps() {
  // build per-request initial state
  const initialState = { user: { id: null }, theme: { mode: 'light' } };
  return { props: { initialState } };
}

export default function Home({ initialState }) {
  // components read via useAppStore((s)=>...)
  return <main>...</main>;
}`}),e.jsx(t.Callout,{children:"In SSR render passes (server), avoid module-level singletons. In the browser, create the store once and reuse it."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Persist + SSR (what works for me)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Only touch ",e.jsx("code",{children:"localStorage"})," on the client."]}),e.jsxs("li",{children:["Gate storage calls with ",e.jsx("code",{children:"typeof window !== 'undefined'"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"createJSONStorage(() => localStorage)"})," so the server never runs it."]}),e.jsx("li",{children:"For critical values (e.g., theme), also seed a server default to avoid flash."})]}),e.jsx("pre",{className:"good",children:`import { persist, createJSONStorage } from 'zustand/middleware';
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
);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Pitfalls I watch for"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Cross-request leaks:"})," exporting a singleton store from a module during SSR.",e.jsx("br",{}),"Fix: always create a new store per request on the server."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Hydration mismatch:"})," server HTML shows “dark” but client store starts “light”.",e.jsx("br",{}),"Fix: pass the same ",e.jsx("code",{children:"initialState"})," to the client and initialize once."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Storage on server:"})," accessing ",e.jsx("code",{children:"localStorage"})," while rendering on the server.",e.jsx("br",{}),"Fix: guard with ",e.jsx("code",{children:"typeof window"})," and inject storage via factory."]}),e.jsxs("li",{children:[e.jsx("b",{children:"RSC boundaries:"})," reading Zustand in a server component with hooks.",e.jsx("br",{}),"Fix: call store hooks only in ",e.jsx("b",{children:"client"})," components (",e.jsx("code",{children:"'use client'"}),")."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Quick recap"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Per-request store on the server, single store instance on the client."}),e.jsx("li",{children:"Embed/receive the same initial state to avoid hydration glitches."}),e.jsx("li",{children:"Keep persistence client-only and guarded."})]})]})]});export{h as default};
