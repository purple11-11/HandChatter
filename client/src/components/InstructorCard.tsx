// InstructorCard.js

import React from "react";

interface Tutor {
    nickname: string;
    email: string;
    content: string;
    price: string;
}

interface Props {
    tutor: Tutor;
}

const InstructorCard: React.FC<Props> = ({ tutor }) => {
    return (
        <div className="card">
            <div className="profile">강사 사진</div>
            <div className="profiel-info">
                <ul>
                    <li>강사 이름: {tutor.nickname}</li>
                    <li>레슨 시간: {tutor.email}</li>
                    <li>가격: {tutor.price}</li>
                </ul>
            </div>
        </div>
    );
};

export default InstructorCard;
