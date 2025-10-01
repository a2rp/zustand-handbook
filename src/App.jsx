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

const TutorialsIntro = lazy(() => import('./pages/tutorials/Intro'));
const TutorialsStoreChoices = lazy(() => import('./pages/tutorials/StoreChoices'));
const TutorialsSelectors = lazy(() => import('./pages/tutorials/Selectors'));
const TutorialsSetAndGet = lazy(() => import('./pages/tutorials/SetAndGet'));
const TutorialsDerivedState = lazy(() => import('./pages/tutorials/DerivedState'));
const TutorialsAsyncFlows = lazy(() => import('./pages/tutorials/AsyncFlows'));
const TutorialsMiddlewarePersist = lazy(() => import('./pages/tutorials/MiddlewarePersist'));
const TutorialsPersistMigrations = lazy(() => import('./pages/tutorials/PersistMigrations'));
const TutorialsMiddlewareDevtools = lazy(() => import('./pages/tutorials/MiddlewareDevtools'));
const TutorialsSubscribeVsSelector = lazy(() => import('./pages/tutorials/SubscribeVsSelector'));
const TutorialsSlicesPattern = lazy(() => import('./pages/tutorials/SlicesPattern'));
const TutorialsMultiStores = lazy(() => import('./pages/tutorials/MultiStores'));
const TutorialsPerformance = lazy(() => import('./pages/tutorials/Performance'));
const TutorialsUiPatterns = lazy(() => import('./pages/tutorials/UiPatterns'));
const TutorialsUndoRedo = lazy(() => import('./pages/tutorials/UndoRedo'));
const TutorialsCrossTabSync = lazy(() => import('./pages/tutorials/CrossTabSync'));
const TutorialsSsrNotes = lazy(() => import('./pages/tutorials/SsrNotes'));
const TutorialsTestingMindset = lazy(() => import('./pages/tutorials/TestingMindset'));
const TutorialsTypescriptReadiness = lazy(() => import('./pages/tutorials/TypescriptReadiness'));
const TutorialsProductionChecklist = lazy(() => import('./pages/tutorials/ProductionChecklist'));

const NotesApiQuickRef = lazy(() => import('./pages/notes/ApiQuickRef'));
const NotesMiddlewaresOverview = lazy(() => import('./pages/notes/MiddlewaresOverview'));
const NotesSelectorsEquality = lazy(() => import('./pages/notes/SelectorsEquality'));
const NotesStateModeling = lazy(() => import('./pages/notes/StateModeling'));
const NotesPerformanceGotchas = lazy(() => import('./pages/notes/PerformanceGotchas'));
const NotesAsyncPatterns = lazy(() => import('./pages/notes/AsyncPatterns'));
const NotesPersistChecklist = lazy(() => import('./pages/notes/PersistChecklist'));
const NotesTestingChecklist = lazy(() => import('./pages/notes/TestingChecklist'));
const NotesTypescriptMap = lazy(() => import('./pages/notes/TypescriptMap'));
const NotesTroubleshooting = lazy(() => import('./pages/notes/Troubleshooting'));
const NotesCheatsheetPrint = lazy(() => import('./pages/notes/CheatsheetPrint'));
const NotesZustandVsOthers = lazy(() => import('./pages/notes/zustandVsOthers'));

const Glossary = lazy(() => import('./pages/glossary'));

const ExampleCounter = lazy(() => import('./pages/examples/counter'));
const ExamplePersistTheme = lazy(() => import('./pages/examples/persist-theme'));
const ExampleDevtoolsTodos = lazy(() => import('./pages/examples/devtools-todos'));
const ExampleSubscribeSelector = lazy(() => import('./pages/examples/subscribe-selector'));
const ExampleUndoRedo = lazy(() => import('./pages/examples/undo-redo'));

const ExampleToggleLabel = lazy(() => import('./pages/examples/toggle-label'));
const ExampleCounterShallow = lazy(() => import('./pages/examples/counter-shallow'));
const ExampleSelectorIdentity = lazy(() => import('./pages/examples/selector-identity'));
const ExampleDerivedBadge = lazy(() => import('./pages/examples/derived-badge'));

