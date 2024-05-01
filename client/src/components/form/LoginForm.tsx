import kakaoLogo from "../../assets/Kakao.png";
import { useForm } from "react-hook-form";
import PasswordInput from "../input/PasswordInput";
import { RoleProps } from "../../types/interface";
import { Link } from "react-router-dom";

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
            <div className="login_wrapper">
                <div className="basic_login">
                    <form name="login_form" onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="id">ID</label>
                        <input
                            type="text"
                            {...register("id", { required: true })}
                            id="id"
                            autoComplete="username"
                        />
                        <label htmlFor="pw">비밀번호</label>
                        <PasswordInput
                            type="password"
                            {...register("pw", { required: true })}
                            id="pw"
                        />

                        <button type="submit">로그인</button>
                    </form>
                    {role === "student" && (
                        <div className="social_login">
                            <Link to={`${process.env.REACT_APP_API_SERVER}/auth/kakao`}>
                                <button type="button">
                                    <img src={kakaoLogo} alt="카카오 로그인 버튼" width={25} />
                                    카카오톡 로그인
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
