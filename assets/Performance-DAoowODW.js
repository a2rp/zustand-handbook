import{j as e}from"./index-CpvfKB5t.js";import{S as s}from"./styled-BiXATIDY.js";const n=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Performance — Over-selecting & Identity"}),e.jsx(s.Subtitle,{children:"My simple rules to keep Zustand apps fast and predictable."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I optimize for"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Only re-render components that actually need to change."}),e.jsx("li",{children:"Keep selectors cheap and stable."}),e.jsx("li",{children:"Batch updates so UI doesn’t repaint multiple times."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Select narrowly (don’t grab the whole store)"}),e.jsx("pre",{className:"bad",children:`// ❌ Over-selecting — every change in store will re-render this component
const everything = useApp((s) => s);`}),e.jsx("pre",{className:"good",children:`// ✅ Select only what this component needs
const user = useApp((s) => s.auth.user);
const isOpen = useApp((s) => s.ui.sidebarOpen);`}),e.jsx("p",{children:"Smaller selections = fewer re-renders."})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["2) When selecting multiple values, use ",e.jsx("code",{children:"shallow"})]}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';

// tuple + shallow
const [count, total] = useCart((s) => [s.count, s.total], shallow);

// object + shallow (nice when you need many fields)
const view = useCart((s) => ({ items: s.items, tax: s.taxRate }), shallow);`}),e.jsxs("p",{children:[e.jsx("code",{children:"shallow"})," prevents re-renders if the top-level values didn’t actually change."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Avoid identity churn in selectors (objects/arrays)"}),e.jsx("pre",{className:"bad",children:`// ❌ Fresh array each time → new reference → re-render
const filtered = useProducts((s) => s.items.filter(p => p.inStock));`}),e.jsx("pre",{className:"good",children:`// ✅ Select inputs, then derive with useMemo
const items = useProducts((s) => s.items);
const filtered = React.useMemo(
  () => items.filter(p => p.inStock),
  [items]
);`}),e.jsxs("p",{children:["Returning new arrays/objects from a selector creates new references on each run. Derive inside the component with ",e.jsx("code",{children:"useMemo"}),", or return a tuple/object +",e.jsx("code",{children:"shallow"})," if you must."]})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["4) Batch related updates in a single ",e.jsx("code",{children:"set()"})]}),e.jsx("pre",{className:"bad",children:`// ❌ multiple set() calls back-to-back
set({ loading: true });
set({ data });
set({ loading: false });`}),e.jsx("pre",{className:"good",children:`// ✅ one set() with the final patch
set({ loading: false, data, error: null }, false, 'fetch/success');`}),e.jsx("p",{children:"Fewer state patches = fewer render passes."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Use the functional form when next state depends on current"}),e.jsx("pre",{className:"good",children:"set((s) => ({ count: s.count + 1 }), false, 'counter/increment');"}),e.jsx("p",{children:"Prevents stale reads and keeps updates correct under rapid changes."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Keep expensive work out of selectors"}),e.jsx("pre",{className:"bad",children:`// ❌ heavy compute in selector runs on every store change
const stats = useData((s) => expensiveCompute(s.bigList));`}),e.jsx("pre",{className:"good",children:`// ✅ select inputs, compute with memo
const list = useData((s) => s.bigList);
const stats = React.useMemo(() => expensiveCompute(list), [list]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"7) Stable references for actions & slices"}),e.jsx("pre",{className:"good",children:`// actions are created once in the store; selecting them is stable
const addToCart = useCart((s) => s.addToCart);
const reset = useCart((s) => s.reset);`}),e.jsx("p",{children:"Don’t recreate actions on every render. Define them once in the store and select them like any other field."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"8) Prefer local/ephemeral state for purely UI concerns"}),e.jsx("pre",{className:"good",children:`// keep transient UI (like input text) local
const [query, setQuery] = React.useState('');`}),e.jsx("p",{children:"Hot, throw-away UI values don’t need to live in the global store. Less global traffic → fewer subscribers waking up."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"9) Persist only what’s needed"}),e.jsx("pre",{className:"good",children:`// with persist middleware later:
// partialize to avoid saving bulky/ephemeral fields
persistConfig: {
  name: 'app',
  partialize: (s) => ({ auth: s.auth, theme: s.theme }) // skip ui.temp, etc.
}`}),e.jsx("p",{children:"Smaller persisted payloads hydrate faster and reduce JSON parse/serialize cost."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"10) One store, feature slices; or multiple stores if truly isolated"}),e.jsx("pre",{className:"good",children:`// global with slices (auth/ui/cart)
const user = useApp((s) => s.auth.user);
const open = useApp((s) => s.ui.sidebarOpen);

// separate local store for a wizard
const useWizard = React.useMemo(() => createWizardStore(1), []);`}),e.jsx("p",{children:"The goal is to keep subscriptions small and focused. Slices + narrow selectors already go a long way."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"How I debug performance"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Turn on React Profiler and click around to see who re-rendered."}),e.jsxs("li",{children:["Name actions (",e.jsx("code",{children:"slice/action"}),") and watch devtools timeline."]}),e.jsxs("li",{children:["Drop a quick ",e.jsx("code",{children:"console.count()"})," in a noisy component to catch loops."]})]}),e.jsx("pre",{className:"note",children:`useEffect(() => {
  console.count('ProductList rendered');
});`})]})]});export{n as default};
