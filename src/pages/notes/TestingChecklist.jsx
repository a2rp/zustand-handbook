import React from "react";
import { Styled } from "./styled";

const TestingChecklist = () => {
    return (
        <Styled.Page>
            <Styled.Title>Testing Checklist — What / Where / How</Styled.Title>
            <Styled.Subtitle>
                A practical list for testing Zustand stores and the UI that uses them.
            </Styled.Subtitle>

            {/* Goals */}
            <Styled.Section>
                <h3>Goals</h3>
                <ul>
                    <li>Confident actions and selectors.</li>
                    <li>Async flows (start → success/error) behave predictably.</li>
                    <li>UI re-renders only when selected state changes.</li>
                    <li>Persisted state and migrations don’t break on upgrades.</li>
                </ul>
            </Styled.Section>

            {/* What to test */}
            <Styled.Section>
                <h3>What I test</h3>
                <ul>
                    <li><b>Store actions:</b> given initial state → after action → expected state.</li>
                    <li><b>Selectors:</b> choose the right slice; equality prevents extra re-renders.</li>
                    <li><b>Async thunks:</b> start/success/error transitions and data mapping.</li>
                    <li><b>Components:</b> render expected UI for selected state; events call actions.</li>
                    <li><b>Persist & migrations:</b> version bump loads and transforms data correctly.</li>
                </ul>
            </Styled.Section>

            {/* Setup pattern */}
            <Styled.Section>
                <h3>Setup I like (fresh store per test)</h3>
                <pre className="good">{`// store/counter.js
import { create } from 'zustand';

export const makeCounterStore = (initial = { count: 0 }) =>
  create((set, get) => ({
    ...initial,
    increment: () => set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
    reset: () => set({ count: 0 }, false, 'counter/reset'),
  }));`}</pre>
                <pre className="good">{`// tests/counter.test.ts (Jest/Vitest)
import { makeCounterStore } from '../store/counter';

test('increment adds 1', () => {
  const useCounter = makeCounterStore({ count: 1 });
  useCounter.getState().increment();
  expect(useCounter.getState().count).toBe(2);
});

test('reset goes back to 0', () => {
  const useCounter = makeCounterStore({ count: 5 });
  useCounter.getState().reset();
  expect(useCounter.getState().count).toBe(0);
});`}</pre>
                <Styled.Callout>
                    Fresh store per test keeps cases isolated and avoids hidden coupling.
                </Styled.Callout>
            </Styled.Section>

            {/* Selectors & rerenders */}
            <Styled.Section>
                <h3>Selectors &amp; re-renders</h3>
                <p>I verify that a component only re-renders when its selected value changes.</p>
                <pre className="note">{`// Component (example)
function CountLabel({ useStore }) {
  const count = useStore((s) => s.count);
  return <span data-testid="c">{count}</span>;
}`}</pre>
                <pre className="good">{`// Test: only count changes should re-render
import { render, screen } from '@testing-library/react';
import React from 'react';

test('CountLabel re-renders when count changes', () => {
  const useCounter = makeCounterStore({ count: 0 });
  const { rerender } = render(<CountLabel useStore={useCounter} />);
  expect(screen.getByTestId('c').textContent).toBe('0');

  // unrelated state update
  useCounter.setState({ other: 'x' });
  rerender(<CountLabel useStore={useCounter} />);
  expect(screen.getByTestId('c').textContent).toBe('0'); // unchanged

  // relevant update
  useCounter.getState().increment();
  rerender(<CountLabel useStore={useCounter} />);
  expect(screen.getByTestId('c').textContent).toBe('1');
});`}</pre>
            </Styled.Section>

            {/* Async flows */}
            <Styled.Section>
                <h3>Async flows (start → success/error)</h3>
                <pre className="good">{`// store/users.js
export const makeUsersStore = (api) =>
  create((set, get) => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: async () => {
      set({ loading: true, error: null }, false, 'users/fetchStart');
      try {
        const data = await api.list();
        set({ loading: false, users: data }, false, 'users/fetchSuccess');
      } catch (e) {
        set({ loading: false, error: String(e) }, false, 'users/fetchError');
      }
    },
  }));`}</pre>
                <pre className="good">{`// tests/users.test.ts
test('fetchUsers: success & error paths', async () => {
  const apiOk = { list: () => Promise.resolve([{ id: 1, name: 'A' }]) };
  const apiFail = { list: () => Promise.reject('boom') };

  // success
  const okStore = makeUsersStore(apiOk);
  await okStore.getState().fetchUsers();
  expect(okStore.getState()).toMatchObject({ loading: false, error: null, users: [{ id: 1, name: 'A' }] });

  // error
  const failStore = makeUsersStore(apiFail);
  await failStore.getState().fetchUsers();
  expect(failStore.getState().loading).toBe(false);
  expect(failStore.getState().error).toBe('boom');
});`}</pre>
                <Styled.Callout>
                    I keep <code>loading</code> and <code>error</code> shapes consistent across slices.
                </Styled.Callout>
            </Styled.Section>

            {/* Optimistic update */}
            <Styled.Section>
                <h3>Optimistic update + rollback</h3>
                <pre className="note">{`// store/items.js (sketch)
export const makeItemsStore = (api) =>
  create((set, get) => ({
    items: [],
    updateTitle: async (id, title) => {
      const prev = get().items;
      set({ items: prev.map(it => it.id === id ? { ...it, title } : it) }, false, 'items/optimistic');
      try {
        await api.update(id, { title });
      } catch (e) {
        set({ items: prev }, false, 'items/rollback');
      }
    },
  }));`}</pre>
                <p>I assert both the optimistic state and the rollback on error.</p>
            </Styled.Section>

            {/* Persist & migrations */}
            <Styled.Section>
                <h3>Persist &amp; migrations</h3>
                <pre className="good">{`// store/persisted.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initial = { version: 2, theme: 'dark' };

export const makePersistedStore = (storage = localStorage) =>
  create(persist(
    (set) => ({
      ...initial,
      toggle: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' }), false, 'theme/toggle'),
    }),
    {
      name: 'app',
      version: 2,
      storage: createJSONStorage(() => storage),
      migrate: (state, v) => {
        if (v < 2) return { ...state, version: 2, theme: state.theme ?? 'dark' };
        return state;
      },
      partialize: (s) => ({ version: s.version, theme: s.theme }),
    }
  ));`}</pre>
                <pre className="good">{`// tests/persisted.test.ts (mock storage)
function makeMemoryStorage() {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
}

test('loads from storage and migrates', async () => {
  const mem = makeMemoryStorage();
  // simulate old data (version 1, no theme)
  mem.setItem('app', JSON.stringify({ state: { version: 1 }, version: 1 }));
  const usePersisted = makePersistedStore(mem);
  // first read will hydrate; small delay might be needed in real apps
  expect(usePersisted.getState().version).toBe(2);
  expect(['dark','light']).toContain(usePersisted.getState().theme);
});`}</pre>
                <Styled.Callout>
                    I test <b>partialize</b> keeps storage minimal and <b>migrate</b> fixes old shapes.
                </Styled.Callout>
            </Styled.Section>

            {/* Component test sketch */}
            <Styled.Section>
                <h3>Component tests (React Testing Library)</h3>
                <pre className="note">{`// Component uses injected store for testability
function CounterView({ useStore }) {
  const count = useStore((s) => s.count);
  const inc = useStore((s) => s.increment);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={inc}>+1</button>
    </div>
  );
}`}</pre>
                <pre className="good">{`import { render, screen, fireEvent } from '@testing-library/react';

test('click increments', () => {
  const useCounter = makeCounterStore({ count: 0 });
  render(<CounterView useStore={useCounter} />);
  fireEvent.click(screen.getByText('+1'));
  expect(screen.getByTestId('count').textContent).toBe('1');
});`}</pre>
            </Styled.Section>

            {/* Reset between tests */}
            <Styled.Section>
                <h3>Reset between tests</h3>
                <ul>
                    <li>Fresh store per test (factory) is the simplest path.</li>
                    <li>If using a singleton store, expose <code>reset()</code> or call <code>setState(initial, true)</code>.</li>
                    <li>In Vitest/Jest, module isolation also helps (<code>vi.resetModules()</code>).</li>
                </ul>
                <pre className="note">{`afterEach(() => {
  // if singleton:
  // useApp.setState(initialState, true);
});`}</pre>
            </Styled.Section>

            {/* Final checklist */}
            <Styled.Section>
                <h3>Quick checklist</h3>
                <ul>
                    <li>Actions: initial → action → expected state.</li>
                    <li>Selectors: only relevant updates trigger re-renders.</li>
                    <li>Async: start/success/error states asserted.</li>
                    <li>Optimistic: snapshot + rollback tested.</li>
                    <li>Persist: partialize + migrate verified with mock storage.</li>
                    <li>Components: render + event → store change.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default TestingChecklist;
