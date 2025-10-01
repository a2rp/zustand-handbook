import{d as t,j as e}from"./index-Bmr0gcqO.js";const r="var(--card, #111)",i="var(--text, #e9e9e9)",l="var(--muted, #b7b7b7)",s="var(--border, #222)",n="var(--accent, #22c55e)",d="var(--danger, #ef4444)",a="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",o={Page:t.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${r};
        color: ${i};
        border: 1px solid ${s};
        border-radius: ${a};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:t.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:t.p`
        margin: 0 0 18px 0;
        color: ${l};
    `,Section:t.section`
        border-top: 1px dashed ${s};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${s};
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
            border: 1px dashed ${s};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${n};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${d};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:t.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${s};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(o.Page,{children:[e.jsx(o.Title,{children:"Example — Devtools Todos"}),e.jsx(o.Subtitle,{children:"Named actions, clean traces, and time-travel with Redux DevTools."}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Wrap a store with the ",e.jsx("code",{children:"devtools"})," middleware."]}),e.jsxs("li",{children:["Name actions like ",e.jsx("code",{children:"slice/action"})," for readable traces."]}),e.jsxs("li",{children:["Group related updates into one ",e.jsx("code",{children:"set()"})," call."]}),e.jsx("li",{children:"Use time-travel to inspect previous states."})]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"1) Store file with devtools"}),e.jsxs("p",{children:["Create ",e.jsx("code",{children:"src/stores/todos.js"})," and wrap with ",e.jsx("code",{children:"devtools"}),":"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';
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
);`}),e.jsxs(o.Callout,{children:["The 3rd argument to ",e.jsx("code",{children:"set()"})," is the ",e.jsx("b",{children:"action name"}),". I use",e.jsx("code",{children:" slice/action"})," like ",e.jsx("code",{children:"todos/add"}),"."]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"2) Using it in components (narrow selectors)"}),e.jsx("pre",{className:"good",children:`import React from 'react';
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
}`}),e.jsxs("p",{children:["I subscribe to only what a component needs. For quick reads that don’t need to subscribe (badges, logs), I sometimes use ",e.jsx("code",{children:"useTodos.getState()"}),"."]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"3) What I look for in Redux DevTools"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Clear action names like ",e.jsx("code",{children:"todos/add"}),", ",e.jsx("code",{children:"todos/toggle"}),"."]}),e.jsx("li",{children:"State diffs after each action (time-travel back/forward to confirm logic)."}),e.jsxs("li",{children:["One action = one logical change. If I see 3 tiny actions back-to-back, I refactor to group them into a single ",e.jsx("code",{children:"set()"}),"."]})]}),e.jsx("pre",{className:"note",children:`// Group related changes into one set() for cleaner traces
completeAll: () =>
  set(
    (s) => ({
      list: s.list.map((t) => ({ ...t, done: true })),
      filter: 'done'
    }),
    false,
    'todos/completeAll'
  );`})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"4) Common mistakes"}),e.jsx("pre",{className:"bad",children:`// ❌ Unnamed actions — DevTools shows "anonymous"
set({ list: [] });`}),e.jsx("pre",{className:"good",children:`// ✅ Name the action
set({ list: [] }, false, 'todos/clear');`}),e.jsx("pre",{className:"bad",children:`// ❌ Many tiny updates back-to-back
set({ loading: true }); set({ list }); set({ loading: false });`}),e.jsx("pre",{className:"good",children:`// ✅ One set() with everything
set((s) => ({ loading: false, list, error: null }), false, 'todos/fetchSuccess');`})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"5) Quick checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Wrap store with ",e.jsx("code",{children:"devtools(…)"})," and give it a ",e.jsx("code",{children:"name"}),"."]}),e.jsxs("li",{children:["Name every action (",e.jsx("code",{children:"slice/action"}),")."]}),e.jsxs("li",{children:["Prefer one ",e.jsx("code",{children:"set()"})," per logical change."]}),e.jsxs("li",{children:["Select narrowly; use ",e.jsx("code",{children:"shallow"})," for tuples/objects."]})]})]})]});export{h as default};