const ExampleFetchUsers = lazy(() => import('./pages/examples/fetch-users'));
const ExampleSearchAbortDedupe = lazy(() => import('./pages/examples/search-abort-dedupe'));
const ExampleOptimisticRename = lazy(() => import('./pages/examples/optimistic-rename'));
const ExamplePaginatedList = lazy(() => import('./pages/examples/paginated-list'));

const ExamplePersistPartialize = lazy(() => import('./pages/examples/persist-partialize'));
const ExampleSubscribeWithSelector = lazy(() => import('./pages/examples/subscribe-with-selector'));
const ExampleDevtoolsActions = lazy(() => import('./pages/examples/devtools-actions'));

const ExampleSlicesPattern = lazy(() => import('./pages/examples/slices-pattern'));
const ExampleWizardFactory = lazy(() => import('./pages/examples/wizard-factory'));
const ExampleModalManager = lazy(() => import('./pages/examples/modal-manager'));
const ExampleToastQueue = lazy(() => import('./pages/examples/toast-queue'));
const ExampleFormValidation = lazy(() => import('./pages/examples/form-validation'));
const ExampleCartTotals = lazy(() => import('./pages/examples/cart-totals'));
const ExampleResetPatterns = lazy(() => import('./pages/examples/reset-patterns'));
const ExamplePerfOverselect = lazy(() => import('./pages/examples/perf-overselect'));

const ExampleCrossTabSync = lazy(() => import('./pages/examples/cross-tab-sync'));
const ExampleSsrNotes = lazy(() => import('./pages/examples/ssr-notes'));
const ExampleTestingStore = lazy(() => import('./pages/examples/testing-store'));
const ExampleTypescriptBasic = lazy(() => import('./pages/examples/typescript-basic'));

// // (Optional minis)
const ExampleSidebar = lazy(() => import('./pages/examples/sidebar'));
const ExampleThemeSystem = lazy(() => import('./pages/examples/theme-system'));
const ExampleClipboardShare = lazy(() => import('./pages/examples/clipboard-share'));

