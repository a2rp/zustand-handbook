import styled from "styled-components";

export const Styled = {
    Nav: styled.nav`
        height: 100%;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        .searchWraper { position: relative; height: 42px; margin-bottom: 16px; }
        input { width: 100%; height: 100%; padding: 0 42px 0 13px; color: #f6f6f6; background: #1c1c1c; border: 1px solid rgba(236, 236, 236, .13); border-radius: 10px; outline: 0; font: inherit; font-size: 12px; transition: .2s; }
        input::placeholder { color: #7e7e7e; }
        input:focus { border-color: rgba(223, 223, 223, .65); box-shadow: 0 0 0 3px rgba(223, 223, 223, .1); }
        .clearIconWrapper { position: absolute; top: 0; right: 0; width: 40px; height: 100%; display: grid; place-items: center; color: #9b9b9b; cursor: pointer; }
        .matchCount { position: absolute; right: 40px; top: 0; height: 100%; display: flex; align-items: center; color: #dfdfdf; font-size: 10px; pointer-events: none; }
        .navlinksWrapper { height: calc(100% - 58px); overflow: auto; padding: 2px 3px 25px; scrollbar-width: thin; }
        .home, a { display: flex; align-items: center; min-height: 34px; padding: 7px 10px; color: #a8a8a8; border-radius: 8px; text-decoration: none; font-size: 12px; transition: .18s; }
        a:hover { color: #f6f6f6; background: rgba(223, 223, 223, .08); }
        a.active { color: #101010; background: #dfdfdf; font-weight: 750; }
        .title { margin: 21px 10px 7px; color: #7d7d7d; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; }
    `,
};
