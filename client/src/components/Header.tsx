import Logo from "../assets/logo.jpg";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useInfoStore } from "../store/store"; // Importing the store

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Using Zustand store
    const isLogin = useInfoStore((state) => state.isLogin);
    const userInfo = useInfoStore((state) => state.userInfo);
    const profileImgUrl = useInfoStore((state) => state.profileImgUrl);
    const logout = useInfoStore((state) => state.logout);
    let mypageIndex = userInfo?.tutor_idx ? userInfo.tutor_idx : userInfo?.stu_idx;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLeftClick = () => {
        setIsMenuOpen(true);
        toggleMenu();
    };

    const handleLogout = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/logout`;
            await axios.post(url);
            setIsMenuOpen(false);
            logout();
        } catch (error) {
            console.error("로그아웃 오류:", error);
        }
    };

    console.log(isLogin, userInfo, profileImgUrl);
    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <Link to="/">HandChatter</Link>
                    </div>
                    <nav className="menu">
                        <ul>
                            <li>
                                <Link to="/learning">개인학습</Link>
                            </li>
                            <li>
                                <Link to="/learning/quiz">퀴즈</Link>
                            </li>
                            {!isLogin ? (
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
                                    <div className="header-nickname" onClick={handleLeftClick}>
                                        <div className="profile-img small">
                                            <img src={profileImgUrl} alt="" />
                                        </div>
                                        <div>{userInfo?.nickname} 님</div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </nav>
                    <Sidebar
                        isMenuOpen={isMenuOpen}
                        onLogout={handleLogout}
                        mypageIndex={mypageIndex}
                    />
                </div>
            </header>
        </>
    );
};

export default Header;
