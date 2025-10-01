import styled from "styled-components";

const cardBg = "var(--card, #111)";
const text = "var(--text, #e9e9e9)";
const muted = "var(--muted, #b7b7b7)";
const border = "var(--border, #222)";
const accent = "var(--accent, #22c55e)";
const radius = "var(--radius, 16px)";
const shadow = "var(--shadow, 0 8px 24px rgba(0,0,0,0.35))";

export const Styled = {
    Page: styled.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${cardBg};
        color: ${text};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 24px;
        line-height: 1.6;

        .link {
            color: ${accent};
            text-decoration: none;
        }
        .link:hover {
            text-decoration: underline;
        }

        .ext {
            color: ${accent};
            text-decoration: none;
            word-break: break-all;
        }
        .ext:hover {
            text-decoration: underline;
        }

        kbd {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid ${border};
            border-radius: 6px;
            padding: 1px 6px;
            font-size: 0.85em;
        }

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${border};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }
    `,

    Title: styled.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,

    Subtitle: styled.p`
        margin: 0 0 18px 0;
        color: ${muted};
    `,

    Section: styled.section`
        border-top: 1px dashed ${border};
        padding-top: 16px;
        margin-top: 16px;

        ul {
            margin: 0 0 0 22px;
        }
    `,
};
