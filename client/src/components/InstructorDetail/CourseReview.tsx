import React, { useState, useEffect } from "react";
import axios from "axios";

type Review = {
    content: string;
    rating: number;
    created_at: string;
    Student: {
        nickname: string;
        profile_img: string;
    };
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
    const [review, setReviews] = useState<Review[]>([]);
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

        if (tutorIdx) {
            fetchTutorDetail();
        }
    }, [tutorIdx]);
    if (review === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="course">
            <div className="total-course-review">
                <p>수강후기 </p>
                <p>
                    평점: ⭐<span>{averageRating ? averageRating.toFixed(1) : "평점 없음"}</span>
                </p>
            </div>
            {review.length === 0 ? (
                <div className="course-review">
                    <div className="none-review-content">리뷰 내용이 없습니다.</div>
                </div>
            ) : (
                review.map((review, index) => (
                    <div className="course-review" key={index}>
                        <div className="course-review-container">
                            <div className="profile-img middle">
                                <img
                                    src={`${process.env.REACT_APP_API_SERVER}/${review.Student.profile_img}`}
                                    alt=""
                                />
                            </div>
                            <div className="reviewer-profile">
                                <div className="reviewer-nickname">
                                    {review.Student.nickname} 님
                                </div>
                                <div className="reviewer-date-score">
                                    <p>
                                        평점: ⭐<span>{review.rating}</span>
                                    </p>
                                    <p>{new Date(review.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="review-content">{review.content}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CourseReview;
