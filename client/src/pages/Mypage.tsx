import React, { useState } from "react";
import MypageProfile from "../components/Mypage/MypageProfile";
import MypageWithdrawMembership from "../components/Mypage/MypageWithdrawMembership";
import StudentMypageLesson from "../components/Mypage/StudentMypageLesson";
import Chatting from "../components/Chatting";
import { Link } from "react-router-dom";
import { useInfoStore } from "../store/store";

const MyPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("chatting"); // 활성화된 탭을 관리하는 state
    const userInfo = useInfoStore((state) => state.userInfo);
    const handleTabChange = (tab: string) => {
        if (tab === "withdraw") {
            if (userInfo?.provider === "kakao") {
                alert("카카오 이용자는 회원탈퇴가 불가능합니다.");
                return;
            }
        }
        setActiveTab(tab);
    };

    return (
        <section>
            <div className="container">
                <div className="mypage-button-container">
                    <button
                        className={activeTab === "chatting" ? "active" : ""}
                        onClick={() => handleTabChange("chatting")}
                    >
                        메세지
                    </button>
                    <button
                        className={activeTab === "lesson" ? "active" : ""}
                        onClick={() => handleTabChange("lesson")}
                    >
                        찜 목록
                    </button>
                    <button
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => handleTabChange("profile")}
                    >
                        프로필
                    </button>
                    <button
                        className={activeTab === "withdraw" ? "active" : ""}
                        onClick={() => handleTabChange("withdraw")}
                    >
                        회원탈퇴
                    </button>
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
