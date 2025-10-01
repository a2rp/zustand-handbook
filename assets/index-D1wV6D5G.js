import{d as i,j as e}from"./index-Bmr0gcqO.js";const o="var(--card, #111)",a="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",r="var(--border, #222)",t="var(--accent, #22c55e)",d="var(--danger, #ef4444)",l="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:i.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${a};
        border: 1px solid ${r};
        border-radius: ${l};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:i.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:i.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:i.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${r};
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
            border: 1px dashed ${r};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${t};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }

        pre.inline {
            display: inline-block;
            margin: 6px 0 0 8px;
        }
    `,Callout:i.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},u=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Sidebar (Persisted)"}),e.jsxs(s.Subtitle,{children:["I keep a small UI slice with ",e.jsx("code",{children:"sidebarOpen"})," and persist just that key."]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsx("li",{children:"One global UI slice for app-chrome state."}),e.jsxs("li",{children:["Persist with ",e.jsx("code",{children:"persist()"})," + ",e.jsx("code",{children:"partialize"})," + ",e.jsx("code",{children:"version"}),"."]}),e.jsx("li",{children:"Selectors that subscribe to the smallest slice."}),e.jsx("li",{children:"Immutable nested updates."})]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["1) Store: ",e.jsx("code",{children:"src/stores/ui.js"})]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
);`}),e.jsxs(s.Callout,{children:["I name actions like ",e.jsx("code",{children:"ui/toggleSidebar"})," so devtools traces are readable."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Using it in layout"}),e.jsx("pre",{className:"good",children:`// Layout.jsx (sketch)
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
}`}),e.jsxs("p",{children:["I subscribe to the minimal piece: ",e.jsx("code",{children:"(s) => s.ui.sidebarOpen"}),". The buttons select just the actions they need."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Accessibility + keyboard"}),e.jsx("pre",{className:"note",children:`// Keyboard shortcut (optional)
useEffect(() => {
  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      useAppUi.getState().toggleSidebar(); // safe call outside component
    }
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);`}),e.jsxs("p",{children:["I set ",e.jsx("code",{children:"aria-expanded"})," on the sidebar container and keep focus inside when open (if it’s a modal-style drawer)."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Variations"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Session-only persistence:",e.jsx("pre",{className:"note inline",children:"storage: createJSONStorage(() => sessionStorage)"})]}),e.jsxs("li",{children:["SSR-safe storage:",e.jsx("pre",{className:"note",children:"storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined))"})]}),e.jsxs("li",{children:["Also persist a numeric width:",e.jsx("pre",{className:"note",children:"ui: { sidebarOpen: true, sidebarWidth: 280 } // clamp on update"})]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Gotchas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Persist only small, safe UI bits. Don’t persist bulky or sensitive data."}),e.jsxs("li",{children:["Immutable nested updates: ",e.jsx("code",{children:"{ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }"}),"."]}),e.jsxs("li",{children:["If you add more keys later, bump ",e.jsx("code",{children:"version"})," and write a ",e.jsx("code",{children:"migrate"}),"."]})]})]})]});export{u as default};
