import React from "react";
import { Styled } from "./styled";

/**
 * Notes: Zustand vs Others — When I pick what
 * Style: short, practical, copy-paste friendly examples (not live).
 */
const ZustandVsOthers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Zustand vs Others — When I Pick What</Styled.Title>
            <Styled.Subtitle>
                My quick notes to choose the right tool: Context, Redux Toolkit, Recoil, Jotai, MobX, XState, and React Query.
            </Styled.Subtitle>

            {/* TL;DR */}
            <Styled.Section>
                <h3>TL;DR (my defaults)</h3>
                <Styled.Table>
                    <thead>
                        <tr>
                            <th>Situation</th>
                            <th>What I reach for</th>
                            <th>Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Small/medium app, minimal boilerplate</td>
                            <td>Zustand</td>
                            <td>Tiny API, precise subscriptions, easy to scale with slices.</td>
                        </tr>
                        <tr>
                            <td>Heavily standardized enterprise flows</td>
                            <td>Redux Toolkit</td>
                            <td>Strong conventions, middleware ecosystem, time-travel devtools.</td>
                        </tr>
                        <tr>
                            <td>Component-local state only</td>
                            <td>React Context / useReducer</td>
                            <td>No extra dep; fine until state becomes cross-cutting.</td>
                        </tr>
                        <tr>
                            <td>Atom-based modeling (fine-grained deps)</td>
                            <td>Jotai or Recoil</td>
                            <td>Atoms/selectors with good ergonomics; different mental model.</td>
                        </tr>
                        <tr>
                            <td>Observable style + OOP vibe</td>
                            <td>MobX</td>
                            <td>Reactive derived values; minimal code for complex graphs.</td>
                        </tr>
                        <tr>
                            <td>Workflow is a state machine (steps, guards)</td>
                            <td>XState</td>
                            <td>Explicit events, transitions, and diagrams.</td>
                        </tr>
                        <tr>
                            <td>Server data (fetch, cache, sync)</td>
                            <td>React Query (+ Zustand for UI state)</td>
                            <td>Server-state ≠ client-state. I keep them separate.</td>
                        </tr>
                    </tbody>
                </Styled.Table>
            </Styled.Section>

            {/* Context vs Zustand */}
            <Styled.Section>
                <h3>React Context vs Zustand</h3>
                <p>
                    I start with Context for tiny apps. When state spreads across pages and I need
                    precise subscriptions (avoid re-render storms), I switch to Zustand.
                </p>
                <pre className="note">{`// Context+useReducer (ok for small apps)
const Ctx = createContext();
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
function Counter() {
  const { state, dispatch } = useContext(Ctx); // re-renders on any state change
  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>;
}`}</pre>
                <pre className="good">{`// Zustand (precise subscription)
import { create } from 'zustand';
const useCounter = create((set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }));
function Counter() {
  const count = useCounter((s) => s.count);  // only re-renders when count changes
  const inc = useCounter((s) => s.inc);
  return <button onClick={inc}>{count}</button>;
}`}</pre>
            </Styled.Section>

            {/* Redux Toolkit vs Zustand */}
            <Styled.Section>
                <h3>Redux Toolkit vs Zustand</h3>
                <ul>
                    <li>I pick RTK when the team wants strict patterns (slices, thunks, middleware).</li>
                    <li>I pick Zustand when I want less boilerplate and custom patterns per feature.</li>
                </ul>
                <pre className="note">{`// RTK (structured, opinionated)
const slice = createSlice({
  name: 'todos',
  initialState: { list: [] },
  reducers: {
    add: (state, action) => { state.list.push(action.payload); },
    toggle: (state, action) => { const t = state.list.find(x => x.id === action.payload); t.done = !t.done; }
  }
});`}</pre>
                <pre className="good">{`// Zustand (minimal, flexible)
const useTodos = create((set) => ({
  list: [],
  add: (todo) => set((s) => ({ list: [...s.list, todo] }), false, 'todos/add'),
  toggle: (id) => set((s) => ({ list: s.list.map(t => t.id === id ? { ...t, done: !t.done } : t) }), false, 'todos/toggle'),
}));`}</pre>
            </Styled.Section>

            {/* Jotai/Recoil vs Zustand */}
            <Styled.Section>
                <h3>Jotai / Recoil vs Zustand</h3>
                <p>
                    Atoms (small independent pieces of state) are great when components depend on
                    different tiny fragments and you enjoy composing atoms/selectors. I stick to
                    Zustand when I prefer slice-based modeling and simple store files.
                </p>
                <pre className="note">{`// Jotai style
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2); // derived
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const double = useAtomValue(doubleAtom);
  return <button onClick={() => setCount((c) => c + 1)}>{count} / {double}</button>;
}`}</pre>
            </Styled.Section>

            {/* MobX vs Zustand */}
            <Styled.Section>
                <h3>MobX vs Zustand</h3>
                <p>
                    MobX shines if you like observable models and automatic derivations. I still
                    reach for Zustand when I want plain JS objects and explicit updates with set().
                </p>
            </Styled.Section>

            {/* XState vs Zustand */}
            <Styled.Section>
                <h3>XState vs Zustand</h3>
                <p>
                    When the domain is a real workflow (steps, guards, events), XState gives me
                    clarity and diagrams. For regular app state, Zustand is lighter.
                </p>
                <pre className="note">{`// XState sketch (wizard)
state: 'step1' -> 'step2' -> 'done'
on: NEXT, PREV, RESET
guards/actions keep the flow valid`}</pre>
            </Styled.Section>

            {/* React Query + Zustand */}
            <Styled.Section>
                <h3>React Query + Zustand (together)</h3>
                <p>
                    Server data (fetching, caching, background refetch, mutations) is React Query's
                    job. I keep local UI/app state in Zustand. They complement each other well.
                </p>
                <pre className="good">{`// React Query for server-state
const { data, isLoading } = useQuery(['todos'], fetchTodos);

// Zustand for UI-state
const filter = useTodosUi((s) => s.filter);
const setFilter = useTodosUi((s) => s.setFilter);`}</pre>
            </Styled.Section>

            {/* How I choose quickly */}
            <Styled.Section>
                <h3>How I choose (quick checklist)</h3>
                <ul>
                    <li>Do I need minimal setup and precise subscriptions? → Zustand.</li>
                    <li>Is the team happier with strong conventions and tooling? → Redux Toolkit.</li>
                    <li>Is it a small isolated component flow? → Context or a per-component Zustand store.</li>
                    <li>Do atom/selector mental models fit the team? → Jotai/Recoil.</li>
                    <li>Is it a formal workflow diagram with events/guards? → XState.</li>
                    <li>Is it server data? → React Query (and keep UI state in Zustand).</li>
                </ul>
            </Styled.Section>

            {/* Migration tips */}
            <Styled.Section>
                <h3>Migration notes</h3>
                <ul>
                    <li>Move slice by slice. Keep selectors stable while refactoring.</li>
                    <li>For persisted data, plan versions and migrations up front.</li>
                    <li>Name actions like <code>slice/action</code> so devtools traces stay readable.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ZustandVsOthers;
