import{d as s,j as e}from"./index-Bmr0gcqO.js";const r="var(--card, #111)",t="var(--text, #e9e9e9)",l="var(--muted, #b7b7b7)",n="var(--border, #222)",a="var(--accent, #22c55e)",i="var(--danger, #ef4444)",d="var(--radius, 16px)",c="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",o={Page:s.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${r};
        color: ${t};
        border: 1px solid ${n};
        border-radius: ${d};
        box-shadow: ${c};
        padding: 24px;
        line-height: 1.6;
    `,Title:s.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:s.p`
        margin: 0 0 18px 0;
        color: ${l};
    `,Section:s.section`
        border-top: 1px dashed ${n};
        padding-top: 16px;
        margin-top: 16px;

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${n};
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
            border: 1px dashed ${n};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.good {
            border: 1px solid ${a};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${i};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:s.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${n};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},g=()=>e.jsxs(o.Page,{children:[e.jsx(o.Title,{children:"Example — Toggle & Label"}),e.jsx(o.Subtitle,{children:"Smallest real-world pattern: a boolean with a readable label."}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"What you’ll learn"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Create a tiny store with a boolean flag."}),e.jsxs("li",{children:["Write a ",e.jsx("code",{children:"toggle()"})," action using the functional ",e.jsx("code",{children:"set()"})," form."]}),e.jsxs("li",{children:["Derive a label (",e.jsx("code",{children:'"On"'})," / ",e.jsx("code",{children:'"Off"'}),") without causing extra renders."]})]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"1) Store file (toggle store)"}),e.jsxs("p",{children:["Create a file like ",e.jsx("code",{children:"src/stores/toggle.js"}),":"]}),e.jsx("pre",{className:"good",children:`import { create } from 'zustand';

export const useToggle = create((set, get) => ({
  on: false,

  // actions
  turnOn:  () => set({ on: true },  false, 'toggle/turnOn'),
  turnOff: () => set({ on: false }, false, 'toggle/turnOff'),
  toggle:  () => set((s) => ({ on: !s.on }), false, 'toggle/toggle'),

  // sometimes you need to read current state
  setTo: (value) => set({ on: !!value }, false, 'toggle/setTo'),
}));`}),e.jsxs(o.Callout,{children:["If next state depends on previous (",e.jsx("code",{children:"!s.on"}),"), prefer the ",e.jsx("b",{children:"functional"})," form:",e.jsx("code",{children:"set((s) => …)"}),"."]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"2) Using it inside a component"}),e.jsx("pre",{className:"good",children:`import React, { useMemo } from 'react';
import { useToggle } from '../stores/toggle';

export default function ToggleCard() {
  // subscribe narrowly
  const on = useToggle((s) => s.on);
  const toggle = useToggle((s) => s.toggle);

  // derive a label locally (cheap compute)
  const label = useMemo(() => (on ? 'On' : 'Off'), [on]);

  return (
    <div>
      <p>Status: {label}</p>
      <button onClick={toggle}>{on ? 'Turn Off' : 'Turn On'}</button>
    </div>
  );
}`}),e.jsxs("p",{children:["Deriving ",e.jsx("code",{children:"label"})," in the component avoids storing duplicates in the store and keeps re-renders precise (the component only subscribes to ",e.jsx("code",{children:"on"}),")."]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"3) Alternative: select multiple values with a tuple + shallow"}),e.jsxs("p",{children:["If you prefer to return both values at once, use a tuple and ",e.jsx("code",{children:"shallow"}),":"]}),e.jsx("pre",{className:"note",children:`import { shallow } from 'zustand/shallow';

const [on, label] = useToggle(
  (s) => [s.on, s.on ? 'On' : 'Off'],
  shallow
);`}),e.jsxs("p",{children:["Tuples/objects without an equality function cause re-renders any time the reference changes. ",e.jsx("code",{children:"shallow"})," makes it compare individual items instead."]})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"4) Common gotchas"}),e.jsx("pre",{className:"bad",children:`// ❌ Over-selecting the whole store
const store = useToggle((s) => s); // more re-renders than needed`}),e.jsx("pre",{className:"good",children:`// ✅ Select narrowly
const on = useToggle((s) => s.on);`}),e.jsx("pre",{className:"bad",children:`// ❌ Returning a fresh object without shallow
const view = useToggle((s) => ({ on: s.on, label: s.on ? 'On' : 'Off' })); // new object each render`}),e.jsx("pre",{className:"good",children:`// ✅ Use a tuple + shallow OR derive in component
import { shallow } from 'zustand/shallow';
const [on, label] = useToggle((s) => [s.on, s.on ? 'On' : 'Off'], shallow);
// or: select 'on' and compute label with useMemo`})]}),e.jsxs(o.Section,{children:[e.jsx("h3",{children:"5) Extras you can try"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Expose ",e.jsx("code",{children:"turnOn()"})," and ",e.jsx("code",{children:"turnOff()"})," in the UI."]}),e.jsxs("li",{children:["Persist the flag with the ",e.jsx("code",{children:"persist"})," middleware (only the ",e.jsx("code",{children:"on"})," key)."]}),e.jsx("li",{children:"Render different icons for on/off and memoize them."})]}),e.jsx("pre",{className:"note",children:`// Persist sketch (partialize just 'on')
import { persist } from 'zustand/middleware';
export const useToggle = create(persist(
  (set) => ({ on: false, toggle: () => set((s) => ({ on: !s.on })) }),
  { name: 'toggle', partialize: (s) => ({ on: s.on }) }
));`})]})]});export{g as default};
