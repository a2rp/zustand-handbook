import{d as s,j as e}from"./index-Bmr0gcqO.js";const a="var(--card, #111)",i="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",r="var(--border, #222)",o="var(--accent, #22c55e)",c="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
        color: ${i};
        border: 1px solid ${r};
        border-radius: ${l};
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
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${r};
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
            border: 1px dashed ${r};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${o};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${c};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},p=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Paginated List"}),e.jsx(t.Subtitle,{children:"Pagination, search, sort, de-dupe, and simple caching per “request key”."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What this teaches"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Store shape for ",e.jsx("b",{children:"page"}),", ",e.jsx("b",{children:"pageSize"}),", ",e.jsx("b",{children:"query"}),", ",e.jsx("b",{children:"sort"}),"."]}),e.jsxs("li",{children:["Create a stable ",e.jsx("b",{children:"request key"})," and cache results per key."]}),e.jsxs("li",{children:["Prevent duplicate requests with ",e.jsx("b",{children:"inflight"})," flags by key."]}),e.jsxs("li",{children:["Selectors to read the ",e.jsx("b",{children:"current page"})," data."]}),e.jsx("li",{children:"Optional TTL to refresh stale cache."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Store sketch"}),e.jsx("pre",{className:"good",children:`// stores/list.js
import { create } from 'zustand';

const normalize = (s = '') => s.trim().toLowerCase();
const makeKey = (s) => {
  const q = normalize(s.query);
  return [
    s.page, s.pageSize,
    s.sortBy || 'name', s.sortDir || 'asc',
    encodeURIComponent(q)
  ].join('|');
};

export const useList = create((set, get) => ({
  // UI state
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sortDir: 'asc',

  // data & bookkeeping
  dataByKey: {},        // { [key]: { items, total, ts } }
  inflightByKey: {},    // { [key]: true }
  error: null,
  ttlMs: 60_000,        // refresh after 60s (optional)

  // setters
  setPage: (n) => set({ page: Math.max(1, n) }, false, 'list/setPage'),
  setPageSize: (n) => set({ pageSize: n, page: 1 }, false, 'list/setPageSize'),
  setQuery: (q) => set({ query: q, page: 1 }, false, 'list/setQuery'),
  setSort: (by, dir='asc') => set({ sortBy: by, sortDir: dir, page: 1 }, false, 'list/setSort'),

  // derive current key
  getKey: () => makeKey(get()),

  // read cached bucket for current key
  getCurrentBucket: () => {
    const key = get().getKey();
    return get().dataByKey[key];
  },

  // invalidate cache (all or conditional)
  invalidateAll: () => set({ dataByKey: {} }, false, 'list/invalidateAll'),
  invalidateWhere: (pred) => set((s) => {
    const next = { ...s.dataByKey };
    for (const k of Object.keys(next)) if (pred(k, next[k])) delete next[k];
    return { dataByKey: next };
  }, false, 'list/invalidateWhere'),

  // main fetch for current key
  fetchCurrent: async () => {
    const state = get();
    const key = state.getKey();

    // de-dupe
    if (state.inflightByKey[key]) return;

    // TTL check
    const bucket = state.dataByKey[key];
    const fresh = bucket && (Date.now() - bucket.ts) < state.ttlMs;
    if (fresh) return;

    set((s) => ({
      inflightByKey: { ...s.inflightByKey, [key]: true },
      error: null
    }), false, 'list/fetchStart');

    try {
      // Build URL from state (replace with your API)
      const params = new URLSearchParams({
        page: String(state.page),
        pageSize: String(state.pageSize),
        query: state.query,
        sortBy: state.sortBy,
        sortDir: state.sortDir
      });

      const res = await fetch('/api/users?' + params.toString());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json(); // { items, total }

      set((s) => ({
        dataByKey: {
          ...s.dataByKey,
          [key]: { items: json.items, total: json.total, ts: Date.now() }
        },
        inflightByKey: { ...s.inflightByKey, [key]: undefined }
      }), false, 'list/fetchSuccess');

    } catch (e) {
      set((s) => ({
        error: String(e),
        inflightByKey: { ...s.inflightByKey, [key]: undefined }
      }), false, 'list/fetchError');
    }
  },
}));`}),e.jsxs(t.Callout,{children:["The ",e.jsx("b",{children:"key"})," is the heart of this example. If any input changes (page, size, query, sort), the key changes → a new bucket in ",e.jsx("code",{children:"dataByKey"}),"."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Reading current page with selectors"}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';
import { useList } from '../stores/list';

// minimal tuple selector
const [page, pageSize, query, sortBy, sortDir] = useList(
  (s) => [s.page, s.pageSize, s.query, s.sortBy, s.sortDir],
  shallow
);

// current bucket (safe: might be undefined before fetch completes)
const bucket = useList((s) => s.getCurrentBucket());
const items = bucket?.items ?? [];
const total = bucket?.total ?? 0;`}),e.jsx("pre",{className:"note",children:`// component-level derived helpers
const totalPages = Math.max(1, Math.ceil(total / pageSize));
const hasPrev = page > 1;
const hasNext = page < totalPages;`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Triggering fetch when inputs change"}),e.jsx("pre",{className:"good",children:`// inside a component
const [page, pageSize, query, sortBy, sortDir] = useList(
  (s) => [s.page, s.pageSize, s.query, s.sortBy, s.sortDir],
  shallow
);

React.useEffect(() => {
  useList.getState().fetchCurrent();
}, [page, pageSize, query, sortBy, sortDir]);`}),e.jsx(t.Callout,{children:"This effect runs whenever inputs change. The store itself de-dupes and obeys TTL."})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Debounced search (UI-side)"}),e.jsx("pre",{className:"note",children:`// keep debouncing in UI; store stays simple
const q = useList((s) => s.query);
const setQuery = useList((s) => s.setQuery);

const onChange = React.useMemo(() => {
  let t;
  return (e) => {
    const val = e.target.value;
    clearTimeout(t);
    t = setTimeout(() => setQuery(val), 300); // debounce
  };
}, [setQuery]);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) Edge cases I handle"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["If the query changes and total shrinks, I clamp ",e.jsx("b",{children:"page"})," back to 1."]}),e.jsx("li",{children:"When pageSize changes, I reset page to 1 for a predictable UX."}),e.jsx("li",{children:"When sort changes, I also reset to page 1."})]}),e.jsx("pre",{className:"good",children:`// already in setters above:
setPageSize: (n) => set({ pageSize: n, page: 1 }, false, 'list/setPageSize');
setQuery: (q) => set({ query: q, page: 1 }, false, 'list/setQuery');
setSort: (by, dir='asc') => set({ sortBy: by, sortDir: dir, page: 1 }, false, 'list/setSort');`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"6) Optional: expire cache (TTL) or manual invalidate"}),e.jsx("pre",{className:"note",children:`// Use ttlMs to auto-refresh after N ms (already in fetchCurrent).
// Or, invalidate when a mutation happens:
useList.getState().invalidateWhere((key, bucket) => key.includes('query=') /* your condition */);`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Compute a stable key from inputs."}),e.jsxs("li",{children:["Cache results in ",e.jsx("code",{children:"dataByKey"})," with a timestamp."]}),e.jsxs("li",{children:["Guard with ",e.jsx("code",{children:"inflightByKey"})," to avoid duplicate requests."]}),e.jsxs("li",{children:["Read current bucket via a selector; handle ",e.jsx("code",{children:"undefined"})," safely."]}),e.jsxs("li",{children:["Effect: ",e.jsx("code",{children:"fetchCurrent()"})," whenever inputs change."]})]})]})]});export{p as default};