const About = lazy(() => import('./pages/about'));


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

                                <>
                                    {/* Tutorials */}
                                    {/* <Route path="/tutorials" element={<Stub title="Tutorials" desc="All tutorial lessons index." />} /> */}
                                    <Route path="/tutorials/intro" element={<TutorialsIntro />} />
                                    <Route path="/tutorials/store-choices" element={<TutorialsStoreChoices />} />
                                    <Route path="/tutorials/selectors" element={<TutorialsSelectors />} />
                                    <Route path="/tutorials/set-and-get" element={<TutorialsSetAndGet />} />
                                    <Route path="/tutorials/derived-state" element={<TutorialsDerivedState />} />
                                    <Route path="/tutorials/async-flows" element={<TutorialsAsyncFlows />} />
                                    <Route path="/tutorials/middleware-persist" element={<TutorialsMiddlewarePersist />} />
                                    <Route path="/tutorials/persist-migrations" element={<TutorialsPersistMigrations />} />
                                    <Route path="/tutorials/middleware-devtools" element={<TutorialsMiddlewareDevtools />} />
                                    <Route path="/tutorials/subscribe-vs-selector" element={<TutorialsSubscribeVsSelector />} />
                                    <Route path="/tutorials/slices-pattern" element={<TutorialsSlicesPattern />} />
                                    <Route path="/tutorials/multi-stores" element={<TutorialsMultiStores />} />
                                    <Route path="/tutorials/performance" element={<TutorialsPerformance />} />
                                    <Route path="/tutorials/ui-patterns" element={<TutorialsUiPatterns />} />
                                    <Route path="/tutorials/undo-redo" element={<TutorialsUndoRedo />} />
                                    <Route path="/tutorials/cross-tab-sync" element={<TutorialsCrossTabSync />} />
                                    <Route path="/tutorials/ssr-notes" element={<TutorialsSsrNotes />} />
                                    <Route path="/tutorials/testing-mindset" element={<TutorialsTestingMindset />} />
                                    <Route path="/tutorials/typescript-readiness" element={<TutorialsTypescriptReadiness />} />
                                    <Route path="/tutorials/production-checklist" element={<TutorialsProductionChecklist />} />
                                </>


                                <>
                                    {/* Notes */}
                                    {/* <Route path="/notes" element={<Stub title="Notes" desc="Notes index & quick references." />} /> */}
                                    <Route path="/notes/api-quick-ref" element={<NotesApiQuickRef />} />
                                    <Route path="/notes/middlewares-overview" element={<NotesMiddlewaresOverview />} />
                                    <Route path="/notes/selectors-equality" element={<NotesSelectorsEquality />} />
                                    <Route path="/notes/state-modeling" element={<NotesStateModeling />} />
                                    <Route path="/notes/performance-gotchas" element={<NotesPerformanceGotchas />} />
                                    <Route path="/notes/async-patterns" element={<NotesAsyncPatterns />} />
                                    <Route path="/notes/persist-checklist" element={<NotesPersistChecklist />} />
                                    <Route path="/notes/testing-checklist" element={<NotesTestingChecklist />} />
                                    <Route path="/notes/typescript-map" element={<NotesTypescriptMap />} />
                                    <Route path="/notes/troubleshooting" element={<NotesTroubleshooting />} />
                                    <Route path="/notes/cheatsheet-print" element={<NotesCheatsheetPrint />} />
                                    <Route path="/notes/zustand-vs-others" element={<NotesZustandVsOthers />} />
                                </>

                                <>
                                    {/* Glossary */}
                                    <Route path="/glossary" element={<Glossary />} />
                                </>

                                {/* Examples (placeholders for later) */}
                                <Route path="/examples/counter" element={<ExampleCounter />} />
                                <Route path="/examples/persist-theme" element={<ExamplePersistTheme />} />
                                <Route path="/examples/devtools-todos" element={<ExampleDevtoolsTodos />} />
                                <Route path="/examples/subscribe-selector" element={<ExampleSubscribeSelector />} />
                                <Route path="/examples/undo-redo" element={<ExampleUndoRedo />} />

                                <Route path="/examples/toggle-label" element={<ExampleToggleLabel />} />
                                <Route path="/examples/counter-shallow" element={<ExampleCounterShallow />} />
                                <Route path="/examples/selector-identity" element={<ExampleSelectorIdentity />} />
                                <Route path="/examples/derived-badge" element={<ExampleDerivedBadge />} />

                                <Route path="/examples/fetch-users" element={<ExampleFetchUsers />} />
                                <Route path="/examples/search-abort-dedupe" element={<ExampleSearchAbortDedupe />} />
                                <Route path="/examples/optimistic-rename" element={<ExampleOptimisticRename />} />
                                <Route path="/examples/paginated-list" element={<ExamplePaginatedList />} />

                                <Route path="/examples/persist-partialize" element={<ExamplePersistPartialize />} />
                                <Route path="/examples/subscribe-with-selector" element={<ExampleSubscribeWithSelector />} />
                                <Route path="/examples/devtools-actions" element={<ExampleDevtoolsActions />} />

                                <Route path="/examples/slices-pattern" element={<ExampleSlicesPattern />} />
                                <Route path="/examples/wizard-factory" element={<ExampleWizardFactory />} />
                                <Route path="/examples/modal-manager" element={<ExampleModalManager />} />
                                <Route path="/examples/toast-queue" element={<ExampleToastQueue />} />
                                <Route path="/examples/form-validation" element={<ExampleFormValidation />} />
                                <Route path="/examples/cart-totals" element={<ExampleCartTotals />} />
                                <Route path="/examples/reset-patterns" element={<ExampleResetPatterns />} />
                                <Route path="/examples/perf-overselect" element={<ExamplePerfOverselect />} />

                                <Route path="/examples/cross-tab-sync" element={<ExampleCrossTabSync />} />
                                <Route path="/examples/ssr-notes" element={<ExampleSsrNotes />} />
                                <Route path="/examples/testing-store" element={<ExampleTestingStore />} />
                                <Route path="/examples/typescript-basic" element={<ExampleTypescriptBasic />} />

                                {/* Optional minis */}
                                <Route path="/examples/sidebar" element={<ExampleSidebar />} />
                                <Route path="/examples/theme-system" element={<ExampleThemeSystem />} />
                                <Route path="/examples/clipboard-share" element={<ExampleClipboardShare />} />

                                {/* Meta */}
                                <Route path="/about" element={<About />} />

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