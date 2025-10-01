import{d as r}from"./index-D0NhHHfM.js";const e="var(--card, #111)",d="var(--text, #e9e9e9)",p="var(--muted, #b7b7b7)",o="var(--border, #222)",a="var(--accent, #22c55e)",t="var(--danger, #ef4444)",n="var(--radius, 16px)",i="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",s={Page:r.div`
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background: ${e};
        color: ${d};
        border: 1px solid ${o};
        border-radius: ${n};
        box-shadow: ${i};
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
            border: 1px solid ${o};
            padding: 0 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
            font-size: 0.95em;
        }

        /* shared note/bad/good blocks */
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
            border: 1px dashed ${o};
            background: rgba(255, 255, 255, 0.04);
        }
        pre.bad {
            border: 1px solid ${t};
            background: rgba(239, 68, 68, 0.08);
        }
        pre.good {
            border: 1px solid ${a};
            background: rgba(34, 197, 94, 0.08);
        }
    `,Title:r.h2`
        margin: 0 0 4px 0;
        font-weight: 900;
        letter-spacing: 0.3px;
    `,Subtitle:r.p`
        margin: 0 0 18px 0;
        color: ${p};
    `,Section:r.section`
        border-top: 1px dashed ${o};
        padding-top: 16px;
        margin-top: 16px;
    `,Table:r.table`
        width: 100%;
        border-collapse: collapse;
        margin: 8px 0 12px 0;
        thead th {
            text-align: left;
            font-weight: 700;
            border-bottom: 1px solid ${o};
            padding: 10px 8px;
        }
        tbody td {
            border-bottom: 1px dashed ${o};
            padding: 10px 8px;
            vertical-align: top;
        }
        tbody tr:last-child td {
            border-bottom: 0;
        }
    `,Callout:r.div`
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px solid ${o};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
    `,Note:r.div`
        margin-top: 20px;
        padding: 12px 14px;
        border: 1px solid ${o};
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        display: inline-flex;
        align-items: center;
        gap: 12px;

        .badge {
            margin-left: 8px;
            padding: 3px 8px;
            border-radius: 999px;
            border: 1px solid ${o};
            color: ${a};
            font-size: 12px;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
    `};export{s as S};
