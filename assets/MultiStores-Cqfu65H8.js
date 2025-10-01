import{j as e}from"./index-D0NhHHfM.js";import{S as s}from"./styled-9asSRIYq.js";const i=()=>e.jsxs(s.Page,{children:[e.jsx(s.Title,{children:"Multi-stores — Boundaries & Coupling"}),e.jsx(s.Subtitle,{children:"How I split state by feature, keep boundaries clean, and make stores talk without tangling them."}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"When I use multiple stores"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Features are independent (auth, cart, ui, notifications)."}),e.jsx("li",{children:"Teams own different areas and ship at different speeds."}),e.jsx("li",{children:"I want smaller bundles (code-split a feature + its store)."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Typical layout I use"}),e.jsx("pre",{className:"good",children:`src/
  stores/
    auth.js       // user, login/logout
    cart.js       // items, add/remove/clear
    ui.js         // theme, sidebar, toasts
  features/
    auth/...
    cart/...
    ...`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Example stores (small & focused)"}),e.jsx("pre",{className:"good",children:`// stores/auth.js
import { create } from 'zustand';
export const useAuth = create((set) => ({
  user: null,
  login: (user) => set({ user }, false, 'auth/login'),
  logout: () => set({ user: null }, false, 'auth/logout'),
}));

// stores/cart.js
import { create } from 'zustand';
export const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
  clear: () => set({ items: [] }, false, 'cart/clear'),
}));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Using more than one store in a component"}),e.jsx("p",{children:"I subscribe narrowly to each store. Each selector re-renders independently."}),e.jsx("pre",{className:"note",children:`// CartHeader.jsx
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

const user = useAuth((s) => s.user);
const count = useCart((s) => s.items.length);

return <p>{user ? 'Hi ' + user.name : 'Guest'} · Items: {count}</p>;`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cross-store reads (safe pattern)"}),e.jsxs("p",{children:["If I need a one-off read, I use the store’s ",e.jsx("code",{children:".getState()"})," method. I avoid keeping references; I read, use, and move on."]}),e.jsx("pre",{className:"note",children:`// services/checkout.js
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

export async function checkout() {
  const { user } = useAuth.getState();    // one-off read
  const { items } = useCart.getState();
  if (!user) throw new Error('Login required');
  // ... call API with { userId: user.id, items }
}`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Cross-store writes: avoid tight coupling"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Don’t"})," call one store’s action directly from inside another store’s factory."]}),e.jsxs("li",{children:[e.jsx("b",{children:"Do"})," orchestrate from a small ",e.jsx("i",{children:"service"})," function or a top-level effect."]})]}),e.jsx("pre",{className:"bad",children:`// ❌ inside auth store — creates a hard dependency on cart
logout: () => { useCart.getState().clear(); set({ user: null }) }`}),e.jsx("pre",{className:"good",children:`// ✅ orchestrate in a service where dependencies are explicit
export function logoutFlow() {
  useCart.getState().clear();
  useAuth.getState().logout();
}`})]}),e.jsxs(s.Section,{children:[e.jsxs("h3",{children:["Reacting to changes with ",e.jsx("code",{children:"subscribe"})]}),e.jsx("p",{children:"Sometimes I want an automatic reaction (e.g., clear cart when user logs out). I set up a subscription once during app bootstrap."}),e.jsx("pre",{className:"good",children:`// AppBootstrap.jsx (run once)
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

useEffect(() => {
  const unsubscribe = useAuth.subscribe(
    (s) => s.user,                    // selector
    (user, prev) => {
      if (!user && prev) useCart.getState().clear(); // user just logged out
    }
  );
  return unsubscribe;
}, []);`}),e.jsx(s.Callout,{children:"Subscriptions live outside React render. Remember to unsubscribe. Keep logic small."})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Derived values across stores"}),e.jsxs("p",{children:["I derive in the component (with ",e.jsx("code",{children:"useMemo"}),") when it combines data from multiple stores. No extra coupling and easy to test."]}),e.jsx("pre",{className:"note",children:`const user = useAuth((s) => s.user);
const items = useCart((s) => s.items);
const summary = useMemo(() => ({
  userName: user?.name ?? 'Guest',
  totalItems: items.length
}), [user, items]);`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Persist & devtools per store"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Each store can opt-in to ",e.jsx("code",{children:"persist"})," with its own storage key."]}),e.jsxs("li",{children:["I name actions as ",e.jsx("code",{children:"slice/action"})," so devtools stays readable."]})]}),e.jsx("pre",{className:"note",children:`// with persist (sketch)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useCart = create(persist(
  (set) => ({ items: [], add: (it) => set((s) => ({ items: [...s.items, it] })) }),
  { name: 'cart-v1' }  // unique key
));`})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Guardrails I follow"}),e.jsxs("ul",{children:[e.jsx("li",{children:"No circular imports between stores."}),e.jsx("li",{children:"Stores expose actions; coordination happens in a tiny service/effect."}),e.jsx("li",{children:"Components subscribe narrowly; avoid “select entire store”."}),e.jsx("li",{children:"Prefer deriving in components when mixing data from multiple stores."})]})]}),e.jsxs(s.Section,{children:[e.jsx("h3",{children:"Checklist"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Split by feature; keep each store small."}),e.jsx("li",{children:"Orchestrate cross-store flows in services/effects, not inside store factories."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"subscribe"})," for simple reactions; remember to unsubscribe."]}),e.jsx("li",{children:"Persist per store with unique keys and plan migrations."}),e.jsxs("li",{children:["Name actions like ",e.jsx("code",{children:"auth/login"}),", ",e.jsx("code",{children:"cart/add"})," for devtools."]})]})]})]});export{i as default};
