import React, { useState } from "react";

export default function MypageWithdrawMembership() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 회원탈퇴 요청 보내는 로직 구현
        console.log("회원탈퇴 요청: ", { userId, password });
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
                        />
                    </div>
                    <button type="submit">회원탈퇴</button>
                </form>
            </section>
        </>
    );
}
