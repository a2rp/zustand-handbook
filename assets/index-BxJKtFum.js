import{d as t,j as e}from"./index-BVVkTRCt.js";const o="var(--card, #111)",l="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",r="var(--border, #222)",i="var(--accent, #22c55e)",a="var(--danger, #ef4444)",c="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:t.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${l};
        border: 1px solid ${r};
        border-radius: ${c};
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
            border: 1px solid ${a};
            background: rgba(239, 68, 68, 0.08);
        }

        pre.good {
            border: 1px solid ${i};
            background: rgba(34, 197, 94, 0.08);
        }
    `,Title:t.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:t.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:t.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;
    `,Note:t.div`
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
            color: ${i};
            font-size: 12px;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Selectors — Slices & Equality"}),e.jsx(s.Subtitle,{children:"Subscribe to the smallest necessary state. Control re-renders with equality."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Outcome"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Pick the right ",e.jsx("b",{children:"slice"})," per component."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"shallow"})," or custom equality to reduce re-renders."]}),e.jsx("li",{children:"Avoid identity traps when selecting objects/arrays."}),e.jsx("li",{children:"Aggregate multiple primitives safely."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Selector basics"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["A selector answers: ",e.jsx("i",{children:"“Exactly what value does this component need?”"})]}),e.jsxs("li",{children:["Prefer selecting ",e.jsx("b",{children:"primitives"})," or stable references."]}),e.jsxs("li",{children:["For multiple values, return an ",e.jsx("b",{children:"object/array + shallow"})," comparison."]})]}),e.jsx("pre",{className:"note",children:`Idea (pseudo):
const count   = useStore((s) => s.count)
const theme   = useStore((s) => s.theme.mode)
// Multiple values (use shallow):
const [count, total] = useStore((s) => [s.count, s.total], shallow)
// or
const view = useStore((s) => ({ count: s.count, total: s.total }), shallow)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Equality functions"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"strict ==="})," is the default. For objects/arrays, it will re-render on every new reference."]}),e.jsxs("li",{children:[e.jsx("code",{children:"shallow"})," compares top-level keys/indices only (fast + common)."]}),e.jsx("li",{children:"Custom equality is possible for special cases (e.g., deep check of small data)."})]}),e.jsx("pre",{className:"note",children:`Equality tips:
- Prefer primitives when possible.
- If you must return an object/array, pass \`shallow\`.
- Memoize derived values upstream if they cause identity churn.`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common pitfalls"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Selecting the ",e.jsx("b",{children:"entire store"})," → widespread re-renders."]}),e.jsxs("li",{children:["Returning ",e.jsx("b",{children:"fresh objects/arrays"})," without equality → every render re-subscribes."]}),e.jsxs("li",{children:["Deriving data in the selector that ",e.jsx("b",{children:"changes reference"})," frequently."]})]}),e.jsx("pre",{className:"bad",children:`Bad:
const view = useStore((s) => ({ list: s.list.filter(p => p.inStock) })) // new array each time`}),e.jsx("pre",{className:"good",children:`Better:
const view = useStore((s) => [s.list, s.filter], shallow)
// derive inside component with memo (or upstream in store) if needed`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Aggregation patterns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Array tuple + shallow"})," — compact & fast for a few primitives."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Object + shallow"})," — readable when many fields are needed."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Selector factories"})," — create reusable selector helpers per slice."]})]}),e.jsx("pre",{className:"note",children:`Selector factory (pseudo):
const selectTotals = (s) => ({ subtotal: s.subtotal, tax: s.tax, total: s.total })
const totals = useStore(selectTotals, shallow)`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Does this component truly need that much state? Trim the slice."}),e.jsxs("li",{children:["If returning objects/arrays → add ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Derived heavy work? Memoize or compute in store once."}),e.jsxs("li",{children:["Selectors should be ",e.jsx("b",{children:"pure, cheap, and stable"}),"."]})]})]}),e.jsxs(s.Note,{children:[e.jsx("b",{children:"Coming next:"})," ",e.jsx("span",{children:"set() & get() — Update patterns"}),e.jsx("span",{className:"badge",children:"Example coming later"})]})]});export{p as default};
