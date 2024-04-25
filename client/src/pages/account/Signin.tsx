import { useState } from "react";
import LoginForm from "../../components/form/LoginForm";
import "../../styles/pages/account/signin.scss";

export default function SignUp() {
    const [role, setRole] = useState<string>("student");
    function showLoginForm(role: string) {
        setRole(role);
    }

    return (
        <>
            <div className="login_container">
                <div className="role_toggle_btn">
                    <div className="student_btn">
                        <button onClick={() => showLoginForm("student")}>학생으로 로그인</button>
                    </div>
                    <div className="tutor_btn">
                        <button onClick={() => showLoginForm("tutor")}>강사로 로그인</button>
                    </div>
                </div>
                <div className="login_box">
                    <div className="go_to_sign_up">
                        <p>아직 회원이 아니신가요?</p>
                        <a href="/api/student">학생 회원가입</a>
                        &nbsp;&nbsp;&nbsp;
                        <a href="/api/tutor">강사 회원가입</a>
                    </div>

                    {role && <LoginForm role={role} />}

                    <div className="find_id_pw">
                        <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a>
                    </div>
                </div>
            </div>
        </>
    );
}
