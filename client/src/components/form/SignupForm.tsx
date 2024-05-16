import { useFormContext } from "react-hook-form";
import { RoleProps, SignupData } from "../../types/interface";
import PasswordInput from "../input/PasswordInput";
import styles from "./signupForm.module.scss";

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

    const onSubmit = async (data: SignupData) => {
        const { id, password, nickname, email, authDocument } = data;

        try {
            if (role === "tutor" && authDocument) {
                const formData = new FormData();
                formData.append("id", id);
                formData.append("password", password);
                formData.append("nickname", nickname);
                formData.append("email", email);
                formData.append("authDocument", authDocument[0]);
                await signup(role, formData);
            } else {
                const newData = { id, password, nickname, email };
                await signup(role, newData);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
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
                                {...register("id", {
                                    required: "아이디를 입력해주세요.",
                                    minLength: 6,
                                })}
                                id="id"
                                autoComplete="username"
                                placeholder="영어 소문자, 숫자 조합 6자 이상"
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
                                {...register("password", { required: true, minLength: 8 })}
                                id="pw"
                                placeholder="영문, 숫자 조합 8자 이상"
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
                                placeholder="example@example.com"
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
                                <div className={`${styles.doc_area}`}>
                                    <div className={`${styles.file_input}`}>
                                        <label htmlFor="auth_document">증빙 자료</label>
                                        <input
                                            type="file"
                                            id="auth_document"
                                            accept=".jpg, .jpeg, .png, .pdf"
                                            {...register("authDocument", { required: true })}
                                        />
                                    </div>
                                    <div className={`${styles.auth_document_desc}`}>
                                        <p>튜터로 등록하시려면 증빙 자료를 첨부해주세요.</p>
                                        <p>
                                            사진 파일(jpg, jpeg, png) 또는 pdf 파일을 첨부할 수
                                            있습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className={`${styles.submit_btn}`} type="submit">
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
