import React, { useState, ChangeEvent } from "react";

interface Passwords {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ModifyPasswordProps {
    handleUserDataChange: (name: string, value: string) => void;
    currentPw: string;
}

const ModifyPassword: React.FC<ModifyPasswordProps> = ({ handleUserDataChange, currentPw }) => {
    const [passwords, setPasswords] = useState<Passwords>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [wrongPw1, setWrongPw1] = useState<string>("");
    const [wrongPw2, setWrongPw2] = useState<string>("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "currentPassword") {
            if (value !== currentPw) {
                setWrongPw1("비밀번호가 일치하지 않습니다.");
            } else {
                setWrongPw1("비밀번호가 일치합니다.");
                setPasswords({
                    ...passwords,
                    [name]: value,
                });
            }
        } else {
            setPasswords({
                ...passwords,
                [name]: value,
            });
        }
    };

    const handleCheckPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value !== passwords.newPassword) {
            setWrongPw2("비밀번호가 일치하지 않습니다.");
        } else {
            setWrongPw2("비밀번호가 일치합니다.");
        }
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    const handleSaveChanges = () => {
        if (passwords.newPassword === passwords.confirmPassword) {
            handleUserDataChange("password", passwords.newPassword);
        } else {
            alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        }
    };

    return (
        <>
            <section>
                <h1>비밀번호 변경</h1>
                <div>
                    <label htmlFor="currentPassword">현재 비밀번호</label>
                    <br />
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        onChange={handleInputChange}
                    />
                </div>
                <div>{wrongPw1}</div>
                <div>
                    <label htmlFor="newPassword">새 비밀번호</label>
                    <br />
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
                    <br />
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleCheckPassword}
                    />
                </div>
                <div>{wrongPw2}</div>
                <button onClick={handleSaveChanges}>변경사항 저장</button>
            </section>
        </>
    );
};

export default ModifyPassword;
