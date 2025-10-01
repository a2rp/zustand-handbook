import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Global vs Per-Component Stores"}),e.jsx(s.Subtitle,{children:"How I decide between one app-wide store and small local stores."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Quick rules to choose global vs local."}),e.jsx("li",{children:"Simple examples you can copy into your project."}),e.jsx("li",{children:"Common mistakes I try to avoid."}),e.jsx("li",{children:"A safe migration plan if the app grows."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick decision matrix"}),e.jsxs(s.Table,{role:"table","aria-label":"Decision matrix for store choices",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Signal"}),e.jsx("th",{children:"My pick"}),e.jsx("th",{children:"Why"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Same state is needed across many pages/features"}),e.jsx("td",{children:"Global store"}),e.jsx("td",{children:"One source of truth; no prop drilling."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"State is temporary and belongs to one widget/screen"}),e.jsx("td",{children:"Per-component store"}),e.jsx("td",{children:"Tighter boundary; less global bloat."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Unmount should reset everything automatically"}),e.jsx("td",{children:"Per-component store"}),e.jsx("td",{children:"Teardown comes “for free” when component unmounts."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Cross-feature concerns (auth, theme, permissions, cart)"}),e.jsx("td",{children:"Global store"}),e.jsx("td",{children:"Shared access and consistent behavior."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Slice is heavy/large"}),e.jsx("td",{children:"Either → slice by feature"}),e.jsx("td",{children:"Split state and select narrowly."})]})]})]}),e.jsxs(s.Callout,{children:["Rule of thumb I use: if ",e.jsx("b",{children:"3+ independent screens"})," need the same state, I go global."]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["When I choose a ",e.jsx("em",{children:"global"})," store"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Truly shared concerns: ",e.jsx("i",{children:"auth, user profile, theme, permissions, cart"}),"."]}),e.jsx("li",{children:"One place to attach middlewares (persist, devtools)."}),e.jsx("li",{children:"Easier to coordinate actions across features."})]}),e.jsx("pre",{className:"good",children:`// stores/app.js
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
}));`}),e.jsx("pre",{className:"note",children:`// In components, I subscribe narrowly:
const user = useApp((s) => s.auth.user);
const mode = useApp((s) => s.theme.mode);`})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["When I prefer a ",e.jsx("em",{children:"local / per-component"})," store"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Self-contained flows: wizard, modal workflow, multi-step form, table filters."}),e.jsx("li",{children:"Reset-on-unmount behavior is desired by default."}),e.jsx("li",{children:"Tests are simpler: mount the component with its own store factory."})]}),e.jsx("pre",{className:"good",children:`// WizardStore.jsx (factory)
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
}`}),e.jsx("pre",{className:"note",children:`// Wizard.jsx
const useWizard = React.useMemo(() => createWizardStore(1), []); // each instance gets its own store

const step = useWizard((s) => s.step);
const next = useWizard((s) => s.next);
const reset = useWizard((s) => s.reset);`}),e.jsx(s.Callout,{children:"Each instance has isolated state. When the component unmounts, the store is gone — no global cleanup needed."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"“Slices” inside a global store"}),e.jsx("p",{children:"Even with one global store, I slice the state by feature and expose actions per slice. This keeps things readable and prevents accidental coupling."}),e.jsx("pre",{className:"good",children:`// stores/app.js (sketch)
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
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Anti-patterns I avoid"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["One giant “kitchen-sink” store.",e.jsx("i",{children:"Fix:"})," split by feature slices; keep actions near their data."]}),e.jsxs("li",{children:["Selecting the entire store in components.",e.jsx("i",{children:"Fix:"})," subscribe to the smallest slice; use ",e.jsx("code",{children:"shallow"})," for tuples/objects."]}),e.jsxs("li",{children:["Putting shared state (e.g., auth) into a local widget store.",e.jsx("i",{children:"Fix:"})," shared concerns belong to a global slice."]})]}),e.jsx("pre",{className:"bad",children:`// ❌ over-selecting in a component
const all = useApp((s) => s); // many re-renders`}),e.jsx("pre",{className:"good",children:`// ✅ select narrowly
const items = useApp((s) => s.cart.items);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"How I migrate safely as the app grows"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Start with a small global store, already split into feature slices."}),e.jsx("li",{children:"Add per-component stores for isolated widgets (wizards/forms/modals)."}),e.jsx("li",{children:"Extract growing slices into their own files; keep selectors narrow."}),e.jsxs("li",{children:["Use persist with ",e.jsx("b",{children:"partialization"})," + ",e.jsx("b",{children:"versioning"})," for durable data."]}),e.jsxs("li",{children:["Name actions (",e.jsx("code",{children:"slice/action"}),") so devtools traces stay readable."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist I actually use"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Shared by multiple screens? → global slice."}),e.jsx("li",{children:"Ephemeral to one widget? → local store factory."}),e.jsx("li",{children:"Needs reset on unmount? → local."}),e.jsx("li",{children:"Cross-feature policy (auth/permissions/theme)? → global."}),e.jsx("li",{children:"Seeing extra renders? → revisit selectors/equality."})]})]})]});export{i as default};
