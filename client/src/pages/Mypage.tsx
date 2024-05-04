import React, { useState } from "react";
import MypageProfile from "../components/Mypage/MypageProfile";
import MypageWithdrawMembership from "../components/Mypage/MypageWithdrawMembership";
import StudentMypageLesson from "../components/Mypage/StudentMypageLesson";
import Chatting from "../components/Chatting";
import { Link } from "react-router-dom";

const MyPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("chatting"); // 활성화된 탭을 관리하는 state

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <section>
            <div className="container">
                <div className="mypage-button-container">
                    <button onClick={() => handleTabChange("chatting")}>메세지</button>
                    <button onClick={() => handleTabChange("lesson")}>찜 목록</button>
                    <button onClick={() => handleTabChange("profile")}>프로필</button>
                    <button onClick={() => handleTabChange("withdraw")}>회원탈퇴</button>
                    <Link to="/class">수업하기</Link>



                </div>
                <div className="mypage-components-container">
                    {/* 조건부 렌더링을 사용하여 활성화된 탭에 따라 해당 컴포넌트를 보여줍니다. */}
                    {activeTab === "chatting" && <Chatting />}
                    {activeTab === "lesson" && <StudentMypageLesson />}
                    {activeTab === "profile" && <MypageProfile />}
                    {activeTab === "withdraw" && <MypageWithdrawMembership />}


                </div>
            </div>
        </section>
    );
};

export default MyPage;
