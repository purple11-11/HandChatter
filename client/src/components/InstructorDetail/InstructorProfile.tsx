import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tutor } from "../../types/interface";
import { Link } from "react-router-dom";
interface InstructorProfileProps {
    tutor: Tutor | null;
    tutorIndex?: string;
    profileImgUrl?: string;
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({
    tutor,
    tutorIndex,
    profileImgUrl,
}) => {
    const [shortenedContent, setShortenedContent] = useState<string>(""); // 제한된 길이의 소개 내용
    const [isFavorite, setIsFavorite] = useState(false);
    // console.log(tutorIndex);
    const handleAddFavorite = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/favorites`;
            const res = await axios.post(url, {
                stu_idx: tutorIndex,
                tutor_idx: tutorIndex,
            });
            if (res.status === 200) {
                setIsFavorite(true);
                alert("찜 목록에 추가되었습니다.");
            }
        } catch (error) {
            console.error("찜하기 오류:", error);
            alert("찜하기에 실패했습니다.");
        }
    };

    useEffect(() => {
        if (tutor && tutor.content) {
            const maxLength = 100; // 최대 길이 설정
            const shortened = tutor.content.slice(0, maxLength);
            setShortenedContent(shortened);
        }
    }, [tutor?.content]);

    if (!tutor) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <img src={profileImgUrl} alt="" />
            </div>
            <div>
                <h2>{tutor.nickname}</h2>
                <p>{shortenedContent}</p>
                <button>
                    <Link to="/mypage">DM 보내기</Link>
                </button>
                <button onClick={handleAddFavorite}>찜하기</button>
            </div>
        </div>
    );
};

export default InstructorProfile;
