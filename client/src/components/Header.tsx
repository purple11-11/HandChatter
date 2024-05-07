import Logo from "../assets/header-logo.png";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useInfoStore } from "../store/store"; // Importing the store
import menuIconWhite from "../assets/menu-icon-white.png";
import cancleIcon from "../assets/cancle-icon.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Using Zustand store
    const isLogin = useInfoStore((state) => state.isLogin);
    const userInfo = useInfoStore((state) => state.userInfo);
    const getInfo = useInfoStore((state) => state.getInfo);
    // getInfo();
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
    useEffect(() => {
        getInfo();
    }, []);
    console.log(isLogin, userInfo, profileImgUrl);
    return (
        <>
            <header className={`header ${isMenuOpen ? "mobile-sidebar-open" : ""}`}>
                <div className="mobile-logo">
                    <Link to="/">
                        <img src={Logo} alt="" />
                        andChatter
                    </Link>
                </div>
                <div className="header-icon" onClick={handleLeftClick}>
                    {!isMenuOpen ? (
                        <img src={menuIconWhite} alt="" />
                    ) : (
                        <img src={cancleIcon} alt="" />
                    )}
                </div>
                <div className={`header-container mobile-sidebar `}>
                    <div className="logo">
                        <Link to="/">
                            <img src={Logo} alt="" />
                            andChatter
                        </Link>
                    </div>
                    <nav className="menu mobile-sidebar-content">
                        <ul>
                            <li>
                                <Link to="/learning">개인학습</Link>
                            </li>
                            <li>
                                <Link to="/quiz">퀴즈</Link>
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
                                <>
                                    <li className="computer-mypage">
                                        <div className="header-nickname" onClick={handleLeftClick}>
                                            <div className="profile-img small">
                                                <img src={profileImgUrl} alt="" />
                                            </div>
                                            <div>{userInfo?.nickname} 님</div>
                                        </div>
                                    </li>
                                    <li className="mobile-mypage">
                                        <div>
                                            <Link to={`/mypage/${mypageIndex}`}>마이페이지</Link>
                                        </div>
                                    </li>
                                    <li
                                        className="mobile-logout"
                                        onClick={() => {
                                            handleLogout();
                                            handleLeftClick();
                                        }}
                                    >
                                        <Link to="/">로그아웃</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                    {isLogin && (
                        <Sidebar
                            isMenuOpen={isMenuOpen}
                            onLogout={handleLogout}
                            mypageIndex={mypageIndex}
                            handleLeftClick={handleLeftClick}
                        />
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
