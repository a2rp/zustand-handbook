import styled from "styled-components";

export const Styled = {
    Nav: styled.div`
        /* border: 1px solid #f00; */
        height: 100%;
        font-family: "Poppins", sans-serif;

        .home,
        a {
            color: #aaa;
            text-decoration: none;
            display: flex;
            &:hover {
                text-decoration: underline;
                color: #fff;
            }
            &.active {
                color: coral;
            }
        }

        .title {
            margin-top: 15px;
        }

        .searchWraper {
            margin-bottom: 15px;
            position: relative;
            height: 40px;

            input {
                width: 100%;
                height: 100%;
                outline: none;
                border: none;
                border: 1px solid #333;
                padding: 0 50px 0 15px;
                background-color: transparent;
                color: #aaa;
            }

            .clearIconWrapper {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                width: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }

        .navlinksWrapper {
            /* border: 1px solid #f00; */
            height: calc(100% - 40px);
            overflow: auto;
            overflow-x: hidden;
            padding-left: 10px;
            color: #666;

            .title {
                white-space: nowrap;
            }

            a {
                padding-left: 10px;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                white-space: nowrap;
            }
        }
    `,
};
