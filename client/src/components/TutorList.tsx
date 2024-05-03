import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
// import "../styles/components/tutorList.scss";
import { Link } from "react-router-dom";

interface Tutor {
    tutor_idx: number;
    id: string;
    nickname: string;
    email: string;
    auth: string;
    authority: number;
}

interface Props {
    tutor: Tutor;
}

const TutorList: React.FC<Props> = ({ tutor }) => {
    return (
        <>
            <td>{tutor.tutor_idx}</td>
            <td>{tutor.id}</td>
            <td> {tutor.nickname}</td>
            <td>{tutor.email}</td>
            <td>
                {/* 이거 새 페이지로 가게 하기 */}
                <Link to={`${process.env.REACT_APP_API_SERVER}/${tutor.auth}`}>
                    {tutor.id}_첨부파일
                </Link>
            </td>
            <td>
                <select name="authority" id="authority">
                    <option value="0">예비튜터</option>
                    <option value="1">튜터</option>
                </select>
            </td>
        </>
    );
};

export default TutorList;
