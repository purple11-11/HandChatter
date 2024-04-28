import { useFormContext } from "react-hook-form";
import { RoleProps, SignupData } from "../../types/interface";
import PasswordInput from "../input/PasswordInput";

// signup, checkDuplicate 함수를 props로 받아옴
interface SignupFormProps {
    checkDuplicate: (keyword: string, value: string) => Promise<void>;
    signup: (
        role: string,
        data: FormData | { id: string; password: string; nickname: string; email: string }
    ) => Promise<void>;
}

export default function SignupForm({ role, signup, checkDuplicate }: SignupFormProps & RoleProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useFormContext<SignupData>();

    const onSubmit = (data: SignupData) => {
        const { id, password, nickname, email, authDocument } = data;
        if (role === "tutor" && authDocument) {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("password", password);
            formData.append("nickname", nickname);
            formData.append("email", email);
            formData.append("authDocument", authDocument as File);
            signup?.(role, formData);
        } else {
            const newData = { id, password, nickname, email };
            signup?.(role, newData);
        }
    };

    return (
        <>
            <div className="signup_wrapper">
                <div className="basic_signup">
                    <form name="signup_form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="signup_id">
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                {...register("id", { required: "아이디를 입력해주세요." })}
                                id="id"
                                autoComplete="username"
                            />
                            <button type="button" onClick={() => checkDuplicate("id", watch("id"))}>
                                중복 확인
                            </button>
                        </div>
                        <div className="signup_pw">
                            <label htmlFor="pw">비밀번호</label>
                            <PasswordInput
                                type="password"
                                {...register("password", { required: true })}
                                id="pw"
                            />
                        </div>
                        <div className="signup_nickname">
                            <label htmlFor="nickname">닉네임</label>
                            <input
                                type="text"
                                {...register("nickname", { required: true })}
                                id="nickname"
                            />
                            <button
                                type="button"
                                onClick={() => checkDuplicate("nickname", watch("nickname"))}
                            >
                                중복 확인
                            </button>
                        </div>
                        <div className="signup_email">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                id="email"
                            />
                            <button type="button">인증</button>
                        </div>
                        {role !== "student" && (
                            <div className="sign_up_auth_document">
                                <label htmlFor="auth_document">증빙 자료</label>
                                <input
                                    type="file"
                                    id="auth_document"
                                    accept=".jpg, .jpeg, .png, .pdf"
                                    {...register("authDocument", { required: true })}
                                />
                            </div>
                        )}

                        <button type="submit">회원가입</button>
                    </form>
                </div>
            </div>
        </>
    );
}
