import React from "react";
import { Styled } from "./styled";

/**
 * Example: subscribeWithSelector (outside React)
 * Goal: listen to precise state changes for logging, analytics, storage sync, etc.
 * Notes only (non-live) you can copy into your app.
 */
const ExampleSubscribeWithSelector = () => {
    return (
        <Styled.Page>
            <Styled.Title>Example — subscribeWithSelector</Styled.Title>
            <Styled.Subtitle>
                Listen to just the part of the store you care about and run side effects.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>When I use this</h3>
                <ul>
                    <li>Logging and analytics without tying code to components.</li>
                    <li>Syncing a slice to <code>localStorage</code> or another tab.</li>
                    <li>Triggering toasts/notifications when a condition becomes true.</li>
                    <li>Integrating non-React code that needs store updates.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>1) Store setup</h3>
                <p>
                    Wrap the store with <code>subscribeWithSelector</code> so subscriptions can use selectors and equality.
                </p>
                <pre className="good">{`// stores/app.js
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
);`}</pre>
                <Styled.Callout>
                    Without <code>subscribeWithSelector</code>, <code>store.subscribe</code> only listens to the entire state.
                </Styled.Callout>
            </Styled.Section>

            <Styled.Section>
                <h3>2) Basic subscription (single value)</h3>
                <p>In any module (not just React components):</p>
                <pre className="good">{`// logger.js
import { useApp } from '../stores/app';

const unsubscribe = useApp.subscribe(
  (s) => s.count,                             // selector
  (count, prevCount) => {                     // listener(selected, previous)
    console.log('count changed:', prevCount, '→', count);
  },
  { equalityFn: Object.is }                   // optional (default is Object.is)
);

// later when you no longer need it:
unsubscribe();`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>3) Multiple values with shallow equality</h3>
                <pre className="good">{`import { shallow } from 'zustand/shallow';
import { useApp } from '../stores/app';

const unsub = useApp.subscribe(
  (s) => [s.user?.id, s.user?.role],          // tuple
  ([id, role], [prevId, prevRole]) => {
    console.log('user changed:', prevId, '→', id, '| role:', prevRole, '→', role);
  },
  { equalityFn: shallow }
);`}</pre>
                <p>
                    With tuples/objects, pass <code>shallow</code> so the listener only fires when values actually change.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>4) Fire once immediately</h3>
                <pre className="note">{`useApp.subscribe(
  (s) => s.user,
  (user) => {
    console.log('initial user (or changed):', user);
  },
  { fireImmediately: true }
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>5) Condition triggers (threshold/edge detection)</h3>
                <p>Subscribe to a boolean selector and react only on transitions.</p>
                <pre className="good">{`// when count crosses 10 for the first time
const unsub = useApp.subscribe(
  (s) => s.count >= 10,              // boolean selector
  (isHigh, wasHigh) => {
    if (isHigh && !wasHigh) {
      // fire once on crossing the boundary
      console.log('🎉 Reached 10!');
      // show toast, log analytics, etc.
    }
  }
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>6) Sync a slice to storage</h3>
                <pre className="good">{`// keep settings in localStorage
import { shallow } from 'zustand/shallow';

const unsub = useApp.subscribe(
  (s) => s.settings,
  (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  },
  { equalityFn: shallow, fireImmediately: true }
);`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>7) Using it inside React (cleanup)</h3>
                <pre className="good">{`import React from 'react';
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
}`}</pre>
            </Styled.Section>

            <Styled.Section>
                <h3>Pitfalls I avoid</h3>
                <ul>
                    <li>
                        Returning fresh objects/arrays from the selector without equality → listener fires on every update.
                        Use primitives or pass <code>shallow</code>.
                    </li>
                    <li>
                        Forgetting to unsubscribe in React effects → memory leaks. Always return the cleanup function.
                    </li>
                    <li>
                        Doing heavy work directly in the listener → throttle/debounce if needed.
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Checklist</h3>
                <ul>
                    <li>Wrap the store with <code>subscribeWithSelector</code>.</li>
                    <li>Pick a stable selector (primitive/tuple + <code>shallow</code>).</li>
                    <li>Add <code>fireImmediately</code> when you need initial sync.</li>
                    <li>Always keep an <code>unsubscribe()</code> path.</li>
                    <li>Name actions (<code>slice/action</code>) for clearer devtools traces.</li>
                </ul>
            </Styled.Section>
        </Styled.Page>
    );
};

export default ExampleSubscribeWithSelector;
