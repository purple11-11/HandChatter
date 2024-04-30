import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MypageWithdrawMembership() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userId || !password) return alert("아이디와 비밀번호를 입력해주세요.");

        const res = await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_SERVER}/api/withdrawal`,
            data: { id: userId, password },
        });

        if (res.data.success) {
            alert("회원탈퇴가 완료되었습니다.");
            navigate("/");
        } else {
            alert(res.data);
        }
    };

    return (
        <>
            <section>
                <p>회원탈퇴를 위해 아이디와 비밀번호를 입력해주세요.</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="userId">아이디:</label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={handleUserIdChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">비밀번호:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit">회원탈퇴</button>
                </form>
            </section>
        </>
    );
}
