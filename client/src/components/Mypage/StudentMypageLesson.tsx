import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InstructorCard from "../InstructorCard";
import { Tutor } from "../../types/interface";

interface LikeTutor {
    like_idx: number;
    tutor_idx: number;
    student_idx: number;
    Tutor: Tutor;
}

export default function StudentMypageLesson() {
    const [searchResults, setSearchResults] = useState<LikeTutor[]>();
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [profileImgUrl, setProfileImgUrl] = useState<string>("");
    useEffect(() => {
        // API 호출 함수 정의
        const fetchSearchResults = async () => {
            try {
                const url = `${process.env.REACT_APP_API_SERVER}/api/favoritesTutor`;
                const res = await axios.get(url);
                console.log(res.data.favorites);
                setSearchResults(res.data.favorites);
            } catch (error) {
                console.error("API 호출 오류:", error);
            }
        };
        // 페이지 로드 시 API 호출 함수 실행
        fetchSearchResults();
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때 한 번만 실행

    return (
        <div className="like-container">
            <ul className="card-container">
                {searchResults ? (
                    searchResults.map((tutor, index) => (
                        <li key={index}>
                            <Link to={`/tutors/${index + 1}`}>
                                <InstructorCard tutor={tutor.Tutor}></InstructorCard>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>No data available</li>
                )}
            </ul>
        </div>
    );
}
