import React, { useState } from "react";
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
const Slider: React.FC<Props> = ({ tutor }) => {

    return (
        <>
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
        </>
    );
};

export default Slider;
