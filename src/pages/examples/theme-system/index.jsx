import React from "react";
import { Styled } from "./styled";

/**
 * Example: Theme + System Preference
 * Goal: support 'light' | 'dark' | 'system' with persist, system sync, and no FOUC.
 * Style: copy-paste friendly notes (not live).
 */
const ExampleThemeSystem = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Theme + System Preference</Styled.Title>
            <Styled.Subtitle>
                Mode values: <code>light</code>, <code>dark</code>, or <code>system</code>. Persist the choice, react to OS changes, and apply to the DOM early.
            </Styled.Subtitle>

            {/* 1) Store shape */}
            <Styled.Section>
                <h3>1) Theme store (persisted)</h3>
                <p>Store only the user’s <code>mode</code> (light/dark/system). Derive the <b>effective</b> mode using the OS preference.</p>
                <pre className="good">{`// src/stores/theme.js
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
);`}</pre>
            </Styled.Section>

            {/* 2) Applying to DOM */}
            <Styled.Section>
                <h3>2) Apply theme to the DOM</h3>
                <p>
                    Keep CSS keyed by <code>[data-theme="light"]</code> and <code>[data-theme="dark"]</code>. Update the attribute on
                    <code>document.documentElement</code> whenever the effective mode changes.
                </p>
                <pre className="good">{`// src/theme/applyTheme.js
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
}`}</pre>
                <pre className="note">{`// src/App.jsx (sketch)
useEffect(() => {
  // set initial attribute from current state
  applyThemeToDom();
  // start system listener
  const cleanupSystem = useTheme.getState().initListener();
  // subscribe to store changes -> update DOM attribute
  const unsub = subscribeThemeDomSync();
  return () => { unsub?.(); cleanupSystem?.(); };
}, []);`}</pre>
            </Styled.Section>

            {/* 3) Avoiding FOUC */}
            <Styled.Section>
                <h3>3) Avoid flash of incorrect theme (FOUC)</h3>
                <p>
                    Read the persisted mode <i>before</i> React loads and set <code>data-theme</code> synchronously in
                    <code>index.html</code>. This avoids a flash of light/dark.
                </p>
                <pre className="good">{`<!-- public/index.html -->
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
</script>`}</pre>
            </Styled.Section>

            {/* 4) CSS tokens */}
            <Styled.Section>
                <h3>4) CSS variables (example)</h3>
                <pre className="note">{`/* app.css */
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
body { background: var(--bg); color: var(--fg); }`}</pre>
            </Styled.Section>

            {/* 5) UI controls */}
            <Styled.Section>
                <h3>5) UI control to switch</h3>
                <pre className="good">{`// ThemeSwitch.jsx
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
}`}</pre>
                <p>If a user picks “System”, OS changes (dark↔light) will update automatically via the <code>matchMedia</code> listener.</p>
            </Styled.Section>

            {/* 6) Extras */}
            <Styled.Section>
                <h3>6) Extras & tips</h3>
                <ul>
                    <li><b>Cross-tab sync:</b> theme syncs naturally because all tabs read from <code>localStorage</code> on load; to live-sync, listen to the <code>storage</code> event and call <code>applyThemeToDom()</code>.</li>
                    <li><b>SSR:</b> set a server-side default (e.g., light), then the inlined script updates on hydration.</li>
                    <li><b>Accessibility:</b> setting <code>color-scheme</code> ensures scrollbars, form controls, etc., match the theme.</li>
                </ul>
                <pre className="note">{`// Optional: cross-tab
window.addEventListener('storage', (e) => {
  if (e.key === 'app-theme') {
    // Re-apply from current store state
    try { require('../theme/applyTheme').applyThemeToDom(); } catch {}
  }
});`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleThemeSystem;
