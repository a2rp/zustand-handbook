import{d as s,j as e}from"./index-CpvfKB5t.js";const o="var(--card, #111)",n="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",r="var(--border, #222)",i="var(--accent, #22c55e)",c="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${n};
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
        color: ${a};
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
            border: 1px solid ${i};
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
    `},p=()=>e.jsxs(t.Page,{children:[e.jsx(t.Title,{children:"Example — Testing the Store"}),e.jsx(t.Subtitle,{children:"How I test Zustand stores (unit + React integration)."}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Unit testing actions without React (pure store API)."}),e.jsx("li",{children:"Integration testing a component with React Testing Library."}),e.jsx("li",{children:"Testing async thunks (start/success/error) with mocks."}),e.jsx("li",{children:"Testing persisted stores with an in-memory storage."}),e.jsxs("li",{children:["Isolating state per test with a ",e.jsx("i",{children:"store factory"}),"."]})]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Test setup (Vitest or Jest)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Use a JSDOM environment for component tests."}),e.jsx("li",{children:"Reset store state between tests to avoid leakage."})]}),e.jsx("pre",{className:"note",children:`// vitest.config.ts (sketch)
test: {
  environment: 'jsdom',
  setupFiles: ['./test/setup.ts']
}`}),e.jsx("pre",{className:"note",children:`// test/setup.ts (optional helpers)
import '@testing-library/jest-dom';`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"1) Unit test actions (no React)"}),e.jsxs("p",{children:["Test the store in isolation using its API: ",e.jsx("code",{children:"getState()"}),", ",e.jsx("code",{children:"setState()"}),", ",e.jsx("code",{children:"subscribe()"}),"."]}),e.jsx("pre",{className:"good",children:`// src/stores/counter.ts (or .js)
import { create } from 'zustand';

export const initialCounter = { count: 0 };

export const useCounter = create((set, get) => ({
  ...initialCounter,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) }), false, 'counter/decrement'),
  reset: () => set(initialCounter, false, 'counter/reset'),
}));`}),e.jsx("pre",{className:"good",children:`// tests/counter.test.ts
import { describe, it, beforeEach, expect } from 'vitest';
import { useCounter, initialCounter } from '../src/stores/counter';

describe('counter store', () => {
  beforeEach(() => {
    // hard reset between tests
    useCounter.setState(initialCounter, true);
  });

  it('increments and decrements', () => {
    const { getState } = useCounter;
    expect(getState().count).toBe(0);

    getState().increment();
    expect(getState().count).toBe(1);

    getState().decrement();
    expect(getState().count).toBe(0);
  });

  it('reset brings it back to initial', () => {
    useCounter.getState().increment();
    useCounter.getState().reset();
    expect(useCounter.getState().count).toBe(0);
  });
});`}),e.jsxs(t.Callout,{children:["Use ",e.jsx("code",{children:"setState(initial, true)"})," in ",e.jsx("code",{children:"beforeEach"})," to reset the store deeply (the second param tells Zustand to replace rather than merge)."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"2) Integration test with a component (RTL)"}),e.jsx("pre",{className:"good",children:`// src/components/CounterCard.tsx
import React from 'react';
import { useCounter } from '../stores/counter';

export default function CounterCard() {
  const count = useCounter((s) => s.count);
  const inc = useCounter((s) => s.increment);
  const dec = useCounter((s) => s.decrement);

  return (
    <div>
      <p aria-label="count">Count: {count}</p>
      <button onClick={inc}>+1</button>
      <button onClick={dec}>-1</button>
    </div>
  );
}`}),e.jsx("pre",{className:"good",children:`// tests/CounterCard.test.tsx
import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CounterCard from '../src/components/CounterCard';
import { useCounter, initialCounter } from '../src/stores/counter';

