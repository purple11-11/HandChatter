import axios from "axios";
import { useState } from "react";
import ModifyPassword from "../../components/Mypage/ModifyPassword";

export default function FindPw() {
    const [id, setId] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const findPw = async () => {
        if (!email) return alert("이메일을 입력해주세요.");

        const res = await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_SERVER}/api/searchPassword?id=${id} email=${email}`,
        });
    };

    return (
        <section>
            <div>
                <h2>비밀번호 변경</h2>
                <div>
                    <div>
                        <label htmlFor="id">아이디</label>
                        <input type="text" id="id" required />
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
                    <button>인증번호 발송</button>
                    <div>
                        <label htmlFor="id">인증번호</label>
                        <input type="text" id="id" required />
                    </div>
                    <button>인증번호 확인</button>
                    <div>
                        <label htmlFor="id">새 비밀번호</label>
                        <input type="text" id="id" required />
                    </div>
                    <div>
                        <label htmlFor="id">새 비밀번호 확인</label>
                        <input type="text" id="id" required />
                    </div>

                    <button type="button" onClick={findPw}>
                        비밀번호 찾기
                    </button>

                    {/* <div className="change_password">
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
                    </div> */}
                </div>
            </div>
        </section>
    );
}
