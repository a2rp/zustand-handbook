import React from "react";
import { Styled } from "./styled";

/**
 * Example: Clipboard + Share
 * Goal: copy/paste app state to/from the system clipboard and share it via the Web Share API.
 * Style: note-style examples (non-live). Copy these snippets into your app if you want.
 */
const ExampleClipboardShare = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — Clipboard &amp; Share</Styled.Title>
            <Styled.Subtitle>
                How I wire a small Zustand slice to copy/paste text and share it on supported devices.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What you’ll learn</h3>
                <ul>
                    <li>A tiny <code>clipboard</code> store with actions for copy, paste, and share.</li>
                    <li>Safe guards for browser support, permissions, and HTTPS/user-gesture rules.</li>
                    <li>Optional: auto-copy on state changes with <code>subscribeWithSelector</code>.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store sketch (clipboard slice)</h3>
                <p>Create something like <code>src/stores/clipboard.js</code>:</p>
                <pre className="good">{`import { create } from 'zustand';

export const useClipboard = create((set, get) => ({
  content: '',
  lastAction: null,    // 'copied' | 'pasted' | 'shared' | null
  error: null,
  loading: false,

  setContent: (text) => set({ content: text }, false, 'clipboard/setContent'),

  copyContent: async () => {
    const text = get().content ?? '';
    set({ loading: true, error: null }, false, 'clipboard/copyStart');
    try {
      if (!('clipboard' in navigator)) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      set({ loading: false, lastAction: 'copied' }, false, 'clipboard/copied');
    } catch (e) {
      set({ loading: false, error: String(e) }, false, 'clipboard/copyError');
    }
  },

  pasteFromClipboard: async () => {
    set({ loading: true, error: null }, false, 'clipboard/pasteStart');
    try {
      if (!('clipboard' in navigator)) throw new Error('Clipboard API unavailable');
      const pasted = await navigator.clipboard.readText();
      set({ loading: false, content: pasted, lastAction: 'pasted' }, false, 'clipboard/pasted');
    } catch (e) {
      set({ loading: false, error: String(e) }, false, 'clipboard/pasteError');
    }
  },

  shareContent: async () => {
    const text = get().content ?? '';
    set({ loading: true, error: null }, false, 'clipboard/shareStart');
    try {
      if (!('share' in navigator)) throw new Error('Web Share API unavailable');
      await navigator.share({ text, title: 'Shared from my app' });
      set({ loading: false, lastAction: 'shared' }, false, 'clipboard/shared');
    } catch (e) {
      // user-cancel typically throws; treat as non-fatal unless you want to surface it
      set({ loading: false, error: String(e) }, false, 'clipboard/shareError');
    }
  },
}));`}</pre>
                <Styled.Callout>
                    Clipboard <b>read</b> usually needs a user gesture, secure context (HTTPS), and permission.
                    Clipboard <b>write</b> also prefers user gestures. Always wrap in <code>try/catch</code>.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Component usage</h3>
                <p>Subscribe narrowly to avoid extra renders:</p>
                <pre className="good">{`import React, { useState } from 'react';
import { useClipboard } from '../stores/clipboard';

export default function ClipboardCard() {
  const content = useClipboard((s) => s.content);
  const loading = useClipboard((s) => s.loading);
  const error = useClipboard((s) => s.error);
  const setContent = useClipboard((s) => s.setContent);
  const copyContent = useClipboard((s) => s.copyContent);
  const pasteFromClipboard = useClipboard((s) => s.pasteFromClipboard);
  const shareContent = useClipboard((s) => s.shareContent);

  return (
    <div>
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type something to copy/share…"
      />
      <div>
        <button disabled={loading} onClick={copyContent}>Copy</button>
        <button disabled={loading} onClick={pasteFromClipboard}>Paste</button>
        <button disabled={loading} onClick={shareContent}>Share</button>
      </div>
      {error && <p style={{color:'tomato'}}>Error: {error}</p>}
    </div>
  );
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Fallback copy (last resort)</h3>
                <p>
                    If the Clipboard API isn’t available, you can attempt a legacy fallback. It’s{" "}
                    <b>deprecated</b> and may not work everywhere, but handy during development:
                </p>
                <pre className="note">{`function legacyCopy(text) {
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy'); // deprecated
    document.body.removeChild(el);
    if (!ok) throw new Error('execCommand copy failed');
  } catch (e) {
    throw e;
  }
}`}</pre>
                <p>Prefer the modern <code>navigator.clipboard.writeText</code> whenever possible.</p>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Auto-copy when state changes (optional)</h3>
                <p>
                    With <code>subscribeWithSelector</code> you can trigger side-effects outside React
                    when a specific slice changes:
                </p>
                <pre className="good">{`// store with subscribeWithSelector
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useClipboard = create(subscribeWithSelector((set, get) => ({
  content: '',
  setContent: (text) => set({ content: text }, false, 'clipboard/setContent'),
})));

// somewhere at app bootstrap (not inside a component render)
const unsub = useClipboard.subscribe(
  (s) => s.content,
  async (next, prev) => {
    if (next && next !== prev && 'clipboard' in navigator) {
      try { await navigator.clipboard.writeText(next); } catch {}
    }
  }
);
// later: unsub();`}</pre>
                <Styled.Callout>
                    Keep subscriptions at app start or inside effects with proper cleanup. Avoid
                    subscribing on every render.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Permissions &amp; platform quirks</h3>
                <ul>
                    <li>Must be on <b>HTTPS</b> (secure context). Localhost is okay during dev.</li>
                    <li>Most browsers require a <b>user gesture</b> (click, keypress) to read/write.</li>
                    <li>Reading may prompt a permission dialog or fail silently — handle errors.</li>
                    <li><code>navigator.share</code> works on many mobile browsers and some desktops; always feature-detect.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Small checklist</h3>
                <ul>
                    <li>Feature-detect <code>navigator.clipboard</code> and <code>navigator.share</code>.</li>
                    <li>Wrap calls in <code>try/catch</code>; show friendly errors.</li>
                    <li>Keep store actions small and named (<code>slice/action</code>).</li>
                    <li>Subscribe narrowly in components.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleClipboardShare;
