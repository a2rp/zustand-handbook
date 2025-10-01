import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Styled } from "./styled";
import { MdClear } from "react-icons/md";

const STORAGE_KEY = "navSearch";

const NavListCore = () => {
    const navRef = useRef(null);
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);
    const { pathname } = useLocation();

    // Restore persisted search
    const [search, setSearch] = useState(() => {
        try {
            return sessionStorage.getItem(STORAGE_KEY) ?? "";
        } catch {
            return "";
        }
    });

    const [matchCount, setMatchCount] = useState(0);

    // Keep the active NavLink centered/visible in the sidebar
    useEffect(() => {
        const el = navRef.current?.querySelector("a.active");
        if (!el) return;
        const id = requestAnimationFrame(() => {
            try {
                el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
            } catch {
                el.scrollIntoView();
            }
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    // Keyboard shortcuts: Cmd/Ctrl+K focus, Esc clear, Enter open first result
    useEffect(() => {
        function onKey(e) {
            const isMetaK = (e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K");
            if (isMetaK) {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
                return;
            }
            if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
                setSearch("");
                return;
            }
            if (e.key === "Enter" && document.activeElement === searchInputRef.current) {
                const first = wrapperRef.current?.querySelector('a:not([data-hidden="true"])');
                if (first) first.click();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Apply filter to links + section headers whenever search changes
    useEffect(() => {
        // persist search
        try {
            sessionStorage.setItem(STORAGE_KEY, search);
        } catch { }

        const root = wrapperRef.current;
        if (!root) return;

        const q = search.trim().toLowerCase();
        const tokens = q.length ? q.split(/\s+/).filter(Boolean) : [];

        const links = Array.from(root.querySelectorAll("a[href]"));
        let visibleCount = 0;

        // Filter links
        links.forEach((a) => {
            const label = (a.textContent || "").toLowerCase();
            const title = (a.getAttribute("title") || "").toLowerCase();
            const hay = `${label} ${title}`;
            const isMatch = tokens.length === 0 || tokens.every((t) => hay.includes(t));
            a.setAttribute("data-hidden", isMatch ? "false" : "true");
            if (isMatch) visibleCount += 1;
        });

        // Hide/show section headings that have zero visible links until next h3
        const headers = Array.from(root.querySelectorAll("h3.title"));
        headers.forEach((h) => {
            let hasVisible = false;
            let node = h.nextElementSibling;
            while (node && node.tagName !== "H3") {
                if (node.tagName === "A" && node.getAttribute("data-hidden") === "false") {
                    hasVisible = true;
                    break;
                }
                node = node.nextElementSibling;
            }
            h.setAttribute("data-hidden", hasVisible ? "false" : "true");
        });

        setMatchCount(visibleCount);
    }, [search]);

    const handleSearchChange = (event) => setSearch(event.target.value);
    const clearSearch = () => setSearch("");

    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    return (
        <Styled.Nav ref={navRef} aria-label="Zustand Handbook navigation">
            <div className="searchWraper">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search topics (Ctrl + K)"
                    value={search}
                    onChange={handleSearchChange}
                    aria-label="Search topics"
                    aria-controls="navlinksWrapper"
                />
                {search.trim().length > 0 && (
                    <div
                        className="clearIconWrapper"
                        onClick={clearSearch}
                        role="button"
                        aria-label="Clear search"
                        title="Clear"
                    >
                        <MdClear size={20} />
                    </div>
                )}
            </div>

            <div className="navlinksWrapper" id="navlinksWrapper" ref={wrapperRef}>
                {/* Home */}
                <NavLink to="/home" title="Home" className="home">
                    Home
                </NavLink>

                {/* Tutorials */}
                <h3 className="title">Tutorials</h3>
                <NavLink to="/tutorials/intro" title="Zustand 101, mental model">Intro</NavLink>
                <NavLink to="/tutorials/store-choices" title="Global vs per-component stores">Store Choices</NavLink>
                <NavLink to="/tutorials/selectors" title="Selecting slices & equality functions">Selectors</NavLink>
                <NavLink to="/tutorials/set-and-get" title="Understanding set & get, update patterns">set() & get()</NavLink>
                <NavLink to="/tutorials/derived-state" title="Computed/derived values">Derived State</NavLink>
                <NavLink to="/tutorials/async-flows" title="Async flows, fetching, thunks">Async Flows</NavLink>
                <NavLink to="/tutorials/middleware-persist" title="Persistence basics">Middleware: persist</NavLink>
                <NavLink to="/tutorials/persist-migrations" title="Versions, migrations, partialization">Persist Migrations</NavLink>
                <NavLink to="/tutorials/middleware-devtools" title="Action names, time-travel, trace">Middleware: devtools</NavLink>
                <NavLink to="/tutorials/subscribe-vs-selector" title="subscribe vs subscribeWithSelector">Subscribe vs Selector</NavLink>
                <NavLink to="/tutorials/slices-pattern" title="Slices & store factories">Slices Pattern</NavLink>
                <NavLink to="/tutorials/multi-stores" title="Multiple stores, boundaries, coupling">Multi-stores</NavLink>
                <NavLink to="/tutorials/performance" title="Over-selecting, identity, rendering costs">Performance</NavLink>
                <NavLink to="/tutorials/ui-patterns" title="Forms, wizards, dialogs with store">UI Patterns</NavLink>
                <NavLink to="/tutorials/undo-redo" title="Temporal state, history, undo/redo">Undo / Redo</NavLink>
                <NavLink to="/tutorials/cross-tab-sync" title="High-level cross-tab sync ideas">Cross-tab Sync</NavLink>
                <NavLink to="/tutorials/ssr-notes" title="SSR/Next mental model (theory)">SSR Notes</NavLink>
                <NavLink to="/tutorials/testing-mindset" title="What to test & why">Testing Mindset</NavLink>
                <NavLink to="/tutorials/typescript-readiness" title="Typing surface & migration map">TypeScript Readiness</NavLink>
                <NavLink to="/tutorials/production-checklist" title="Ship-ready checks & anti-patterns">Production Checklist</NavLink>

                {/* Notes */}
                <h3 className="title">Notes</h3>
                <NavLink to="/notes/api-quick-ref" title="Daily API reference: create, set, get, subscribe">API Quick Ref</NavLink>
                <NavLink to="/notes/middlewares-overview" title="persist, devtools, subscribeWithSelector, immer">Middlewares Overview</NavLink>
                <NavLink to="/notes/selectors-equality" title="Equality functions, shallow, custom comparators">Selectors & Equality</NavLink>
                <NavLink to="/notes/state-modeling" title="Slices, normalization, factories">State Modeling</NavLink>
                <NavLink to="/notes/performance-gotchas" title="Identity traps, object/array slices">Performance Gotchas</NavLink>
                <NavLink to="/notes/async-patterns" title="Loading, error, optimistic updates">Async Patterns</NavLink>
                <NavLink to="/notes/persist-checklist" title="Persistence + migrations checklist">Persist Checklist</NavLink>
                <NavLink to="/notes/testing-checklist" title="What/where/how to test">Testing Checklist</NavLink>
                <NavLink to="/notes/typescript-map" title="Typing the store & selectors">TypeScript Map</NavLink>
                <NavLink to="/notes/troubleshooting" title="Common errors & fixes">Troubleshooting</NavLink>
                <NavLink to="/notes/cheatsheet-print" title="Print-friendly one pager">Cheatsheet (Print)</NavLink>
                <NavLink to="/notes/zustand-vs-others" title="When to pick Zustand vs alternatives">Zustand vs Others</NavLink>

                {/* Glossary */}
                <h3 className="title">Glossary</h3>
                <NavLink to="/glossary" title="Glossary index">Glossary</NavLink>

                {/* Examples (placeholders for later) */}
                <h3 className="title">Examples</h3>
                <NavLink to="/examples/counter" title="Counter demo (coming soon)">Counter</NavLink>
                <NavLink to="/examples/persist-theme" title="Persist theme (coming soon)">Persist Theme</NavLink>
                <NavLink to="/examples/devtools-todos" title="Todos + devtools (coming soon)">Devtools Todos</NavLink>
                <NavLink to="/examples/subscribe-selector" title="subscribeWithSelector demo (coming soon)">Subscribe + Selector</NavLink>
                <NavLink to="/examples/undo-redo" title="Temporal/history demo (coming soon)">Undo / Redo</NavLink>

                {/* Meta */}
                <h3 className="title">Meta</h3>
                <NavLink to="/changelog" title="Release notes & last updated">Changelog</NavLink>
                <NavLink to="/about" title="Project overview, credits, how to use">About</NavLink>
            </div>

            {/* Minimal CSS hook: hide elements with data-hidden="true" if your Styled.Nav doesn't already */}
            <style>{`
        [data-hidden="true"] { display: none !important; }
      `}</style>
        </Styled.Nav>
    );
};

export default NavListCore;
