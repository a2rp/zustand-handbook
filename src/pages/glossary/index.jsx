import React, { useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Styled } from "./styled";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Minimal glossary data (add/edit freely)
const TERMS = [
    {
        term: "Action",
        def: "A named function inside the store that updates state via set(). Helpful for devtools tracing.",
        tags: ["core"],
        see: ["/tutorials/set-and-get"],
    },
    {
        term: "AbortController",
        def: "Browser API to cancel fetch requests; prevents stale responses from overwriting fresh state.",
        tags: ["async"],
        see: ["/tutorials/async-flows"],
    },
    {
        term: "Derived state",
        def: "Values computed from source state (subtotal, total, etc.). Prefer computing instead of storing duplicates.",
        tags: ["core", "perf"],
        see: ["/tutorials/derived-state"],
    },
    {
        term: "Devtools",
        def: "Middleware that integrates with Redux DevTools for time-travel and action tracing. Name actions like slice/action.",
        tags: ["middleware"],
        see: ["/tutorials/middleware-devtools"],
    },
    {
        term: "Equality function",
        def: "Function that decides if selected value has changed. By default strict ===. Use shallow for tuples/objects.",
        tags: ["perf"],
        see: ["/tutorials/selectors"],
        aka: ["Comparator"],
    },
    {
        term: "get()",
        def: "Helper available inside the store to read the current state in actions. Avoids stale closures.",
        tags: ["core"],
        see: ["/tutorials/set-and-get"],
    },
    {
        term: "Hydration",
        def: "Reapplying persisted or server-provided state into the client store on load or after SSR.",
        tags: ["persist", "ssr"],
        see: ["/tutorials/ssr-notes", "/tutorials/middleware-persist"],
        aka: ["Rehydration"],
    },
    {
        term: "inflight flag",
        def: "Boolean (or keyed map) marking an async request in progress; prevents duplicate calls.",
        tags: ["async"],
        see: ["/tutorials/async-flows"],
    },
    {
        term: "Migration (persist)",
        def: "A versioned function that transforms old persisted data into the new shape when your store changes.",
        tags: ["persist"],
        see: ["/tutorials/persist-migrations"],
    },
    {
        term: "Middleware",
        def: "Zustand enhancers that add behavior around the store, like persist, devtools, or subscribeWithSelector.",
        tags: ["middleware"],
        see: ["/tutorials/middleware-persist", "/tutorials/middleware-devtools"],
    },
    {
        term: "Optimistic update",
        def: "Update UI immediately before the server confirms, and roll back if the request fails.",
        tags: ["async", "ux"],
        see: ["/tutorials/async-flows"],
    },
    {
        term: "Partialization",
        def: "Persist only a subset of the state (e.g., user + theme), not everything in the store.",
        tags: ["persist"],
        see: ["/tutorials/middleware-persist"],
    },
    {
        term: "persist",
        def: "Middleware to save selected state to storage (localStorage, etc.). Supports versioning and migrations.",
        tags: ["middleware", "persist"],
        see: ["/tutorials/middleware-persist", "/tutorials/persist-migrations"],
    },
    {
        term: "Selector",
        def: "A function that returns exactly the piece of state a component needs. Reduces re-renders.",
        tags: ["core", "perf"],
        see: ["/tutorials/selectors"],
    },
    {
        term: "set()",
        def: "Updates state. Use object form for static updates and functional form when new state depends on previous state.",
        tags: ["core"],
        see: ["/tutorials/set-and-get"],
    },
    {
        term: "shallow",
        def: "Helper comparator for shallow equality of arrays/objects returned by selectors to avoid extra re-renders.",
        tags: ["perf"],
        see: ["/tutorials/selectors"],
    },
    {
        term: "Slice",
        def: "A feature-scoped section of a global store (auth slice, cart slice). Keeps code organized and decoupled.",
        tags: ["architecture"],
        see: ["/tutorials/slices-pattern", "/tutorials/store-choices"],
    },
    {
        term: "Store",
        def: "Plain JS object managed by Zustand. Holds state and actions created with create((set, get) => ...).",
        tags: ["core"],
        see: ["/tutorials/intro"],
    },
    {
        term: "Store factory",
        def: "A function that creates a new store instance (useful for per-component stores like wizards).",
        tags: ["patterns"],
        see: ["/tutorials/store-choices"],
    },
    {
        term: "subscribe()",
        def: "Low-level listener to store changes. Useful for non-React integrations and effects.",
        tags: ["advanced"],
        see: ["/tutorials/subscribe-vs-selector"],
    },
    {
        term: "subscribeWithSelector",
        def: "Middleware that adds selector-aware subscriptions with equality checks outside React components.",
        tags: ["middleware", "advanced"],
        see: ["/tutorials/subscribe-vs-selector"],
    },
    {
        term: "Temporal state",
        def: "Keeping a history to support undo/redo features (time-travel-like behavior).",
        tags: ["patterns", "ux"],
        see: ["/tutorials/undo-redo"],
    },
    {
        term: "Thunk",
        def: "An action that performs async work and then updates state (fetch, save, etc.).",
        tags: ["async"],
        see: ["/tutorials/async-flows"],
    },
    {
        term: "SSR (Server-Side Rendering)",
        def: "Rendering on the server and sending HTML to the client, then hydrating the store on the client.",
        tags: ["ssr"],
        see: ["/tutorials/ssr-notes"],
    },
];

