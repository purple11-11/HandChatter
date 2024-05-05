import React, { useState, useEffect } from "react";
import axios from "axios";

type Review = {
    content: string;
    rating: number;
    created_at: string;
};

type TutorInfo = {
    nickname: string;
    email: string;
    description: string;
    authority: string;
    profile_img: string;
    des_video: string;
};

interface CourseReviewProps {
    tutorIdx?: string;
}

const CourseReview: React.FC<CourseReviewProps> = ({ tutorIdx }) => {
    const [tutorInfo, setTutorInfo] = useState<TutorInfo | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchTutorDetail = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_SERVER}/api/tutors/${tutorIdx}`
                );
                const { tutorInfo, review } = response.data;
                setTutorInfo(tutorInfo);
                setReviews(review);

                // 리뷰들의 평균 평점 계산
                const totalRating = review.reduce(
                    (acc: number, curr: Review) => acc + curr.rating,
                    0
                );
                const avgRating = totalRating / review.length;
                setAverageRating(avgRating);
            } catch (error) {
                console.error("Error fetching tutor detail:", error);
            }
        };

        fetchTutorDetail();
    }, [tutorIdx]); // tutorIdx가 변경될 때마다 useEffect가 실행되도록

    return (
        <div className="course">
            <div className="total-course-review">
                <p>수강후기</p>
                {/* 평점을 표시하는 부분 */}
                <p>
                    평점: ⭐<span>{averageRating ? averageRating.toFixed(1) : "평점 없음"}</span>
                </p>
            </div>
            {/* 수강후기를 표시하는 부분 */}
            {reviews[0] === null ? (
                <>
                    {reviews.map((review, index) => (
                        <div className="course-review" key={index}>
                            <div className="course-review-container">
                                {/* 리뷰어 프로필 이미지 */}
                                <div className="profile-img middle">
                                    <img src="" alt="" />
                                </div>
                                <div className="reviewer-profile">
                                    {/* 리뷰어 닉네임 */}
                                    <div className="reviewer-nickname">닉네임 님</div>
                                    <div className="reviewer-date-score">
                                        {/* 리뷰 평점 및 작성 날짜 */}
                                        <p>
                                            평점: ⭐<span>{review.rating}</span>
                                        </p>
                                        <p>{review.created_at}</p>
                                    </div>
                                </div>
                            </div>
                            {/* 리뷰 내용 */}
                            <div className="review-content">{review.content}</div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="course-review">
                    <div className="none-review-content">리뷰 내용이 없습니다.</div>
                </div>
            )}
        </div>
    );
};

export default CourseReview;
