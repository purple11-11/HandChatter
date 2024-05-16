import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./adminLogin.module.scss";
import axios from "axios";
import { useInfoStore } from "../../store/store";

interface SigninData {
    id: string;
    password: string;
}

export default function AdminLogin() {
    const [formData, setFormData] = useState({ id: "", pw: "" });
    const getInfo = useInfoStore((state) => state.getInfo);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninData>({
        mode: "onSubmit",
        defaultValues: {
            id: "",
            password: "",
        },
    });
    const navigate = useNavigate();
    const login = async (data: SigninData) => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/admin/login`;
            const { id, password } = data;
            const res = await axios({
                method: "post",
                url: url,
                data: data,
            });
            if (!res.data.isAdminLogin) {
                alert("로그인 실패 \n" + res.data);
            } else {
                getInfo();
                navigate("/admin");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert("로그인 실패 \n" + (error.response?.data || error.message));
            } else if (error instanceof Error) {
                alert("로그인 실패 \n" + error.message);
            }
        }
    };
    return (
        <section className="some-section">
            <div className={`${styles.login_admin_wrapper}`}>
                <h2>관리자 로그인</h2>
                <div className={`${styles.login_box}`}>
                    <form name={`${styles.admin_login_form}`} onSubmit={handleSubmit(login)}>
                        <div className={`${styles.admin_id_wrap}`}>
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                {...register("id")}
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            />
                        </div>
                        <div className={`${styles.admin_pw_wrap}`}>
                            <label htmlFor="pw">비밀번호</label>
                            <input
                                type="password"
                                {...register("password")}
                                value={formData.pw}
                                onChange={(e) => setFormData({ ...formData, pw: e.target.value })}
                            />
                        </div>
                        <button className={`${styles.admin_login_btn}`} type="submit">
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
