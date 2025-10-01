import{j as e}from"./index-CpvfKB5t.js";import{S as t}from"./styled-BiXATIDY.js";const n=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Testing Mindset — What & Why"}),e.jsx(t.Subtitle,{children:"What I actually test with Zustand: small, focused checks that keep behavior safe."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"My goals"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Actions change state as expected (happy + error paths)."}),e.jsx("li",{children:"Selectors/derived values don’t cause surprise re-renders."}),e.jsx("li",{children:"Async flows follow start → success/error shape."}),e.jsx("li",{children:"UI reflects store changes without brittle implementation details."})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Setup I use"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Runner:"})," Vitest (or Jest)"]}),e.jsxs("li",{children:[e.jsx("b",{children:"UI:"})," @testing-library/react"]}),e.jsxs("li",{children:[e.jsx("b",{children:"Tip:"})," reset store between tests so cases don’t leak into each other"]})]}),e.jsx("pre",{className:"good",children:`// vitest example config (package.json)
// "test": "vitest"

// common helpers (test/utils.ts)
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => cleanup());`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Unit: actions change state"}),e.jsxs("p",{children:["Directly hit the store via ",e.jsx("code",{children:"getState()"}),"/",e.jsx("code",{children:"setState()"}),". Fast and clear."]}),e.jsx("pre",{className:"good",children:`// stores/counter.ts (example)
import { create } from 'zustand';
export const initialCounter = { count: 0 };
export const useCounter = create((set, get) => ({
  ...initialCounter,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  reset: () => set(initialCounter, true, 'counter/reset'), // replace = true
}));`}),e.jsx("pre",{className:"good",children:`// tests/counter.test.ts
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
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Component: subscription renders"}),e.jsx("p",{children:"Render a tiny component that selects a slice; assert the UI updates once the action fires."}),e.jsx("pre",{className:"good",children:`// tests/counter.ui.test.tsx
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
});`})]}),e.jsxs(t.Section,{children:[e.jsxs("h3",{children:["Selectors & ",e.jsx("code",{children:"shallow"})," in practice"]}),e.jsxs("p",{children:["When selecting multiple values, I use a tuple/object + ",e.jsx("code",{children:"shallow"})," so unrelated changes don’t re-render."]}),e.jsx("pre",{className:"note",children:`// component example
import { shallow } from 'zustand/shallow';
const [count, disabled] = useCounter((s) => [s.count, s.count > 10], shallow);`}),e.jsx("pre",{className:"good",children:`// quick render-stability check (sketch)
import { render } from '@testing-library/react';
let renders = 0;
function View() { renders++; const v = useCounter((s) => [s.count, s.count > 10], shallow); return null; }
render(<View />);
useCounter.getState().reset();            // same values → no render bump expected
// expect(renders).toBe(1)  // adjust depending on framework behavior`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Async flows: start → success/error"}),e.jsxs("p",{children:["I keep a consistent shape: ",e.jsx("code",{children:"loading"}),", ",e.jsx("code",{children:"error"}),", and the data slice."]}),e.jsx("pre",{className:"good",children:`// stores/users.ts
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
}));`}),e.jsx("pre",{className:"good",children:`// tests/users.test.ts
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
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Local store factories keep tests clean"}),e.jsx("p",{children:"For widget-scoped flows (wizards/modals), I expose a factory and inject it in tests so each test gets a fresh instance."}),e.jsx("pre",{className:"good",children:`// wizardStore.ts
import { create } from 'zustand';
export const createWizardStore = (step = 1) =>
  create((set) => ({
    step, data: {},
    next: () => set((s) => ({ step: s.step + 1 })),
    reset: () => set({ step: 1, data: {} }),
  }));`}),e.jsx("pre",{className:"good",children:`// Wizard.tsx (component accepts a store hook prop)
export function Wizard({ useWizard }: { useWizard: any }) {
  const step = useWizard((s: any) => s.step);
  const next = useWizard((s: any) => s.next);
  return <button onClick={next}>Step: {step}</button>;
}`}),e.jsx("pre",{className:"good",children:`// tests/wizard.ui.test.tsx
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Wizard } from '../src/Wizard';
import { createWizardStore } from '../src/wizardStore';

it('advances steps', async () => {
  const useWizard = createWizardStore(1);
  render(<Wizard useWizard={useWizard} />);
  await user.click(screen.getByRole('button'));
  expect(useWizard.getState().step).toBe(2);
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Persist & migrations (quick idea)"}),e.jsx("p",{children:"If I version persisted state, I test that old shapes migrate correctly."}),e.jsx("pre",{className:"note",children:`// migration function (concept)
function migrate(v, state) {
  if (v < 2) return { ...state, theme: { mode: state.dark ? 'dark' : 'light' } };
  return state;
}
// test supplies a fake old snapshot → expect new shape`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"My checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Reset store in ",e.jsx("code",{children:"beforeEach"})," using ",e.jsx("code",{children:"setState(initial, true)"}),"."]}),e.jsx("li",{children:"Test actions at the unit level; UI at the integration level."}),e.jsxs("li",{children:["Use narrow selectors in components; consider ",e.jsx("code",{children:"shallow"})," for tuples/objects."]}),e.jsxs("li",{children:["Keep async shape predictable: ",e.jsx("code",{children:"loading"}),", ",e.jsx("code",{children:"error"}),", data."]}),e.jsx("li",{children:"Prefer store factories for local/ephemeral flows."})]})]})]});export{n as default};
