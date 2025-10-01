import React from "react";
import { Styled } from "./styled";

/**
 * Example: Sidebar (persisted)
 * Goal: a tiny global UI slice that persists `sidebarOpen` to localStorage.
 * Notes-only: copy snippets into your app; nothing executes here.
 */
const ExampleSidebar = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Sidebar (Persisted)</Styled.Title>
            <Styled.Subtitle>
                I keep a small UI slice with <code>sidebarOpen</code> and persist just that key.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>One global UI slice for app-chrome state.</li>
                    <li>Persist with <code>persist()</code> + <code>partialize</code> + <code>version</code>.</li>
                    <li>Selectors that subscribe to the smallest slice.</li>
                    <li>Immutable nested updates.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store: <code>src/stores/ui.js</code></h3>
                <pre className="good">{`import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppUi = create(
  persist(
    (set, get) => ({
      // --- UI slice ---
      ui: { sidebarOpen: true }, // sensible default

      openSidebar: () =>
        set((s) => ({ ui: { ...s.ui, sidebarOpen: true } }), false, 'ui/openSidebar'),

      closeSidebar: () =>
        set((s) => ({ ui: { ...s.ui, sidebarOpen: false } }), false, 'ui/closeSidebar'),

      toggleSidebar: () =>
        set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }), false, 'ui/toggleSidebar'),

      resetUi: () => set({ ui: { sidebarOpen: true } }, false, 'ui/reset'),
    }),
    {
      name: 'app-ui',                 // localStorage key
      version: 1,                     // bump when shape changes
      storage: createJSONStorage(() => localStorage),
      // persist only what I need (not the whole store)
      partialize: (s) => ({ ui: { sidebarOpen: s.ui.sidebarOpen } }),
      // example migration sketch:
      // migrate: (persisted, v) => {
      //   if (v < 1) return { ui: { sidebarOpen: !!persisted?.ui?.sidebarOpen } };
      //   return persisted;
      // },
    }
  )
);`}</pre>
                <Styled.Callout>
                    I name actions like <code>ui/toggleSidebar</code> so devtools traces are readable.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using it in layout</h3>
                <pre className="good">{`// Layout.jsx (sketch)
import { useAppUi } from '../stores/ui';

export default function Layout({ children }) {
  const open = useAppUi((s) => s.ui.sidebarOpen);
  const toggle = useAppUi((s) => s.toggleSidebar);
  const openSidebar = useAppUi((s) => s.openSidebar);
  const closeSidebar = useAppUi((s) => s.closeSidebar);

  return (
    <div className={open ? 'with-sidebar' : 'no-sidebar'}>
      <aside aria-hidden={!open} aria-expanded={open}>
        {/* …sidebar content… */}
      </aside>
      <main>
        <button onClick={toggle}>{open ? 'Hide' : 'Show'} Sidebar</button>
        <button onClick={openSidebar}>Open</button>
        <button onClick={closeSidebar}>Close</button>
        {children}
      </main>
    </div>
  );
}`}</pre>
                <p>
                    I subscribe to the minimal piece: <code>(s) =&gt; s.ui.sidebarOpen</code>. The buttons
                    select just the actions they need.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Accessibility + keyboard</h3>
                <pre className="note">{`// Keyboard shortcut (optional)
useEffect(() => {
  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      useAppUi.getState().toggleSidebar(); // safe call outside component
    }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);`}</pre>
                <p>
                    I set <code>aria-expanded</code> on the sidebar container and keep focus inside when open (if it’s a modal-style drawer).
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Variations</h3>
                <ul>
                    <li>
                        Session-only persistence:
                        <pre className="note inline">{`storage: createJSONStorage(() => sessionStorage)`}</pre>
                    </li>
                    <li>
                        SSR-safe storage:
                        <pre className="note">{`storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined))`}</pre>
                    </li>
                    <li>
                        Also persist a numeric width:
                        <pre className="note">{`ui: { sidebarOpen: true, sidebarWidth: 280 } // clamp on update`}</pre>
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Gotchas</h3>
                <ul>
                    <li>Persist only small, safe UI bits. Don’t persist bulky or sensitive data.</li>
                    <li>Immutable nested updates: <code>{`{ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }`}</code>.</li>
                    <li>If you add more keys later, bump <code>version</code> and write a <code>migrate</code>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSidebar;
