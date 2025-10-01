import React from "react";
import { Styled } from "./styled";

/**
 * Example: Persist Theme
 * Goal: save theme (light/dark/system) to storage with versioning + partialization.
 * Style: note-style snippets you can copy into your app.
 */
const ExamplePersistTheme = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Persist Theme</Styled.Title>
            <Styled.Subtitle>Save theme to storage with a small, safe setup.</Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Use <code>persist</code> middleware to store just the theme (not the whole app).</li>
                    <li>Keep a <code>version</code> and a <code>migrate()</code> function for future changes.</li>
                    <li>Support a <b>system</b> mode that maps to light/dark using media query.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Install & core imports</h3>
                <pre className="good">{`npm i zustand

// store/theme.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Theme store with persist (partialization + version)</h3>
                <pre className="good">{`// store/theme.js
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
);`}</pre>

                <Styled.Callout>
                    <b>Why partialize?</b> Persisting only <code>mode</code> keeps storage small and avoids accidental leaks of other UI state.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Using it in a component</h3>
                <pre className="good">{`// ThemeSwitcher.jsx
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
}`}</pre>
                <p>
                    Selecting the whole store (<code>(s) =&gt; s</code>) would cause more re-renders. Stick to
                    the fields you actually use.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>4) CSS hook (example)</h3>
                <pre className="note">{`/* app.css */
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
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) System preference changes (optional)</h3>
                <p>
                    If the user chooses <b>system</b>, you can react to OS theme changes:
                </p>
                <pre className="note">{`useEffect(() => {
  if (useTheme.getState().mode !== 'system') return;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const effective = mql.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', effective);
  };
  apply();
  mql.addEventListener?.('change', apply);
  return () => mql.removeEventListener?.('change', apply);
}, []);`}</pre>
                <p>Skip this if you don’t need live OS-change reaction.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Common pitfalls</h3>
                <pre className="bad">{`// ❌ Persisting the whole UI state "just because"
persist((set) => ({ ui: { manyThings: {...} } }), { name: 'big-ui' })`}</pre>
                <pre className="good">{`// ✅ Persist the minimum you need (theme only)
partialize: (s) => ({ mode: s.mode })`}</pre>

                <pre className="bad">{`// ❌ Forgetting version/migrate when changing shape
version: 1, migrate: undefined`}</pre>
                <pre className="good">{`// ✅ Bump version + migrate old data
version: 2, migrate: (prev, v) => { /* map to new shape */ }`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Extra: cross-tab sync (optional)</h3>
                <p>
                    If you change the mode in one tab, you can rehydrate in other tabs:
                </p>
                <pre className="note">{`// somewhere at app root
window.addEventListener('storage', (e) => {
  if (e.key === 'zh-theme') {
    // Ask persist to read again from storage
    useTheme.persist?.rehydrate?.();
  }
});`}</pre>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExamplePersistTheme;
