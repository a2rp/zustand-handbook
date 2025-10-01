import{d as t,j as e}from"./index-Bmr0gcqO.js";const a="var(--card, #111)",s="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",o="var(--border, #222)",i="var(--accent, #22c55e)",l="var(--danger, #ef4444)",c="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",r={Page:t.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
        color: ${s};
        border: 1px solid ${o};
        border-radius: ${c};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:t.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:t.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:t.section`
        border-top: 1px dashed ${o};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${o};
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
            border: 1px dashed ${o};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${i};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${l};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:t.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${o};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(r.Page,{children:[e.jsx(r.Title,{children:"Example — Clipboard & Share"}),e.jsx(r.Subtitle,{children:"How I wire a small Zustand slice to copy/paste text and share it on supported devices."}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["A tiny ",e.jsx("code",{children:"clipboard"})," store with actions for copy, paste, and share."]}),e.jsx("li",{children:"Safe guards for browser support, permissions, and HTTPS/user-gesture rules."}),e.jsxs("li",{children:["Optional: auto-copy on state changes with ",e.jsx("code",{children:"subscribeWithSelector"}),"."]})]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"1) Store sketch (clipboard slice)"}),e.jsxs("p",{children:["Create something like ",e.jsx("code",{children:"src/stores/clipboard.js"}),":"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

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
}));`}),e.jsxs(r.Callout,{children:["Clipboard ",e.jsx("b",{children:"read"})," usually needs a user gesture, secure context (HTTPS), and permission. Clipboard ",e.jsx("b",{children:"write"})," also prefers user gestures. Always wrap in ",e.jsx("code",{children:"try/catch"}),"."]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"2) Component usage"}),e.jsx("p",{children:"Subscribe narrowly to avoid extra renders:"}),e.jsx("pre",{className:"good",children:`import React, { useState } from 'react';
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
}`})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"3) Fallback copy (last resort)"}),e.jsxs("p",{children:["If the Clipboard API isn’t available, you can attempt a legacy fallback. It’s"," ",e.jsx("b",{children:"deprecated"})," and may not work everywhere, but handy during development:"]}),e.jsx("pre",{className:"note",children:`function legacyCopy(text) {
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
}`}),e.jsxs("p",{children:["Prefer the modern ",e.jsx("code",{children:"navigator.clipboard.writeText"})," whenever possible."]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"4) Auto-copy when state changes (optional)"}),e.jsxs("p",{children:["With ",e.jsx("code",{children:"subscribeWithSelector"})," you can trigger side-effects outside React when a specific slice changes:"]}),e.jsx("pre",{className:"good",children:`// store with subscribeWithSelector
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
// later: unsub();`}),e.jsx(r.Callout,{children:"Keep subscriptions at app start or inside effects with proper cleanup. Avoid subscribing on every render."})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"5) Permissions & platform quirks"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Must be on ",e.jsx("b",{children:"HTTPS"})," (secure context). Localhost is okay during dev."]}),e.jsxs("li",{children:["Most browsers require a ",e.jsx("b",{children:"user gesture"})," (click, keypress) to read/write."]}),e.jsx("li",{children:"Reading may prompt a permission dialog or fail silently — handle errors."}),e.jsxs("li",{children:[e.jsx("code",{children:"navigator.share"})," works on many mobile browsers and some desktops; always feature-detect."]})]})]}),e.jsxs(r.Section,{children:[e.jsx("h3",{children:"6) Small checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Feature-detect ",e.jsx("code",{children:"navigator.clipboard"})," and ",e.jsx("code",{children:"navigator.share"}),"."]}),e.jsxs("li",{children:["Wrap calls in ",e.jsx("code",{children:"try/catch"}),"; show friendly errors."]}),e.jsxs("li",{children:["Keep store actions small and named (",e.jsx("code",{children:"slice/action"}),")."]}),e.jsx("li",{children:"Subscribe narrowly in components."})]})]})]});export{h as default};
