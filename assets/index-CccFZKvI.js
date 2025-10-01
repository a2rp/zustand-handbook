import{d as s,j as e}from"./index-Gt8sd0pi.js";const o="var(--card, #111)",l="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",t="var(--border, #222)",a="var(--accent, #22c55e)",i="var(--danger, #ef4444)",c="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",r={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${l};
        border: 1px solid ${t};
        border-radius: ${c};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:s.section`
        border-top: 1px dashed ${t};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${t};
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
            border: 1px dashed ${t};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${a};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${i};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${t};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},y=()=>e.jsxs(r.Page,{children:[e.jsx(r.Title,{children:"Example — Search: Abort & De-dupe"}),e.jsx(r.Subtitle,{children:"Avoid race conditions: cancel the previous request or skip if one is already running."}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Keep an ",e.jsx("code",{children:"AbortController"})," per query key and cancel the old request."]}),e.jsxs("li",{children:["Use an ",e.jsx("code",{children:"inflight"})," flag (or map) to de-dupe repeat calls."]}),e.jsxs("li",{children:["Store results by ",e.jsx("b",{children:"key"})," (e.g., query string) to avoid overwriting other queries."]}),e.jsxs("li",{children:["Name actions for devtools: ",e.jsx("code",{children:"search/start"}),", ",e.jsx("code",{children:"search/success"}),", ",e.jsx("code",{children:"search/error"}),", ",e.jsx("code",{children:"search/abort"}),"."]})]})]}),e.jsxs(r.Section,{children:[e.jsxs("h3",{children:["1) Store sketch — ",e.jsx("em",{children:"Abort previous"})," pattern (great for typing/search boxes)"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

export const useSearch = create((set, get) => ({
  // keyed state
  resultsByKey: {},     // { [key]: array }
  errorByKey: {},       // { [key]: string | null }
  inflightByKey: {},    // { [key]: boolean }
  controllers: {},      // { [key]: AbortController }

  // helper to build a stable key from params (e.g., query string)
  keyOf: (q) => (q ?? '').trim().toLowerCase(),

  // abort the previous request for the same key, then fetch
  search: async (q) => {
    const key = get().keyOf(q);

    // abort previous controller (if any)
    const prev = get().controllers[key];
    prev?.abort?.();

    // set up fresh controller & start state
    const controller = new AbortController();
    set((s) => ({
      controllers: { ...s.controllers, [key]: controller },
      inflightByKey: { ...s.inflightByKey, [key]: true },
      errorByKey: { ...s.errorByKey, [key]: null },
    }), false, 'search/start');

    try {
      const res = await fetch(\`/api/search?q=\${encodeURIComponent(q)}\`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      // success: clear inflight, store results
      set((s) => ({
        inflightByKey: { ...s.inflightByKey, [key]: false },
        resultsByKey: { ...s.resultsByKey, [key]: data },
        controllers: { ...s.controllers, [key]: null },
      }), false, 'search/success');
    } catch (e) {
      // if aborted, quietly exit (and clear inflight/controller)
      if (e?.name === 'AbortError') {
        set((s) => ({
          inflightByKey: { ...s.inflightByKey, [key]: false },
          controllers: { ...s.controllers, [key]: null },
        }), false, 'search/abort');
        return;
      }
      // failure
      set((s) => ({
        inflightByKey: { ...s.inflightByKey, [key]: false },
        errorByKey: { ...s.errorByKey, [key]: String(e) },
        controllers: { ...s.controllers, [key]: null },
      }), false, 'search/error');
    }
  },
}));`}),e.jsx(r.Callout,{children:"For typing UIs, aborting the previous request keeps results fresh and prevents “late responses” from overwriting newer ones."})]}),e.jsxs(r.Section,{children:[e.jsxs("h3",{children:["2) Store sketch — ",e.jsx("em",{children:"De-dupe"})," pattern (skip if already in-flight)"]}),e.jsx("pre",{className:"note",children:`export const useSearchOnce = create((set, get) => ({
  resultsByKey: {},
  inflightByKey: {},
  errorByKey: {},
  keyOf: (q) => (q ?? '').trim().toLowerCase(),

  fetchOnce: async (q) => {
    const key = get().keyOf(q);
    if (get().inflightByKey[key]) return; // already running → skip

    set((s) => ({
      inflightByKey: { ...s.inflightByKey, [key]: true },
      errorByKey: { ...s.errorByKey, [key]: null },
    }), false, 'search/start');

    try {
      const data = await api.search(q); // your API
      set((s) => ({
        inflightByKey: { ...s.inflightByKey, [key]: false },
        resultsByKey: { ...s.resultsByKey, [key]: data },
      }), false, 'search/success');
    } catch (e) {
      set((s) => ({
        inflightByKey: { ...s.inflightByKey, [key]: false },
        errorByKey: { ...s.errorByKey, [key]: String(e) },
      }), false, 'search/error');
    }
  },
}));`}),e.jsx("p",{children:"This is useful for idempotent buttons (e.g., “Load more”) where you want to ignore repeated clicks."})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"3) Component usage sketch"}),e.jsx("pre",{className:"good",children:`import React from 'react';
import { useSearch } from '../stores/search';
import { shallow } from 'zustand/shallow';

export default function SearchBox() {
  const [q, setQ] = React.useState('');
  const [search, inflight, results, error] = useSearch((s) => {
    const key = s.keyOf(q);
    return [
      s.search,
      !!s.inflightByKey[key],
      s.resultsByKey[key] ?? [],
      s.errorByKey[key] ?? null,
    ];
  }, shallow);

  // debounce the action to avoid spamming fetch
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (q.trim()) search(q);
    }, 300);
    return () => clearTimeout(id); // cancel debounce timer
  }, [q, search]);

  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." />
      {inflight && <span>Loading…</span>}
      {error && <span style={{ color: 'salmon' }}>{error}</span>}
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`}),e.jsxs(r.Callout,{children:["The store handles ",e.jsx("code",{children:"AbortController"})," and inflight flags; the component just debounces and calls the action."]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"4) Common pitfalls"}),e.jsx("pre",{className:"bad",children:`// ❌ Single "results" value shared across queries — later responses overwrite other tabs/queries
set({ results: data });`}),e.jsx("pre",{className:"good",children:`// ✅ Keyed storage keeps results separate
set((s) => ({ resultsByKey: { ...s.resultsByKey, [key]: data } }));`}),e.jsx("pre",{className:"bad",children:`// ❌ Forgetting to clear inflight on abort/error → UI stays stuck
// inflightByKey[key] remains true`}),e.jsx("pre",{className:"good",children:`// ✅ Always clear inflight in every exit path (success, error, abort)
set((s) => ({ inflightByKey: { ...s.inflightByKey, [key]: false } }));`}),e.jsx("pre",{className:"bad",children:"// ❌ Swallowing AbortError but leaving old controller in state"}),e.jsx("pre",{className:"good",children:`// ✅ Null out the controller on every finish
set((s) => ({ controllers: { ...s.controllers, [key]: null } }));`})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"5) Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Choose your key (query string, filters, page, etc.)."}),e.jsx("li",{children:"Abort previous for type-ahead; de-dupe for idempotent triggers."}),e.jsxs("li",{children:["Store ",e.jsx("code",{children:"resultsByKey"}),", ",e.jsx("code",{children:"errorByKey"}),", ",e.jsx("code",{children:"inflightByKey"}),"."]}),e.jsxs("li",{children:["Always clear ",e.jsx("code",{children:"inflight"})," and controller on success/error/abort."]}),e.jsxs("li",{children:["Name actions for devtools (",e.jsx("code",{children:"search/start"}),", ",e.jsx("code",{children:"search/success"}),", …)."]})]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"6) Exercise ideas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Add per-key caching TTL; skip fetch if cache is fresh."}),e.jsxs("li",{children:["Track ",e.jsx("code",{children:"lastUpdatedByKey"})," and render stale badges."]}),e.jsx("li",{children:"Support cancel-all when navigating away from the page."})]})]})]});export{y as default};
