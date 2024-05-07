import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Tutor } from "../../types/interface";
import { Link } from "react-router-dom";
import { useInfoStore } from "../../store/store";
import fullHeart from "../../assets/fullheart.png";
import poorHeart from "../../assets/poorheart.png";
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
    const [shortenedContent, setShortenedContent] = useState<string>("");
    const userInfo = useInfoStore((state) => state.userInfo);
    const isLogin = useInfoStore((state) => state.isLogin);
    const favorites = useInfoStore((state) => state.favorites);
    const togglefavorite = useInfoStore((state) => state.toggleFavorite);
    const dmToTutor = useInfoStore((state) => state.dmToTutor);
    const isFavorite = useInfoStore((state) => state.isFavorite);
    const navigate = useNavigate();
    const handleAddFavorite = async () => {
        try {
            if (!isLogin) {
                alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
                navigate("/login");
                return;
            }
            if (!tutorIndex) return;
            const url = `${process.env.REACT_APP_API_SERVER}/api/favorites`;
            const res = await axios.post(url, {
                stu_idx: userInfo?.stu_idx,
                tutor_idx: tutorIndex,
            });
            if (res.status === 200) {
                togglefavorite(tutorIndex);
                alert("찜 목록에 추가되었습니다.");
            } else {
                togglefavorite(tutorIndex);
            }
        } catch (error) {
            console.error("찜하기 오류:", error);
            alert("찜하기에 실패했습니다.");
        }
    };

    const handleRemoveFavorite = async () => {
        try {
            if (!isLogin) {
                alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
                navigate("/login");
                return;
            }
            if (!tutorIndex) return;
            const url = `${process.env.REACT_APP_API_SERVER}/api/favorites`;
            const res = await axios.delete(url, {
                data: {
                    tutor_idx: tutorIndex,
                },
            });
            if (res.status === 200) {
                togglefavorite(tutorIndex);
                alert("찜이 취소되었습니다.");
            }
        } catch (error) {
            console.error("찜하기 해제 오류:", error);
            alert("찜하기 해제에 실패했습니다.");
        }
    };

    useEffect(() => {
        if (tutor && tutor.description) {
            const maxLength = 100;
            const shortened = tutor.description.slice(0, maxLength);
            setShortenedContent(shortened);
        }
    }, [tutor?.description]);

    if (!tutor || !tutorIndex) {
        return <div>Loading...</div>;
    }
    console.log(favorites[tutorIndex]);
    const handleDM = () => {
        if (!isLogin) {
            alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
            navigate("/login");
            return;
        }
        if (userInfo?.tutor_idx) {
            alert("강사가 강사에게 메시지를 보낼 수 없습니다.");
            return;
        }
        navigate(`/mypage/${userInfo?.stu_idx}`);
    };

    return (
        <div className="instructor-profile">
            <div className="profile-img big">
                <img src={profileImgUrl} alt="" />
            </div>
            <div className="profile-content">
                <h2>{tutor.nickname}</h2>
                <p>{shortenedContent ? shortenedContent : "안녕하세요"}</p>
                <div>
                    <button
                        className="dm"
                        onClick={() => {
                            handleDM();
                            tutorIndex && dmToTutor(tutorIndex);
                        }}
                    >
                        DM 보내기
                    </button>

                    {favorites[tutorIndex] && favorites[tutorIndex] === true ? (
                        <button className="favorite" onClick={handleRemoveFavorite}>
                            <img src={fullHeart} />
                        </button>
                    ) : (
                        <button className="favorite" onClick={handleAddFavorite}>
                            <img src={poorHeart} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;
