import{d as n,j as e}from"./index-BVVkTRCt.js";const a="var(--card, #111)",i="var(--text, #e9e9e9)",d="var(--muted, #b7b7b7)",r="var(--border, #222)",t="var(--accent, #22c55e)",o="var(--danger, #ef4444)",c="var(--radius, 16px)",l="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:n.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
        color: ${i};
        border: 1px solid ${r};
        border-radius: ${c};
        box-shadow: ${l};
        padding: 24px;
        line-height: 1.6;

        h3 {
            margin: 0 0 10px 0;
            font-weight: 800;
            letter-spacing: 0.2px;
        }

        ul,
        ol {
            margin: 0 0 16px 22px;
        }

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${r};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        pre.note,
        pre.bad,
        pre.good {
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

        pre.bad {
            border: 1px solid ${o};
            background: rgba(239, 68, 68, 0.08);
        }

        pre.good {
            border: 1px solid ${t};
            background: rgba(34, 197, 94, 0.08);
        }
    `,Title:n.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:n.p`
        margin: 0 0 18px 0;
        color: ${d};
    `,Section:n.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;
    `,Callout:n.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `,Note:n.div`
        margin-top: 20px;
        padding: 12px 14px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        align-items: center;
        gap: 12px;

        .badge {
            margin-left: 8px;
            padding: 3px 8px;
            border-radius: 999px;
            border: 1px solid ${r};
            color: ${t};
            font-size: 12px;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
    `},x=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"set() & get() — Update Patterns"}),e.jsx(s.Subtitle,{children:"Learn the right way to update and read state, name actions, and avoid stale closures."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Outcome"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Choose between ",e.jsx("b",{children:"object"})," and ",e.jsx("b",{children:"functional"})," update forms."]}),e.jsxs("li",{children:["Use ",e.jsx("b",{children:"named actions"})," for better devtools traces."]}),e.jsxs("li",{children:["Avoid ",e.jsx("b",{children:"stale reads"})," with ",e.jsx("code",{children:"get()"})," in actions."]}),e.jsxs("li",{children:["Handle ",e.jsx("b",{children:"partial updates"})," and ",e.jsx("b",{children:"reset"})," patterns cleanly."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Two update forms"}),e.jsx("pre",{className:"good",children:`// Object form: when new state doesn't depend on previous state
set({ open: true, error: null });

// Functional form: when next state depends on current state
set((s) => ({ count: s.count + 1 }));`}),e.jsxs(s.Callout,{children:["Prefer the ",e.jsx("b",{children:"functional form"})," whenever the new value depends on the previous one."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Named actions (for devtools & debugging)"}),e.jsx("pre",{className:"good",children:`// Inside your store factory
increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
reset: () => set({ count: 0 }, false, 'counter/reset')`}),e.jsxs("p",{children:["The 3rd argument (action type) improves ",e.jsx("b",{children:"devtools"})," readability and helps you trace flows."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Reading state safely with get()"}),e.jsxs("p",{children:["When your action needs the ",e.jsx("i",{children:"current"})," value, read it via ",e.jsx("code",{children:"get()"})," (inside the store). This avoids stale closures."]}),e.jsx("pre",{className:"good",children:`// Inside create((set, get) => ({ ... }))
toggleTheme: () => {
  const mode = get().theme?.mode === 'dark' ? 'light' : 'dark';
  set({ theme: { mode } }, false, 'theme/toggle');
}`}),e.jsx("pre",{className:"bad",children:`// Anti-pattern: captured "theme" from component scope might be stale
toggleTheme: () => set({ theme: { mode: theme === 'dark' ? 'light' : 'dark' } });`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Partial updates & immutable thinking"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Updates are ",e.jsx("b",{children:"merged"})," into the current state shape you define in your store."]}),e.jsxs("li",{children:["When updating nested data, create ",e.jsx("b",{children:"new references"})," for changed objects/arrays."]})]}),e.jsx("pre",{className:"good",children:`// Update only what's changed, keep other keys as-is
set((s) => ({ user: { ...s.user, name: 'Ashish' } }), false, 'user/rename');`}),e.jsxs("p",{children:["If you prefer ergonomic nested updates, consider the ",e.jsx("b",{children:"immer"})," middleware later (we'll cover it in middleware topics)."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Batching multiple changes"}),e.jsxs("p",{children:["Group related updates in a ",e.jsx("b",{children:"single set()"})," call when possible to reduce renders."]}),e.jsx("pre",{className:"good",children:`set((s) => ({
  loading: false,
  data: payload,
  error: null
}), false, 'fetch/success');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Reset patterns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Slice reset:"})," expose a ",e.jsx("code",{children:"reset()"})," action per slice."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Full reset:"})," store a constant ",e.jsx("code",{children:"initialState"})," and set it back."]})]}),e.jsx("pre",{className:"good",children:`const initial = { count: 0, items: [] };
resetAll: () => set(initial, false, 'app/reset');`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Error-handling & async tips"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Set ",e.jsx("code",{children:"loading"})," before async, clear it in success/failure branches."]}),e.jsxs("li",{children:["Store ",e.jsx("code",{children:"error"})," objects or messages; keep shape consistent."]})]}),e.jsx("pre",{className:"note",children:`async fetchData() {
  set({ loading: true, error: null }, false, 'fetch/start');
  try {
    const data = await api();
    set({ loading: false, data }, false, 'fetch/success');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'fetch/error');
  }
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Depends on previous state? → ",e.jsx("b",{children:"functional form"}),"."]}),e.jsxs("li",{children:["Name actions for ",e.jsx("b",{children:"devtools"})," (e.g., ",e.jsx("code",{children:"slice/action"}),")."]}),e.jsxs("li",{children:["Need current value inside action? Use ",e.jsx("code",{children:"get()"}),"."]}),e.jsxs("li",{children:["Change nested data? Create ",e.jsx("b",{children:"new references"}),"."]}),e.jsxs("li",{children:["Group related changes into one ",e.jsx("code",{children:"set()"}),"."]})]})]}),e.jsxs(s.Note,{children:[e.jsx("b",{children:"Coming next:"})," Derived state — computed values without extra renders."," ",e.jsx("span",{className:"badge",children:"Example coming later"})]})]});export{x as default};
