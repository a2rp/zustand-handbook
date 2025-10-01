import{d as o,r as c,j as t,N as y}from"./index-Gt8sd0pi.js";const j="var(--card, #111)",g="var(--text, #e9e9e9)",l="var(--muted, #b7b7b7)",d="var(--border, #222)",k="var(--accent, #22c55e)",$="var(--radius, 16px)",S="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",i={Page:o.div`
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        background: ${j};
        color: ${g};
        border: 1px solid ${d};
        border-radius: ${$};
        box-shadow: ${S};
        padding: 24px;
        line-height: 1.6;
    `,Title:o.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:o.p`
        margin: 0 0 18px 0;
        color: ${l};
    `,SearchRow:o.div`
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 8px 0 12px 0;

        input {
            flex: 1;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid ${d};
            border-radius: 12px;
            padding: 10px 12px;
            color: ${g};
            outline: none;
        }
        .count {
            color: ${l};
            font-size: 0.95rem;
        }
    `,AlphaBar:o.nav`
        display: grid;
        grid-template-columns: repeat(26, minmax(0, 1fr));
        gap: 6px;
        margin: 6px 0 18px 0;

        button {
            border: 1px solid ${d};
            background: rgba(255, 255, 255, 0.03);
            color: ${g};
            border-radius: 8px;
            padding: 6px 0;
            cursor: pointer;
            font-size: 12px;
        }
        button:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }
    `,LetterHeader:o.h3`
        margin: 18px 0 8px 0;
        font-weight: 800;
        letter-spacing: 0.2px;
        border-bottom: 1px dashed ${d};
        padding-bottom: 6px;
    `,Grid:o.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
    `,Card:o.article`
        border: 1px solid ${d};
        border-radius: 14px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.02);

        .top {
            display: flex;
            align-items: baseline;
            gap: 10px;
            .term {
                margin: 0;
                font-size: 18px;
                font-weight: 800;
            }
            .aka {
                color: ${l};
                font-size: 12px;
            }
        }

        .def {
            margin: 6px 0 10px 0;
            color: ${g};
        }

        .meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            justify-content: space-between;
        }

        .tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;

            .tag {
                border: 1px solid ${d};
                border-radius: 999px;
                padding: 2px 8px;
                font-size: 11px;
                color: ${l};
            }
        }

        .see {
            font-size: 12px;
            color: ${l};

            .link {
                color: ${k};
                text-decoration: none;
            }
            .link:hover {
                text-decoration: underline;
            }
        }
    `,Empty:o.div`
        margin-top: 24px;
        color: ${l};
    `},b="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),R=[{term:"Action",def:"A named function inside the store that updates state via set(). Helpful for devtools tracing.",tags:["core"],see:["/tutorials/set-and-get"]},{term:"AbortController",def:"Browser API to cancel fetch requests; prevents stale responses from overwriting fresh state.",tags:["async"],see:["/tutorials/async-flows"]},{term:"Derived state",def:"Values computed from source state (subtotal, total, etc.). Prefer computing instead of storing duplicates.",tags:["core","perf"],see:["/tutorials/derived-state"]},{term:"Devtools",def:"Middleware that integrates with Redux DevTools for time-travel and action tracing. Name actions like slice/action.",tags:["middleware"],see:["/tutorials/middleware-devtools"]},{term:"Equality function",def:"Function that decides if selected value has changed. By default strict ===. Use shallow for tuples/objects.",tags:["perf"],see:["/tutorials/selectors"],aka:["Comparator"]},{term:"get()",def:"Helper available inside the store to read the current state in actions. Avoids stale closures.",tags:["core"],see:["/tutorials/set-and-get"]},{term:"Hydration",def:"Reapplying persisted or server-provided state into the client store on load or after SSR.",tags:["persist","ssr"],see:["/tutorials/ssr-notes","/tutorials/middleware-persist"],aka:["Rehydration"]},{term:"inflight flag",def:"Boolean (or keyed map) marking an async request in progress; prevents duplicate calls.",tags:["async"],see:["/tutorials/async-flows"]},{term:"Migration (persist)",def:"A versioned function that transforms old persisted data into the new shape when your store changes.",tags:["persist"],see:["/tutorials/persist-migrations"]},{term:"Middleware",def:"Zustand enhancers that add behavior around the store, like persist, devtools, or subscribeWithSelector.",tags:["middleware"],see:["/tutorials/middleware-persist","/tutorials/middleware-devtools"]},{term:"Optimistic update",def:"Update UI immediately before the server confirms, and roll back if the request fails.",tags:["async","ux"],see:["/tutorials/async-flows"]},{term:"Partialization",def:"Persist only a subset of the state (e.g., user + theme), not everything in the store.",tags:["persist"],see:["/tutorials/middleware-persist"]},{term:"persist",def:"Middleware to save selected state to storage (localStorage, etc.). Supports versioning and migrations.",tags:["middleware","persist"],see:["/tutorials/middleware-persist","/tutorials/persist-migrations"]},{term:"Selector",def:"A function that returns exactly the piece of state a component needs. Reduces re-renders.",tags:["core","perf"],see:["/tutorials/selectors"]},{term:"set()",def:"Updates state. Use object form for static updates and functional form when new state depends on previous state.",tags:["core"],see:["/tutorials/set-and-get"]},{term:"shallow",def:"Helper comparator for shallow equality of arrays/objects returned by selectors to avoid extra re-renders.",tags:["perf"],see:["/tutorials/selectors"]},{term:"Slice",def:"A feature-scoped section of a global store (auth slice, cart slice). Keeps code organized and decoupled.",tags:["architecture"],see:["/tutorials/slices-pattern","/tutorials/store-choices"]},{term:"Store",def:"Plain JS object managed by Zustand. Holds state and actions created with create((set, get) => ...).",tags:["core"],see:["/tutorials/intro"]},{term:"Store factory",def:"A function that creates a new store instance (useful for per-component stores like wizards).",tags:["patterns"],see:["/tutorials/store-choices"]},{term:"subscribe()",def:"Low-level listener to store changes. Useful for non-React integrations and effects.",tags:["advanced"],see:["/tutorials/subscribe-vs-selector"]},{term:"subscribeWithSelector",def:"Middleware that adds selector-aware subscriptions with equality checks outside React components.",tags:["middleware","advanced"],see:["/tutorials/subscribe-vs-selector"]},{term:"Temporal state",def:"Keeping a history to support undo/redo features (time-travel-like behavior).",tags:["patterns","ux"],see:["/tutorials/undo-redo"]},{term:"Thunk",def:"An action that performs async work and then updates state (fetch, save, etc.).",tags:["async"],see:["/tutorials/async-flows"]},{term:"SSR (Server-Side Rendering)",def:"Rendering on the server and sending HTML to the client, then hydrating the store on the client.",tags:["ssr"],see:["/tutorials/ssr-notes"]}];function A(a=""){return a.toLowerCase()}function N(a,p){if(p.length===0)return!0;const u=`${a.term} ${a.def} ${(a.aka||[]).join(" ")} ${(a.tags||[]).join(" ")}`.toLowerCase();return p.every(m=>u.includes(m))}const C=()=>{const[a,p]=c.useState(""),u=c.useRef({}),m=c.useMemo(()=>a.trim().split(/\s+/).filter(Boolean).map(A),[a]),f=c.useMemo(()=>R.filter(e=>N(e,m)),[m]),h=c.useMemo(()=>{const e={};for(const r of f){const s=/^[a-z]/i.test(r.term)?r.term[0].toUpperCase():"#";e[s]||(e[s]=[]),e[s].push(r)}return Object.keys(e).forEach(r=>e[r].sort((s,n)=>s.term.localeCompare(n.term))),e},[f]),x=f.length,v=e=>{const r=u.current[e];if(r)try{r.scrollIntoView({block:"start",behavior:"smooth"})}catch{r.scrollIntoView()}};return t.jsxs(i.Page,{children:[t.jsx(i.Title,{children:"Glossary"}),t.jsx(i.Subtitle,{children:"A–Z terms for quick lookups."}),t.jsxs(i.SearchRow,{children:[t.jsx("input",{type:"text",placeholder:"Search terms, tags or synonyms…",value:a,onChange:e=>p(e.target.value),"aria-label":"Search glossary"}),t.jsxs("span",{className:"count",children:[x," item",x===1?"":"s"]})]}),t.jsx(i.AlphaBar,{role:"navigation","aria-label":"Jump to letter",children:b.map(e=>{const r=!h[e]||h[e].length===0;return t.jsx("button",{type:"button",onClick:()=>!r&&v(e),disabled:r,"aria-label":`Jump to ${e}`,title:r?`No ${e} terms`:`Jump to ${e}`,children:e},e)})}),b.map(e=>{const r=h[e];return!r||r.length===0?null:t.jsxs("section",{children:[t.jsx(i.LetterHeader,{id:`gloss-${e}`,ref:s=>u.current[e]=s,children:e}),t.jsx(i.Grid,{children:r.map(s=>t.jsxs(i.Card,{children:[t.jsxs("div",{className:"top",children:[t.jsx("h4",{className:"term",children:s.term}),s.aka&&s.aka.length>0&&t.jsxs("span",{className:"aka",children:["aka: ",s.aka.join(", ")]})]}),t.jsx("p",{className:"def",children:s.def}),t.jsxs("div",{className:"meta",children:[t.jsx("div",{className:"tags",children:(s.tags||[]).map(n=>t.jsx("span",{className:"tag",children:n},n))}),s.see&&s.see.length>0&&t.jsxs("div",{className:"see",children:["See also: ",s.see.map((n,w)=>t.jsxs(y,{to:n,className:"link",children:[n.replace("/tutorials/","").replace("/notes/",""),w<s.see.length-1?", ":""]},n))]})]})]},s.term))})]},e)}),x===0&&t.jsxs(i.Empty,{children:["No results for ",t.jsx("b",{children:a}),". Try a different keyword."]})]})};export{C as default};
