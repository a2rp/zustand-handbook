import React from "react";
import { Styled } from "./styled";

const StoreChoices = () => {
    return (
        <Styled.Page>
            <Styled.Title>Global vs Per-Component Stores</Styled.Title>
            <Styled.Subtitle>
                How I decide between one app-wide store and small local stores.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>Quick rules to choose global vs local.</li>
                    <li>Simple examples you can copy into your project.</li>
                    <li>Common mistakes I try to avoid.</li>
                    <li>A safe migration plan if the app grows.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick decision matrix</h3>
                <Styled.Table role="table" aria-label="Decision matrix for store choices">
                    <thead>
                        <tr>
                            <th>Signal</th>
                            <th>My pick</th>
                            <th>Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Same state is needed across many pages/features</td>
                            <td>Global store</td>
                            <td>One source of truth; no prop drilling.</td>
                        </tr>
                        <tr>
                            <td>State is temporary and belongs to one widget/screen</td>
                            <td>Per-component store</td>
                            <td>Tighter boundary; less global bloat.</td>
                        </tr>
                        <tr>
                            <td>Unmount should reset everything automatically</td>
                            <td>Per-component store</td>
                            <td>Teardown comes “for free” when component unmounts.</td>
                        </tr>
                        <tr>
                            <td>Cross-feature concerns (auth, theme, permissions, cart)</td>
                            <td>Global store</td>
                            <td>Shared access and consistent behavior.</td>
                        </tr>
                        <tr>
                            <td>Slice is heavy/large</td>
                            <td>Either → slice by feature</td>
                            <td>Split state and select narrowly.</td>
                        </tr>
                    </tbody>
                </Styled.Table>
                <Styled.Callout>
                    Rule of thumb I use: if <b>3+ independent screens</b> need the same state, I go global.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>When I choose a <em>global</em> store</h3>
                <ul>
                    <li>Truly shared concerns: <i>auth, user profile, theme, permissions, cart</i>.</li>
                    <li>One place to attach middlewares (persist, devtools).</li>
                    <li>Easier to coordinate actions across features.</li>
                </ul>
                <pre className="good">{`// stores/app.js
import { create } from 'zustand';

export const useApp = create((set) => ({
  auth: { user: null },
  theme: { mode: 'dark' },
  cart: { items: [] },

  login: (user) => set({ auth: { user } }, false, 'auth/login'),
  logout: () => set({ auth: { user: null } }, false, 'auth/logout'),

  toggleTheme: () => set((s) => ({
    theme: { mode: s.theme.mode === 'dark' ? 'light' : 'dark' }
  }), false, 'theme/toggle'),
}));`}</pre>
                <pre className="note">{`// In components, I subscribe narrowly:
const user = useApp((s) => s.auth.user);
const mode = useApp((s) => s.theme.mode);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>When I prefer a <em>local / per-component</em> store</h3>
                <ul>
                    <li>Self-contained flows: wizard, modal workflow, multi-step form, table filters.</li>
                    <li>Reset-on-unmount behavior is desired by default.</li>
                    <li>Tests are simpler: mount the component with its own store factory.</li>
                </ul>
                <pre className="good">{`// WizardStore.jsx (factory)
import { create } from 'zustand';

export function createWizardStore(initialStep = 1) {
  return create((set) => ({
    step: initialStep,
    data: {},
    next: () => set((s) => ({ step: s.step + 1 })),
    prev: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
    setField: (k, v) => set((s) => ({ data: { ...s.data, [k]: v } })),
    reset: () => set({ step: 1, data: {} }),
  }));
}`}</pre>
                <pre className="note">{`// Wizard.jsx
const useWizard = React.useMemo(() => createWizardStore(1), []); // each instance gets its own store

const step = useWizard((s) => s.step);
const next = useWizard((s) => s.next);
const reset = useWizard((s) => s.reset);`}</pre>
                <Styled.Callout>
                    Each instance has isolated state. When the component unmounts, the store is gone —
                    no global cleanup needed.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>“Slices” inside a global store</h3>
                <p>
                    Even with one global store, I slice the state by feature and expose actions per
                    slice. This keeps things readable and prevents accidental coupling.
                </p>
                <pre className="good">{`// stores/app.js (sketch)
export const useApp = create((set, get) => ({
  // auth slice
  auth: { user: null },
  login: (user) => set({ auth: { user } }, false, 'auth/login'),

  // ui slice
  ui: { sidebarOpen: true, toast: null },
  toggleSidebar: () => set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } }), false, 'ui/toggleSidebar'),

  // cart slice
  cart: { items: [] },
  addToCart: (item) => set((s) => ({ cart: { items: [...s.cart.items, item] } }), false, 'cart/add'),
}));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Anti-patterns I avoid</h3>
                <ul>
                    <li>
                        One giant “kitchen-sink” store.
                        <i>Fix:</i> split by feature slices; keep actions near their data.
                    </li>
                    <li>
                        Selecting the entire store in components.
                        <i>Fix:</i> subscribe to the smallest slice; use <code>shallow</code> for tuples/objects.
                    </li>
                    <li>
                        Putting shared state (e.g., auth) into a local widget store.
                        <i>Fix:</i> shared concerns belong to a global slice.
                    </li>
                </ul>
                <pre className="bad">{`// ❌ over-selecting in a component
const all = useApp((s) => s); // many re-renders`}</pre>
                <pre className="good">{`// ✅ select narrowly
const items = useApp((s) => s.cart.items);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>How I migrate safely as the app grows</h3>
                <ol>
                    <li>Start with a small global store, already split into feature slices.</li>
                    <li>Add per-component stores for isolated widgets (wizards/forms/modals).</li>
                    <li>Extract growing slices into their own files; keep selectors narrow.</li>
                    <li>Use persist with <b>partialization</b> + <b>versioning</b> for durable data.</li>
                    <li>Name actions (<code>slice/action</code>) so devtools traces stay readable.</li>
                </ol>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist I actually use</h3>
                <ul>
                    <li>Shared by multiple screens? → global slice.</li>
                    <li>Ephemeral to one widget? → local store factory.</li>
                    <li>Needs reset on unmount? → local.</li>
                    <li>Cross-feature policy (auth/permissions/theme)? → global.</li>
                    <li>Seeing extra renders? → revisit selectors/equality.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default StoreChoices;
