import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInfoStore } from "../store/store";
import { useRef, useEffect } from "react";
interface SidebarProps {
    isMenuOpen: boolean;
    onLogout: () => void;
    mypageIndex?: number;
    handleLeftClick: () => void;
    onClickOutside: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isMenuOpen,
    onLogout,
    mypageIndex,
    handleLeftClick,
    onClickOutside,
}) => {
    const userInfo = useInfoStore((state) => state.userInfo);
    const profileImgUrl = useInfoStore((state) => state.profileImgUrl);
    return (
        <>
            {isMenuOpen && (
                <div className="sidebar" >
                    <div className="profile-img big">
                        <img src={profileImgUrl} alt="" />
                    </div>
                    <div className="sidebar-profile">
                        <p>{userInfo?.nickname}</p>
                        <p>{userInfo?.email}</p>
                    </div>
                    <ul>
                        <li onClick={handleLeftClick}>
                            <Link to={`/mypage/${mypageIndex}`}>마이페이지</Link>
                        </li>
                        <li
                            onClick={() => {
                                onLogout();
                                handleLeftClick();
                            }}
                        >
                            <Link to="/">로그아웃</Link>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Sidebar;
