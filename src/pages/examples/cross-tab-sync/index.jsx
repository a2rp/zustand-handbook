import React from "react";
import { Styled } from "./styled";

/**
 * Example: Cross-Tab Sync
 * Goal: keep selected parts of the store in sync across browser tabs/windows.
 * Style: note-style code (non-live) you can copy into your app.
 */
const ExampleCrossTabSync = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Cross-Tab Sync</Styled.Title>
            <Styled.Subtitle>Sync selected slices between tabs with BroadcastChannel + storage events.</Styled.Subtitle>

            <Styled.Section>
                <h3>What this teaches</h3>
                <ul>
                    <li>Pick which slices to sync (don’t mirror the entire store).</li>
                    <li>Broadcast local changes with <code>BroadcastChannel</code> and fallback to <code>storage</code> events.</li>
                    <li>Prevent echo loops with a <code>tabId</code> + suppression flag.</li>
                    <li>Handle ordering with timestamps; debounce bursts of updates.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Decide the sync surface</h3>
                <p>Only sync state that should be shared between tabs (e.g., theme, auth, feature flags). Leave widget-local UI out.</p>
                <pre className="good">{`// stores/app.js (sketch)
import { create } from 'zustand';

export const useApp = create((set, get) => ({
  theme: { mode: 'dark' },
  auth:  { user: null },
  // other local UI that should NOT sync:
  ui:    { sidebarOpen: true, toast: null },

  setTheme: (mode) => set({ theme: { mode } }, false, 'theme/set'),
  login:    (user) => set({ auth: { user } }, false, 'auth/login'),
  logout:   () => set({ auth: { user: null } }, false, 'auth/logout'),
}));
// We will sync only { theme, auth }`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Transport helpers (BroadcastChannel + storage fallback)</h3>
                <p>Use a single channel name across tabs. Tag each message with a <code>tabId</code> and timestamp.</p>
                <pre className="good">{`// sync/transport.js
const CHANNEL = 'zustand-handbook-sync-v1';
export const tabId = crypto?.randomUUID?.() || String(Math.random());
export const now = () => Date.now();

export const bc = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel(CHANNEL)
  : null;

// Fallback: storage event (fires in other tabs)
export function emitStorage(msg) {
  try {
    localStorage.setItem(CHANNEL, JSON.stringify(msg));
    // optional: remove to keep LS clean (event already fired)
    localStorage.removeItem(CHANNEL);
  } catch {}
}

export function postMessage(payload) {
  const msg = { ...payload, tabId, t: now() };
  if (bc) bc.postMessage(msg);
  emitStorage(msg);
}

export function onMessage(cb) {
  bc?.addEventListener('message', (e) => cb(e.data));
  window.addEventListener('storage', (e) => {
    if (e.key !== CHANNEL || !e.newValue) return;
    try { cb(JSON.parse(e.newValue)); } catch {}
  });
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Wire it to Zustand (subscribe + apply)</h3>
                <p>Subscribe to only the syncable slice, broadcast patches, and apply incoming patches safely.</p>
                <pre className="good">{`// sync/glue.js
import { shallow } from 'zustand/shallow';
import { useApp } from '../stores/app';
import { onMessage, postMessage, tabId } from './transport';

// choose what to sync
const selectSyncable = (s) => ({ theme: s.theme, auth: s.auth });

let suppress = false; // prevents echo loops
let lastApplied = 0;  // ordering guard

// 1) Broadcast local changes (debounced)
let timer = null;
useApp.subscribe(
  selectSyncable,
  (next) => {
    if (suppress) return; // change came from remote
    clearTimeout(timer);
    const patch = next; // you could diff with previous if desired
    timer = setTimeout(() => {
      postMessage({ type: 'SYNC_PATCH', patch });
    }, 60); // debounce bursty updates
  },
  { equalityFn: shallow }
);

// 2) Apply remote patches
onMessage((msg) => {
  if (!msg || msg.tabId === tabId || msg.type !== 'SYNC_PATCH') return;
  if (msg.t <= lastApplied) return; // ignore out-of-order
  lastApplied = msg.t;

  suppress = true;
  useApp.setState(
    (s) => ({ ...s, ...msg.patch }), // shallow merge of syncable keys
    false,
    'sync/incoming'
  );
  suppress = false;
});`}</pre>
                <Styled.Callout>
                    This merges only the syncable keys. Keep complex reconciliation inside your own actions if needed.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Using with <code>persist</code></h3>
                <ul>
                    <li><b>Persist</b> gives you durable state on reload, but not live tab-to-tab updates.</li>
                    <li>Keep using the sync glue above for live updates; persist remains for reload/restore.</li>
                    <li>Partialize persisted state the same way you partialize your sync surface.</li>
                </ul>
                <pre className="note">{`persist(
  (set, get) => ({ /* ...app state... */ }),
  {
    name: 'app',
    partialize: (s) => ({ theme: s.theme, auth: s.auth }),
    version: 2,
    migrate: (persisted, v) => persisted, // add real migrations when shapes change
  }
)`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Pitfalls & tips</h3>
                <ul>
                    <li>Never sync ephemeral UI (like open modals) unless you truly want shared UI across tabs.</li>
                    <li>Include a <code>tabId</code> and suppress self-originated updates to avoid ping-pong.</li>
                    <li>Use timestamps to ignore out-of-order messages; keep a small <code>lastApplied</code>.</li>
                    <li>Debounce 30–120ms to coalesce bursts without feeling laggy.</li>
                    <li>Validate payload shape before applying (defensive parsing if messages could be spoofed).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Minimal “it works” checklist</h3>
                <ul>
                    <li>Open two tabs → change theme in one → the other tab updates.</li>
                    <li>Reload both tabs → persisted theme still matches.</li>
                    <li>Rapid toggles don’t flood → messages are debounced.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleCrossTabSync;
