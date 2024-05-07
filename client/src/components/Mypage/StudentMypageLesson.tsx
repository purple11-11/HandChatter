import React, { useState, useEffect, useRef } from "react";
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

    const cardContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cardContainer = cardContainerRef.current;
        const section = sectionRef.current;
        const container = containerRef.current;
        const cards = cardContainer?.querySelectorAll(".card");

        function adjustContainerHeight() {
            if (!cardContainer || !section || !container || !cards) return;

            // 카드 컨테이너의 높이를 0으로 초기화
            cardContainer.style.height = "0px";
            section.style.height = "auto";
            container.style.height = "auto";

            // 각 카드의 높이를 가져와 최대 높이를 계산합니다.
            let maxHeight = 0;
            cards.forEach((card) => {
                const element = card as HTMLElement; // HTMLElement로 캐스팅
                const cardHeight = element.offsetHeight;

                maxHeight += cardHeight / 3;
            });

            cardContainer.style.height = `${maxHeight}px`;
            section.style.height = `${maxHeight + 550}px`;
            container.style.height = `${maxHeight + 600}px`;
        }

        adjustContainerHeight();

        window.addEventListener("resize", adjustContainerHeight);

        // cleanup 함수 등록
        return () => {
            window.removeEventListener("resize", adjustContainerHeight);
        };
    }, [searchResults]);
    return (
        <div className="like-container" ref={sectionRef}>
            <div ref={cardContainerRef} className="card-container">
                {searchResults ? (
                    searchResults.map((tutor, index) => (
                        <div className="card" key={index}>
                            <Link to={`/tutors/${tutor.tutor_idx}`}>
                                <InstructorCard tutor={tutor.Tutor}></InstructorCard>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="none-like">현재 찜 목록이 비어있습니다.</div>
                )}
            </div>
        </div>
    );
}