describe('CounterCard', () => {
  beforeEach(() => {
    useCounter.setState(initialCounter, true); // fresh state
  });

  it('renders and updates count', () => {
    render(<CounterCard />);
    expect(screen.getByLabelText('count')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('+1'));
    expect(screen.getByLabelText('count')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('-1'));
    expect(screen.getByLabelText('count')).toHaveTextContent('0');
  });
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"3) Testing async thunks"}),e.jsx("pre",{className:"good",children:`// src/stores/users.ts
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
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { useUsers } from '../src/stores/users';

describe('users async', () => {
  beforeEach(() => {
    useUsers.setState({ users: [], loading: false, error: null }, true);
  });

  it('success path', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([{ id: 1, name: 'Ash' }])
    } as any);

    await useUsers.getState().fetchUsers();

    expect(useUsers.getState().loading).toBe(false);
    expect(useUsers.getState().error).toBeNull();
    expect(useUsers.getState().users).toHaveLength(1);

    (global.fetch as any).mockRestore();
  });

  it('error path', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 500 } as any);

    await useUsers.getState().fetchUsers();

    expect(useUsers.getState().loading).toBe(false);
    expect(useUsers.getState().error).toContain('HTTP 500');

    (global.fetch as any).mockRestore();
  });
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"4) Testing persisted stores (in-memory storage)"}),e.jsx("p",{children:"Swap browser storage with a memory implementation during tests."}),e.jsx("pre",{className:"good",children:`// src/stores/session.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initial = { token: null };

export const useSession = create(
  persist(
    (set) => ({
      ...initial,
      login: (token) => set({ token }, false, 'session/login'),
      logout: () => set(initial, false, 'session/logout'),
    }),
    {
      name: 'app-session',
      storage: createJSONStorage(() => localStorage), // swapped in tests
      version: 1,
    }
  )
);`}),e.jsx("pre",{className:"good",children:`// tests/session.test.ts
import { describe, it, beforeEach, expect } from 'vitest';
import { useSession } from '../src/stores/session';
import { createJSONStorage } from 'zustand/middleware';

const memoryStorage = (() => {
  let map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(),
  };
})();

beforeEach(() => {
  // @ts-ignore – swap storage for persist during test
  useSession.persist.setOptions({
    storage: createJSONStorage(() => memoryStorage as any),
  });
  // reset state + storage
  (memoryStorage as any).clear?.();
  useSession.setState({ token: null }, true);
});

describe('session persist', () => {
  it('writes and reads token from storage', () => {
    useSession.getState().login('abc123');
    const raw = (memoryStorage as any).getItem('app-session');
    expect(raw).toBeTruthy(); // persisted JSON exists
    expect(JSON.parse(raw!).state.token).toBe('abc123');
  });
});`}),e.jsxs(t.Callout,{children:[e.jsx("code",{children:"useStore.persist"})," API lets you tweak persist options at runtime. Use a memory storage to keep tests fast and deterministic."]})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"5) Store factory per test (full isolation)"}),e.jsx("p",{children:"Create a fresh store instance for each test with the vanilla API."}),e.jsx("pre",{className:"good",children:`// src/testing/makeCounterStore.ts
import { createStore } from 'zustand/vanilla';

export function makeCounterStore(initial = 0) {
  return createStore((set) => ({
    count: initial,
    inc: () => set((s: any) => ({ count: s.count + 1 })),
  }));
}`}),e.jsx("pre",{className:"good",children:`// tests/makeCounterStore.test.ts
import { describe, it, expect } from 'vitest';
import { makeCounterStore } from '../src/testing/makeCounterStore';

describe('counter vanilla store', () => {
  it('is isolated per instance', () => {
    const a = makeCounterStore(5);
    const b = makeCounterStore(0);

    a.getState().inc();
    expect(a.getState().count).toBe(6);
    expect(b.getState().count).toBe(0);
  });
});`})]}),e.jsxs(t.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Reset store state in ",e.jsx("code",{children:"beforeEach"})," with ",e.jsx("code",{children:"setState(initial, true)"}),"."]}),e.jsx("li",{children:"Prefer unit tests for logic; use RTL for rendering & events."}),e.jsxs("li",{children:["Mock network with ",e.jsx("code",{children:"vi.spyOn(global, 'fetch')"})," (or MSW for advanced flows)."]}),e.jsx("li",{children:"For persist, swap storage with an in-memory implementation."}),e.jsx("li",{children:"For tricky cases, generate a fresh store via a factory per test."})]})]})]});export{p as default};
