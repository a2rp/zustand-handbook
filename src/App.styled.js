import styled, { css } from "styled-components";

const scrollbar = css`
    scrollbar-width: thin;
    scrollbar-color: rgba(126, 245, 190, .32) transparent;
    &::-webkit-scrollbar { width: 9px; height: 9px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: rgba(126, 245, 190, .28); border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
    &::-webkit-scrollbar-thumb:hover { background: #7ef5be; background-clip: content-box; }
`;

const Wrapper = styled.div`
    --bg: #070b11;
    --surface: #0e151e;
    --surface-2: #121d28;
    --line: rgba(220, 240, 235, .12);
    --text: #f2f7f5;
    --muted: #8e9f9d;
    --accent: #7ef5be;
    min-height: 100dvh;
    background: radial-gradient(circle at 76% -12%, rgba(126, 245, 190, .12), transparent 32rem), var(--bg);
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Header = styled.header`
    position: fixed;
    inset: 0 0 auto;
    z-index: 1000;
    height: 74px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(16px, 3vw, 42px);
    background: rgba(7, 11, 17, .86);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--line);
`;

const LogoLinkWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    > a:last-child { display: flex; align-items: center; gap: 11px; color: var(--text); text-decoration: none; font-size: 15px; font-weight: 780; letter-spacing: -.02em; }
    .brandMark { display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid rgba(126,245,190,.5); border-radius: 10px; color: var(--accent); font-size: 11px; font-weight: 800; letter-spacing: -.08em; }
    .brandCopy { display: grid; gap: 2px; }
    .brandCopy small { color: var(--muted); font-size: 10px; font-weight: 500; letter-spacing: .03em; }
    > a:last-child:hover { color: var(--accent); }
`;

const NavLinkWrapper = styled.button`
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    padding: 0;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: 10px;
    cursor: pointer;
    transition: .2s ease;
    &:hover { color: var(--accent); border-color: rgba(126,245,190,.5); transform: translateY(-1px); }
`;

const Heading = styled.h1`
    margin: 0;
    font-size: 13px;
    a { display: block; opacity: .9; transition: opacity .2s; }
    a:hover { opacity: 1; }
    img { display: block; height: 26px; width: auto; }
`;

const Main = styled.div`
    height: 100dvh;
    padding-top: 74px;
    display: flex;
    overflow: hidden;
`;

const NavWrapper = styled.aside`
    width: 0;
    flex: 0 0 0;
    overflow: hidden;
    z-index: 900;
    background: rgba(14, 21, 30, .96);
    border-right: 1px solid var(--line);
    transition: width .25s ease, flex-basis .25s ease;
    &.active { width: 292px; flex-basis: 292px; }
    .navInner { width: 292px; height: 100%; padding: 18px 14px; overflow-y: auto; ${scrollbar}; }
    @media (max-width: 900px) { position: fixed; top: 74px; left: 0; height: calc(100dvh - 74px); box-shadow: 18px 0 40px rgba(0,0,0,.25); &.active { width: min(292px, 86vw); flex-basis: min(292px, 86vw); } }
`;

const ContentWrapper = styled.main`
    flex: 1;
    min-width: 0;
    overflow: auto;
    ${scrollbar};
    scroll-behavior: smooth;
`;

const RoutesWrapper = styled.div`
    min-height: calc(100dvh - 74px);
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: clamp(22px, 4vw, 52px);
`;

const Footer = styled.footer`
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: 20px clamp(22px, 4vw, 52px) 32px;
    color: var(--muted);
    border-top: 1px solid var(--line);
`;

export const Styled = { Wrapper, Header, LogoLinkWrapper, NavLinkWrapper, Heading, Main, NavWrapper, ContentWrapper, RoutesWrapper, Footer };