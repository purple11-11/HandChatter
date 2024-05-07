import React, { useState, useEffect, useRef } from "react";
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
        price: userInfo?.price,
        password: userInfo?.password,
        profileImgUrl: profileImgUrl,
        description: userInfo?.description,
        level: userInfo?.level,
        levels: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleTabChange = (tab: string) => {
        if (userInfo?.provider === "kakao") {
            alert("카카오 이용자는 비밀번호를 수정하실 수 없습니다.");
            return;
        }
        setShowPassword(true);
    };

    const handleUserDataChange = (fieldName: string, value: string) => {
        setUserData({ ...userData, [fieldName]: value });
    };
    const handleSubmit = async () => {
        try {
            let res;
            if (!userInfo?.tutor_idx) {
                const url = `${process.env.REACT_APP_API_SERVER}/api/studentProfile`;
                res = await axios.patch(url, {
                    nickname: userData.nickname,
                    password: userData.password,
                });
            } else {
                console.log(userData);
                const url = `${process.env.REACT_APP_API_SERVER}/api/tutorProfile`;
                res = await axios.patch(url, {
                    nickname: userData.nickname,
                    password: userData.password,
                    level: userData.level,
                    price: userData.price,
                    description: userData.description,
                });
            }
            alert(res.data.msg);
            getInfo();
        } catch (error) {
            console.error("프로필 수정 오류:", error);
        }
    };

    const handleImageChange = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            console.log(file);
            const url = `${process.env.REACT_APP_API_SERVER}/api/editPhoto`;
            const res = await axios.patch(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(profileImgUrl);
            getInfo();
            return;
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
            return;
        } catch (error) {
            console.error("기본 이미지로 변경하는 중 오류:", error);
        }
    };
    const handleLevelChange = (level: string) => {
        const currentLevels = [...userData.levels, userInfo?.level];
        const isLevelSelected = currentLevels.includes(level);

        const newLevels = isLevelSelected ? currentLevels.filter((l) => l !== level) : [level];

        setUserData({ ...userData, levels: newLevels });
        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="levels"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.value === level) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
            console.log(checkbox.checked);
        });
    };
    const handleIntroVideoUpload = async (file: File) => {
        try {
            if (!file) {
                console.error("파일이 선택되지 않았습니다.");
                return;
            }

            const formData = new FormData();
            formData.append("video", file);

            const url = `${process.env.REACT_APP_API_SERVER}/api/uploadVideo`;
            const res = await axios.patch(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("영상 업로드 완료:", res.data);
        } catch (error) {
            console.error("영상 업로드 오류:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) {
                console.error("파일이 선택되지 않았습니다.");
                return;
            }

            // 파일이 선택되면 영상 업로드 함수 호출
            handleIntroVideoUpload(file);
        } catch (error) {
            console.error("파일 선택 오류:", error);
        }
    };
    const handleIntroTextChange = (text: string) => {
        setUserData({ ...userData, description: text });
        console.log(userData);
    };

    const handleModal = (isModal: boolean) => {
        if (userInfo?.provider === "kakao") {
            alert("카카오 이용자는 이미지만 수정 가능합니다.");
            return;
        }
        setShowModal(isModal);
    };

    const onHideModifyPassword = () => {
        setShowPassword(false);
    };

    return (
        <>
            <p className="title">내 정보 확인 및 수정</p>
            <div className="mypage-profile-container">
                <div className="mypage-profile">
                    <div className="mypage-profile-img">
                        <div className="profile-img big">
                            <img src={profileImgUrl} alt="프로필 이미지" />
                        </div>
                    </div>
                    <div className="mypage-profile-img-btn">
                        <button onClick={handleDefaultImage}>기본 이미지</button>
                        <button onClick={handleImageUpload}>이미지 수정</button>
                    </div>
                </div>
                <div className="mypage-input-container">
                    <form action="">
                        <div>
                            <label htmlFor="">아이디</label>
                            <input type="text" value={userData.id} readOnly />
                        </div>
                        <div>
                            <label htmlFor="">닉네임</label>
                            {userInfo?.provider === "kakao" ? (
                                <input
                                    type="text"
                                    value={userData.nickname}
                                    onChange={(e) =>
                                        handleUserDataChange("nickname", e.target.value)
                                    }
                                    readOnly
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={userData.nickname}
                                    onChange={(e) =>
                                        handleUserDataChange("nickname", e.target.value)
                                    }
                                />
                            )}
                        </div>
                        {userInfo?.provider !== "kakao" && (
                            <div>
                                <label htmlFor="">이메일</label>
                                <input
                                    type="text"
                                    value={userData.email}
                                    // onChange={(e) => handleUserDataChange("email", e.target.value)}
                                    readOnly
                                />
                            </div>
                        )}
                        <div></div>
                        {userInfo?.tutor_idx && (
                            <>
                                <div className="level-check">
                                    <label htmlFor="">강의 레벨</label>
                                    <div>
                                        <input
                                            type="checkbox"
                                            id="beginner"
                                            name="levels"
                                            value="beginner"
                                            checked={userData.levels.includes("beginner")}
                                            onChange={() => handleLevelChange("beginner")}
                                        />
                                        <label htmlFor="beginner">초급</label>
                                        <input
                                            type="checkbox"
                                            id="intermediate"
                                            name="levels"
                                            value="intermediate"
                                            checked={userData.levels.includes("intermediate")}
                                            onChange={() => handleLevelChange("intermediate")}
                                        />
                                        <label htmlFor="intermediate">중급</label>
                                        <input
                                            type="checkbox"
                                            id="advanced"
                                            name="levels"
                                            value="advanced"
                                            checked={userData.levels.includes("advanced")}
                                            onChange={() => handleLevelChange("advanced")}
                                        />
                                        <label htmlFor="advanced">고급</label>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">가격</label>
                                    <input
                                        type="text"
                                        value={userData.price}
                                        onChange={(e) =>
                                            handleUserDataChange("price", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">자기소개 영상</label>
                                    <input type="file" onChange={handleFileSelect} />
                                </div>
                                <div className="textarea">
                                    <label htmlFor="">자기소개</label>
                                    <textarea
                                        value={userData.description}
                                        onChange={(e) => handleIntroTextChange(e.target.value)}
                                        cols={30}
                                        rows={10}
                                    ></textarea>
                                </div>
                            </>
                        )}
                    </form>
                    <div className="mypage-profile-btn">
                        <button onClick={() => handleTabChange("password")}>비밀번호 수정</button>
                        <button onClick={() => handleModal(!showModal)}>수정 내용 저장</button>
                    </div>
                </div>
            </div>

            <div>
                {showModal && (
                    <>
                        <div className="modal">
                            <div className="modal" onClick={() => handleModal(!showModal)}></div>
                            <div className="modal-content">
                                <p>프로필을 변경하시려면 비밀번호를 입력하세요.</p>
                                <div className="modal-password">
                                    <label htmlFor="">비밀번호</label>
                                    <input
                                        type="password"
                                        // value={userData.password}
                                        onChange={(e) =>
                                            handleUserDataChange("password", e.target.value)
                                        }
                                    />
                                    <button
                                        onClick={() => {
                                            handleSubmit();
                                            handleModal(!showModal);
                                        }}
                                    >
                                        수정 내용 저장
                                    </button>
                                </div>
                                <button
                                    className="hide"
                                    onClick={() => {
                                        handleModal(!showModal);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {showPassword && (
                    <div className="modal">
                        <div className="modal" onClick={onHideModifyPassword}></div>
                        <ModifyPassword
                            handleUserDataChange={handleUserDataChange}
                            currentPw={userData.password}
                            onHide={onHideModifyPassword}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
