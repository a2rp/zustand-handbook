import React from "react";
import { Styled } from "./styled";

/**
 * Example: Search — Abort & De-dupe
 * Goal: cancel stale requests with AbortController and avoid duplicate in-flight calls.
 * Style: copy-paste notes (not live).
 */
const ExampleSearchAbortDedupe = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Search: Abort &amp; De-dupe</Styled.Title>
            <Styled.Subtitle>
                Avoid race conditions: cancel the previous request or skip if one is already running.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Keep an <code>AbortController</code> per query key and cancel the old request.</li>
                    <li>Use an <code>inflight</code> flag (or map) to de-dupe repeat calls.</li>
                    <li>Store results by <b>key</b> (e.g., query string) to avoid overwriting other queries.</li>
                    <li>Name actions for devtools: <code>search/start</code>, <code>search/success</code>, <code>search/error</code>, <code>search/abort</code>.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch — <em>Abort previous</em> pattern (great for typing/search boxes)</h3>
                <pre className="good">{`import { create } from 'zustand';

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
}));`}</pre>
                <Styled.Callout>
                    For typing UIs, aborting the previous request keeps results fresh and prevents
                    “late responses” from overwriting newer ones.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Store sketch — <em>De-dupe</em> pattern (skip if already in-flight)</h3>
                <pre className="note">{`export const useSearchOnce = create((set, get) => ({
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
}));`}</pre>
                <p>
                    This is useful for idempotent buttons (e.g., “Load more”) where you want to ignore repeated clicks.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Component usage sketch</h3>
                <pre className="good">{`import React from 'react';
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
}`}</pre>
                <Styled.Callout>
                    The store handles <code>AbortController</code> and inflight flags; the component just debounces and calls the action.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Common pitfalls</h3>
                <pre className="bad">{`// ❌ Single "results" value shared across queries — later responses overwrite other tabs/queries
set({ results: data });`}</pre>
                <pre className="good">{`// ✅ Keyed storage keeps results separate
set((s) => ({ resultsByKey: { ...s.resultsByKey, [key]: data } }));`}</pre>

                <pre className="bad">{`// ❌ Forgetting to clear inflight on abort/error → UI stays stuck
// inflightByKey[key] remains true`}</pre>
                <pre className="good">{`// ✅ Always clear inflight in every exit path (success, error, abort)
set((s) => ({ inflightByKey: { ...s.inflightByKey, [key]: false } }));`}</pre>

                <pre className="bad">{`// ❌ Swallowing AbortError but leaving old controller in state`}</pre>
                <pre className="good">{`// ✅ Null out the controller on every finish
set((s) => ({ controllers: { ...s.controllers, [key]: null } }));`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Checklist</h3>
                <ul>
                    <li>Choose your key (query string, filters, page, etc.).</li>
                    <li>Abort previous for type-ahead; de-dupe for idempotent triggers.</li>
                    <li>Store <code>resultsByKey</code>, <code>errorByKey</code>, <code>inflightByKey</code>.</li>
                    <li>Always clear <code>inflight</code> and controller on success/error/abort.</li>
                    <li>Name actions for devtools (<code>search/start</code>, <code>search/success</code>, …).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Exercise ideas</h3>
                <ul>
                    <li>Add per-key caching TTL; skip fetch if cache is fresh.</li>
                    <li>Track <code>lastUpdatedByKey</code> and render stale badges.</li>
                    <li>Support cancel-all when navigating away from the page.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSearchAbortDedupe;
