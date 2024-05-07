import axios from "axios";
import React, { useState, ChangeEvent } from "react";
import ModifyPassword from "../../components/Mypage/ModifyPassword";
import { useInfoStore } from "../../store/store";
import { setCommentRange } from "typescript";

interface Passwords {
    newPassword: string;
    confirmPassword: string;
}

interface ModifyPasswordProps {
    onHide: () => void;
}

export default function FindPw() {
    const [id, setId] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [certification, setCertification] = useState<number>(0);
    const [randomNum, setRandomNum] = useState<number>(0);
    const [isCertified, setIsCertified] = useState(false);
    const userInfo = useInfoStore((state) => state.userInfo);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState<Passwords>({
        newPassword: "",
        confirmPassword: "",
    });
    const [wrongPw1, setWrongPw1] = useState<string>("");

    const sendEmail = async () => {
        if (!id) return alert("아이디를 입력해주세요.");
        if (!email) return alert("이메일을 입력해주세요.");
        if (!email.includes("@" && (".co" || ".com")))
            return alert("이메일 형식이 올바르지 않습니다.");

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_SERVER}/api/searchPassword`, {
                id,
                email,
            });

            if (res.data.randomNum) {
                setRandomNum(res.data.randomNum);
                alert("인증번호가 전송되었습니다.");
            } else alert(res.data);
        } catch (error) {
            console.error("이메일 전송 오류", error);
        }
    };
    const checkCertification = (certification: number) => {
        if (!certification) return alert("인증번호를 입력해주세요.");
        if (certification === Number(randomNum)) {
            alert("인증되었습니다.");
            setIsCertified(true);
            handleShowPasswordModal();
        } else {
            alert("인증번호가 일치하지 않습니다.");
        }
    };
    const handleShowPasswordModal = () => {
        setShowPasswordModal(true); // 모달 표시 상태를 true로 설정
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPasswords({
            ...passwords,
            [name]: value,
        });
    };
    const handleCheckPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value !== passwords.newPassword) {
            setWrongPw1("비밀번호가 일치하지 않습니다.");
        } else {
            setWrongPw1("비밀번호가 일치합니다.");
        }
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };
    const handleSaveChanges = async () => {
        // 변경사항 저장 버튼 클릭 시 처리할 로직
        // 비밀번호 바꾸는 api 백에서 작성 후 patch axios 요청문 쓰면 될 듯.
    };
    const onHideModifyPassword = () => {
        setShowPasswordModal(false);
    };

    return (
        <section>
            <div>
                <h2>비밀번호 변경</h2>
                <div>
                    <div>
                        <label htmlFor="id">아이디</label>
                        <input
                            type="text"
                            id="id"
                            value={id || ""}
                            onChange={(e) => setId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="button" onClick={sendEmail}>
                        인증번호 발송
                    </button>
                    <div>
                        <label htmlFor="certification">인증번호</label>
                        <input
                            type="number"
                            id="certification"
                            value={certification || ""}
                            onChange={(e) => setCertification(parseInt(e.target.value))}
                            required
                        />
                    </div>
                    <button type="button" onClick={() => checkCertification(Number(certification))}>
                        인증 확인
                    </button>
                    <div className="change_password">
                        {showPasswordModal && ( // 모달 표시 여부에 따라 모달 컴포넌트를 렌더링
                            <div className="modal">
                                <div className="modal" onClick={onHideModifyPassword}></div>
                                <div className="modal-content">
                                    <div>
                                        <label htmlFor="newPassword">새 비밀번호</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handleCheckPassword}
                                        />
                                    </div>
                                    <div className="check">{wrongPw1}</div>
                                    <button onClick={handleSaveChanges}>변경사항 저장</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
