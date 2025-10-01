import{d as s,j as e}from"./index-Gt8sd0pi.js";const r="var(--card, #111)",a="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",o="var(--border, #222)",i="var(--accent, #22c55e)",d="var(--danger, #ef4444)",c="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${r};
        color: ${a};
        border: 1px solid ${o};
        border-radius: ${c};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:s.section`
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
            border: 1px solid ${i};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${o};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},m=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Persist Theme"}),e.jsx(t.Subtitle,{children:"Save theme to storage with a small, safe setup."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Use ",e.jsx("code",{children:"persist"})," middleware to store just the theme (not the whole app)."]}),e.jsxs("li",{children:["Keep a ",e.jsx("code",{children:"version"})," and a ",e.jsx("code",{children:"migrate()"})," function for future changes."]}),e.jsxs("li",{children:["Support a ",e.jsx("b",{children:"system"})," mode that maps to light/dark using media query."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Install & core imports"}),e.jsx("pre",{className:"good",children:`npm i zustand

// store/theme.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Theme store with persist (partialization + version)"}),e.jsx("pre",{className:"good",children:`// store/theme.js
export const useTheme = create(
  persist(
    (set, get) => ({
      // 'light' | 'dark' | 'system'
      mode: 'system',

      setMode: (mode) => set({ mode }, false, 'theme/setMode'),
      toggle: () =>
        set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' }), false, 'theme/toggle'),

      // Helper to compute the actual mode if 'system' is chosen
      getEffectiveMode: () => {
        const m = get().mode;
        if (m !== 'system') return m;
        if (typeof window !== 'undefined' && window.matchMedia) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
      },
    }),
    {
      name: 'zh-theme',              // storage key
      version: 1,                    // bump when shape changes
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }), // only persist mode
      migrate: (persisted, version) => {
        // Example migration if you used an older shape
        if (!persisted) return { mode: 'system' };
        switch (version) {
          case 0:
            // Example: old state may have been { theme: { mode } }
            return { mode: persisted?.theme?.mode ?? 'system' };
          default:
            return persisted;
        }
      },
      // Optional: rehydrate callback hooks
      // onRehydrateStorage: () => (state) => { /* after rehydrate */ },
    }
  )
);`}),e.jsxs(t.Callout,{children:[e.jsx("b",{children:"Why partialize?"})," Persisting only ",e.jsx("code",{children:"mode"})," keeps storage small and avoids accidental leaks of other UI state."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Using it in a component"}),e.jsx("pre",{className:"good",children:`// ThemeSwitcher.jsx
import React, { useEffect } from 'react';
import { useTheme } from '../store/theme';
import { shallow } from 'zustand/shallow';

export default function ThemeSwitcher() {
  // Select narrowly with a tuple + shallow (perf-friendly)
  const [mode, setMode, toggle] = useTheme(
    (s) => [s.mode, s.setMode, s.toggle],
    shallow
  );

  // Apply to <html data-theme="..."> so CSS can react to it
  useEffect(() => {
    const html = document.documentElement;
    const effective = useTheme.getState().getEffectiveMode(); // safe read
    html.setAttribute('data-theme', effective);
  }, [mode]); // runs when 'mode' changes

  return (
    <div>
      <p>Theme: <b>{mode}</b></p>
      <button onClick={toggle}>Toggle (light/dark)</button>
      <button onClick={() => setMode('system')}>System</button>
      <button onClick={() => setMode('light')}>Light</button>
      <button onClick={() => setMode('dark')}>Dark</button>
    </div>
  );
}`}),e.jsxs("p",{children:["Selecting the whole store (",e.jsx("code",{children:"(s) => s"}),") would cause more re-renders. Stick to the fields you actually use."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) CSS hook (example)"}),e.jsx("pre",{className:"note",children:`/* app.css */
:root[data-theme="light"] {
  --bg: #ffffff;
  --text: #0f172a;
}
:root[data-theme="dark"] {
  --bg: #0b0b0b;
  --text: #e5e7eb;
}

/* Then use variables in your app */
body {
  background: var(--bg);
  color: var(--text);
}`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) System preference changes (optional)"}),e.jsxs("p",{children:["If the user chooses ",e.jsx("b",{children:"system"}),", you can react to OS theme changes:"]}),e.jsx("pre",{className:"note",children:`useEffect(() => {
  if (useTheme.getState().mode !== 'system') return;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const effective = mql.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', effective);
  };
  apply();
  mql.addEventListener?.('change', apply);
  return () => mql.removeEventListener?.('change', apply);
}, []);`}),e.jsx("p",{children:"Skip this if you don’t need live OS-change reaction."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"6) Common pitfalls"}),e.jsx("pre",{className:"bad",children:`// ❌ Persisting the whole UI state "just because"
persist((set) => ({ ui: { manyThings: {...} } }), { name: 'big-ui' })`}),e.jsx("pre",{className:"good",children:`// ✅ Persist the minimum you need (theme only)
partialize: (s) => ({ mode: s.mode })`}),e.jsx("pre",{className:"bad",children:`// ❌ Forgetting version/migrate when changing shape
version: 1, migrate: undefined`}),e.jsx("pre",{className:"good",children:`// ✅ Bump version + migrate old data
version: 2, migrate: (prev, v) => { /* map to new shape */ }`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"7) Extra: cross-tab sync (optional)"}),e.jsx("p",{children:"If you change the mode in one tab, you can rehydrate in other tabs:"}),e.jsx("pre",{className:"note",children:`// somewhere at app root
window.addEventListener('storage', (e) => {
  if (e.key === 'zh-theme') {
    // Ask persist to read again from storage
    useTheme.persist?.rehydrate?.();
  }
});`})]})]});export{m as default};
