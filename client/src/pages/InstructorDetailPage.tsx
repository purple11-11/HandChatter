import CourseReview from "../components/InstructorDetail/CourseReview";
import InstructorProfile from "../components/InstructorDetail/InstructorProfile";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tutor } from "../types/interface";

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
        <section>
            <div className="container">
                <InstructorProfile
                    tutor={tutor}
                    tutorIndex={tutorIndex}
                    profileImgUrl={profileImgUrl}
                ></InstructorProfile>
                <div className="tutor-introduce-content">
                    <div className="tutor-video-introduce">
                        <div className="tutor-video">
                            {tutor?.des_video ? (
                                <video controls>
                                    <source src={tutor?.des_video} type="video/mp4" />
                                </video>
                            ) : (
                                <p>자기소개 영상이 없습니다</p>
                            )}
                        </div>
                        <div className="tutor-introduce">
                            <p>{tutor?.content ? tutor.content : "내용이 없습니다."}</p>
                        </div>
                    </div>
                    <CourseReview></CourseReview>
                </div>
            </div>
        </section>
    );
}
