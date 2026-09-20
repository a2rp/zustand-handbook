import { createElement } from "react";
import { FaCodepen, FaFacebook, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { FiCoffee, FiHeart, FiMail, FiUser } from "react-icons/fi";
import { Styled } from "./styled";

const links = [
    ["Portfolio", "https://www.ashishranjan.net", FiUser],
    ["GitHub", "https://github.com/a2rp", FaGithub],
    ["CodePen", "https://codepen.io/ash1198", FaCodepen],
    ["LinkedIn", "https://www.linkedin.com/in/aashishranjan", FaLinkedin],
    ["Facebook", "https://www.facebook.com/theash.ashish/", FaFacebook],
    ["YouTube", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FaYoutube],
    ["Email", "mailto:ash.ranjan09@gmail.com", FiMail],
];

const support = [
    ["Support", "https://a2rp-donation-page.netlify.app/", FiHeart],
    ["Buy Me a Coffee", "https://buymeacoffee.com/a2rp", FiCoffee],
    ["Patreon", "https://patreon.com/a2rp", FiHeart],
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <Styled.Wrapper>
            <Styled.Intro>
                <strong>Zustand Handbook</strong>
                <span>Practical state patterns for React developers.</span>
            </Styled.Intro>

            <Styled.LinkGroups>
                <Styled.Group>
                    <h3>Links</h3>
                    {links.map(([label, href, Icon]) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                            {createElement(Icon, { "aria-hidden": true })}
                            {label}
                        </a>
                    ))}
                </Styled.Group>

                <Styled.Group>
                    <h3>Support</h3>
                    {support.map(([label, href, Icon]) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                            {createElement(Icon, { "aria-hidden": true })}
                            {label}
                        </a>
                    ))}
                </Styled.Group>
            </Styled.LinkGroups>

            <Styled.Bottom>
                <span>Copyright &copy; {year} <a href="https://www.ashishranjan.net" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></span>
                <span>Built with React and Zustand</span>
            </Styled.Bottom>
        </Styled.Wrapper>
    );
}


