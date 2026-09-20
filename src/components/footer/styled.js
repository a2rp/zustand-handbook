import styled from "styled-components";

const Wrapper = styled.div`
    display: grid;
    gap: 28px;
    margin-top: 50px;
    padding: 30px 0 8px;
    color: var(--muted, #8e9f9d);
    border-top: 1px solid var(--line, rgba(220, 240, 235, .12));
`;

const Intro = styled.div`
    display: grid;
    gap: 5px;
    strong { color: var(--text, #f2f7f5); font-size: 16px; }
    span { font-size: 12px; }
`;

const LinkGroups = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 36px;
    @media (max-width: 620px) { grid-template-columns: 1fr; gap: 24px; }
`;

const Group = styled.div`
    display: grid;
    gap: 8px;
    h3 { margin: 0 0 3px; color: var(--text, #f2f7f5); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
    a { display: flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; font-size: 12px; transition: color .2s, transform .2s; }
    a:hover { color: var(--accent, #7ef5be); transform: translateX(3px); }
`;

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    padding-top: 16px;
    border-top: 1px solid var(--line, rgba(220, 240, 235, .12));
    font-size: 11px;
    a { color: var(--text, #f2f7f5); }
`;

export const Styled = { Wrapper, Intro, LinkGroups, Group, Bottom };
