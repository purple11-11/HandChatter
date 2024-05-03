import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInfoStore } from "../store/store";

interface SidebarProps {
    isMenuOpen: boolean;
    onLogout: () => void;
    mypageIndex?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, onLogout, mypageIndex }) => {
    const userInfo = useInfoStore((state) => state.userInfo);
    const profileImgUrl = useInfoStore((state) => state.profileImgUrl);
    console.log(profileImgUrl);
    console.log(userInfo);
    return (
        <>
            {isMenuOpen && (
                <div className="sidebar">
                    <div className="profile-img big">
                        <img src={profileImgUrl} alt="" />
                    </div>
                    <div className="sidebar-profile">
                        <p>{userInfo?.nickname}</p>
                        <p>{userInfo?.email}</p>
                    </div>
                    <ul>
                        <li>
                            <Link to={`/mypage/${mypageIndex}`}>마이페이지</Link>
                        </li>
                        <li onClick={onLogout}>
                            <Link to="/">로그아웃</Link>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Sidebar;
