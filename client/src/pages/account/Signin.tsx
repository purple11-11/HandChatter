import { useState } from "react";
import LoginForm from "../../components/form/LoginForm";
import "../../styles/pages/account/signin.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signip() {
    const [role, setRole] = useState<string>("student");
    function showLoginForm(role: string) {
        setRole(role);
    }

    const navigate = useNavigate();

    // axios
    const login = async (role: string, id: string, pw: string): Promise<void> => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/login${
                role === "student" ? "Student" : "Tutor"
            }`;

            await axios({
                method: "post",
                url: url,
                data: {
                    id: id,
                    password: pw,
                },
            }).then((res) => {
                if (!res.data.isLogin) {
                    alert("로그인 실패 \n" + res.data);
                } else {
                    navigate("/api");
                }
            });
        } catch (error) {
            console.error("로그인 오류", error);
        }
    };

    return (
        <>
            <div className="login_container">
                <h2>{role === "student" ? "학생 " : "강사 "} 로그인</h2>
                <div className="go_to_sign_up">
                    <p>아직 회원이 아니신가요?</p>
                    <Link to="/api/student">학생 회원가입</Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="/api/tutor">강사 회원가입</Link>
                </div>
                <div className="role_toggle_btn">
                    <div className="student_btn">
                        <button onClick={() => showLoginForm("student")}>학생으로 로그인</button>
                    </div>
                    <div className="tutor_btn">
                        <button onClick={() => showLoginForm("tutor")}>강사로 로그인</button>
                    </div>
                </div>
                <div className="login_box">
                    {role && <LoginForm role={role} login={login} />}

                    <div className="find_id_pw">
                        <Link to="#">아이디 찾기</Link> | <Link to="#">비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
