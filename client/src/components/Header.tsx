import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="logo">로고</div>
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
                </ul>
            </nav>
        </header>
    );
}