function normalize(s = "") {
    return s.toLowerCase();
}

function matches(term, qTokens) {
    if (qTokens.length === 0) return true;
    const hay =
        `${term.term} ${term.def} ${(term.aka || []).join(" ")} ${(term.tags || []).join(" ")}`.toLowerCase();
    return qTokens.every((t) => hay.includes(t));
}

const Glossary = () => {
    const [q, setQ] = useState("");
    const headersRef = useRef({}); // map letter -> element

    const qTokens = useMemo(
        () => q.trim().split(/\s+/).filter(Boolean).map(normalize),
        [q]
    );

    const filtered = useMemo(() => TERMS.filter((t) => matches(t, qTokens)), [qTokens]);

    const grouped = useMemo(() => {
        const map = {};
        for (const t of filtered) {
            const letter = /^[a-z]/i.test(t.term) ? t.term[0].toUpperCase() : "#";
            if (!map[letter]) map[letter] = [];
            map[letter].push(t);
        }
        // sort terms alphabetically inside each group
        Object.keys(map).forEach((k) => map[k].sort((a, b) => a.term.localeCompare(b.term)));
        return map;
    }, [filtered]);

    const total = filtered.length;

    const scrollToLetter = (L) => {
        const el = headersRef.current[L];
        if (el) {
            try {
                el.scrollIntoView({ block: "start", behavior: "smooth" });
            } catch {
                el.scrollIntoView();
            }
        }
    };

    return (
        <Styled.Page>
            <Styled.Title>Glossary</Styled.Title>
            <Styled.Subtitle>A–Z terms for quick lookups.</Styled.Subtitle>

            <Styled.SearchRow>
                <input
                    type="text"
                    placeholder="Search terms, tags or synonyms…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Search glossary"
                />
                <span className="count">{total} item{total === 1 ? "" : "s"}</span>
            </Styled.SearchRow>

            <Styled.AlphaBar role="navigation" aria-label="Jump to letter">
                {ALPHABET.map((L) => {
                    const disabled = !grouped[L] || grouped[L].length === 0;
                    return (
                        <button
                            key={L}
                            type="button"
                            onClick={() => !disabled && scrollToLetter(L)}
                            disabled={disabled}
                            aria-label={`Jump to ${L}`}
                            title={disabled ? `No ${L} terms` : `Jump to ${L}`}
                        >
                            {L}
                        </button>
                    );
                })}
            </Styled.AlphaBar>

            {ALPHABET.map((L) => {
                const list = grouped[L];
                if (!list || list.length === 0) return null;
                return (
                    <section key={L}>
                        <Styled.LetterHeader
                            id={`gloss-${L}`}
                            ref={(el) => (headersRef.current[L] = el)}
                        >
                            {L}
                        </Styled.LetterHeader>

                        <Styled.Grid>
                            {list.map((t) => (
                                <Styled.Card key={t.term}>
                                    <div className="top">
                                        <h4 className="term">{t.term}</h4>
                                        {t.aka && t.aka.length > 0 && (
                                            <span className="aka">aka: {t.aka.join(", ")}</span>
                                        )}
                                    </div>

                                    <p className="def">{t.def}</p>

                                    <div className="meta">
                                        <div className="tags">
                                            {(t.tags || []).map((tag) => (
                                                <span className="tag" key={tag}>{tag}</span>
                                            ))}
                                        </div>
                                        {t.see && t.see.length > 0 && (
                                            <div className="see">
                                                See also:&nbsp;
                                                {t.see.map((path, i) => (
                                                    <NavLink key={path} to={path} className="link">
                                                        {path.replace("/tutorials/", "").replace("/notes/", "")}
                                                        {i < t.see.length - 1 ? ", " : ""}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Styled.Card>
                            ))}
                        </Styled.Grid>
                    </section>
                );
            })}

            {total === 0 && (
                <Styled.Empty>
                    No results for <b>{q}</b>. Try a different keyword.
                </Styled.Empty>
            )}
        </Styled.Page>
    );
};

export default Glossary;
