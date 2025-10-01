import React from "react";
import { Styled } from "./styled";

/**
 * Tutorial: Selectors — choosing slices & equality functions
 * Focus: Theory-first. Small pseudo-snippets in <pre>, no live demos yet.
 */
const Selectors = () => {
    return (
        <Styled.Page>
            <Styled.Title>Selectors — Slices & Equality</Styled.Title>
            <Styled.Subtitle>
                Subscribe to the smallest necessary state. Control re-renders with equality.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>Outcome</h3>
                <ul>
                    <li>Pick the right <b>slice</b> per component.</li>
                    <li>Use <code>shallow</code> or custom equality to reduce re-renders.</li>
                    <li>Avoid identity traps when selecting objects/arrays.</li>
                    <li>Aggregate multiple primitives safely.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Selector basics</h3>
                <ul>
                    <li>A selector answers: <i>“Exactly what value does this component need?”</i></li>
                    <li>Prefer selecting <b>primitives</b> or stable references.</li>
                    <li>For multiple values, return an <b>object/array + shallow</b> comparison.</li>
                </ul>
                <pre className="note">{`Idea (pseudo):
const count   = useStore((s) => s.count)
const theme   = useStore((s) => s.theme.mode)
// Multiple values (use shallow):
const [count, total] = useStore((s) => [s.count, s.total], shallow)
// or
const view = useStore((s) => ({ count: s.count, total: s.total }), shallow)`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Equality functions</h3>
                <ul>
                    <li><code>strict ===</code> is the default. For objects/arrays, it will re-render on every new reference.</li>
                    <li><code>shallow</code> compares top-level keys/indices only (fast + common).</li>
                    <li>Custom equality is possible for special cases (e.g., deep check of small data).</li>
                </ul>
                <pre className="note">{`Equality tips:
- Prefer primitives when possible.
- If you must return an object/array, pass \`shallow\`.
- Memoize derived values upstream if they cause identity churn.`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Common pitfalls</h3>
                <ul>
                    <li>Selecting the <b>entire store</b> → widespread re-renders.</li>
                    <li>Returning <b>fresh objects/arrays</b> without equality → every render re-subscribes.</li>
                    <li>Deriving data in the selector that <b>changes reference</b> frequently.</li>
                </ul>
                <pre className="bad">{`Bad:
const view = useStore((s) => ({ list: s.list.filter(p => p.inStock) })) // new array each time`}</pre>
                <pre className="good">{`Better:
const view = useStore((s) => [s.list, s.filter], shallow)
// derive inside component with memo (or upstream in store) if needed`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Aggregation patterns</h3>
                <ul>
                    <li><b>Array tuple + shallow</b> — compact & fast for a few primitives.</li>
                    <li><b>Object + shallow</b> — readable when many fields are needed.</li>
                    <li><b>Selector factories</b> — create reusable selector helpers per slice.</li>
                </ul>
                <pre className="note">{`Selector factory (pseudo):
const selectTotals = (s) => ({ subtotal: s.subtotal, tax: s.tax, total: s.total })
const totals = useStore(selectTotals, shallow)`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Does this component truly need that much state? Trim the slice.</li>
                    <li>If returning objects/arrays → add <code>shallow</code>.</li>
                    <li>Derived heavy work? Memoize or compute in store once.</li>
                    <li>Selectors should be <b>pure, cheap, and stable</b>.</li>
                </ul>
            </Styled.Section>

            <Styled.Note>
                <b>Coming next:</b> <span>set() & get() — Update patterns</span>
                <span className="badge">Example coming later</span>
            </Styled.Note>
        </Styled.Page>
    );
};

export default Selectors;
