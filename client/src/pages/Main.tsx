import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import InstructorCard from "../components/InstructorCard";
import { Tutor } from "../types/interface";
import mainImg from "../assets/mainImg.jpg";

export default function Main() {
    const url = "http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";
    const apiKey = "5e912661-427a-40bb-814d-facab428d26f";
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Tutor[]>([]);
    const [error, setError] = useState<string>("");

    const filterTutorsByNickname = (tutors: Tutor[], searchTerm: string): Tutor[] => {
        if (!searchTerm) {
            return tutors; // 검색어가 없으면 모든 강사를 반환
        }

        const filteredTutors = tutors.filter((tutor) =>
            tutor.nickname.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredTutors;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchTutor = async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api`;
            const res = await axios.get(url);
            const filteredTutors = filterTutorsByNickname(res.data.tutorsInfo, searchTerm);
            setSearchResults(filteredTutors);
            setError("");
        } catch (error) {
            setError("검색 중 오류가 발생");
        }
    };

    useEffect(() => {
        handleSearchTutor(); // 초기 렌더링 시에 강사 정보를 불러옴
    }, []);

    // const handleSearch = async () => {
    //     try {
    //         console.log("하이");
    //         const response = await axios.get(url, {
    //             params: {
    //                 serviceKey: apiKey,
    //                 // numOfRows: "10",
    //                 // pageNo: "1",
    //             },
    //         });
    //         const { data } = response;
    //         console.log(data.response.body.items.item);

    //         const results: Sign[] = data.response.body.items.item;
    //         console.log(results);
    //         setSearchResults(results);
    //         setError("");
    //     } catch (error) {
    //         setSearchResults([]);
    //         setError("검색 중 오류가 발생했습니다.");
    //     }
    // };

    return (
        <div>
            <section className="main-banner">
                <div>WELCOME TO HAND CHATTER</div>
            </section>
            <section className="ourtutor">
                <div className="container">
                    <p>Our Tutor</p>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="    튜터 검색"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        <button onClick={handleSearchTutor}>검색</button>
                    </div>
                    {error && <p>{error}</p>}
                    <ul className="card-container">
                        {searchResults &&
                            searchResults.map((tutor, index) => (
                                <li key={index}>
                                    <Link to={`/tutors/${index + 1}`}>
                                        <InstructorCard tutor={tutor}></InstructorCard>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            </section>
            {/* <section>
                <div>
                    <input
                        type="text"
                        placeholder="수어 검색"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button onClick={handleSearch}>검색</button>
                    {error && <p>{error}</p>}
                    <ul>
                        {searchResults.map((sign, index) => (
                            <li key={index}>
                                {/* <img src={sign.url} alt={sign.title} /> 
                                <p>
                                    <a href={sign.url} target="_blank">
                                        {sign.title}
                                    </a>
                                </p>
                                <img src={sign.referenceIdentifier} alt="" />
                                <p>{sign.title}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section> */}
        </div>
    );
}
