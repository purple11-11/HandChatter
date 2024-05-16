import { RoleProps, SignupData } from "../../types/interface";
import styles from "./signup.module.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FormProvider, set, useForm } from "react-hook-form";
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
            certification: undefined,
        },
    });

    const { watch, reset } = methods;

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isCertified, setIsCertified] = useState(false);
    const [randomNum, setRandomNum] = useState(0);

    const navigateAndReset = (path: string) => {
        reset();
        navigate(path);
        setIsIdChecked(false);
        setIsNicknameChecked(false);
        setIsCertified(false);
    };

    const idValue = watch("id");
    const nicknameValue = watch("nickname");
    const emailValue = watch("email");
    const preIdValue = usePrevious(idValue);
    const preNicknameValue = usePrevious(nicknameValue);
    const preEmailValue = usePrevious(emailValue);

    useEffect(() => {
        if (idValue !== preIdValue) setIsIdChecked(false);
        if (nicknameValue !== preNicknameValue) setIsNicknameChecked(false);
        if (emailValue !== preEmailValue) setIsCertified(false);
    }, [idValue, nicknameValue, emailValue, preIdValue, preNicknameValue, preEmailValue]);

    /* axios */
    // 중복 체크(아이디, 닉네임)
    const checkDuplicate = async (keyword: string, value: string): Promise<void> => {
        if (!value) return alert(`${keyword === "id" ? "아이디를" : "닉네임을"} 입력해주세요.`);

        if (keyword === "id" && value.length < 6) return alert("아이디는 6자 이상이어야 합니다.");

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

    // 회원가입
    const signup = async (role: string, data: SignupData | FormData) => {

        if (!isIdChecked || !isNicknameChecked)
            return alert("아이디와 닉네임 모두 중복 확인을 해주세요.");

        if (!isCertified) return alert("이메일 인증을 해주세요.");

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
                navigate("/login");
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
                navigate("/login");
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data || error.message);
                } else if (error instanceof Error) {
                    alert(error.message);
                }
            }
        }
    };

    // 이메일 인증
    const sendEmail = async (email: string) => {
        if (!email) return alert("이메일을 입력해주세요.");

        if (!email.includes("@" && (".co" || ".com")))
            return alert("이메일 형식이 올바르지 않습니다.");

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_SERVER}/api/email`, {
                email,
            });

            if (res.data.randomNum) {
                setRandomNum(res.data.randomNum);
                alert("인증번호가 전송되었습니다.");
            } else alert(res.data);
        } catch (error) {
            console.error("이메일 전송 오류", error);
        }
    };

    // 인증번호 확인
    const checkCertification = (certification: number) => {
        if (!certification) return alert("인증번호를 입력해주세요.");

        if (certification === Number(randomNum)) {
            alert("인증되었습니다.");
            setIsCertified(true);
        } else {
            alert("인증번호가 일치하지 않습니다.");
        }
    };

    return (
        <section className="some-section">
            <div className={`${styles.signup_container}`}>
                <h2>{role === "student" ? "학생 " : "튜터 "} 회원가입</h2>
                <div className={`${styles.go_to_other_sign_up}`}>
                    {role === "student" ? (
                        <button type="button" onClick={() => navigateAndReset("/signup/tutor")}>
                            튜터로 가입하기
                        </button>
                    ) : (
                        <button type="button" onClick={() => navigateAndReset("/signup/student")}>
                            학생으로 가입하기
                        </button>
                    )}
                </div>
                <FormProvider {...methods}>
                    <SignupForm
                        role={role}
                        signup={signup}
                        checkDuplicate={checkDuplicate}
                        sendEmail={sendEmail}
                        checkCertification={checkCertification}
                    />
                </FormProvider>
            </div>
            <div className={`${styles.go_to_login}`}>
                <p>이미 계정이 있으신가요?</p>
                <Link to="/login">로그인</Link>
            </div>
        </section>
    );
}
