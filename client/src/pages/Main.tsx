import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import InstructorCard from "../components/InstructorCard";
import { Tutor } from "../types/interface";
import mainImg from "../assets/mainImg.jpg";
import Slider from "../components/Slide";
export default function Main() {
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

            // 카드 컨테이너의 높이를 최대 높이로 설정합니다.
            cardContainer.style.height = `${maxHeight}px`;
            section.style.height = `${maxHeight + 550}px`;
            container.style.height = `${maxHeight + 600}px`;
        }

        // 페이지 로드 후 초기화 함수를 호출하여 높이를 조정합니다.
        adjustContainerHeight();

        // 윈도우 크기가 변경될 때마다 높이를 다시 조정합니다.
        window.addEventListener("resize", adjustContainerHeight);

        // cleanup 함수 등록
        return () => {
            window.removeEventListener("resize", adjustContainerHeight);
        };
    }, [searchResults]);

    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const slideRef = useRef<HTMLDivElement>(null);
    const slideContainerRef = useRef<HTMLDivElement>(null);
    const children = slideContainerRef.current?.querySelectorAll(".slide");
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (children === undefined) return;

        if (touchStart - touchEnd > 150) {
            if (currentSlide < children.length - 1) {
                setCurrentSlide(currentSlide + 1);
            }
        }

        if (touchStart - touchEnd < -150) {
            if (currentSlide > 0) {
                setCurrentSlide(currentSlide - 1);
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchTutor();
        }
    };
    
    return (
        <div>
            <section className="main-banner">
                <div>WELCOME TO HAND CHATTER</div>
            </section>
            <section className="ourtutor" ref={sectionRef}>
                <div className="container" ref={containerRef}>
                    <p>Our Tutor</p>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="튜터 검색"
                            value={searchTerm}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSearchTutor}>검색</button>
                    </div>
                    {error && <p className="no-answer">검색 결과가 없습니다.</p>}
                    <div ref={cardContainerRef} className="card-container">
                        {searchResults.length !== 0 ? (
                            searchResults.map((tutor, index) => (
                                <div className="card" key={index}>
                                    <Link to={`/tutors/${tutor.tutor_idx}`}>
                                        <InstructorCard tutor={tutor}></InstructorCard>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="no-answer">검색 결과가 없습니다.</p>
                        )}
                    </div>
                    <div
                        className="slide-container"
                        ref={slideContainerRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {children !== undefined ? (
                            <div
                                className="slide-wrapper"
                                style={{
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                }}
                                ref={slideRef}
                            >
                                {searchResults.length !== 0 ? (
                                    searchResults.map((tutor, index) => (
                                        <div className="slide">
                                            <Link to={`/tutors/${tutor.tutor_idx}`}>
                                                <Slider tutor={tutor}></Slider>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-answer">검색 결과가 없습니다.</p>
                                )}
                            </div>
                        ) : (
                            <p>현재 강사가 없습니다.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
