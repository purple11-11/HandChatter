import React, { useState } from "react";
import ModifyEmail from "./ModifyEmail";
import ModifyPassword from "./ModifyPassword";
import { useInfoStore } from "../../store/store";
import axios from "axios";

export default function MypageProfile() {
    const userInfo = useInfoStore((state) => state.userInfo);
    const profileImgUrl = useInfoStore((state) => state.profileImgUrl);
    const getInfo = useInfoStore((state) => state.getInfo);
    const [activeTab, setActiveTab] = useState<string>("chatting"); // 활성화된 탭을 관리하는 state
    const [userData, setUserData] = useState<any>({
        id: userInfo?.id,
        nickname: userInfo?.nickname,
        email: userInfo?.email,
        password: userInfo?.password,
        profileImgUrl: profileImgUrl,
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleUserDataChange = (fieldName: string, value: string) => {
        setUserData({ ...userData, [fieldName]: value });
    };

    const handleSubmit = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/studentProfile`;
            const res = await axios.patch(url, {
                nickname: userData.nickname,
                password: userData.password,
            });
            console.log(res.data);
            // 서버로부터 응답을 받은 후에 필요한 작업 수행
        } catch (error) {
            console.error("프로필 수정 오류:", error);
            // 오류 처리
        }
    };

    const handleImageChange = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            console.log(file);
            const url = `${process.env.REACT_APP_API_SERVER}/api/editPhoto`;
            console.log("gkgkkg");
            const res = await axios.patch(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(profileImgUrl);
            getInfo();
            console.log(profileImgUrl);
        } catch (error) {
            console.error("이미지 수정 오류:", error);
        }
    };
    // getInfo();
    const handleImageUpload = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = (e) => {
            if (!e.target) {
                console.error("이벤트 타겟이 존재하지 않습니다.");
                return;
            }
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleImageChange(file);
            }
        };
        fileInput.click();
    };

    const handleDefaultImage = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/backDefault`;
            const res = await axios.patch(url);
            console.log(res.data);
            getInfo();
        } catch (error) {
            console.error("기본 이미지로 변경하는 중 오류:", error);
        }
    };

    return (
        <section>
            <h1>내 정보 확인 및 수정</h1>
            <div>
                <div>
                    <img src={profileImgUrl} alt="프로필 이미지" />
                </div>
                <div>
                    <button onClick={handleDefaultImage}>기본 이미지</button>
                    <button onClick={handleImageUpload}>이미지 수정</button>
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
