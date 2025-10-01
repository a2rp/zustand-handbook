import{d as s,j as e}from"./index-CpvfKB5t.js";const o="var(--card, #111)",n="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",r="var(--border, #222)",c="var(--accent, #22c55e)",d="var(--danger, #ef4444)",i="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${n};
        border: 1px solid ${r};
        border-radius: ${i};
        box-shadow: ${l};
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
            border: 1px solid ${c};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `},h=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Theme + System Preference"}),e.jsxs(t.Subtitle,{children:["Mode values: ",e.jsx("code",{children:"light"}),", ",e.jsx("code",{children:"dark"}),", or ",e.jsx("code",{children:"system"}),". Persist the choice, react to OS changes, and apply to the DOM early."]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Theme store (persisted)"}),e.jsxs("p",{children:["Store only the user’s ",e.jsx("code",{children:"mode"})," (light/dark/system). Derive the ",e.jsx("b",{children:"effective"})," mode using the OS preference."]}),e.jsx("pre",{className:"good",children:`// src/stores/theme.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

function getSystemPref() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useTheme = create(
  persist(
    (set, get) => ({
      mode: 'system',        // 'light' | 'dark' | 'system'
      system: getSystemPref(), // last-known system preference (light/dark)

      // derived helper
      effective: () => {
        const s = get();
        return s.mode === 'system' ? s.system : s.mode;
      },

      setMode: (mode) => set({ mode }, false, 'theme/setMode'),

      // call once on app start to wire up system changes
      initListener: () => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
          set({ system: e.matches ? 'dark' : 'light' }, false, 'theme/systemChange');
        };
        // modern browsers
        try { mql.addEventListener('change', handler); }
        catch { mql.addListener(handler); /* legacy */ }

        // store cleanup function if you want to unmount/remove later (optional)
        return () => {
          try { mql.removeEventListener('change', handler); }
          catch { mql.removeListener(handler); }
        };
      },
    }),
    {
      name: 'app-theme',
      storage: createJSONStorage(() => localStorage),
      // persist only what you need
      partialize: (s) => ({ mode: s.mode }),
      version: 1,
      migrate: (persisted, version) => persisted, // sketch
    }
  )
);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Apply theme to the DOM"}),e.jsxs("p",{children:["Keep CSS keyed by ",e.jsx("code",{children:'[data-theme="light"]'})," and ",e.jsx("code",{children:'[data-theme="dark"]'}),". Update the attribute on",e.jsx("code",{children:"document.documentElement"})," whenever the effective mode changes."]}),e.jsx("pre",{className:"good",children:`// src/theme/applyTheme.js
import { useTheme } from '../stores/theme';

export function applyThemeToDom() {
  const m = useTheme.getState().effective();
  const root = document.documentElement;
  root.setAttribute('data-theme', m);
  // Helps built-in controls match theme
  root.style.colorScheme = m; // 'light' | 'dark'
}

// subscribe once (e.g., at App mount)
export function subscribeThemeDomSync() {
  const unsub = useTheme.subscribe(
    (s) => s.effective(),              // selector
    (effective) => {
      const root = document.documentElement;
      root.setAttribute('data-theme', effective);
      root.style.colorScheme = effective;
    }
  );
  return unsub;
}`}),e.jsx("pre",{className:"note",children:`// src/App.jsx (sketch)
useEffect(() => {
  // set initial attribute from current state
  applyThemeToDom();
  // start system listener
  const cleanupSystem = useTheme.getState().initListener();
  // subscribe to store changes -> update DOM attribute
  const unsub = subscribeThemeDomSync();
  return () => { unsub?.(); cleanupSystem?.(); };
}, []);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Avoid flash of incorrect theme (FOUC)"}),e.jsxs("p",{children:["Read the persisted mode ",e.jsx("i",{children:"before"})," React loads and set ",e.jsx("code",{children:"data-theme"})," synchronously in",e.jsx("code",{children:"index.html"}),". This avoids a flash of light/dark."]}),e.jsx("pre",{className:"good",children:`<!-- public/index.html -->
<script>
  try {
    const key = 'app-theme';
    const raw = localStorage.getItem(key);
    let mode = 'system';
    if (raw) {
      const parsed = JSON.parse(raw);
      // zustand persist stores as { state: {...}, version: n }
      mode = parsed?.state?.mode || 'system';
    }
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effective = mode === 'system' ? system : mode;
    document.documentElement.setAttribute('data-theme', effective);
    document.documentElement.style.colorScheme = effective;
  } catch (e) { /* ignore */ }
<\/script>`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) CSS variables (example)"}),e.jsx("pre",{className:"note",children:`/* app.css */
:root {
  --bg: #0b0b0b;
  --fg: #e6e6e6;
}

:root[data-theme="light"] {
  --bg: #ffffff;
  --fg: #0b0b0b;
}

:root[data-theme="dark"] {
  --bg: #0b0b0b;
  --fg: #e6e6e6;
}

/* usage */
body { background: var(--bg); color: var(--fg); }`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) UI control to switch"}),e.jsx("pre",{className:"good",children:`// ThemeSwitch.jsx
import React from 'react';
import { useTheme } from '../stores/theme';

export default function ThemeSwitch() {
  const mode = useTheme((s) => s.mode);
  const setMode = useTheme((s) => s.setMode);
  return (
    <div>
      <button
        onClick={() => setMode('light')}
        aria-pressed={mode === 'light'}
      >Light</button>
      <button
        onClick={() => setMode('dark')}
        aria-pressed={mode === 'dark'}
      >Dark</button>
      <button
        onClick={() => setMode('system')}
        aria-pressed={mode === 'system'}
      >System</button>
    </div>
  );
}`}),e.jsxs("p",{children:["If a user picks “System”, OS changes (dark↔light) will update automatically via the ",e.jsx("code",{children:"matchMedia"})," listener."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"6) Extras & tips"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Cross-tab sync:"})," theme syncs naturally because all tabs read from ",e.jsx("code",{children:"localStorage"})," on load; to live-sync, listen to the ",e.jsx("code",{children:"storage"})," event and call ",e.jsx("code",{children:"applyThemeToDom()"}),"."]}),e.jsxs("li",{children:[e.jsx("b",{children:"SSR:"})," set a server-side default (e.g., light), then the inlined script updates on hydration."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Accessibility:"})," setting ",e.jsx("code",{children:"color-scheme"})," ensures scrollbars, form controls, etc., match the theme."]})]}),e.jsx("pre",{className:"note",children:`// Optional: cross-tab
window.addEventListener('storage', (e) => {
  if (e.key === 'app-theme') {
    // Re-apply from current store state
    try { require('../theme/applyTheme').applyThemeToDom(); } catch {}
  }
});`})]})]});export{h as default};
