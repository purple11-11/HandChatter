import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InstructorCard from "../InstructorCard";
import { Tutor } from "../../types/interface";
import Slider from "../Slide";
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

            cardContainer.style.height = "0px";
            section.style.height = "auto";
            container.style.height = "auto";

            let maxHeight = 0;
            cards.forEach((card) => {
                const element = card as HTMLElement;
                const cardHeight = element.offsetHeight;

                maxHeight += cardHeight / 3;
            });

            cardContainer.style.height = `${maxHeight}px`;
            section.style.height = `${maxHeight + 550}px`;
            container.style.height = `${maxHeight + 600}px`;
        }

        adjustContainerHeight();

        window.addEventListener("resize", adjustContainerHeight);

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

    return (
        <div className="like-container" ref={sectionRef}>
            <div ref={cardContainerRef} className="card-container">
                {searchResults && searchResults.length !== 0 ? (
                    searchResults.map((tutor, index) => (
                        <div className="card" key={index}>
                            <Link to={`/tutors/${tutor.tutor_idx}`}>
                                <InstructorCard tutor={tutor.Tutor}></InstructorCard>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="no-answer">검색 결과가 없습니다.</p>
                )}
            </div>
            <p className="favorite-title">내 찜 목록</p>
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
                        {searchResults && searchResults.length !== 0 ? (
                            searchResults.map((tutor, index) => (
                                <div className="slide">
                                    <Link to={`/tutors/${tutor.tutor_idx}`}>
                                        <Slider tutor={tutor.Tutor}></Slider>
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
    );
}
