import{d as o,j as e}from"./index-Gt8sd0pi.js";const t="var(--card, #111)",i="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",r="var(--border, #222)",c="var(--accent, #22c55e)",l="var(--danger, #ef4444)",a="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:o.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${t};
        color: ${i};
        border: 1px solid ${r};
        border-radius: ${a};
        box-shadow: ${d};
        padding: 24px;
        line-height: 1.6;
    `,Title:o.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:o.p`
        margin: 0 0 18px 0;
        color: ${n};
    `,Section:o.section`
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
            border: 1px solid ${c};
            background: rgba(34, 197, 94, 0.08);
        }
        pre.bad {
            border: 1px solid ${l};
            background: rgba(239, 68, 68, 0.08);
        }
    `,Callout:o.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `},h=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Example — subscribeWithSelector"}),e.jsx(s.Subtitle,{children:"Listen to just the part of the store you care about and run side effects."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"When I use this"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Logging and analytics without tying code to components."}),e.jsxs("li",{children:["Syncing a slice to ",e.jsx("code",{children:"localStorage"})," or another tab."]}),e.jsx("li",{children:"Triggering toasts/notifications when a condition becomes true."}),e.jsx("li",{children:"Integrating non-React code that needs store updates."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"1) Store setup"}),e.jsxs("p",{children:["Wrap the store with ",e.jsx("code",{children:"subscribeWithSelector"})," so subscriptions can use selectors and equality."]}),e.jsx("pre",{className:"good",children:`// stores/app.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useApp = create(
  subscribeWithSelector((set, get) => ({
    count: 0,
    user: null,
    settings: { theme: 'dark', locale: 'en' },

    inc: () => set((s) => ({ count: s.count + 1 }), false, 'counter/inc'),
    setUser: (user) => set({ user }, false, 'auth/setUser'),
    setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } }), false, 'settings/theme'),
  }))
);`}),e.jsxs(s.Callout,{children:["Without ",e.jsx("code",{children:"subscribeWithSelector"}),", ",e.jsx("code",{children:"store.subscribe"})," only listens to the entire state."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"2) Basic subscription (single value)"}),e.jsx("p",{children:"In any module (not just React components):"}),e.jsx("pre",{className:"good",children:`// logger.js
import { useApp } from '../stores/app';

const unsubscribe = useApp.subscribe(
  (s) => s.count,                             // selector
  (count, prevCount) => {                     // listener(selected, previous)
    console.log('count changed:', prevCount, '→', count);
  },
  { equalityFn: Object.is }                   // optional (default is Object.is)
);

// later when you no longer need it:
unsubscribe();`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"3) Multiple values with shallow equality"}),e.jsx("pre",{className:"good",children:`import { shallow } from 'zustand/shallow';
import { useApp } from '../stores/app';

const unsub = useApp.subscribe(
  (s) => [s.user?.id, s.user?.role],          // tuple
  ([id, role], [prevId, prevRole]) => {
    console.log('user changed:', prevId, '→', id, '| role:', prevRole, '→', role);
  },
  { equalityFn: shallow }
);`}),e.jsxs("p",{children:["With tuples/objects, pass ",e.jsx("code",{children:"shallow"})," so the listener only fires when values actually change."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"4) Fire once immediately"}),e.jsx("pre",{className:"note",children:`useApp.subscribe(
  (s) => s.user,
  (user) => {
    console.log('initial user (or changed):', user);
  },
  { fireImmediately: true }
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"5) Condition triggers (threshold/edge detection)"}),e.jsx("p",{children:"Subscribe to a boolean selector and react only on transitions."}),e.jsx("pre",{className:"good",children:`// when count crosses 10 for the first time
const unsub = useApp.subscribe(
  (s) => s.count >= 10,              // boolean selector
  (isHigh, wasHigh) => {
    if (isHigh && !wasHigh) {
      // fire once on crossing the boundary
      console.log('🎉 Reached 10!');
      // show toast, log analytics, etc.
    }
  }
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"6) Sync a slice to storage"}),e.jsx("pre",{className:"good",children:`// keep settings in localStorage
import { shallow } from 'zustand/shallow';

const unsub = useApp.subscribe(
  (s) => s.settings,
  (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  },
  { equalityFn: shallow, fireImmediately: true }
);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"7) Using it inside React (cleanup)"}),e.jsx("pre",{className:"good",children:`import React from 'react';
import { useApp } from '../stores/app';

export function CountWatcher() {
  React.useEffect(() => {
    const unsub = useApp.subscribe(
      (s) => s.count,
      (c) => console.log('count in effect:', c)
    );
    return () => unsub(); // cleanup on unmount
  }, []);
  return null;
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Pitfalls I avoid"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Returning fresh objects/arrays from the selector without equality → listener fires on every update. Use primitives or pass ",e.jsx("code",{children:"shallow"}),"."]}),e.jsx("li",{children:"Forgetting to unsubscribe in React effects → memory leaks. Always return the cleanup function."}),e.jsx("li",{children:"Doing heavy work directly in the listener → throttle/debounce if needed."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Wrap the store with ",e.jsx("code",{children:"subscribeWithSelector"}),"."]}),e.jsxs("li",{children:["Pick a stable selector (primitive/tuple + ",e.jsx("code",{children:"shallow"}),")."]}),e.jsxs("li",{children:["Add ",e.jsx("code",{children:"fireImmediately"})," when you need initial sync."]}),e.jsxs("li",{children:["Always keep an ",e.jsx("code",{children:"unsubscribe()"})," path."]}),e.jsxs("li",{children:["Name actions (",e.jsx("code",{children:"slice/action"}),") for clearer devtools traces."]})]})]})]});export{h as default};
