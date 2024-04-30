import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
interface SidebarProps {
    isMenuOpen: boolean;
    onLogout: () => void; // 로그아웃 시 호출할 콜백 함수
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, onLogout }) => {
    return (
        <>
            {isMenuOpen && (
                <div className="sidebar">
                    <ul>
                        <li>
                            <Link to="/mypage">마이페이지</Link>
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
