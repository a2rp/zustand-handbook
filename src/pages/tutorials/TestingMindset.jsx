import React from "react";
import { Styled } from "./styled";

const TestingMindset = () => {
    return (
        <Styled.Page>
            <Styled.Title>Testing Mindset — What & Why</Styled.Title>
            <Styled.Subtitle>
                What I actually test with Zustand: small, focused checks that keep behavior safe.
            </Styled.Subtitle>

            {/* Goals */}
            <Styled.Section>
                <h3>My goals</h3>
                <ul>
                    <li>Actions change state as expected (happy + error paths).</li>
                    <li>Selectors/derived values don’t cause surprise re-renders.</li>
                    <li>Async flows follow start → success/error shape.</li>
                    <li>UI reflects store changes without brittle implementation details.</li>
                </ul>
            </Styled.Section>

            {/* Setup */}
            <Styled.Section>
                <h3>Setup I use</h3>
                <ul>
                    <li><b>Runner:</b> Vitest (or Jest)</li>
                    <li><b>UI:</b> @testing-library/react</li>
                    <li><b>Tip:</b> reset store between tests so cases don’t leak into each other</li>
                </ul>
                <pre className="good">{`// vitest example config (package.json)
// "test": "vitest"

// common helpers (test/utils.ts)
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => cleanup());`}</pre>
            </Styled.Section>

            {/* Unit: actions */}
            <Styled.Section>
                <h3>Unit: actions change state</h3>
                <p>Directly hit the store via <code>getState()</code>/<code>setState()</code>. Fast and clear.</p>
                <pre className="good">{`// stores/counter.ts (example)
import { create } from 'zustand';
export const initialCounter = { count: 0 };
export const useCounter = create((set, get) => ({
  ...initialCounter,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  reset: () => set(initialCounter, true, 'counter/reset'), // replace = true
}));`}</pre>
                <pre className="good">{`// tests/counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCounter, initialCounter } from '../src/stores/counter';

describe('counter store', () => {
  beforeEach(() => {
    // full reset (replace = true)
    useCounter.setState(initialCounter, true);
  });

  it('increments', () => {
    useCounter.getState().increment();
    expect(useCounter.getState().count).toBe(1);
  });

  it('resets', () => {
    useCounter.getState().increment();
    useCounter.getState().reset();
    expect(useCounter.getState().count).toBe(0);
  });
});`}</pre>
            </Styled.Section>

            {/* Component: subscription renders */}
            <Styled.Section>
                <h3>Component: subscription renders</h3>
                <p>Render a tiny component that selects a slice; assert the UI updates once the action fires.</p>
                <pre className="good">{`// tests/counter.ui.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useCounter, initialCounter } from '../src/stores/counter';

function CounterView() {
  const count = useCounter((s) => s.count); // narrow selector
  return <div data-testid="count">{count}</div>;
}

test('updates view when count changes', () => {
  useCounter.setState(initialCounter, true);
  render(<CounterView />);
  expect(screen.getByTestId('count').textContent).toBe('0');

  act(() => useCounter.getState().increment());
  expect(screen.getByTestId('count').textContent).toBe('1');
});`}</pre>
            </Styled.Section>

            {/* Selectors & shallow */}
            <Styled.Section>
                <h3>Selectors &amp; <code>shallow</code> in practice</h3>
                <p>When selecting multiple values, I use a tuple/object + <code>shallow</code> so unrelated changes don’t re-render.</p>
                <pre className="note">{`// component example
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter((s) => [s.count, s.count > 10], shallow);`}</pre>
                <pre className="good">{`// quick render-stability check (sketch)
import { render } from '@testing-library/react';
let renders = 0;
function View() { renders++; const v = useCounter((s) => [s.count, s.count > 10], shallow); return null; }
render(<View />);
useCounter.getState().reset();            // same values → no render bump expected
// expect(renders).toBe(1)  // adjust depending on framework behavior`}</pre>
            </Styled.Section>

            {/* Async flows */}
            <Styled.Section>
                <h3>Async flows: start → success/error</h3>
                <p>I keep a consistent shape: <code>loading</code>, <code>error</code>, and the data slice.</p>
                <pre className="good">{`// stores/users.ts
import { create } from 'zustand';
export const useUsers = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null }, false, 'users/fetchStart');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      set({ loading: false, users: data }, false, 'users/fetchSuccess');
    } catch (e) {
      set({ loading: false, error: String(e) }, false, 'users/fetchError');
    }
  },
}));`}</pre>
                <pre className="good">{`// tests/users.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUsers } from '../src/stores/users';

describe('users fetch', () => {
  beforeEach(() => {
    useUsers.setState({ users: [], loading: false, error: null }, true);
  });

  it('success path', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{ id: 1, name: 'A' }]),
    });
    const { fetchUsers } = useUsers.getState();
    const p = fetchUsers();
    expect(useUsers.getState().loading).toBe(true);
    await p;
    expect(useUsers.getState().loading).toBe(false);
    expect(useUsers.getState().users).toHaveLength(1);
    expect(useUsers.getState().error).toBe(null);
  });

  it('error path', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    const { fetchUsers } = useUsers.getState();
    await fetchUsers();
    expect(useUsers.getState().loading).toBe(false);
    expect(useUsers.getState().error).toMatch(/HTTP 500/);
  });
});`}</pre>
            </Styled.Section>

            {/* Local store factory tests */}
            <Styled.Section>
                <h3>Local store factories keep tests clean</h3>
                <p>For widget-scoped flows (wizards/modals), I expose a factory and inject it in tests so each test gets a fresh instance.</p>
                <pre className="good">{`// wizardStore.ts
import { create } from 'zustand';
export const createWizardStore = (step = 1) =>
  create((set) => ({
    step, data: {},
    next: () => set((s) => ({ step: s.step + 1 })),
    reset: () => set({ step: 1, data: {} }),
  }));`}</pre>
                <pre className="good">{`// Wizard.tsx (component accepts a store hook prop)
export function Wizard({ useWizard }: { useWizard: any }) {
  const step = useWizard((s: any) => s.step);
  const next = useWizard((s: any) => s.next);
  return <button onClick={next}>Step: {step}</button>;
}`}</pre>
                <pre className="good">{`// tests/wizard.ui.test.tsx
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Wizard } from '../src/Wizard';
import { createWizardStore } from '../src/wizardStore';

it('advances steps', async () => {
  const useWizard = createWizardStore(1);
  render(<Wizard useWizard={useWizard} />);
  await user.click(screen.getByRole('button'));
  expect(useWizard.getState().step).toBe(2);
});`}</pre>
            </Styled.Section>

            {/* Persist & migrations */}
            <Styled.Section>
                <h3>Persist & migrations (quick idea)</h3>
                <p>If I version persisted state, I test that old shapes migrate correctly.</p>
                <pre className="note">{`// migration function (concept)
function migrate(v, state) {
  if (v < 2) return { ...state, theme: { mode: state.dark ? 'dark' : 'light' } };
  return state;
}
// test supplies a fake old snapshot → expect new shape`}</pre>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>My checklist</h3>
                <ul>
                    <li>Reset store in <code>beforeEach</code> using <code>setState(initial, true)</code>.</li>
                    <li>Test actions at the unit level; UI at the integration level.</li>
                    <li>Use narrow selectors in components; consider <code>shallow</code> for tuples/objects.</li>
                    <li>Keep async shape predictable: <code>loading</code>, <code>error</code>, data.</li>
                    <li>Prefer store factories for local/ephemeral flows.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default TestingMindset;
