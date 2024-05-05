import kakaoLogo from "../../assets/Kakao.png";
import { useForm } from "react-hook-form";
import PasswordInput from "../input/PasswordInput";
import { RoleProps } from "../../types/interface";
import { Link } from "react-router-dom";
import styles from "./loginForm.module.scss";

interface SigninData {
    id: string;
    pw: string;
}
interface LoginProps {
    login: (role: string, id: string, pw: string) => Promise<void>;
}

export default function LoginForm({ role, login }: RoleProps & LoginProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninData>({
        mode: "onSubmit",
        defaultValues: {
            id: "",
            pw: "",
        },
    });

    const onSubmit = async (data: SigninData) => {
        try {
            const { id, pw } = data;
            await login(role, id, pw);
        } catch (error) {
            console.error("로그인 오류", error);
        }
    };

    return (
        <>
            <div className={`${styles.login_wrapper}`}>
                <form name="login_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${styles.id_wrap}`}>
                        <label htmlFor="id">아이디</label>
                        <input
                            type="text"
                            {...register("id", { required: true })}
                            id="id"
                            autoComplete="username"
                        />
                    </div>
                    <div className={`${styles.pw_wrap}`}>
                        <label htmlFor="pw">비밀번호</label>
                        <PasswordInput
                            type="password"
                            {...register("pw", { required: true })}
                            id="pw"
                        />
                    </div>
                    <button className={`${styles.login_btn}`} type="submit">
                        로그인
                    </button>
                    {role === "student" && (
                        <div className={`${styles.social_login}`}>
                            <Link to={`${process.env.REACT_APP_API_SERVER}/auth/kakao`}>
                                <button type="button">
                                    <img src={kakaoLogo} alt="카카오 로그인 버튼" width={25} />
                                    카카오톡 로그인
                                </button>
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
