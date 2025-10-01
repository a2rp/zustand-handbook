import{d as t,j as e}from"./index-Bmr0gcqO.js";const i="var(--card, #111)",a="var(--text, #e9e9e9)",o="var(--muted, #b7b7b7)",r="var(--border, #222)",l="var(--accent, #22c55e)",n="var(--danger, #ef4444)",c="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:t.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${i};
        color: ${a};
        border: 1px solid ${r};
        border-radius: ${c};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:t.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:t.p`
        margin: 0 0 18px 0;
        color: ${o};
    `,Section:t.section`
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
            border: 1px solid ${l};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${n};
            background: rgba(239, 68, 68, 0.08);
        }
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Slices Pattern (auth / ui / cart)"}),e.jsx(s.Subtitle,{children:"One global store, split by feature slices. Clean structure and narrow selectors."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Organize a single store by feature slices."}),e.jsx("li",{children:"Keep actions near their data and name them for devtools."}),e.jsx("li",{children:"Select narrowly to avoid extra re-renders."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Single file store with slices"}),e.jsx("p",{children:"Simple to start: one file, but grouped by feature."}),e.jsx("pre",{className:"good",children:`// src/stores/app.js
import { create } from 'zustand';

export const useApp = create((set, get) => ({
  // --- auth slice ---
  auth: { user: null },
  login: (user) => set({ auth: { user } }, false, 'auth/login'),
  logout: () => set({ auth: { user: null } }, false, 'auth/logout'),

  // --- ui slice ---
  ui: { sidebarOpen: true, theme: 'dark' },
  toggleSidebar: () =>
    set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }), false, 'ui/toggleSidebar'),
  setTheme: (mode) =>
    set((s) => ({ ui: { ...s.ui, theme: mode } }), false, 'ui/setTheme'),

  // --- cart slice ---
  cart: { items: [] },
  addToCart: (item) =>
    set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
  clearCart: () => set((s) => ({ cart: { items: [] } }), false, 'cart/clear'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Selecting only what you need"}),e.jsx("pre",{className:"good",children:`// Component snippets
const user = useApp((s) => s.auth.user);
const theme = useApp((s) => s.ui.theme);
const items = useApp((s) => s.cart.items);`}),e.jsx("pre",{className:"note",children:`// Multiple values with shallow equality
import { shallow } from 'zustand/shallow';
const [items, sidebarOpen] = useApp((s) => [s.cart.items, s.ui.sidebarOpen], shallow);`}),e.jsx("pre",{className:"bad",children:`// Avoid this: over-selecting everything
const all = useApp((s) => s); // causes more re-renders`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Option B — slice creators (split into files)"}),e.jsxs("p",{children:["Better for larger apps. Each slice is a function that takes ",e.jsx("code",{children:"set"}),"/",e.jsx("code",{children:"get"}),"."]}),e.jsx("pre",{className:"good",children:`// src/stores/slices/auth.js
export const createAuthSlice = (set, get) => ({
  auth: { user: null },
  login: (user) => set({ auth: { user } }, false, 'auth/login'),
  logout: () => set({ auth: { user: null } }, false, 'auth/logout'),
});

// src/stores/slices/ui.js
export const createUiSlice = (set, get) => ({
  ui: { sidebarOpen: true, theme: 'dark' },
  toggleSidebar: () =>
    set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }), false, 'ui/toggleSidebar'),
  setTheme: (mode) =>
    set((s) => ({ ui: { ...s.ui, theme: mode } }), false, 'ui/setTheme'),
});

// src/stores/slices/cart.js
export const createCartSlice = (set, get) => ({
  cart: { items: [] },
  addToCart: (item) =>
    set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
  clearCart: () => set((s) => ({ cart: { items: [] } }), false, 'cart/clear'),
});

// src/stores/app.js (compose them)
import { create } from 'zustand';
import { createAuthSlice } from './slices/auth';
import { createUiSlice } from './slices/ui';
import { createCartSlice } from './slices/cart';

export const useApp = create((set, get) => ({
  ...createAuthSlice(set, get),
  ...createUiSlice(set, get),
  ...createCartSlice(set, get),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Reset patterns (slice or app)"}),e.jsx("pre",{className:"note",children:`// Per-slice reset
const initialAuth = { user: null };
resetAuth: () => set({ auth: initialAuth }, false, 'auth/reset');

// Full reset (keep a top-level initial)
const initial = {
  auth: initialAuth,
  ui: { sidebarOpen: true, theme: 'dark' },
  cart: { items: [] },
};
resetAll: () => set(initial, false, 'app/reset');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Testing actions quickly"}),e.jsx("pre",{className:"good",children:`import { act } from '@testing-library/react';
import { useApp } from '../stores/app';

test('login updates user', () => {
  act(() => useApp.getState().login({ id: 1, name: 'A' }));
  expect(useApp.getState().auth.user?.id).toBe(1);
});`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common mistakes"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Putting everything in one flat object with unrelated actions."}),e.jsx("li",{children:"Selecting the whole store in components."}),e.jsx("li",{children:"Updating nested data without creating new references."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Try this"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Add a ",e.jsx("code",{children:"removeFromCart(id)"})," action."]}),e.jsxs("li",{children:["Persist only the ",e.jsx("code",{children:"auth"})," and ",e.jsx("code",{children:"ui.theme"})," parts with a partializer."]}),e.jsxs("li",{children:["Show a cart badge derived from ",e.jsx("code",{children:"items.length"})," (derive in component)."]})]})]})]});export{p as default};
