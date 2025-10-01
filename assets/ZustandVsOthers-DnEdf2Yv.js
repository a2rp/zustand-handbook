import{j as e}from"./index-Gt8sd0pi.js";import{S as t}from"./styled-BO5MAwS2.js";const i=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Zustand vs Others — When I Pick What"}),e.jsx(t.Subtitle,{children:"My quick notes to choose the right tool: Context, Redux Toolkit, Recoil, Jotai, MobX, XState, and React Query."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"TL;DR (my defaults)"}),e.jsxs(t.Table,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Situation"}),e.jsx("th",{children:"What I reach for"}),e.jsx("th",{children:"Why"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Small/medium app, minimal boilerplate"}),e.jsx("td",{children:"Zustand"}),e.jsx("td",{children:"Tiny API, precise subscriptions, easy to scale with slices."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Heavily standardized enterprise flows"}),e.jsx("td",{children:"Redux Toolkit"}),e.jsx("td",{children:"Strong conventions, middleware ecosystem, time-travel devtools."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Component-local state only"}),e.jsx("td",{children:"React Context / useReducer"}),e.jsx("td",{children:"No extra dep; fine until state becomes cross-cutting."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Atom-based modeling (fine-grained deps)"}),e.jsx("td",{children:"Jotai or Recoil"}),e.jsx("td",{children:"Atoms/selectors with good ergonomics; different mental model."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Observable style + OOP vibe"}),e.jsx("td",{children:"MobX"}),e.jsx("td",{children:"Reactive derived values; minimal code for complex graphs."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Workflow is a state machine (steps, guards)"}),e.jsx("td",{children:"XState"}),e.jsx("td",{children:"Explicit events, transitions, and diagrams."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Server data (fetch, cache, sync)"}),e.jsx("td",{children:"React Query (+ Zustand for UI state)"}),e.jsx("td",{children:"Server-state ≠ client-state. I keep them separate."})]})]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"React Context vs Zustand"}),e.jsx("p",{children:"I start with Context for tiny apps. When state spreads across pages and I need precise subscriptions (avoid re-render storms), I switch to Zustand."}),e.jsx("pre",{className:"note",children:`// Context+useReducer (ok for small apps)
const Ctx = createContext();
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
function Counter() {
  const { state, dispatch } = useContext(Ctx); // re-renders on any state change
  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>;
}`}),e.jsx("pre",{className:"good",children:`// Zustand (precise subscription)
import { create } from 'zustand';
const useCounter = create((set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }));
function Counter() {
  const count = useCounter((s) => s.count);  // only re-renders when count changes
  const inc = useCounter((s) => s.inc);
  return <button onClick={inc}>{count}</button>;
}`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Redux Toolkit vs Zustand"}),e.jsxs("ul",{children:[e.jsx("li",{children:"I pick RTK when the team wants strict patterns (slices, thunks, middleware)."}),e.jsx("li",{children:"I pick Zustand when I want less boilerplate and custom patterns per feature."})]}),e.jsx("pre",{className:"note",children:`// RTK (structured, opinionated)
const slice = createSlice({
  name: 'todos',
  initialState: { list: [] },
  reducers: {
    add: (state, action) => { state.list.push(action.payload); },
    toggle: (state, action) => { const t = state.list.find(x => x.id === action.payload); t.done = !t.done; }
  }
});`}),e.jsx("pre",{className:"good",children:`// Zustand (minimal, flexible)
const useTodos = create((set) => ({
  list: [],
  add: (todo) => set((s) => ({ list: [...s.list, todo] }), false, 'todos/add'),
  toggle: (id) => set((s) => ({ list: s.list.map(t => t.id === id ? { ...t, done: !t.done } : t) }), false, 'todos/toggle'),
}));`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Jotai / Recoil vs Zustand"}),e.jsx("p",{children:"Atoms (small independent pieces of state) are great when components depend on different tiny fragments and you enjoy composing atoms/selectors. I stick to Zustand when I prefer slice-based modeling and simple store files."}),e.jsx("pre",{className:"note",children:`// Jotai style
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2); // derived
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const double = useAtomValue(doubleAtom);
  return <button onClick={() => setCount((c) => c + 1)}>{count} / {double}</button>;
}`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"MobX vs Zustand"}),e.jsx("p",{children:"MobX shines if you like observable models and automatic derivations. I still reach for Zustand when I want plain JS objects and explicit updates with set()."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"XState vs Zustand"}),e.jsx("p",{children:"When the domain is a real workflow (steps, guards, events), XState gives me clarity and diagrams. For regular app state, Zustand is lighter."}),e.jsx("pre",{className:"note",children:`// XState sketch (wizard)
state: 'step1' -> 'step2' -> 'done'
on: NEXT, PREV, RESET
guards/actions keep the flow valid`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"React Query + Zustand (together)"}),e.jsx("p",{children:"Server data (fetching, caching, background refetch, mutations) is React Query's job. I keep local UI/app state in Zustand. They complement each other well."}),e.jsx("pre",{className:"good",children:`// React Query for server-state
const { data, isLoading } = useQuery(['todos'], fetchTodos);

// Zustand for UI-state
const filter = useTodosUi((s) => s.filter);
const setFilter = useTodosUi((s) => s.setFilter);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"How I choose (quick checklist)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Do I need minimal setup and precise subscriptions? → Zustand."}),e.jsx("li",{children:"Is the team happier with strong conventions and tooling? → Redux Toolkit."}),e.jsx("li",{children:"Is it a small isolated component flow? → Context or a per-component Zustand store."}),e.jsx("li",{children:"Do atom/selector mental models fit the team? → Jotai/Recoil."}),e.jsx("li",{children:"Is it a formal workflow diagram with events/guards? → XState."}),e.jsx("li",{children:"Is it server data? → React Query (and keep UI state in Zustand)."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Migration notes"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Move slice by slice. Keep selectors stable while refactoring."}),e.jsx("li",{children:"For persisted data, plan versions and migrations up front."}),e.jsxs("li",{children:["Name actions like ",e.jsx("code",{children:"slice/action"})," so devtools traces stay readable."]})]})]})]});export{i as default};
