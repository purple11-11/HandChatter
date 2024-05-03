// InstructorCard.js

import React from "react";
import mainImg from "../assets/mainImg.jpg";

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
            <div className="gradi">
                <div className="profile-info">
                    <ul>
                        <li>{tutor.nickname}</li>
                        <li>{tutor.email}</li>
                        <li>{tutor.content}안녕하세요 제이름은 이기혁입니다</li>
                        <li>{tutor.price} 원</li>
                    </ul>
                </div>
            </div>
            <div className="profile">
                <img src={mainImg} alt="" />
            </div>
        </div>
    );
};

export default InstructorCard;
