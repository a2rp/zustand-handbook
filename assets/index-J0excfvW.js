import{d as n,j as e,N as t}from"./index-Gt8sd0pi.js";const o="var(--card, #111)",a="var(--text, #e9e9e9)",l="var(--muted, #b7b7b7)",r="var(--border, #222)",i="var(--accent, #22c55e)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:n.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${a};
        border: 1px solid ${r};
        border-radius: ${d};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;

        .link {
            color: ${i};
            text-decoration: none;
        }
        .link:hover {
            text-decoration: underline;
        }

        .ext {
            color: ${i};
            text-decoration: none;
            word-break: break-all;
        }
        .ext:hover {
            text-decoration: underline;
        }

        kbd {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid ${r};
            border-radius: 6px;
            padding: 1px 6px;
            font-size: 0.85em;
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
    `,Title:n.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:n.p`
        margin: 0 0 18px 0;
        color: ${l};
    `,Section:n.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;

        ul {
            margin: 0 0 0 22px;
        }
    `},x=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Zustand Handbook — About"}),e.jsx(s.Subtitle,{children:"A practical set of tutorials, notes, glossary, and examples to learn and use Zustand in real React apps."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What this is"}),e.jsx("p",{children:"I’m collecting everything I actually use when teaching or setting up Zustand in projects: a clear learning path, quick notes you can copy, and small, focused examples. Nothing fancy—just the good parts."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Who this is for"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Beginners starting from zero with state management."}),e.jsx("li",{children:"React devs who want a lightweight alternative to heavy setups."}),e.jsx("li",{children:"Teams that prefer simple patterns with good discipline."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"What you’ll find here"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx(t,{className:"link",to:"/tutorials/intro",children:"Tutorials"})," — short lessons that build up from the basics to solid patterns."]}),e.jsxs("li",{children:[e.jsx(t,{className:"link",to:"/notes/api-quick-ref",children:"Notes"})," — quick references, checklists, and troubleshooting."]}),e.jsxs("li",{children:[e.jsx(t,{className:"link",to:"/glossary",children:"Glossary"})," — A–Z of terms (selectors, shallow, persist, migrations…)."]}),e.jsxs("li",{children:[e.jsx(t,{className:"link",to:"/examples/counter",children:"Examples"})," — note-style walkthroughs you can paste into your app."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"How to navigate"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Use the left sidebar search (press ",e.jsx("kbd",{children:"Ctrl"}),"/",e.jsx("kbd",{children:"Cmd"}),"+",e.jsx("kbd",{children:"K"}),") to filter topics instantly."]}),e.jsxs("li",{children:["Press ",e.jsx("kbd",{children:"Enter"})," in the search to open the first match."]}),e.jsxs("li",{children:["Press ",e.jsx("kbd",{children:"Esc"})," to clear the search field."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Conventions in examples"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Actions named as ",e.jsx("code",{children:"slice/action"})," for clean devtools traces."]}),e.jsxs("li",{children:["Prefer functional updates: ",e.jsx("code",{children:"set((s) => (…))"})," when next state depends on previous."]}),e.jsxs("li",{children:["Subscribe narrowly using selectors; use ",e.jsx("code",{children:"shallow"})," for tuples/objects."]}),e.jsx("li",{children:"Derive values in components/selectors unless the compute is expensive."}),e.jsx("li",{children:"Persist with partialization + versioned migrations (when needed)."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Project links"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Live:"," ",e.jsx("a",{className:"ext",href:"https://a2rp.github.io/zustand-handbook/home",target:"_blank",rel:"noreferrer",children:"a2rp.github.io/zustand-handbook"})]}),e.jsxs("li",{children:["Repo:"," ",e.jsx("a",{className:"ext",href:"https://github.com/a2rp/zustand-handbook",target:"_blank",rel:"noreferrer",children:"github.com/a2rp/zustand-handbook"})]}),e.jsxs("li",{children:["Zustand:"," ",e.jsx("a",{className:"ext",href:"https://github.com/pmndrs/zustand",target:"_blank",rel:"noreferrer",children:"github.com/pmndrs/zustand"})]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Acknowledgments"}),e.jsx("p",{children:"Thanks to the Zustand maintainers and the React community for keeping state management approachable."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Feedback & contributions"}),e.jsx("p",{children:"Found a mistake or want to add an example? Open an issue or PR on the repository. Clear, small examples help everyone."})]})]});export{x as default};
