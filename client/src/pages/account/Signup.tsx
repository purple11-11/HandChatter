import { RoleProps, SignupData } from "../../types/interface";
import "../../styles/pages/account/signup.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import usePrevious from "../../hooks/usePrevious";
import SignupForm from "../../components/form/SignupForm";

export default function StudentSignup({ role }: RoleProps) {
    const navigate = useNavigate();
    const methods = useForm<SignupData>({
        mode: "onSubmit",
        defaultValues: {
            id: "",
            password: "",
            nickname: "",
            email: "",
            authDocument: null,
        },
    });

    const { watch, reset } = methods;

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const navigateAndReset = (path: string) => {
        reset();
        navigate(path);
        setIsIdChecked(false);
        setIsNicknameChecked(false);
    };

    const idValue = watch("id");
    const nicknameValue = watch("nickname");
    const preIdVlaue = usePrevious(idValue);
    const preNicknameValue = usePrevious(nicknameValue);

    useEffect(() => {
        if (idValue !== preIdVlaue) setIsIdChecked(false);
        if (nicknameValue !== preNicknameValue) setIsNicknameChecked(false);
    }, [idValue, nicknameValue, preIdVlaue, preNicknameValue]);

    /* axios */
    const checkDuplicate = async (keyword: string, value: string): Promise<void> => {
        if (!value) return alert(`${keyword === "id" ? "아이디를" : "닉네임을"} 입력해주세요.`);

        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/check${
                role === "student" ? "Student" : "Tutor"
            }${keyword === "id" ? "Id" : "Nickname"}?${keyword}=${value}`;

            const res = await axios.get(url);

            if (res.data.available === false) {
                alert(`이미 사용중인 ${keyword === "id" ? "아이디" : "닉네임"}입니다.`);
            } else {
                alert(`사용 가능한 ${keyword === "id" ? "아이디" : "닉네임"}입니다.`);
                keyword === "id" ? setIsIdChecked(true) : setIsNicknameChecked(true);
            }
        } catch (error) {
            console.error("아이디 중복검사 오류", error);
        }
    };

    const signup = async (role: string, data: SignupData | FormData) => {
        if (!isIdChecked || !isNicknameChecked)
            return alert("아이디와 닉네임 모두 중복 확인을 해주세요.");

        if (data instanceof FormData) {
            const newFormData = new FormData();
            data.forEach((value, key) => {
                const newKey = key === "authDocument" ? "auth" : key;
                newFormData.append(newKey, value);
            });

            const nickname = newFormData.get("nickname") as string;

            try {
                const res = await axios({
                    method: "post",
                    url: `${process.env.REACT_APP_API_SERVER}/api/${role}`,
                    data: newFormData,
                    headers: { "Content-Type": "multipart/form-data" },
                });

                alert(`${res.data}! ${nickname}님 환영합니다🎉\n로그인 페이지로 이동합니다.`);
                navigate("/api/login");
            } catch (error) {
                console.error("회원가입 오류", error);
            }
        } else {
            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_API_SERVER}/api/${role}`,
                    data
                );

                alert(`${res.data}! ${data.nickname}님 환영합니다🎉\n로그인 페이지로 이동합니다.`);
                navigate("/api/login");
            } catch (error) {
                console.error("회원가입 오류", error);
            }
        }
    };

    return (
        <>
            <div className="signup_container">
                <h2>{role === "student" ? "학생 " : "강사 "} 회원가입</h2>
                <div className="go_to_other_sign_up">
                    {role === "student" ? (
                        <button type="button" onClick={() => navigateAndReset("/api/tutor")}>
                            강사로 가입하기
                        </button>
                    ) : (
                        <button type="button" onClick={() => navigateAndReset("/api/student")}>
                            학생으로 가입하기
                        </button>
                    )}
                </div>
                <span>이미 계정이 있으신가요?</span>
                &nbsp;
                <Link to="/api/login">로그인</Link>
                <FormProvider {...methods}>
                    <SignupForm role={role} signup={signup} checkDuplicate={checkDuplicate} />
                </FormProvider>
            </div>
        </>
    );
}
