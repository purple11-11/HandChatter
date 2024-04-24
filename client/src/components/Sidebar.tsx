import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const handleLogout = () => {
        // 로그아웃 로직을 추가할 수 있습니다.
        console.log("로그아웃");
    };
    return (
        <>
            {isMenuOpen && ( // 메뉴가 열려있을 때만 ul 태그를 렌더링합니다.
                <ul>
                    <li>
                        <Link to="/mypage">마이페이지</Link>
                    </li>
                    <li onClick={handleLogout}>로그아웃</li>
                </ul>
            )}
        </>
    );
}
