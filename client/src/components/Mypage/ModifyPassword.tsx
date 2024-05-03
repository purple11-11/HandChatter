import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useInfoStore } from "../../store/store";
interface Passwords {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ModifyPasswordProps {
    handleUserDataChange: (name: string, value: string) => void;
    currentPw: string;
    onHide: () => void;
}

const ModifyPassword: React.FC<ModifyPasswordProps> = ({
    handleUserDataChange,
    currentPw,
    onHide,
}) => {
    const [passwords, setPasswords] = useState<Passwords>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [wrongPw1, setWrongPw1] = useState<string>("");
    const [wrongPw2, setWrongPw2] = useState<string>("");
    const userInfo = useInfoStore((state) => state.userInfo);
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
            setWrongPw2("비밀번호가 일치하지 않습니다.");
        } else {
            setWrongPw2("비밀번호가 일치합니다.");
        }
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            let res;
            if (!userInfo?.tutor_idx) {
                const url = `${process.env.REACT_APP_API_SERVER}/api/editStudentPassword`; // Update the URL according to your API endpoint
                res = await axios.patch(url, {
                    password: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                });
                const { result, msg } = res.data;
                if (result) {
                    handleUserDataChange("password", passwords.newPassword);
                    onHide();
                    alert(msg);
                } else {
                    alert(msg);
                }
            } else {
                const url = `${process.env.REACT_APP_API_SERVER}/api/editTutorPassword`; // Update the URL according to your API endpoint
                res = await axios.patch(url, {
                    password: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                });
                const { result, msg } = res.data;
                if (result) {
                    handleUserDataChange("password", passwords.newPassword);
                    onHide();
                    alert(msg);
                } else {
                    alert(msg);
                }
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("비밀번호 업데이트 중 오류가 발생했습니다.");
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
