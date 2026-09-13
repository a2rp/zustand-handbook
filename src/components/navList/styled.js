import styled from "styled-components";

export const Styled = {
    Nav: styled.nav`
        height: 100%;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        .searchWraper { position: relative; height: 42px; margin-bottom: 16px; }
        input { width: 100%; height: 100%; padding: 0 42px 0 13px; color: #f2f7f5; background: #121d28; border: 1px solid rgba(220,240,235,.13); border-radius: 10px; outline: 0; font: inherit; font-size: 12px; transition: .2s; }
        input::placeholder { color: #71817f; }
        input:focus { border-color: rgba(126,245,190,.65); box-shadow: 0 0 0 3px rgba(126,245,190,.1); }
        .clearIconWrapper { position: absolute; top: 0; right: 0; width: 40px; height: 100%; display: grid; place-items: center; color: #8e9f9d; cursor: pointer; }
        .navlinksWrapper { height: calc(100% - 58px); overflow: auto; padding: 2px 3px 25px; scrollbar-width: thin; }
        .home, a { display: flex; align-items: center; min-height: 34px; padding: 7px 10px; color: #9baba8; border-radius: 8px; text-decoration: none; font-size: 12px; transition: .18s; }
        a:hover { color: #f2f7f5; background: rgba(126,245,190,.08); }
        a.active { color: #07120e; background: #7ef5be; font-weight: 750; }
        .title { margin: 21px 10px 7px; color: #6f817e; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; }
    `,
};