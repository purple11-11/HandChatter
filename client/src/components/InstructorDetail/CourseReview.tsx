export default function CourseReview() {
    return (
        <div className="course">
            <div className="total-course-review">
                <p>수강후기</p>
                <p>
                    평점: ⭐<span></span>
                </p>
            </div>
            <div className="course-review">
                <div className="course-review-container">
                    <div className="profile-img middle">
                        <img src="" alt="" />
                    </div>
                    <div className="reviewer-profile">
                        <div className="reviewer-nickname">닉네임 님</div>
                        <div className="reviewer-date-score">
                            <p>
                                평점: ⭐<span></span>
                            </p>
                            <p>날짜</p>
                        </div>
                    </div>
                </div>
                <div className="review-content">오늘 너무 만족하면서 배웠어요</div>
            </div>
        </div>
    );
}
