import { useEffect, useState } from "react";
import TutorList from "../../components/TutorList";
import axios from "axios";
import "../../styles/pages/admin.scss";

interface Tutor {
    tutor_idx: number;
    id: string;
    nickname: string;
    email: string;
    auth: string;
    authority: number;
}

export default function Admin() {
    const [tutorResults, setTutorResults] = useState<Tutor[]>([]);
    const [error, setError] = useState<string>("");

    const handleTutor = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/admin`;
            const res = await axios.get(url);
            const tutorList: Tutor[] = res.data.users;

            setTutorResults([...tutorResults, ...tutorList]);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert("튜터 조회 중 오류 발생 \n" + (error.response?.data || error.message));
                document.location.href = "/adminLogin";
            } else if (error instanceof Error) {
                alert("튜터 조회 중 오류 발생 \n" + error.message);
                document.location.href = "/adminLogin";
            }
        }
    };
    const handleLogout = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/admin/logout`;
            await axios.post(url);
            document.location.href = "/adminLogin";
        } catch (error) {
            console.error("로그아웃 오류:", error);
        }
    };

    useEffect(() => {});

    useEffect(() => {
        handleTutor();
    }, []);

    return (
        <>
            <section className="some-section">
                <h1>Our Tutors</h1>
                <table>
                    <tr className="first_tr">
                        <th></th>
                        <th>아이디</th>
                        <th>닉네임</th>
                        <th>메일</th>
                        <th>자격증</th>
                        <th>권한</th>
                    </tr>
                    {tutorResults.map((tutor, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <TutorList tutor={tutor}></TutorList>
                        </tr>
                    ))}
                </table>
                <button onClick={handleLogout} className="logout_btn">
                    로그아웃
                </button>
            </section>
        </>
    );
}
