import React from "react";
import { Styled } from "./styled";

/**
 * Tutorial: Global vs Per-Component Stores
 * Focus: Decision making (theory first, no live demo yet)
 * Tip: Replace <pre> blocks later with real examples when we add the Examples track.
 */
const StoreChoices = () => {
    return (
        <Styled.Page>
            <Styled.Title>Global vs Per-Component Stores</Styled.Title>
            <Styled.Subtitle>When to keep one global store, when to spawn local stores.</Styled.Subtitle>

            <Styled.Section>
                <h3>Outcome</h3>
                <ul>
                    <li>Decide quickly between a <b>single global store</b> and a <b>local/per-component store</b>.</li>
                    <li>Understand coupling, testability, and performance trade-offs.</li>
                    <li>Have a safe migration plan if your app grows beyond the initial choice.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Quick decision matrix</h3>
                <Styled.Table role="table" aria-label="Decision matrix for store choices">
                    <thead>
                        <tr>
                            <th>Signal</th>
                            <th>Bias</th>
                            <th>Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>State is shared across many pages/features</td>
                            <td>Global store</td>
                            <td>Prevents prop drilling; single source of truth.</td>
                        </tr>
                        <tr>
                            <td>State is temporary & isolated to one widget</td>
                            <td>Per-component store</td>
                            <td>Keeps boundaries tight; avoids global bloat.</td>
                        </tr>
                        <tr>
                            <td>Feature needs easy reset/unmount behavior</td>
                            <td>Per-component store</td>
                            <td>Dispose on unmount; no global leaks.</td>
                        </tr>
                        <tr>
                            <td>Cross-feature coordination (auth, theme, cart)</td>
                            <td>Global store</td>
                            <td>Shared access and consistent behavior app-wide.</td>
                        </tr>
                        <tr>
                            <td>Heavy computations/large slices</td>
                            <td>Either, but slice by feature</td>
                            <td>Split store into slices; select narrowly.</td>
                        </tr>
                    </tbody>
                </Styled.Table>
            </Styled.Section>

            <Styled.Section>
                <h3>Global store — when it shines</h3>
                <ul>
                    <li>Truly shared concerns: <i>auth, user profile, theme, permissions, cart</i>.</li>
                    <li>Consistency across routes; easy to debug with devtools.</li>
                    <li>Single place to attach middlewares (persist, devtools, logs).</li>
                </ul>
                <Styled.Callout>
                    <b>Rule of thumb:</b> If 3+ independent screens need the same state, prefer global.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Per-component/local store — when it wins</h3>
                <ul>
                    <li>Encapsulated widgets: <i>wizard, modal workflow, form builder, table filters</i>.</li>
                    <li>Easy teardown on unmount (automatic reset without manual cleanup).</li>
                    <li>Improves testability: mount the component with its store factory in tests.</li>
                </ul>
                <pre className="note">
                    {`Pattern idea:
function useWizardStoreFactory(initial) {
  return create((set) => ({
    step: initial?.step ?? 1,
    data: {},
    next: () => set((s) => ({ step: s.step + 1 })),
    reset: () => set({ step: 1, data: {} }),
  }));
}
// Later: const useWizardStore = useWizardStoreFactory({ step: 1 });
`}
                </pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Anti-patterns to avoid</h3>
                <ul>
                    <li><b>One giant global store</b> with everything — leads to accidental coupling.</li>
                    <li>Selecting <b>entire store</b> in components — causes widespread re-renders.</li>
                    <li>Local store holding <b>shared state</b> (e.g., auth) — causes duplication/drift.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Migration plan (safe path)</h3>
                <ol>
                    <li><b>Start small</b> with a global store split into <i>slices</i> (auth, theme, cart, ui).</li>
                    <li>For contained widgets, <b>introduce local store factories</b> near the component.</li>
                    <li>As features grow, <b>extract slices</b> into dedicated files; keep selectors narrow.</li>
                    <li>Use <b>persist partialization + versioning</b> to evolve data safely.</li>
                    <li>Add <b>devtools</b> and name actions to trace behavior during the migration.</li>
                </ol>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Is the state shared by multiple screens? → Global slice.</li>
                    <li>Is the state ephemeral to a widget? → Local store factory.</li>
                    <li>Will unmount/reset semantics matter? → Local is simpler.</li>
                    <li>Do we need cross-feature policies (e.g., auth)? → Global.</li>
                    <li>Are components over-rendering? → Revisit selectors/equality.</li>
                </ul>
            </Styled.Section>

            <Styled.Note>
                <b>Coming next:</b> Selectors — choosing the exact slice & equality checks.{" "}
                <span className="badge">Example coming later</span>
            </Styled.Note>
        </Styled.Page>
    );
};

export default StoreChoices;
