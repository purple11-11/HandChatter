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
    const [authority, setAuthority] = useState<number>(0);
    const [tutorId, setTutorId] = useState<string>("");
    const handleTutor = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/admin`;
            const res = await axios.get(url);
            const tutorList: Tutor[] = res.data.users;

            console.log(tutorList);
            setTutorResults([...tutorResults, ...tutorList]);
        } catch (error) {
            setError("튜터 조회 중 오류 발생");
        }
    };

    useEffect(() => {});

    useEffect(() => {
        handleTutor();
        console.log(tutorResults);
    }, []);

    // useEffect(() => {}, [tutorResults]);

    return (
        <>
            <section>
                <h1>Our Tutors</h1>
                <table>
                    <tr className="first_tr">
                        <th>인덱스</th>
                        <th>아이디</th>
                        <th>닉네임</th>
                        <th>메일</th>
                        <th>자격증</th>
                        <th>권한</th>
                    </tr>
                    {tutorResults.map((tutor, index) => (
                        <tr key={index}>
                            <TutorList tutor={tutor}></TutorList>
                        </tr>
                    ))}
                </table>
            </section>
        </>
    );
}
