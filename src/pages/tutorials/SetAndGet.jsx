import React from "react";
import { Styled } from "./styled";

const SetAndGet = () => {
    return (
        <Styled.Page>
            <Styled.Title>set() &amp; get() — Update Patterns</Styled.Title>
            <Styled.Subtitle>How I update state safely, read the latest value, and avoid extra renders.</Styled.Subtitle>

            <Styled.Section>
                <h3>What I cover</h3>
                <ul>
                    <li>When I use the object form vs functional form of <code>set()</code>.</li>
                    <li>Why I sometimes read with <code>get()</code> inside actions.</li>
                    <li>Named actions for nicer devtools traces.</li>
                    <li>Batching, partial updates, and reset patterns.</li>
                </ul>
            </Styled.Section>

            {/* Two update forms */}
            <Styled.Section>
                <h3>Two ways to call set()</h3>
                <pre className="good">{`// Object form: when the new state DOES NOT depend on the previous state
set({ open: true, error: null });

// Functional form: when it DOES depend on the previous state
set((s) => ({ count: s.count + 1 }));`}</pre>
                <p>
                    If I’m using values from the current state to compute the next value,
                    I reach for the functional form. It makes race conditions less likely.
                </p>
            </Styled.Section>

            {/* Reading safely with get() */}
            <Styled.Section>
                <h3>Reading the latest value with get()</h3>
                <p>
                    Inside store actions, I read the current snapshot using <code>get()</code> instead of
                    relying on variables captured from component scope.
                </p>
                <pre className="good">{`// inside create((set, get) => ({ ... }))
toggleTheme: () => {
  const curr = get().theme?.mode;          // always fresh
  const next = curr === 'dark' ? 'light' : 'dark';
  set({ theme: { mode: next } });
}`}</pre>
                <pre className="bad">{`// ⚠️ might use a stale \`theme\` captured from a component
toggleTheme: () => set({ theme: { mode: theme === 'dark' ? 'light' : 'dark' } });`}</pre>
            </Styled.Section>

            {/* Named actions */}
            <Styled.Section>
                <h3>Named actions (for devtools)</h3>
                <p>
                    When I add the <code>devtools</code> middleware later, I pass an action name so
                    traces are readable. Without devtools, I just omit the third argument.
                </p>
                <pre className="good">{`// With devtools middleware: set(partial, replace?, actionName)
increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
reset:     () => set({ count: 0 }, false, 'counter/reset'),`}</pre>
            </Styled.Section>

            {/* Partial & nested updates */}
            <Styled.Section>
                <h3>Partial updates & immutable mindset</h3>
                <ul>
                    <li><b>set(object)</b> merges at the top level (it won’t deep-merge nested objects).</li>
                    <li>For nested updates, I spread the changed branch to create a new reference.</li>
                </ul>
                <pre className="good">{`// top-level merge
set({ loading: true });

// nested (manual copy to keep immutability)
set((s) => ({ user: { ...s.user, name: 'Ashish' } }));`}</pre>
            </Styled.Section>

            {/* Batch updates */}
            <Styled.Section>
                <h3>Batch related changes</h3>
                <p>I prefer one <code>set()</code> with a single render over multiple back-to-back sets.</p>
                <pre className="good">{`set((s) => ({
  loading: false,
  data: payload,
  error: null
}));`}</pre>
            </Styled.Section>

            {/* Reset patterns */}
            <Styled.Section>
                <h3>Reset patterns I use</h3>
                <ul>
                    <li><b>Slice reset:</b> expose a <code>reset()</code> per slice.</li>
                    <li><b>Full replace:</b> pass <code>replace = true</code> to overwrite the whole store.</li>
                </ul>
                <pre className="good">{`// Keep an initial object around
const initial = { count: 0, items: [], loading: false, error: null };

resetAll: () => set(initial, true), // replace=true -> replace entire state`}</pre>
                <pre className="note">{`// If replacing feels too strong, I reset per-slice:
resetCart: () => set({ cart: { items: [] } });`}</pre>
            </Styled.Section>

            {/* Async shape guidance */}
            <Styled.Section>
                <h3>Async shape I keep consistent</h3>
                <ul>
                    <li><code>loading: boolean</code>, <code>error: string | null</code>, and the data field for results.</li>
                    <li>Set <code>loading=true</code> at start, clear it on success/failure.</li>
                    <li>Clear <code>error</code> on new attempts.</li>
                </ul>
                <pre className="good">{`set({ loading: true, error: null });
try {
  const data = await api();
  set({ loading: false, data });
} catch (e) {
  set({ loading: false, error: String(e) });
}`}</pre>
            </Styled.Section>

            {/* Quick checklist */}
            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Depends on previous state? → functional form.</li>
                    <li>Need the latest snapshot inside an action? → <code>get()</code>.</li>
                    <li>Update nested data? → copy the branch (new references).</li>
                    <li>Group related changes in one <code>set()</code>.</li>
                    <li>For devtools later, name actions as <code>slice/action</code>.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default SetAndGet;
