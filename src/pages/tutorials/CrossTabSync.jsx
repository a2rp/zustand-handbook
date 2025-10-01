import React from "react";
import { Styled } from "./styled";

const CrossTabSync = () => {
    return (
        <Styled.Page>
            <Styled.Title>Cross-tab Sync — High-level Ideas</Styled.Title>
            <Styled.Subtitle>
                Keep multiple browser tabs in agreement without weird overwrites.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this solves</h3>
                <ul>
                    <li>User opens your app in 2–3 tabs; state should stay in sync.</li>
                    <li>Edits in one tab should reflect in others (theme, cart, auth, etc.).</li>
                    <li>Conflicts should be predictable (last-write wins, versioning, or merge).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Three simple building blocks</h3>
                <ol>
                    <li><b>storage events</b> — fired when <code>localStorage</code> changes in other tabs.</li>
                    <li><b>BroadcastChannel</b> — pub/sub messages across tabs (modern, clean API).</li>
                    <li><b>persist middleware</b> — store state in storage so other tabs can read it.</li>
                </ol>
            </Styled.Section>

            <Styled.Section>
                <h3>Approach A — storage event (works almost everywhere)</h3>
                <pre className="good">{`// 1) Persist your store to localStorage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useApp = create(
  persist(
    (set, get) => ({
      theme: { mode: 'light' },
      toggleTheme: () => set((s) => ({ theme: { mode: s.theme.mode === 'light' ? 'dark' : 'light' } }), false, 'theme/toggle'),
      version: 0, // simple change counter
    }),
    { name: 'app', version: 1 } // storage key + optional migration version
  )
);

// 2) Listen for changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key !== 'app') return;
  try {
    const parsed = JSON.parse(e.newValue ?? 'null');
    // naive last-write-wins (compare version/time)
    // you can also directly call useApp.setState(parsed.state)
    useApp.setState(parsed?.state ?? {}, true); // replace or merge as needed
  } catch {}
});`}</pre>
                <p>
                    The <code>storage</code> event fires only in <b>other</b> tabs, not the one that wrote. It’s a
                    simple way to “pull” the latest state.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Approach B — BroadcastChannel (cleaner messaging)</h3>
                <pre className="good">{`// channel per app/slice
const ch = new BroadcastChannel('zustand-app');

useApp.subscribe(
  (state) => state, // whole state or a partial slice
  (next) => { ch.postMessage({ type: 'STATE', payload: next }); },
  { fireImmediately: false }
);

ch.onmessage = (ev) => {
  if (ev.data?.type !== 'STATE') return;
  // merge policy: last-write-wins or smarter merge
  useApp.setState(ev.data.payload, false);
};`}</pre>
                <p>
                    This avoids writing to storage on every change. You can still combine this with
                    <code>persist</code> for reload durability.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Approach C — custom persist storage (advanced)</h3>
                <p>
                    You can plug a custom storage that also notifies peers. Useful for IndexedDB or when
                    you want to attach metadata (timestamp, tabId).
                </p>
                <pre className="note">{`const tabId = Math.random().toString(36).slice(2);
const ch = new BroadcastChannel('zustand-app');

const notify = (state) => ch.postMessage({ type: 'STATE', from: tabId, ts: Date.now(), payload: state });

const customStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    try { const parsed = JSON.parse(value); notify(parsed?.state ?? {}); } catch {}
    return Promise.resolve();
  },
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

// then:
persist((set, get) => ({ /* ... */ }), { name: 'app', storage: customStorage });`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Conflict policies (pick one)</h3>
                <ul>
                    <li><b>Last-write wins:</b> compare <code>ts</code> (timestamp) and accept newer.</li>
                    <li><b>Field-wise merge:</b> merge objects; arrays need a custom strategy.</li>
                    <li><b>Versioning:</b> bump <code>version</code> on each action; if incoming version is higher, accept.</li>
                </ul>
                <pre className="note">{`// naive versioning sketch
const applyIncoming = (incoming) => {
  const current = useApp.getState();
  if ((incoming.version ?? 0) > (current.version ?? 0)) {
    useApp.setState(incoming, false);
  }
};`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>What I’d actually sync</h3>
                <ul>
                    <li><b>Theme</b>, <b>auth</b> (token/user), <b>cart</b>, <b>feature flags</b>.</li>
                    <li>Avoid sync for very noisy UI state (dragging, transient inputs).</li>
                    <li>Gate sensitive changes behind user intent (e.g., “Restore from other tab?”).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Pitfalls</h3>
                <ul>
                    <li>Infinite loops (tab A updates B which updates A). Use a <code>tabId</code> to ignore your own messages.</li>
                    <li>Storage event payload size limits. Keep state lean or use IndexedDB.</li>
                    <li>Race conditions. Prefer a monotonic <code>version</code> or <code>ts</code>.</li>
                </ul>
                <pre className="bad">{`// ❌ echoing your own broadcast
ch.onmessage = (ev) => useApp.setState(ev.data.payload);
// Fix:
ch.onmessage = (ev) => { if (ev.data.from !== tabId) useApp.setState(ev.data.payload); };`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Add <code>persist</code> for reloads; add <code>BroadcastChannel</code> for live sync.</li>
                    <li>Tag messages with <code>tabId</code> and <code>ts</code>/<code>version</code>.</li>
                    <li>Decide merge policy up front (LWW, merge, versioned).</li>
                    <li>Only sync meaningful slices; skip noisy UI state.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default CrossTabSync;
