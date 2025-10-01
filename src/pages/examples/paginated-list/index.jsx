import React from "react";
import { Styled } from "./styled";

/**
 * Example: Paginated List
 * Goal: page/pageSize/query/sort → cache-by-key, prevent duplicate fetches,
 *       and read the current page data with stable selectors.
 */
const ExamplePaginatedList = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Paginated List</Styled.Title>
            <Styled.Subtitle>
                Pagination, search, sort, de-dupe, and simple caching per “request key”.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>Store shape for <b>page</b>, <b>pageSize</b>, <b>query</b>, <b>sort</b>.</li>
                    <li>Create a stable <b>request key</b> and cache results per key.</li>
                    <li>Prevent duplicate requests with <b>inflight</b> flags by key.</li>
                    <li>Selectors to read the <b>current page</b> data.</li>
                    <li>Optional TTL to refresh stale cache.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch</h3>
                <pre className="good">{`// stores/list.js
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
}));`}</pre>
                <Styled.Callout>
                    The <b>key</b> is the heart of this example. If any input changes (page, size, query,
                    sort), the key changes → a new bucket in <code>dataByKey</code>.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Reading current page with selectors</h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';
import { useList } from '../stores/list';

// minimal tuple selector
const [page, pageSize, query, sortBy, sortDir] = useList(
  (s) => [s.page, s.pageSize, s.query, s.sortBy, s.sortDir],
  shallow
);

// current bucket (safe: might be undefined before fetch completes)
const bucket = useList((s) => s.getCurrentBucket());
const items = bucket?.items ?? [];
const total = bucket?.total ?? 0;`}</pre>
                <pre className="note">{`// component-level derived helpers
const totalPages = Math.max(1, Math.ceil(total / pageSize));
const hasPrev = page > 1;
const hasNext = page < totalPages;`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Triggering fetch when inputs change</h3>
                <pre className="good">{`// inside a component
const [page, pageSize, query, sortBy, sortDir] = useList(
  (s) => [s.page, s.pageSize, s.query, s.sortBy, s.sortDir],
  shallow
);

React.useEffect(() => {
  useList.getState().fetchCurrent();
}, [page, pageSize, query, sortBy, sortDir]);`}</pre>
                <Styled.Callout>
                    This effect runs whenever inputs change. The store itself de-dupes and obeys TTL.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Debounced search (UI-side)</h3>
                <pre className="note">{`// keep debouncing in UI; store stays simple
const q = useList((s) => s.query);
const setQuery = useList((s) => s.setQuery);

const onChange = React.useMemo(() => {
  let t;
  return (e) => {
    const val = e.target.value;
    clearTimeout(t);
    t = setTimeout(() => setQuery(val), 300); // debounce
  };
}, [setQuery]);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Edge cases I handle</h3>
                <ul>
                    <li>If the query changes and total shrinks, I clamp <b>page</b> back to 1.</li>
                    <li>When pageSize changes, I reset page to 1 for a predictable UX.</li>
                    <li>When sort changes, I also reset to page 1.</li>
                </ul>
                <pre className="good">{`// already in setters above:
setPageSize: (n) => set({ pageSize: n, page: 1 }, false, 'list/setPageSize');
setQuery: (q) => set({ query: q, page: 1 }, false, 'list/setQuery');
setSort: (by, dir='asc') => set({ sortBy: by, sortDir: dir, page: 1 }, false, 'list/setSort');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Optional: expire cache (TTL) or manual invalidate</h3>
                <pre className="note">{`// Use ttlMs to auto-refresh after N ms (already in fetchCurrent).
// Or, invalidate when a mutation happens:
useList.getState().invalidateWhere((key, bucket) => key.includes('query=') /* your condition */);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Compute a stable key from inputs.</li>
                    <li>Cache results in <code>dataByKey</code> with a timestamp.</li>
                    <li>Guard with <code>inflightByKey</code> to avoid duplicate requests.</li>
                    <li>Read current bucket via a selector; handle <code>undefined</code> safely.</li>
                    <li>Effect: <code>fetchCurrent()</code> whenever inputs change.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExamplePaginatedList;
