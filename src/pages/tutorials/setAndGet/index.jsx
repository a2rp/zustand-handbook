import React from "react";
import { Styled } from "./styled";

/**
 * Tutorial: set() & get() — Update patterns
 * Focus: How to update state safely, name actions, avoid stale reads.
 * No live demo yet; pseudo-snippets in <pre>.
 */
const SetAndGet = () => {
    return (
        <Styled.Page>
            <Styled.Title>set() &amp; get() — Update Patterns</Styled.Title>
            <Styled.Subtitle>
                Learn the right way to update and read state, name actions, and avoid stale closures.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>Outcome</h3>
                <ul>
                    <li>Choose between <b>object</b> and <b>functional</b> update forms.</li>
                    <li>Use <b>named actions</b> for better devtools traces.</li>
                    <li>Avoid <b>stale reads</b> with <code>get()</code> in actions.</li>
                    <li>Handle <b>partial updates</b> and <b>reset</b> patterns cleanly.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Two update forms</h3>
                <pre className="good">{`// Object form: when new state doesn't depend on previous state
set({ open: true, error: null });

// Functional form: when next state depends on current state
set((s) => ({ count: s.count + 1 }));`}</pre>
                <Styled.Callout>
                    Prefer the <b>functional form</b> whenever the new value depends on the previous one.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>Named actions (for devtools &amp; debugging)</h3>
                <pre className="good">{`// Inside your store factory
increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
reset: () => set({ count: 0 }, false, 'counter/reset')`}</pre>
                <p>
                    The 3rd argument (action type) improves <b>devtools</b> readability and helps you trace flows.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Reading state safely with get()</h3>
                <p>
                    When your action needs the <i>current</i> value, read it via <code>get()</code> (inside the store).
                    This avoids stale closures.
                </p>
                <pre className="good">{`// Inside create((set, get) => ({ ... }))
toggleTheme: () => {
  const mode = get().theme?.mode === 'dark' ? 'light' : 'dark';
  set({ theme: { mode } }, false, 'theme/toggle');
}`}</pre>
                <pre className="bad">{`// Anti-pattern: captured "theme" from component scope might be stale
toggleTheme: () => set({ theme: { mode: theme === 'dark' ? 'light' : 'dark' } });`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Partial updates &amp; immutable thinking</h3>
                <ul>
                    <li>Updates are <b>merged</b> into the current state shape you define in your store.</li>
                    <li>When updating nested data, create <b>new references</b> for changed objects/arrays.</li>
                </ul>
                <pre className="good">{`// Update only what's changed, keep other keys as-is
set((s) => ({ user: { ...s.user, name: 'Ashish' } }), false, 'user/rename');`}</pre>
                <p>
                    If you prefer ergonomic nested updates, consider the <b>immer</b> middleware later (we'll cover it in middleware topics).
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Batching multiple changes</h3>
                <p>
                    Group related updates in a <b>single set()</b> call when possible to reduce renders.
                </p>
                <pre className="good">{`set((s) => ({
  loading: false,
  data: payload,
  error: null
}), false, 'fetch/success');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Reset patterns</h3>
                <ul>
                    <li><b>Slice reset:</b> expose a <code>reset()</code> action per slice.</li>
                    <li><b>Full reset:</b> store a constant <code>initialState</code> and set it back.</li>
                </ul>
                <pre className="good">{`const initial = { count: 0, items: [] };
resetAll: () => set(initial, false, 'app/reset');`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Error-handling &amp; async tips</h3>
                <ul>
                    <li>Set <code>loading</code> before async, clear it in success/failure branches.</li>
                    <li>Store <code>error</code> objects or messages; keep shape consistent.</li>
                </ul>
                <pre className="note">{`async fetchData() {
  set({ loading: true, error: null }, false, 'fetch/start');
  try {
    const data = await api();
    set({ loading: false, data }, false, 'fetch/success');
  } catch (e) {
    set({ loading: false, error: String(e) }, false, 'fetch/error');
  }
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Depends on previous state? → <b>functional form</b>.</li>
                    <li>Name actions for <b>devtools</b> (e.g., <code>slice/action</code>).</li>
                    <li>Need current value inside action? Use <code>get()</code>.</li>
                    <li>Change nested data? Create <b>new references</b>.</li>
                    <li>Group related changes into one <code>set()</code>.</li>
                </ul>
            </Styled.Section>

            <Styled.Note>
                <b>Coming next:</b> Derived state — computed values without extra renders.{" "}
                <span className="badge">Example coming later</span>
            </Styled.Note>
        </Styled.Page>
    );
};

export default SetAndGet;
