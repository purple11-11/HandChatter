import React, { useState } from "react";
import ModifyEmail from "./ModifyEmail";
import ModifyPassword from "./ModifyPassword";

export default function MypageProfile() {
    const [activeTab, setActiveTab] = useState<string>("chatting"); // 활성화된 탭을 관리하는 state
    const [userData, setUserData] = useState<any>({
        id: "dlrlgur789",
        nickname: "rekey", // 닉네임 초기값
        email: "789rlgur@naver.com", // 이메일 초기값
        password: "Ctywo9631!", // 비밀번호 초기값
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleUserDataChange = (fieldName: string, value: string) => {
        setUserData({ ...userData, [fieldName]: value });
    };

    const handleSubmit = () => {
        console.log("전송할 userData:", userData);
    };

    console.log(userData);
    return (
        <section>
            <h1>내 정보 확인 및 수정</h1>
            <div>
                <div>프로필 이미지</div>
                <div>
                    <button>기본 이미지</button>
                    <button> 이미지 수정</button>
                </div>
            </div>
            <div>
                <form action="">
                    <div>
                        <label htmlFor="">아이디</label>
                        <input type="text" value={userData.id} readOnly />
                    </div>
                    <div>
                        <label htmlFor="">닉네임</label>
                        <input
                            type="text"
                            value={userData.nickname}
                            onChange={(e) => handleUserDataChange("nickname", e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="">비밀번호</label>
                        <input
                            type="password"
                            // value={userData.password}
                            // onChange={(e) => handleUserDataChange("password", e.target.value)}
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="">이메일</label>
                        <input
                            type="text"
                            value={userData.email}
                            // onChange={(e) => handleUserDataChange("email", e.target.value)}
                            readOnly
                        />
                    </div>
                </form>
            </div>
            <div>
                <div>
                    <button onClick={() => handleTabChange("email")}>이메일 수정</button>
                    <button onClick={() => handleTabChange("password")}>비밀번호 수정</button>
                    <button onClick={handleSubmit}>수정 내용 저장</button>
                </div>
                <div>
                    {activeTab === "email" && <ModifyEmail />}
                    {activeTab === "password" && (
                        <ModifyPassword
                            handleUserDataChange={handleUserDataChange}
                            currentPw={userData.password}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
