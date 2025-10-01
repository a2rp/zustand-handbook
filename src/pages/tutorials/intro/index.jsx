import React from "react";
import { Styled } from "./styled";

const TutorialIntro = () => {
    return (
        <Styled.Page>
            <Styled.Title>Zustand 101 & Mental Model</Styled.Title>
            <Styled.Subtitle>Read-first tutorial. No code demo yet.</Styled.Subtitle>

            <Styled.Section>
                <h3>Outcome</h3>
                <ul>
                    <li>Think of a store as the single source of truth.</li>
                    <li>Understand what <code>set</code> and <code>get</code> do.</li>
                    <li>Know why selectors matter and when equality checks help.</li>
                    <li>See where middlewares like <code>persist</code> and <code>devtools</code> fit.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Why this matters</h3>
                <p>
                    As React apps grow, prop-drilling and ad-hoc context state quickly become brittle.
                    Zustand keeps the API minimal but gives you precise control over what each component
                    subscribes to, which keeps re-renders low and state logic clean.
                </p>
            </Styled.Section>

            <Styled.Section>
                <h3>Core ideas</h3>
                <ul>
                    <li><b>Store:</b> Plain JS object shaped for your domain + helper functions.</li>
                    <li><b>Selectors:</b> Components subscribe to only the slice they need (performance).</li>
                    <li><b>Equality:</b> Controls <i>when</i> a component re-renders for a selected value.</li>
                    <li><b>Updates:</b> Always via <code>set()</code>; prefer named actions for traceability.</li>
                    <li><b>Middlewares:</b> Add features (persist/devtools/subscribeWithSelector) orthogonally.</li>
                    <li><b>Immutable thinking:</b> Create new references; avoid mutating existing state.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Conceptual flow</h3>
                <ol>
                    <li>Design store shape by feature (slices) — not by components.</li>
                    <li>Inside a component, select the exact value(s) needed.</li>
                    <li>Update state via action functions that call <code>set()</code>.</li>
                    <li>Attach middlewares to gain persistence, devtools, or precise subscriptions.</li>
                    <li>Scale by splitting slices or creating store factories as features grow.</li>
                </ol>
            </Styled.Section>

            <Styled.Section>
                <h3>Common pitfalls</h3>
                <ul>
                    <li>Selecting the entire store → unnecessary re-renders.</li>
                    <li>Returning new object/array literals directly from selectors (identity flips).</li>
                    <li>Using persist without planning versioned migrations.</li>
                    <li>Unnamed actions → weak traces in devtools.</li>
                </ul>
            </Styled.Section>

            <Styled.Section>
                <h3>Recap</h3>
                <ul>
                    <li>Minimal API, maximum control.</li>
                    <li>Selectors + equality = render discipline.</li>
                    <li>Middlewares add features without coupling.</li>
                    <li>Start small; scale with slices and factories.</li>
                </ul>
            </Styled.Section>

            <Styled.Note>
                <b>Coming next:</b> Global vs per-component stores (theory first).
                <span className="badge">Example coming later</span>
            </Styled.Note>
        </Styled.Page>
    );
};

export default TutorialIntro;
