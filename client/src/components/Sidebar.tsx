import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
    isMenuOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen }) => {
    const handleLogout = () => {
        console.log("로그아웃");
    };
    return (
        <>
            {isMenuOpen && (
                <div className="sidebar">
                    <ul>
                        <li>
                            <Link to="/api/mypage">마이페이지</Link>
                        </li>
                        <li onClick={handleLogout}>로그아웃</li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Sidebar;
