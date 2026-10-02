import styled from "styled-components";

export const Styled = {
    Wrapper: styled.div`
        display: grid;
        gap: 24px;
        padding: 18px 0 30px;
        h3 { margin: 0; color: #f6f6f6; font-size: clamp(1.25rem, 2vw, 1.65rem); letter-spacing: -.03em; }
        h3 time { color: #dfdfdf; font-size: .72em; font-weight: 500; }
        fieldset { min-width: 0; padding: clamp(18px, 3vw, 30px); border: 1px solid rgba(236, 236, 236, .13); border-radius: 18px; background: linear-gradient(145deg, rgba(28, 28, 28, .9), rgba(17, 17, 17, .72)); box-shadow: 0 18px 50px rgba(0,0,0,.12); }
        legend { padding: 0 10px; color: #dfdfdf; font-size: 11px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
        .para { max-width: 820px; color: #b1b1b1; font-size: 14px; line-height: 1.8; }
        .para p { margin: 0 0 16px; }
        .section { display: grid; gap: 8px; margin-top: 24px; }
        .section h3 { font-size: 12px; font-weight: 500; }
        .section a, a { color: #dfdfdf; text-decoration: none; overflow-wrap: anywhere; }
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
    border-bottom: 1px solid rgba(236, 236, 236, .08);
    &:last-child { border-bottom: 0; }
    &:hover { background: rgba(223, 223, 223, .04); }
`;

export const Col1 = styled.div`
    flex: 0 0 105px;
    color: #7e7e7e;
    font-size: 12px;
    font-weight: 650;
`;

export const Col2 = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    min-width: 0;
    color: #e5e5e5;
    font-size: 13px;
    text-align: right;
    a { color: #dfdfdf; overflow-wrap: anywhere; word-break: break-word; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .icon { display: grid; place-items: center; flex: 0 0 34px; width: 34px; height: 34px; color: #dfdfdf; background: rgba(223, 223, 223, .08); border-radius: 9px; }
    @media (max-width: 560px) { align-items: flex-end; flex-direction: column-reverse; gap: 6px; text-align: left; }
`;