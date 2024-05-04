import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

interface SigninData {
    id: string;
    pw: string;
}

interface LoginProps {
    login: (id: string, pw: string) => Promise<void>;
}

export default function AdminLogin() {
    const [formData, setFormData] = useState({ id: "", pw: "" });
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
    const navigate = useNavigate();
    const onSubmit = (data: SigninData) => {
        const { id, pw } = data;
        if (!id || !pw) {
            alert("빈칸을 입력해주세요.");
            return;
        }
        try {
            const adminId = "admin123";
            const adminPw = "admin123";

            if (id === adminId) {
                if (pw === adminPw) {
                    navigate("/admin");
                } else alert("관리자 비밀번호와 일치하지 않습니다. 다시 시도해주세요.");
            } else alert("관리자 아이디가 아닙니다. 다시 시도해주세요.");

            setFormData({ id: "", pw: "" });
        } catch (error) {
            console.error("관리자 로그인 오류", error);
        }
    };
    return (
        <section>
            <div className="login_container">
                <h2>관리자 로그인</h2>
                <div className="login_box">
                    <form name="login_form" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            {...register("id")}
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        />
                        <input
                            type="password"
                            {...register("pw")}
                            value={formData.pw}
                            onChange={(e) => setFormData({ ...formData, pw: e.target.value })}
                        />
                        <button type="submit">로그인</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
