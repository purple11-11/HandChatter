import CourseReview from "../components/InstructorDetail/CourseReview";
import InstructorProfile from "../components/InstructorDetail/InstructorProfile";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tutor } from "../types/interface";
import ReactPlayer from "react-player";
import room from "../assets/room.mp4";
export default function InstructorDetailPage() {
    const { tutorIndex } = useParams<{ tutorIndex: string }>(); // URL 파라미터에서 강사 ID 가져오기
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [profileImgUrl, setProfileImgUrl] = useState<string>("");

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                const url = `${process.env.REACT_APP_API_SERVER}/api/tutors/${tutorIndex}`;
                const res = await axios.get(url);
                console.log(res.data);
                const newProfileImgUrl =
                    process.env.REACT_APP_API_SERVER + "/" + res.data.tutorInfo.profile_img;
                setProfileImgUrl(newProfileImgUrl);
                setTutor(res.data.tutorInfo);
            } catch (error) {
                console.error("강사 정보를 불러오는 중 에러:", error);
            }
        };

        fetchTutor();
    }, [tutorIndex]);

    return (
        <section className="instructor-detail-section">
            <div className="container">
                <InstructorProfile
                    tutor={tutor}
                    tutorIndex={tutorIndex}
                    profileImgUrl={profileImgUrl}
                ></InstructorProfile>
                <div className="tutor-introduce-content">
                    <div className="tutor-video-introduce">
                        <div className="tutor-video">
                            {/* {`${process.env.REACT_APP_API_SERVER}/${tutor?.des_video}`} */}
                            {tutor?.des_video ? (
                                <ReactPlayer
                                    url={`${process.env.REACT_APP_API_SERVER}/${tutor?.des_video}`}
                                    controls
                                    loop={true}
                                    muted
                                    width={"100%"}
                                    height={"100%"}
                                />
                            ) : (
                                <p>자기소개 영상이 없습니다</p>
                            )}
                        </div>
                        <div className="tutor-introduce">
                            <p>{tutor?.description ? tutor.description : "내용이 없습니다."}</p>
                        </div>
                    </div>
                    <CourseReview tutorIdx={tutorIndex}></CourseReview>
                </div>
            </div>
        </section>
    );
}
