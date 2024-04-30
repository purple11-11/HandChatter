// TutorDetailPage.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tutor } from "../../types/interface";

interface InstructorProfileProps {
    tutor: Tutor | null;
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({ tutor }) => {
    const [shortenedContent, setShortenedContent] = useState<string>(""); // 제한된 길이의 소개 내용

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
            <h2>{tutor.nickname} 강사 상세 페이지</h2>
            <p>소개: {shortenedContent}</p>
        </div>
    );
};

export default InstructorProfile;
