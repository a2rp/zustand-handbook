import{j as e}from"./index-Gt8sd0pi.js";import{S as s}from"./styled-B1sUtMju.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"subscribe vs subscribeWithSelector"}),e.jsx(s.Subtitle,{children:"Picking between the React hook selector and imperative subscriptions."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"TL;DR"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"useStore(selector)"}),": for UI. Re-renders the component when the selected value changes."]}),e.jsxs("li",{children:[e.jsx("b",{children:"store.subscribe(listener)"}),": for non-UI side effects or code outside React. Runs a callback; doesn’t re-render."]}),e.jsxs("li",{children:[e.jsx("b",{children:"subscribeWithSelector"})," (middleware): lets you subscribe to a ",e.jsx("i",{children:"slice"})," with an equality function and options."]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"useStore(selector) — the normal React way"}),e.jsx("pre",{className:"good",children:`// Component reads only what it needs; re-renders on change
const count = useCounter((s) => s.count);
const inc   = useCounter((s) => s.increment);`}),e.jsx("p",{children:"Use this for rendering UI. It’s simple and efficient when you pick small slices."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"store.subscribe — imperative listener (no re-render)"}),e.jsxs("p",{children:["Useful for logging, analytics, syncing to storage manually, or reacting to state",e.jsx("i",{children:"outside"})," React components."]}),e.jsx("pre",{className:"good",children:`// Basic subscribe (no middleware)
import { useCounterStore } from '../stores/counter'; // the store function from create()
const unsub = useCounterStore.subscribe((state, prev) => {
  if (state.count !== prev.count) {
    console.log('count changed:', state.count);
  }
});
// later (cleanup)
unsub();`}),e.jsx("pre",{className:"note",children:`// In React: setup/cleanup inside useEffect
useEffect(() => {
  const unsub = useCounterStore.subscribe((s, p) => {
    if (s.count !== p.count) {
      window.localStorage.setItem('lastCount', String(s.count));
    }
  });
  return unsub; // important
}, []);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"subscribeWithSelector — precise subscriptions"}),e.jsxs("p",{children:["Add the middleware to make ",e.jsx("code",{children:"subscribe"})," selector-aware and pass an equality function or options."]}),e.jsx("pre",{className:"good",children:`// store: create with middleware
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useCart = create(subscribeWithSelector((set, get) => ({
  items: [],
  taxRate: 0.1,
  add: (it) => set((s) => ({ items: [...s.items, it] }), false, 'cart/add'),
})));`}),e.jsx("pre",{className:"good",children:`// subscribe to a slice + equality + options
import { shallow } from 'zustand/shallow';

const unsub = useCart.subscribe(
  (s) => [s.items.length, s.taxRate],    // selector (tuple)
  ([len, tax], [prevLen, prevTax]) => {  // listener
    console.log('cart changed → items:', len, 'tax:', tax);
  },
  { equalityFn: shallow, fireImmediately: true }
);

// later
unsub();`}),e.jsxs("p",{children:["This fires only when the selected slice changes according to the equality function (here, ",e.jsx("code",{children:"shallow"}),"), and it can fire immediately once on setup."]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Practical patterns I use"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Debounced side effects"})," for chatty slices:",e.jsx("pre",{className:"note",children:`const unsub = useSearch.subscribe(
  (s) => s.query,
  debounce((q) => analytics.track('search', { q }), 300),
  { fireImmediately: false }
);`})]}),e.jsxs("li",{children:[e.jsx("b",{children:"Drive services without UI re-renders"}),":",e.jsx("pre",{className:"note",children:`// keep URL in sync with filters
useEffect(() => {
  const unsub = useFilters.subscribe(
    (s) => s.serialized, // string
    (val) => window.history.replaceState(null, '', '?f=' + encodeURIComponent(val)),
    { fireImmediately: true }
  );
  return unsub;
}, []);`})]}),e.jsxs("li",{children:[e.jsx("b",{children:"One-off reactions"})," with ",e.jsx("code",{children:"fireImmediately"})," to initialize:",e.jsx("pre",{className:"note",children:`const unsub = useAuth.subscribe(
  (s) => s.user?.id ?? null,
  (id) => id && preloadUserStuff(id),
  { fireImmediately: true }
);`})]})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Common mistakes (and fixes)"}),e.jsx("pre",{className:"bad",children:`// ❌ Forgetting to unsubscribe
useEffect(() => {
  useStore.subscribe(() => { /* ... */ });
}, []);`}),e.jsx("pre",{className:"good",children:`// ✅ Always cleanup
useEffect(() => {
  const unsub = useStore.subscribe(() => { /* ... */ });
  return unsub;
}, []);`}),e.jsx("pre",{className:"bad",children:`// ❌ Using subscribe to drive UI updates
useStore.subscribe((s) => rerenderManually(s));`}),e.jsx("pre",{className:"good",children:`// ✅ Use the hook for UI
const value = useStore((s) => s.value);`}),e.jsx("pre",{className:"bad",children:`// ❌ Heavy work inside the subscriber (runs on every relevant change)
useStore.subscribe((s) => doExpensiveThing(s.bigList));`}),e.jsx("pre",{className:"good",children:`// ✅ Throttle/debounce or move heavy work to a worker/memo
useStore.subscribe((s) => throttleSync(s.bigList), { fireImmediately: true });`}),e.jsx("pre",{className:"bad",children:`// ❌ Mutating state inside a subscribe listener triggered by the same mutation (risk of loops)
useStore.subscribe((s) => { useStore.setState({ triggered: true }) });`}),e.jsx("pre",{className:"good",children:`// ✅ Guard, or schedule outside the tick
useStore.subscribe((s, p) => {
  if (!p.triggered && s.needsTrigger) queueMicrotask(() => useStore.setState({ triggered: true }));
});`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Quick checklist"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Rendering UI? → ",e.jsx("code",{children:"useStore(selector)"}),"."]}),e.jsxs("li",{children:["Non-UI side effects or usage outside React? → ",e.jsx("code",{children:"subscribe"}),"."]}),e.jsxs("li",{children:["Need to listen to a specific slice? → add ",e.jsx("code",{children:"subscribeWithSelector"}),"."]}),e.jsxs("li",{children:["Always unsubscribe; consider ",e.jsx("code",{children:"fireImmediately"})," for initial sync."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"shallow"})," (or a custom equality) for tuples/objects."]})]})]})]});export{i as default};
