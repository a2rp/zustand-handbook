import{d as r,j as e}from"./index-CpvfKB5t.js";const o="var(--card, #111)",i="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",t="var(--border, #222)",c="var(--accent, #22c55e)",a="var(--danger, #ef4444)",l="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${o};
        color: ${i};
        border: 1px solid ${t};
        border-radius: ${l};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:r.section`
        border-top: 1px dashed ${t};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${t};
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
            border: 1px dashed ${t};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${c};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${a};
            background: rgba(239, 68, 68, 0.08);
        }
    `},p=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — Subscribe + Selector"}),e.jsxs(s.Subtitle,{children:["Select in components with ",e.jsx("code",{children:"useStore(selector)"}),". For non-React listeners or effect-style taps, use ",e.jsx("code",{children:"subscribeWithSelector"}),"."]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Store sketch (with subscribeWithSelector)"}),e.jsx("pre",{className:"good",children:`// src/stores/cart.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useCart = create(
  subscribeWithSelector((set, get) => ({
    items: [],

    add: (item) =>
      set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),

    remove: (id) =>
      set((s) => ({ items: s.items.filter(it => it.id !== id) }), false, 'cart/remove'),

    clear: () => set({ items: [] }, false, 'cart/clear'),
  }))
);`}),e.jsxs("p",{children:[e.jsx("b",{children:"Why this middleware?"})," It lets us subscribe with a selector, equality function, and get precise change notifications ",e.jsx("i",{children:"outside"})," React components."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Selecting in React components"}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';
import { useCart } from '../stores/cart';

function CartSummary() {
  // subscribe only to what you need
  const [count, ids] = useCart((s) => [s.items.length, s.items.map(it => it.id)], shallow);
  const add = useCart((s) => s.add);

  return (
    <div>
      <p>Items: {count}</p>
      <button onClick={() => add({ id: crypto.randomUUID?.() || Date.now(), title: 'Apple', price: 1 })}>
        Add Apple
      </button>
    </div>
  );
}`}),e.jsxs("p",{children:["Returning tuples/objects? Pass ",e.jsx("code",{children:"shallow"})," so React re-renders only when those values actually change."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Subscribing outside React (or in an effect)"}),e.jsx("p",{children:"Great for logging, analytics, or syncing other systems."}),e.jsx("pre",{className:"note",children:`// plain JS (outside components)
import { useCart } from '../stores/cart';

const unsubscribe = useCart.subscribe(
  (s) => s.items.length,                      // selector
  (len, prevLen) => {                         // listener
    console.log('cart size', prevLen, '→', len);
  },
  { equalityFn: Object.is, fireImmediately: true }
);

// later, stop listening:
unsubscribe();`}),e.jsx("pre",{className:"good",children:`// inside a React component effect
import { useEffect } from 'react';
import { useCart } from '../stores/cart';

function CartLogger() {
  useEffect(() => {
    const unsub = useCart.subscribe(
      (s) => s.items.length,
      (len, prev) => console.log('[CartLogger] size', prev, '→', len),
      { equalityFn: Object.is, fireImmediately: true }
    );
    return () => unsub();
  }, []);
  return null;
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Common mistakes"}),e.jsx("pre",{className:"bad",children:`// ❌ subscribe(selector, listener) without subscribeWithSelector middleware
// store.subscribe will only support (listener) in vanilla mode, not selector+listener.`}),e.jsx("pre",{className:"good",children:"// ✅ wrap store with subscribeWithSelector middleware (see store sketch above)"}),e.jsx("pre",{className:"bad",children:`// ❌ Selecting entire store in components
const all = useCart((s) => s); // causes extra re-renders`}),e.jsx("pre",{className:"good",children:`// ✅ Select the smallest slice you need
const count = useCart((s) => s.items.length);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["In components: ",e.jsx("code",{children:"useStore(selector)"})," + ",e.jsx("code",{children:"shallow"})," when returning tuples/objects."]}),e.jsxs("li",{children:["Outside React or for effects: ",e.jsx("code",{children:"subscribeWithSelector"})," then ",e.jsx("code",{children:"store.subscribe(selector, listener, opts)"}),"."]}),e.jsxs("li",{children:["Always ",e.jsx("code",{children:"unsubscribe()"})," when done."]}),e.jsxs("li",{children:["Name actions (",e.jsx("code",{children:"slice/action"}),") to keep devtools traces clean."]})]})]})]});export{p as default};
