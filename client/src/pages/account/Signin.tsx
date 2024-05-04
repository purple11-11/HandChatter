import { useState } from "react";
import LoginForm from "../../components/form/LoginForm";
import styles from "./signin.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RoleProps } from "../../types/interface";
import { useInfoStore } from "../../store/store";

export default function Signip() {
    const [role, setRole] = useState<RoleProps>({ role: "student" });

    const getInfo = useInfoStore((state) => state.getInfo);
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

            const res = await axios({
                method: "post",
                url: url,
                data: {
                    id: id,
                    password: pw,
                },
            });
            if (!res.data.isLogin) {
                alert("로그인 실패 \n" + res.data);
            } else {
                getInfo();
                navigate("/");
            }
        } catch (error: unknown) {
            // error가 AxiosError 타입인지 확인
            if (axios.isAxiosError(error)) {
                alert("로그인 실패 \n" + (error.response?.data || error.message));
            } else if (error instanceof Error) {
                alert("로그인 실패 \n" + error.message);
            }
        }
    };

    return (
        <section>
            <div className={`${styles.login_container}`}>
                <h2>{role.role === "student" ? "학생 " : "강사 "} 로그인</h2>
                <div className={`${styles.go_to_sign_up}`}>
                    <p>아직 회원이 아니신가요?</p>
                    <Link to="/signup/student">학생 회원가입</Link>
                    <Link to="/signup/tutor">강사 회원가입</Link>
                </div>
                <div className={`${styles.login_area}`}>
                    <div className={`${styles.role_toggle_btn}`}>
                        <div className={`${styles.student_btn}`}>
                            <button onClick={() => showLoginForm({ role: "student" })}>
                                학생 로그인
                            </button>
                        </div>
                        <div className={`${styles.tutor_btn}`}>
                            <button onClick={() => showLoginForm({ role: "tutor" })}>
                                강사 로그인
                            </button>
                        </div>
                    </div>
                    <div className={`${styles.login_box}`}>
                        <LoginForm role={role.role} login={login} />
                        <div className={`${styles.find_id_pw}`}>
                            <Link to="/find/id">아이디 찾기</Link>
                            <Link to="#">비밀번호 찾기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
