import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const n=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"set() & get() — Update Patterns"}),e.jsx(s.Subtitle,{children:"How I update state safely, read the latest value, and avoid extra renders."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What I cover"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["When I use the object form vs functional form of ",e.jsx("code",{children:"set()"}),"."]}),e.jsxs("li",{children:["Why I sometimes read with ",e.jsx("code",{children:"get()"})," inside actions."]}),e.jsx("li",{children:"Named actions for nicer devtools traces."}),e.jsx("li",{children:"Batching, partial updates, and reset patterns."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Two ways to call set()"}),e.jsx("pre",{className:"good",children:`// Object form: when the new state DOES NOT depend on the previous state
set({ open: true, error: null });

// Functional form: when it DOES depend on the previous state
set((s) => ({ count: s.count + 1 }));`}),e.jsx("p",{children:"If I’m using values from the current state to compute the next value, I reach for the functional form. It makes race conditions less likely."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Reading the latest value with get()"}),e.jsxs("p",{children:["Inside store actions, I read the current snapshot using ",e.jsx("code",{children:"get()"})," instead of relying on variables captured from component scope."]}),e.jsx("pre",{className:"good",children:`// inside create((set, get) => ({ ... }))
toggleTheme: () => {
  const curr = get().theme?.mode;          // always fresh
  const next = curr === 'dark' ? 'light' : 'dark';
  set({ theme: { mode: next } });
}`}),e.jsx("pre",{className:"bad",children:"// ⚠️ might use a stale `theme` captured from a component\ntoggleTheme: () => set({ theme: { mode: theme === 'dark' ? 'light' : 'dark' } });"})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Named actions (for devtools)"}),e.jsxs("p",{children:["When I add the ",e.jsx("code",{children:"devtools"})," middleware later, I pass an action name so traces are readable. Without devtools, I just omit the third argument."]}),e.jsx("pre",{className:"good",children:`// With devtools middleware: set(partial, replace?, actionName)
increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
reset:     () => set({ count: 0 }, false, 'counter/reset'),`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Partial updates & immutable mindset"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"set(object)"})," merges at the top level (it won’t deep-merge nested objects)."]}),e.jsx("li",{children:"For nested updates, I spread the changed branch to create a new reference."})]}),e.jsx("pre",{className:"good",children:`// top-level merge
set({ loading: true });

// nested (manual copy to keep immutability)
set((s) => ({ user: { ...s.user, name: 'Ashish' } }));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Batch related changes"}),e.jsxs("p",{children:["I prefer one ",e.jsx("code",{children:"set()"})," with a single render over multiple back-to-back sets."]}),e.jsx("pre",{className:"good",children:`set((s) => ({
  loading: false,
  data: payload,
  error: null
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Reset patterns I use"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Slice reset:"})," expose a ",e.jsx("code",{children:"reset()"})," per slice."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Full replace:"})," pass ",e.jsx("code",{children:"replace = true"})," to overwrite the whole store."]})]}),e.jsx("pre",{className:"good",children:`// Keep an initial object around
const initial = { count: 0, items: [], loading: false, error: null };

resetAll: () => set(initial, true), // replace=true -> replace entire state`}),e.jsx("pre",{className:"note",children:`// If replacing feels too strong, I reset per-slice:
resetCart: () => set({ cart: { items: [] } });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Async shape I keep consistent"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"loading: boolean"}),", ",e.jsx("code",{children:"error: string | null"}),", and the data field for results."]}),e.jsxs("li",{children:["Set ",e.jsx("code",{children:"loading=true"})," at start, clear it on success/failure."]}),e.jsxs("li",{children:["Clear ",e.jsx("code",{children:"error"})," on new attempts."]})]}),e.jsx("pre",{className:"good",children:`set({ loading: true, error: null });
try {
  const data = await api();
  set({ loading: false, data });
} catch (e) {
  set({ loading: false, error: String(e) });
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Depends on previous state? → functional form."}),e.jsxs("li",{children:["Need the latest snapshot inside an action? → ",e.jsx("code",{children:"get()"}),"."]}),e.jsx("li",{children:"Update nested data? → copy the branch (new references)."}),e.jsxs("li",{children:["Group related changes in one ",e.jsx("code",{children:"set()"}),"."]}),e.jsxs("li",{children:["For devtools later, name actions as ",e.jsx("code",{children:"slice/action"}),"."]})]})]})]});export{n as default};
