import styled from "styled-components";

export const Styled = {
    Wrapper: styled.div`
        display: grid;
        gap: 24px;
        padding: 18px 0 30px;
        h3 { margin: 0; color: #f2f7f5; font-size: clamp(1.25rem, 2vw, 1.65rem); letter-spacing: -.03em; }
        h3 time { color: #7ef5be; font-size: .72em; font-weight: 500; }
        fieldset { min-width: 0; padding: clamp(18px, 3vw, 30px); border: 1px solid rgba(220,240,235,.13); border-radius: 18px; background: linear-gradient(145deg, rgba(18,29,40,.9), rgba(11,18,26,.72)); box-shadow: 0 18px 50px rgba(0,0,0,.12); }
        legend { padding: 0 10px; color: #7ef5be; font-size: 11px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
        .para { max-width: 820px; color: #a6b4b1; font-size: 14px; line-height: 1.8; }
        .para p { margin: 0 0 16px; }
        .section { display: grid; gap: 8px; margin-top: 24px; }
        .section h3 { font-size: 12px; font-weight: 500; }
        .section a, a { color: #7ef5be; text-decoration: none; overflow-wrap: anywhere; }
        .section a:hover, a:hover { text-decoration: underline; }
        .aboutDeveloper { display: grid; gap: 2px; }
    `,
};

export const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 11px 0;
    border-bottom: 1px solid rgba(220,240,235,.08);
    &:last-child { border-bottom: 0; }
    &:hover { background: rgba(126,245,190,.04); }
`;

export const Col1 = styled.div`
    flex: 0 0 105px;
    color: #71817f;
    font-size: 12px;
    font-weight: 650;
`;

export const Col2 = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    min-width: 0;
    color: #dce8e4;
    font-size: 13px;
    text-align: right;
    a { color: #7ef5be; overflow-wrap: anywhere; word-break: break-word; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .icon { display: grid; place-items: center; flex: 0 0 34px; width: 34px; height: 34px; color: #7ef5be; background: rgba(126,245,190,.08); border-radius: 9px; }
    @media (max-width: 560px) { align-items: flex-end; flex-direction: column-reverse; gap: 6px; text-align: left; }
`;