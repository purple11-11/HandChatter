import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        getUser();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLeftClick = () => {
        window.location.href = "/mypage";
    };

    const handleRightClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setIsMenuOpen(true);
        toggleMenu();
    };

    const getUser = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/userInfo`;
            const res = await axios.get(url);
            console.log(res.data.studentInfo[0]);
            setUserInfo(res.data.studentInfo[0]);
        } catch (error) {
            console.error("사용자 정보를 불러오는 중 에러:", error);
        }
    };

    return (
        <>
            <header className="header">
                <div className="logo">
                    <Link to="/">로고</Link>
                </div>
                <nav className="menu">
                    <ul>
                        <li>
                            <Link to="/personal-learning">개인학습</Link>
                        </li>
                        <li>
                            <Link to="/quiz">퀴즈</Link>
                        </li>
                        {!userInfo ? (
                            <>
                                <li>
                                    <Link to="/login">로그인</Link>
                                </li>
                                <li>
                                    <Link to="/signup/student">회원가입</Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    to="/mypage"
                                    onClick={handleLeftClick}
                                    onContextMenu={handleRightClick}
                                >
                                    {userInfo.nickname} 님
                                </Link>
                            </li>
                        )}
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
