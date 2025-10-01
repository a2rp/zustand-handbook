import{d as r,j as e}from"./index-BVVkTRCt.js";const n="var(--card, #111)",o="var(--text, #e9e9e9)",i="var(--muted, #b7b7b7)",t="var(--border, #222)",l="var(--accent, #22c55e)",a="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${n};
        color: ${o};
        border: 1px solid ${t};
        border-radius: ${a};
        box-shadow: ${d};
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

        pre.note {
            background: rgba(255, 255, 255, 0.04);
            border: 1px dashed ${t};
            border-radius: 10px;
            padding: 12px 14px;
            white-space: pre-wrap;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
            color: ${i};
        }
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${i};
    `,Section:r.section`
        border-top: 1px dashed ${t};
        padding-top: 16px;
        margin-top: 16px;
    `,Table:r.table`
        width: 100%;
        border-collapse: collapse;
        margin: 8px 0 12px 0;
        thead th {
            text-align: left;
            font-weight: 700;
            border-bottom: 1px solid ${t};
            padding: 10px 8px;
        }
        tbody td {
            border-bottom: 1px dashed ${t};
            padding: 10px 8px;
            vertical-align: top;
        }
        tbody tr:last-child td {
            border-bottom: 0;
        }
    `,Callout:r.div`
        margin-top: 10px;
        padding: 10px 12px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `,Note:r.div`
        margin-top: 20px;
        padding: 12px 14px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        align-items: center;
        gap: 12px;

        .badge {
            margin-left: 8px;
            padding: 3px 8px;
            border-radius: 999px;
            border: 1px solid ${t};
            color: ${l};
            font-size: 12px;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
    `},h=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Global vs Per-Component Stores"}),e.jsx(s.Subtitle,{children:"When to keep one global store, when to spawn local stores."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Outcome"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Decide quickly between a ",e.jsx("b",{children:"single global store"})," and a ",e.jsx("b",{children:"local/per-component store"}),"."]}),e.jsx("li",{children:"Understand coupling, testability, and performance trade-offs."}),e.jsx("li",{children:"Have a safe migration plan if your app grows beyond the initial choice."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick decision matrix"}),e.jsxs(s.Table,{role:"table","aria-label":"Decision matrix for store choices",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Signal"}),e.jsx("th",{children:"Bias"}),e.jsx("th",{children:"Why"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"State is shared across many pages/features"}),e.jsx("td",{children:"Global store"}),e.jsx("td",{children:"Prevents prop drilling; single source of truth."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"State is temporary & isolated to one widget"}),e.jsx("td",{children:"Per-component store"}),e.jsx("td",{children:"Keeps boundaries tight; avoids global bloat."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Feature needs easy reset/unmount behavior"}),e.jsx("td",{children:"Per-component store"}),e.jsx("td",{children:"Dispose on unmount; no global leaks."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Cross-feature coordination (auth, theme, cart)"}),e.jsx("td",{children:"Global store"}),e.jsx("td",{children:"Shared access and consistent behavior app-wide."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Heavy computations/large slices"}),e.jsx("td",{children:"Either, but slice by feature"}),e.jsx("td",{children:"Split store into slices; select narrowly."})]})]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Global store — when it shines"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Truly shared concerns: ",e.jsx("i",{children:"auth, user profile, theme, permissions, cart"}),"."]}),e.jsx("li",{children:"Consistency across routes; easy to debug with devtools."}),e.jsx("li",{children:"Single place to attach middlewares (persist, devtools, logs)."})]}),e.jsxs(s.Callout,{children:[e.jsx("b",{children:"Rule of thumb:"})," If 3+ independent screens need the same state, prefer global."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Per-component/local store — when it wins"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Encapsulated widgets: ",e.jsx("i",{children:"wizard, modal workflow, form builder, table filters"}),"."]}),e.jsx("li",{children:"Easy teardown on unmount (automatic reset without manual cleanup)."}),e.jsx("li",{children:"Improves testability: mount the component with its store factory in tests."})]}),e.jsx("pre",{className:"note",children:`Pattern idea:
function useWizardStoreFactory(initial) {
  return create((set) => ({
    step: initial?.step ?? 1,
    data: {},
    next: () => set((s) => ({ step: s.step + 1 })),
    reset: () => set({ step: 1, data: {} }),
  }));
}
// Later: const useWizardStore = useWizardStoreFactory({ step: 1 });
`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Anti-patterns to avoid"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"One giant global store"})," with everything — leads to accidental coupling."]}),e.jsxs("li",{children:["Selecting ",e.jsx("b",{children:"entire store"})," in components — causes widespread re-renders."]}),e.jsxs("li",{children:["Local store holding ",e.jsx("b",{children:"shared state"})," (e.g., auth) — causes duplication/drift."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Migration plan (safe path)"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Start small"})," with a global store split into ",e.jsx("i",{children:"slices"})," (auth, theme, cart, ui)."]}),e.jsxs("li",{children:["For contained widgets, ",e.jsx("b",{children:"introduce local store factories"})," near the component."]}),e.jsxs("li",{children:["As features grow, ",e.jsx("b",{children:"extract slices"})," into dedicated files; keep selectors narrow."]}),e.jsxs("li",{children:["Use ",e.jsx("b",{children:"persist partialization + versioning"})," to evolve data safely."]}),e.jsxs("li",{children:["Add ",e.jsx("b",{children:"devtools"})," and name actions to trace behavior during the migration."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Is the state shared by multiple screens? → Global slice."}),e.jsx("li",{children:"Is the state ephemeral to a widget? → Local store factory."}),e.jsx("li",{children:"Will unmount/reset semantics matter? → Local is simpler."}),e.jsx("li",{children:"Do we need cross-feature policies (e.g., auth)? → Global."}),e.jsx("li",{children:"Are components over-rendering? → Revisit selectors/equality."})]})]}),e.jsxs(s.Note,{children:[e.jsx("b",{children:"Coming next:"})," Selectors — choosing the exact slice & equality checks."," ",e.jsx("span",{className:"badge",children:"Example coming later"})]})]});export{h as default};
