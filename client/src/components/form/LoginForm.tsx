import kakaoLogo from "../../assets/Kakao.png";

interface Props {
    role: string;
}

export default function LoginForm({ role }: Props) {
    return (
        <>
            <div className="login_wrapper">
                <h2>{role === "student" ? "학생 " : "강사 "} 로그인</h2>
                <div className="basic_login">
                    <form name="login_form">
                        <input type="text" placeholder="ID" name="id" />
                        <input type="password" placeholder="Password" name="pw" />
                        <button>로그인</button>
                    </form>

                    <div className="social_login">
                        <button>
                            <img src={kakaoLogo} alt="카카오 로그인 버튼" width={25} />
                            카카오톡 로그인
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
