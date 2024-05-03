// InstructorCard.js

import React from "react";
import mainImg from "../assets/mainImg.jpg";

interface Tutor {
    nickname: string;
    email: string;
    description: string;
    price: string;
    profile_img: string;
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
                        <li>{tutor.description}</li>
                        <li>{tutor.price} 원</li>
                    </ul>
                </div>
            </div>
            <div className="profile">
                <img src={`${process.env.REACT_APP_API_SERVER}/${tutor.profile_img}`} alt="" />
            </div>
        </div>
    );
};

export default InstructorCard;
