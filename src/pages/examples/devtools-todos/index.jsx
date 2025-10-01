import React from "react";
import { Styled } from "./styled";

/**
 * Example: Devtools Todos
 * Goal: show how I wire Redux DevTools to a Zustand store and
 *       name actions so traces + time-travel are actually useful.
 * Style: note-style examples (copy/paste ready, not live).
 */
const ExampleDevtoolsTodos = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Devtools Todos</Styled.Title>
            <Styled.Subtitle>Named actions, clean traces, and time-travel with Redux DevTools.</Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Wrap a store with the <code>devtools</code> middleware.</li>
                    <li>Name actions like <code>slice/action</code> for readable traces.</li>
                    <li>Group related updates into one <code>set()</code> call.</li>
                    <li>Use time-travel to inspect previous states.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store file with devtools</h3>
                <p>Create <code>src/stores/todos.js</code> and wrap with <code>devtools</code>:</p>
                <pre className="good">{`import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

let nextId = 1;

export const useTodos = create(
  devtools(
    (set, get) => ({
      list: [],
      filter: 'all', // 'all' | 'open' | 'done'

      add: (title) =>
        set(
          (s) => ({ list: [...s.list, { id: nextId++, title, done: false }] }),
          false,
          'todos/add'
        ),

      toggle: (id) =>
        set(
          (s) => ({
            list: s.list.map((t) =>
              t.id === id ? { ...t, done: !t.done } : t
            ),
          }),
          false,
          'todos/toggle'
        ),

      remove: (id) =>
        set(
          (s) => ({ list: s.list.filter((t) => t.id !== id) }),
          false,
          'todos/remove'
        ),

      setFilter: (f) => set({ filter: f }, false, 'todos/setFilter'),

      // derived helper (cheap) — not stored:
      counts: () => {
        const list = get().list;
        const open = list.filter((t) => !t.done).length;
        const done = list.length - open;
        return { open, done, total: list.length };
      },
    }),
    { name: 'todos-store' } // appears in Redux DevTools tab
  )
);`}</pre>
                <Styled.Callout>
                    The 3rd argument to <code>set()</code> is the <b>action name</b>. I use
                    <code> slice/action</code> like <code>todos/add</code>.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Using it in components (narrow selectors)</h3>
                <pre className="good">{`import React from 'react';
import { useTodos } from '../stores/todos';
import { shallow } from 'zustand/shallow';

export function TodosHeader() {
  const [filter, setFilter] = useTodos((s) => [s.filter, s.setFilter], shallow);
  const counts = useTodos.getState().counts(); // safe read for a quick badge
  return (
    <header>
      <span>Open: {counts.open} / Done: {counts.done} / Total: {counts.total}</span>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="done">Done</option>
      </select>
    </header>
  );
}

export function TodosList() {
  const [list, filter, toggle, remove] = useTodos(
    (s) => [s.list, s.filter, s.toggle, s.remove],
    shallow
  );

  const visible = React.useMemo(() => {
    if (filter === 'open') return list.filter((t) => !t.done);
    if (filter === 'done') return list.filter((t) => t.done);
    return list;
  }, [list, filter]);

  return (
    <ul>
      {visible.map((t) => (
        <li key={t.id}>
          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
          <span>{t.title}</span>
          <button onClick={() => remove(t.id)}>x</button>
        </li>
      ))}
    </ul>
  );
}

export function TodosAdd() {
  const [title, setTitle] = React.useState('');
  const add = useTodos((s) => s.add);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        add(title.trim());
        setTitle('');
      }}
    >
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add todo" />
      <button>Add</button>
    </form>
  );
}`}</pre>
                <p>
                    I subscribe to only what a component needs. For quick reads that don’t need to
                    subscribe (badges, logs), I sometimes use <code>useTodos.getState()</code>.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) What I look for in Redux DevTools</h3>
                <ul>
                    <li>Clear action names like <code>todos/add</code>, <code>todos/toggle</code>.</li>
                    <li>State diffs after each action (time-travel back/forward to confirm logic).</li>
                    <li>One action = one logical change. If I see 3 tiny actions back-to-back,
                        I refactor to group them into a single <code>set()</code>.</li>
                </ul>
                <pre className="note">{`// Group related changes into one set() for cleaner traces
completeAll: () =>
  set(
    (s) => ({
      list: s.list.map((t) => ({ ...t, done: true })),
      filter: 'done'
    }),
    false,
    'todos/completeAll'
  );`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Common mistakes</h3>
                <pre className="bad">{`// ❌ Unnamed actions — DevTools shows "anonymous"
set({ list: [] });`}</pre>
                <pre className="good">{`// ✅ Name the action
set({ list: [] }, false, 'todos/clear');`}</pre>

                <pre className="bad">{`// ❌ Many tiny updates back-to-back
set({ loading: true }); set({ list }); set({ loading: false });`}</pre>
                <pre className="good">{`// ✅ One set() with everything
set((s) => ({ loading: false, list, error: null }), false, 'todos/fetchSuccess');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Quick checklist</h3>
                <ul>
                    <li>Wrap store with <code>devtools(…)</code> and give it a <code>name</code>.</li>
                    <li>Name every action (<code>slice/action</code>).</li>
                    <li>Prefer one <code>set()</code> per logical change.</li>
                    <li>Select narrowly; use <code>shallow</code> for tuples/objects.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleDevtoolsTodos;
