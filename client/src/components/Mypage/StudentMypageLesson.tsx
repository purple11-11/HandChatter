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
        fetchSearchResults();
    }, []); 

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
                    <li>현재 찜 목록이 비어있습니다.</li>
                )}
            </ul>
        </div>
    );
}
