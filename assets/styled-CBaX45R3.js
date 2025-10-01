import{d as o}from"./index-D0NhHHfM.js";const a="var(--card, #111)",e="var(--text, #e9e9e9)",d="var(--muted, #b7b7b7)",r="var(--border, #222)",n="var(--accent, #22c55e)",p="var(--danger, #ef4444)",i="var(--radius, 16px)",t="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",g={Page:o.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${a};
        color: ${e};
        border: 1px solid ${r};
        border-radius: ${i};
        box-shadow: ${t};
        padding: 24px;
        line-height: 1.6;

        h3 {
            margin: 0 0 10px 0;
            font-weight: 800;
            letter-spacing: 0.2px;
        }
        ul,
        ol {
            margin: 0 0 16px 22px;
        }

        code {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid ${r};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        pre.note,
        pre.bad,
        pre.good {
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
        pre.bad {
            border: 1px solid ${p};
            background: rgba(239, 68, 68, 0.08);
        }
        pre.good {
            border: 1px solid ${n};
            background: rgba(34, 197, 94, 0.08);
        }
    `,Title:o.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:o.p`
        margin: 0 0 18px 0;
        color: ${d};
    `,Section:o.section`
        border-top: 1px dashed ${r};
        padding-top: 16px;
        margin-top: 16px;
    `,Callout:o.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${r};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `};export{g as S};
