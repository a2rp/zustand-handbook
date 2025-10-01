import React from "react";
import { Styled } from "./styled";

const ExampleSlicesPattern = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Slices Pattern (auth / ui / cart)</Styled.Title>
            <Styled.Subtitle>
                One global store, split by feature slices. Clean structure and narrow selectors.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>Organize a single store by feature slices.</li>
                    <li>Keep actions near their data and name them for devtools.</li>
                    <li>Select narrowly to avoid extra re-renders.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Single file store with slices</h3>
                <p>Simple to start: one file, but grouped by feature.</p>
                <pre className="good">{`// src/stores/app.js
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
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Selecting only what you need</h3>
                <pre className="good">{`// Component snippets
const user = useApp((s) => s.auth.user);
const theme = useApp((s) => s.ui.theme);
const items = useApp((s) => s.cart.items);`}</pre>
                <pre className="note">{`// Multiple values with shallow equality
import { shallow } from 'zustand/shallow';
const [items, sidebarOpen] = useApp((s) => [s.cart.items, s.ui.sidebarOpen], shallow);`}</pre>
                <pre className="bad">{`// Avoid this: over-selecting everything
const all = useApp((s) => s); // causes more re-renders`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Option B — slice creators (split into files)</h3>
                <p>Better for larger apps. Each slice is a function that takes <code>set</code>/<code>get</code>.</p>
                <pre className="good">{`// src/stores/slices/auth.js
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
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Reset patterns (slice or app)</h3>
                <pre className="note">{`// Per-slice reset
const initialAuth = { user: null };
resetAuth: () => set({ auth: initialAuth }, false, 'auth/reset');

// Full reset (keep a top-level initial)
const initial = {
  auth: initialAuth,
  ui: { sidebarOpen: true, theme: 'dark' },
  cart: { items: [] },
};
resetAll: () => set(initial, false, 'app/reset');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Testing actions quickly</h3>
                <pre className="good">{`import { act } from '@testing-library/react';
import { useApp } from '../stores/app';

test('login updates user', () => {
  act(() => useApp.getState().login({ id: 1, name: 'A' }));
  expect(useApp.getState().auth.user?.id).toBe(1);
});`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Common mistakes</h3>
                <ul>
                    <li>Putting everything in one flat object with unrelated actions.</li>
                    <li>Selecting the whole store in components.</li>
                    <li>Updating nested data without creating new references.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Try this</h3>
                <ul>
                    <li>Add a <code>removeFromCart(id)</code> action.</li>
                    <li>Persist only the <code>auth</code> and <code>ui.theme</code> parts with a partializer.</li>
                    <li>Show a cart badge derived from <code>items.length</code> (derive in component).</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSlicesPattern;
