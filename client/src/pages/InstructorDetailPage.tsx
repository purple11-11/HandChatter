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
                const newProfileImgUrl = res.data.tutorInfo.profile_img.replace(
                    ".",
                    process.env.REACT_APP_API_SERVER
                );
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
            <div>
                <InstructorProfile tutor={tutor} tutorIndex={tutorIndex} profileImgUrl={profileImgUrl}></InstructorProfile>
                <div>
                    <div>
                        <div>{tutor?.des_video}</div>
                        <div>{tutor?.content}</div>
                    </div>
                    <CourseReview></CourseReview>
                </div>
            </div>
        </section>
    );
}
