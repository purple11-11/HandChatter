import { useState } from "react";
import LoginForm from "../../components/form/LoginForm";
import "../../styles/pages/account/signin.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RoleProps } from "../../types/interface";

export default function Signip() {
    const [role, setRole] = useState<RoleProps>({ role: "student" });
    function showLoginForm(role: RoleProps) {
        setRole(role);
    }

    const navigate = useNavigate();

    // axios
    const login = async (role: string, id: string, pw: string): Promise<void> => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/login${
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
                    navigate("/");
                }
            });
        } catch (error) {
            console.error("로그인 오류", error);
        }
    };

    return (
        <section>
            <div className="login_container">
                <h2>{role.role === "student" ? "학생 " : "강사 "} 로그인</h2>
                <div className="go_to_sign_up">
                    <p>아직 회원이 아니신가요?</p>
                    <Link to="/signup/student">학생 회원가입</Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="/signup/tutor">강사 회원가입</Link>
                </div>
                <div className="role_toggle_btn">
                    <div className="student_btn">
                        <button onClick={() => showLoginForm({ role: "student" })}>
                            학생으로 로그인
                        </button>
                    </div>
                    <div className="tutor_btn">
                        <button onClick={() => showLoginForm({ role: "tutor" })}>
                            강사로 로그인
                        </button>
                    </div>
                </div>
                <div className="login_box">
                    <LoginForm role={role.role} login={login} />
                    <div className="find_id_pw">
                        <Link to="/find/id">아이디 찾기</Link> | <Link to="#">비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
