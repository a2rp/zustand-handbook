import ScrollToTop from './components/ScrollToTop';
import { Styled } from './App.styled';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { MdMenuOpen } from 'react-icons/md';
import { Box, CircularProgress } from '@mui/material';
import Footer from './components/footer';
import NavList from './components/navList';

import ar_logo from "./assets/ar_logo.png";

// ✅ Toasts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Pages */
const Home = lazy(() => import('./pages/home'));
const NotFound = lazy(() => import('./pages/notFound'));

const TutorialsIntro = lazy(() => import('./pages/tutorials/intro'));
const TutorialsStoreChoices = lazy(() => import('./pages/tutorials/storeChoices'));
const TutorialsSelectors = lazy(() => import('./pages/tutorials/selectors'));
const TutorialsSetAndGet = lazy(() => import('./pages/tutorials/setAndGet'));



const App = () => {
    const [displayNav, setDisplayNav] = useState(true);
    const handleDisplayNav = () => setDisplayNav(prev => !prev);

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Styled.LogoLinkWrapper>
                    <Styled.NavLinkWrapper onClick={handleDisplayNav}>
                        <MdMenuOpen size={20} />
                    </Styled.NavLinkWrapper>
                    <NavLink to="/" title="Zustand Handbook">Zustand Handbook</NavLink>
                </Styled.LogoLinkWrapper>
                <Styled.Heading>
                    <a
                        href="https://www.ashishranjan.net"
                        target="_blank"
                        title="Ashish Ranjan"
                        rel="noreferrer"
                    >
                        <img src={ar_logo} alt="ar_logo" />
                    </a>
                </Styled.Heading>
            </Styled.Header>

            <Styled.Main>
                <Styled.NavWrapper className={`${displayNav ? "active" : ""}`}>
                    <div className="navInner">
                        <NavList />
                    </div>
                </Styled.NavWrapper>

                <Styled.ContentWrapper id="scroll-root" data-scroll-root>
                    <Styled.RoutesWrapper>
                        <Suspense
                            fallback={
                                <Box
                                    sx={{
                                        width: "100vw", height: "100vh",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            }
                        >
                            <Routes>
                                {/* Redirect root -> /home */}
                                <Route path="/" element={<Navigate to="/home" replace />} />
                                <Route path="/home" element={<Home />} />

                                {/* Tutorials */}
                                {/* <Route path="/tutorials" element={<Stub title="Tutorials" desc="All tutorial lessons index." />} /> */}
                                <Route path="/tutorials/intro" element={<TutorialsIntro />} />
                                <Route path="/tutorials/store-choices" element={<TutorialsStoreChoices />} />
                                <Route path="/tutorials/selectors" element={<TutorialsSelectors />} />
                                <Route path="/tutorials/set-and-get" element={<TutorialsSetAndGet />} />

                                <Route path="/tutorials/derived-state" element={<Stub title="Derived State — Computed Values" />} />
                                <Route path="/tutorials/async-flows" element={<Stub title="Async Flows — Fetching & Thunks" />} />
                                <Route path="/tutorials/middleware-persist" element={<Stub title="Middleware: persist — Basics" />} />
                                <Route path="/tutorials/persist-migrations" element={<Stub title="Persist Migrations — Versions & Partialization" />} />
                                <Route path="/tutorials/middleware-devtools" element={<Stub title="Middleware: devtools — Time-Travel & Trace" />} />
                                <Route path="/tutorials/subscribe-vs-selector" element={<Stub title="subscribe vs subscribeWithSelector" />} />
                                <Route path="/tutorials/slices-pattern" element={<Stub title="Slices Pattern — Store Factories" />} />
                                <Route path="/tutorials/multi-stores" element={<Stub title="Multi-stores — Boundaries & Coupling" />} />
                                <Route path="/tutorials/performance" element={<Stub title="Performance — Over-selecting & Identity" />} />
                                <Route path="/tutorials/ui-patterns" element={<Stub title="UI Patterns — Forms, Wizards, Dialogs" />} />
                                <Route path="/tutorials/undo-redo" element={<Stub title="Undo / Redo — Temporal State" />} />
                                <Route path="/tutorials/cross-tab-sync" element={<Stub title="Cross-tab Sync — High-level Ideas" />} />
                                <Route path="/tutorials/ssr-notes" element={<Stub title="SSR Notes — Next.js Theory" />} />
                                <Route path="/tutorials/testing-mindset" element={<Stub title="Testing Mindset — What & Why" />} />
                                <Route path="/tutorials/typescript-readiness" element={<Stub title="TypeScript Readiness — Typing the Store" />} />
                                <Route path="/tutorials/production-checklist" element={<Stub title="Production Checklist — Anti-patterns" />} />

                                {/* Notes */}
                                <Route path="/notes" element={<Stub title="Notes" desc="Notes index & quick references." />} />
                                <Route path="/notes/api-quick-ref" element={<Stub title="API Quick Ref — create/set/get/subscribe" />} />
                                <Route path="/notes/middlewares-overview" element={<Stub title="Middlewares Overview — persist/devtools/subscribeWithSelector/immer" />} />
                                <Route path="/notes/selectors-equality" element={<Stub title="Selectors & Equality — shallow & custom comparators" />} />
                                <Route path="/notes/state-modeling" element={<Stub title="State Modeling — Slices, Normalization, Factories" />} />
                                <Route path="/notes/performance-gotchas" element={<Stub title="Performance Gotchas — Identity Traps" />} />
                                <Route path="/notes/async-patterns" element={<Stub title="Async Patterns — Loading, Error, Optimistic" />} />
                                <Route path="/notes/persist-checklist" element={<Stub title="Persist Checklist — Migrations & Storage" />} />
                                <Route path="/notes/testing-checklist" element={<Stub title="Testing Checklist — What/Where/How" />} />
                                <Route path="/notes/typescript-map" element={<Stub title="TypeScript Map — Typing Store & Selectors" />} />
                                <Route path="/notes/troubleshooting" element={<Stub title="Troubleshooting — Common Errors & Fixes" />} />
                                <Route path="/notes/cheatsheet-print" element={<Stub title="Cheatsheet (Print) — One Pager" />} />
                                <Route path="/notes/zustand-vs-others" element={<Stub title="Zustand vs Others — When to Pick What" />} />

                                {/* Glossary */}
                                <Route path="/glossary" element={<Stub title="Glossary" desc="A–Z terms for quick lookups." />} />
                                {/* Optional future: <Route path="/glossary/:term" element={<GlossaryTerm />} /> */}

                                {/* Examples (placeholders for later) */}
                                <Route path="/examples" element={<Stub title="Examples" desc="Live demos coming later." />} />
                                <Route path="/examples/counter" element={<Stub title="Example — Counter (Coming Soon)" />} />
                                <Route path="/examples/persist-theme" element={<Stub title="Example — Persist Theme (Coming Soon)" />} />
                                <Route path="/examples/devtools-todos" element={<Stub title="Example — Devtools Todos (Coming Soon)" />} />
                                <Route path="/examples/subscribe-selector" element={<Stub title="Example — Subscribe + Selector (Coming Soon)" />} />
                                <Route path="/examples/undo-redo" element={<Stub title="Example — Undo/Redo (Coming Soon)" />} />

                                {/* Meta */}
                                <Route path="/changelog" element={<Stub title="Changelog" desc="Release notes & last updated." />} />
                                <Route path="/about" element={<Stub title="About" desc="Project overview, credits, how to use." />} />

                                {/* 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </Styled.RoutesWrapper>

                    <Styled.Footer>
                        <Footer />
                    </Styled.Footer>
                </Styled.ContentWrapper>
            </Styled.Main>

            <ScrollToTop />

            {/* ✅ Toasts live here (rendered once for the whole app) */}
            <ToastContainer position="bottom-center" autoClose={4000} newestOnTop />
        </Styled.Wrapper>
    );
};

export default App;


// ---- Generic stub while content is being written ----
const Stub = ({ title, desc }) => (
    <div style={{ padding: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 800 }}>{title}</h2>
        <p style={{ opacity: 0.85, marginTop: 8 }}>{desc || "Content coming soon."}</p>
    </div>
);