import Logo from "../assets/logo.jpg";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const navigate = useNavigate();
    // useEffect(() => {
    //     console.log("하하");
    //     getUser();
    // }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLeftClick = () => {
        navigate("/mypage");
    };

    const handleRightClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setIsMenuOpen(true);
        toggleMenu();
    };

    const handleLogout = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/logout`;
            await axios.post(url);

            localStorage.removeItem("isLoggedIn");
            setIsMenuOpen(false); // 로그아웃 후 메뉴 닫기
            setUserInfo(null); // 로그아웃 후 사용자 정보 초기화
        } catch (error) {
            console.error("로그아웃 오류:", error);
        }
    };

    const getUser = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/userInfo`;
            const res = await axios.get(url);
            setUserInfo(res.data.studentInfo[0]);
            const myInfo = JSON.stringify(res.data.studentInfo[0]);
            localStorage.setItem("userInfo", myInfo);
            console.log(myInfo);
        } catch (error) {
            setUserInfo(null);
        }
    };

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    useEffect(() => {
        console.log(isLoggedIn + "-------");
        if (isLoggedIn) {
            getUser();
        }
    }, [isLoggedIn]);

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="logo">
                        {/* <img src={Logo} alt="" /> */}
                        <Link to="/">HandChatter</Link>
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
                    <Sidebar isMenuOpen={isMenuOpen} onLogout={handleLogout} />
                </div>
            </header>
        </>
    );
};

export default Header;
