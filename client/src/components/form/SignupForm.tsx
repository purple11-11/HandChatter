import { useFormContext } from "react-hook-form";
import { RoleProps, SignupData } from "../../types/interface";
import PasswordInput from "../input/PasswordInput";
import styles from "./signupForm.module.scss";
import React, { useCallback, useState } from "react";

// signup, checkDuplicate 함수를 props로 받아옴
interface SignupFormProps {
    checkDuplicate: (keyword: string, value: string) => Promise<void>;
    signup: (
        role: string,
        data: FormData | { id: string; password: string; nickname: string; email: string }
    ) => Promise<void>;
    sendEmail: (email: string) => Promise<void>;
    checkCertification: (certification: number) => void;
}

export default function SignupForm({
    role,
    signup,
    checkDuplicate,
    sendEmail,
    checkCertification,
}: SignupFormProps & RoleProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useFormContext<SignupData>();

    const [fileName, setFileName] = useState<string>("");
    const fileInputHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    }, []);

    const onSubmit = (data: SignupData) => {
        const { id, password, nickname, email, authDocument } = data;
        // TODO: tutor의 경우 authDocument가 없을 때 alert 띄우기
        /* if (role === "tutor" && authDocument) {
            if (!authDocument || authDocument.length === 0) {
                return alert("증빙 자료를 첨부해주세요.");
            } */

        if (role === "tutor" && authDocument) {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("password", password);
            formData.append("nickname", nickname);
            formData.append("email", email);
            formData.append("authDocument", authDocument[0]);
            signup(role, formData);
        } else {
            const newData = { id, password, nickname, email };
            signup(role, newData);
        }
    };

    return (
        <>
            <div
                className={
                    role === "student"
                        ? `${styles.signup_stu_wrapper}`
                        : `${styles.signup_tu_wrapper}`
                }
            >
                <form name="signup_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${styles.signup_input}`}>
                        <div className={`${styles.signup_id}`}>
                            <label htmlFor="id">아이디</label>
                            <input
                                type="text"
                                {...register("id", { required: "아이디를 입력해주세요." })}
                                id="id"
                                autoComplete="username"
                                placeholder="영문, 숫자 조합 6자 이상 입력"
                            />
                            <button
                                className={`${styles.check_btn}`}
                                type="button"
                                onClick={() => checkDuplicate("id", watch("id"))}
                            >
                                중복 확인
                            </button>
                        </div>
                        <div className={`${styles.signup_pw}`}>
                            <label htmlFor="pw">비밀번호</label>
                            <PasswordInput
                                type="password"
                                {...register("password", { required: true })}
                                id="pw"
                            />
                        </div>
                        <div className={`${styles.signup_nickname}`}>
                            <label htmlFor="nickname">닉네임</label>
                            <input
                                type="text"
                                {...register("nickname", { required: true })}
                                id="nickname"
                            />
                            <button
                                className={`${styles.check_btn}`}
                                type="button"
                                onClick={() => checkDuplicate("nickname", watch("nickname"))}
                            >
                                중복 확인
                            </button>
                        </div>
                        <div className={`${styles.signup_email}`}>
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                id="email"
                            />
                            <button
                                className={`${styles.check_btn}`}
                                type="button"
                                onClick={() => sendEmail(watch("email"))}
                            >
                                인증번호 발송
                            </button>
                        </div>
                        <div className={`${styles.signup_certification}`}>
                            <label htmlFor="certification">인증번호</label>
                            <input
                                type="number"
                                placeholder="숫자만 입력해주세요."
                                {...register("certification", { required: true })}
                                id="certification"
                            />
                            <button
                                className={`${styles.check_btn}`}
                                type="button"
                                onClick={() => checkCertification(Number(watch("certification")))}
                            >
                                인증 확인
                            </button>
                        </div>
                        {role !== "student" && (
                            <div className={`${styles.signup_auth_document}`}>
                                <label htmlFor="auth_document">
                                    증빙 자료
                                    <div className={`${styles.file_input}`}>
                                        <div className={`${styles.file_btn}`}>📁 파일 첨부</div>
                                        {fileName ? (
                                            <p>{fileName}</p>
                                        ) : (
                                            "강사 증명 파일을 첨부해주세요. (jpg,jpeg,png,pdf 가능)"
                                        )}
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="auth_document"
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    {...register("authDocument", { required: true })}
                                    onChange={fileInputHandler}
                                />
                            </div>
                        )}
                    </div>

                    <button className={`${styles.submit_btn}`} type="submit">
                        회원가입
                    </button>
                </form>
            </div>
        </>
    );
}
