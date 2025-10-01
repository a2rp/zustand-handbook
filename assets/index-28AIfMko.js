import{d as i,j as e}from"./index-BVVkTRCt.js";const n="var(--card, #111)",t="var(--text, #e9e9e9)",l="var(--muted, #b7b7b7)",r="var(--border, #222)",o="var(--accent, #22c55e)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:i.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${n};
        color: ${t};
        border: 1px solid ${r};
        border-radius: ${d};
        box-shadow: ${c};
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
    `,Title:i.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:i.p`
        margin: 0 0 18px 0;
        color: ${l};
    `,Section:i.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;
    `,Note:i.div`
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
            color: ${o};
            font-size: 12px;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
    `},h=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Zustand 101 & Mental Model"}),e.jsx(s.Subtitle,{children:"Read-first tutorial. No code demo yet."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Outcome"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Think of a store as the single source of truth."}),e.jsxs("li",{children:["Understand what ",e.jsx("code",{children:"set"})," and ",e.jsx("code",{children:"get"})," do."]}),e.jsx("li",{children:"Know why selectors matter and when equality checks help."}),e.jsxs("li",{children:["See where middlewares like ",e.jsx("code",{children:"persist"})," and ",e.jsx("code",{children:"devtools"})," fit."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Why this matters"}),e.jsx("p",{children:"As React apps grow, prop-drilling and ad-hoc context state quickly become brittle. Zustand keeps the API minimal but gives you precise control over what each component subscribes to, which keeps re-renders low and state logic clean."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Core ideas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Store:"})," Plain JS object shaped for your domain + helper functions."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Selectors:"})," Components subscribe to only the slice they need (performance)."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Equality:"})," Controls ",e.jsx("i",{children:"when"})," a component re-renders for a selected value."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Updates:"})," Always via ",e.jsx("code",{children:"set()"}),"; prefer named actions for traceability."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Middlewares:"})," Add features (persist/devtools/subscribeWithSelector) orthogonally."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Immutable thinking:"})," Create new references; avoid mutating existing state."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Conceptual flow"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Design store shape by feature (slices) — not by components."}),e.jsx("li",{children:"Inside a component, select the exact value(s) needed."}),e.jsxs("li",{children:["Update state via action functions that call ",e.jsx("code",{children:"set()"}),"."]}),e.jsx("li",{children:"Attach middlewares to gain persistence, devtools, or precise subscriptions."}),e.jsx("li",{children:"Scale by splitting slices or creating store factories as features grow."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common pitfalls"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Selecting the entire store → unnecessary re-renders."}),e.jsx("li",{children:"Returning new object/array literals directly from selectors (identity flips)."}),e.jsx("li",{children:"Using persist without planning versioned migrations."}),e.jsx("li",{children:"Unnamed actions → weak traces in devtools."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Recap"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Minimal API, maximum control."}),e.jsx("li",{children:"Selectors + equality = render discipline."}),e.jsx("li",{children:"Middlewares add features without coupling."}),e.jsx("li",{children:"Start small; scale with slices and factories."})]})]}),e.jsxs(s.Note,{children:[e.jsx("b",{children:"Coming next:"})," Global vs per-component stores (theory first).",e.jsx("span",{className:"badge",children:"Example coming later"})]})]});export{h as default};
