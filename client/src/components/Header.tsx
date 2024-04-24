import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="header">
                <div className="logo">
                    <Link to="/api">로고</Link>
                </div>
                <nav className="menu">
                    <ul>
                        <li>
                            <Link to="/personal-learning">개인학습</Link>
                        </li>
                        <li>
                            <Link to="/quiz">퀴즈</Link>
                        </li>
                        <li>
                            <Link to="/login">로그인</Link>
                        </li>
                        <li>
                            <Link to="/signup">회원가입</Link>
                        </li>
                        <li>
                            <Link to="/api/mypage" onClick={toggleMenu}>
                                -----님
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <br />
            <br />
            <br />
            <Sidebar isMenuOpen={isMenuOpen} />
        </>
    );
};

export default Header;
