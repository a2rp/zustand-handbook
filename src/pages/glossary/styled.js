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
        max-width: 1100px;
        margin: 0 auto;
        background: ${cardBg};
        color: ${text};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 24px;
        line-height: 1.6;
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

    SearchRow: styled.div`
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 8px 0 12px 0;

        input {
            flex: 1;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid ${border};
            border-radius: 12px;
            padding: 10px 12px;
            color: ${text};
            outline: none;
        }
        .count {
            color: ${muted};
            font-size: 0.95rem;
        }
    `,

    AlphaBar: styled.nav`
        display: grid;
        grid-template-columns: repeat(26, minmax(0, 1fr));
        gap: 6px;
        margin: 6px 0 18px 0;

        button {
            border: 1px solid ${border};
            background: rgba(255, 255, 255, 0.03);
            color: ${text};
            border-radius: 8px;
            padding: 6px 0;
            cursor: pointer;
            font-size: 12px;
        }
        button:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }
    `,

    LetterHeader: styled.h3`
        margin: 18px 0 8px 0;
        font-weight: 800;
        letter-spacing: 0.2px;
        border-bottom: 1px dashed ${border};
        padding-bottom: 6px;
    `,

    Grid: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
    `,

    Card: styled.article`
        border: 1px solid ${border};
        border-radius: 14px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.02);

        .top {
            display: flex;
            align-items: baseline;
            gap: 10px;
            .term {
                margin: 0;
                font-size: 18px;
                font-weight: 800;
            }
            .aka {
                color: ${muted};
                font-size: 12px;
            }
        }

        .def {
            margin: 6px 0 10px 0;
            color: ${text};
        }

        .meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            justify-content: space-between;
        }

        .tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;

            .tag {
                border: 1px solid ${border};
                border-radius: 999px;
                padding: 2px 8px;
                font-size: 11px;
                color: ${muted};
            }
        }

        .see {
            font-size: 12px;
            color: ${muted};

            .link {
                color: ${accent};
                text-decoration: none;
            }
            .link:hover {
                text-decoration: underline;
            }
        }
    `,

    Empty: styled.div`
        margin-top: 24px;
        color: ${muted};
    `,
};
