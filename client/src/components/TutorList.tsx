import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
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
    const [authority, setAuthority] = useState<number>(0);
    const [tutorId, setTutorId] = useState<string>("");

    const handleSubmit = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/admin/access`;
            const res = await axios.patch(url, {
                // patchData: [{ authority: authority, id: tutorId }],

                authority: authority,
                id: tutorId,
            });
            alert(res.data.msg);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert("권한 수정 오류 \n" + (error.response?.data.msg || error.message));
            } else if (error instanceof Error) {
                alert("권한 수정 오류 \n" + error.message);
            }
        }
    };

    return (
        <>
            <td>{tutor.id}</td>
            <td> {tutor.nickname}</td>
            <td>{tutor.email}</td>
            <td>
                {/* 이거 새 페이지로 가게 하기 */}
                <a
                    href={`${process.env.REACT_APP_API_SERVER}/${tutor.auth}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {tutor.id}_첨부파일
                </a>
            </td>
            <td>
                <select
                    name="authority"
                    id="authority"
                    onChange={(e) => {
                        setAuthority(Number(e.target.value));
                        setTutorId(tutor.id);
                    }}
                >
                    <option value="0" selected={tutor.authority === 0}>
                        예비튜터
                    </option>
                    <option value="1" selected={tutor.authority === 1}>
                        튜터
                    </option>
                </select>
            </td>
            <td>
                <button onClick={handleSubmit}>저장</button>
            </td>
        </>
    );
};

export default TutorList;
