import React from "react";
import { NavLink } from "react-router-dom";
import { Styled } from "./styled";

const About = () => {
    return (
        <Styled.Page>
            <Styled.Title>Zustand Handbook — About</Styled.Title>
            <Styled.Subtitle>
                A practical set of tutorials, notes, glossary, and examples to learn and
                use Zustand in real React apps.
            </Styled.Subtitle>

            <Styled.Section>
                <h3>What this is</h3>
                <p>
                    I’m collecting everything I actually use when teaching or setting up
                    Zustand in projects: a clear learning path, quick notes you can copy,
                    and small, focused examples. Nothing fancy—just the good parts.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Who this is for</h3>
                <ul>
                    <li>Beginners starting from zero with state management.</li>
                    <li>React devs who want a lightweight alternative to heavy setups.</li>
                    <li>Teams that prefer simple patterns with good discipline.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>What you’ll find here</h3>
                <ul>
                    <li>
                        <NavLink className="link" to="/tutorials/intro">Tutorials</NavLink> —
                        short lessons that build up from the basics to solid patterns.
                    </li>
                    <li>
                        <NavLink className="link" to="/notes/api-quick-ref">Notes</NavLink> —
                        quick references, checklists, and troubleshooting.
                    </li>
                    <li>
                        <NavLink className="link" to="/glossary">Glossary</NavLink> —
                        A–Z of terms (selectors, shallow, persist, migrations…).
                    </li>
                    <li>
                        <NavLink className="link" to="/examples/counter">Examples</NavLink> —
                        note-style walkthroughs you can paste into your app.
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>How to navigate</h3>
                <ul>
                    <li>
                        Use the left sidebar search (press <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd>)
                        to filter topics instantly.
                    </li>
                    <li>Press <kbd>Enter</kbd> in the search to open the first match.</li>
                    <li>Press <kbd>Esc</kbd> to clear the search field.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Conventions in examples</h3>
                <ul>
                    <li>Actions named as <code>slice/action</code> for clean devtools traces.</li>
                    <li>
                        Prefer functional updates: <code>set((s) =&gt; (…))</code> when next state
                        depends on previous.
                    </li>
                    <li>Subscribe narrowly using selectors; use <code>shallow</code> for tuples/objects.</li>
                    <li>Derive values in components/selectors unless the compute is expensive.</li>
                    <li>Persist with partialization + versioned migrations (when needed).</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Project links</h3>
                <ul>
                    <li>
                        Live:{" "}
                        <a className="ext" href="https://a2rp.github.io/zustand-handbook/home" target="_blank" rel="noreferrer">
                            a2rp.github.io/zustand-handbook
                        </a>
                    </li>
                    <li>
                        Repo:{" "}
                        <a className="ext" href="https://github.com/a2rp/zustand-handbook" target="_blank" rel="noreferrer">
                            github.com/a2rp/zustand-handbook
                        </a>
                    </li>
                    <li>
                        Zustand:{" "}
                        <a className="ext" href="https://github.com/pmndrs/zustand" target="_blank" rel="noreferrer">
                            github.com/pmndrs/zustand
                        </a>
                    </li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Acknowledgments</h3>
                <p>
                    Thanks to the Zustand maintainers and the React community for keeping
                    state management approachable.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Feedback & contributions</h3>
                <p>
                    Found a mistake or want to add an example? Open an issue or PR on the
                    repository. Clear, small examples help everyone.
                </p>
            </Styled.Section>
        </Styled.Page>
    );
};

export default About;
