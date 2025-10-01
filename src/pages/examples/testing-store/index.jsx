import React from "react";
import { Styled } from "./styled";

/**
 * Example: Testing the Store
 * Goal: unit-test actions (no React) + integration-test components (RTL),
 *       async thunks, and persisted stores — all beginner friendly.
 * Style: copy-paste notes (non-live) you can adapt to your project.
 */
const ExampleTestingStore = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Testing the Store</Styled.Title>
            <Styled.Subtitle>How I test Zustand stores (unit + React integration).</Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>Unit testing actions without React (pure store API).</li>
                    <li>Integration testing a component with React Testing Library.</li>
                    <li>Testing async thunks (start/success/error) with mocks.</li>
                    <li>Testing persisted stores with an in-memory storage.</li>
                    <li>Isolating state per test with a <i>store factory</i>.</li>
                </ul>
            </Styled.Section>

            {/* Setup */}
            <Styled.Section>
                <h3>Test setup (Vitest or Jest)</h3>
                <ul>
                    <li>Use a JSDOM environment for component tests.</li>
                    <li>Reset store state between tests to avoid leakage.</li>
                </ul>
                <pre className="note">{`// vitest.config.ts (sketch)
test: {
  environment: 'jsdom',
  setupFiles: ['./test/setup.ts']
}`}</pre>
                <pre className="note">{`// test/setup.ts (optional helpers)
import '@testing-library/jest-dom';`}</pre>
            </Styled.Section>

            {/* 1) Unit test actions */}
            <Styled.Section>
                <h3>1) Unit test actions (no React)</h3>
                <p>Test the store in isolation using its API: <code>getState()</code>, <code>setState()</code>, <code>subscribe()</code>.</p>
                <pre className="good">{`// src/stores/counter.ts (or .js)
import { create } from 'zustand';

export const initialCounter = { count: 0 };

export const useCounter = create((set, get) => ({
  ...initialCounter,
  increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) }), false, 'counter/decrement'),
  reset: () => set(initialCounter, false, 'counter/reset'),
}));`}</pre>

                <pre className="good">{`// tests/counter.test.ts
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
});`}</pre>

                <Styled.Callout>
                    Use <code>setState(initial, true)</code> in <code>beforeEach</code> to reset the store deeply (the
                    second param tells Zustand to replace rather than merge).
                </Styled.Callout>
            </Styled.Section>

            {/* 2) Integration test with RTL */}
            <Styled.Section>
                <h3>2) Integration test with a component (RTL)</h3>
                <pre className="good">{`// src/components/CounterCard.tsx
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
}`}</pre>
                <pre className="good">{`// tests/CounterCard.test.tsx
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
});`}</pre>
            </Styled.Section>

            {/* 3) Async thunks */}
            <Styled.Section>
                <h3>3) Testing async thunks</h3>
                <pre className="good">{`// src/stores/users.ts
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
});`}</pre>
            </Styled.Section>

            {/* 4) Persisted store */}
            <Styled.Section>
                <h3>4) Testing persisted stores (in-memory storage)</h3>
                <p>Swap browser storage with a memory implementation during tests.</p>
                <pre className="good">{`// src/stores/session.ts
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
);`}</pre>

                <pre className="good">{`// tests/session.test.ts
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
});`}</pre>

                <Styled.Callout>
                    <code>useStore.persist</code> API lets you tweak persist options at runtime.
                    Use a memory storage to keep tests fast and deterministic.
                </Styled.Callout>
            </Styled.Section>

            {/* 5) Store factory per test */}
            <Styled.Section>
                <h3>5) Store factory per test (full isolation)</h3>
                <p>Create a fresh store instance for each test with the vanilla API.</p>
                <pre className="good">{`// src/testing/makeCounterStore.ts
import { createStore } from 'zustand/vanilla';

export function makeCounterStore(initial = 0) {
  return createStore((set) => ({
    count: initial,
    inc: () => set((s: any) => ({ count: s.count + 1 })),
  }));
}`}</pre>

                <pre className="good">{`// tests/makeCounterStore.test.ts
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
});`}</pre>
            </Styled.Section>

            {/* Checklist */}
            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Reset store state in <code>beforeEach</code> with <code>setState(initial, true)</code>.</li>
                    <li>Prefer unit tests for logic; use RTL for rendering & events.</li>
                    <li>Mock network with <code>vi.spyOn(global, 'fetch')</code> (or MSW for advanced flows).</li>
                    <li>For persist, swap storage with an in-memory implementation.</li>
                    <li>For tricky cases, generate a fresh store via a factory per test.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleTestingStore;
