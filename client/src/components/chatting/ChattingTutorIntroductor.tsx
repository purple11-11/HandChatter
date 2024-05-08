// 채팅방에 있는 상대방 정보 컴포넌트
import { ChatRoom } from "../../types/interface";
const ChattingTutorIntroductor: React.FC<{ room: ChatRoom; showTutorInfo: boolean }> = ({
    room,
    showTutorInfo,
}) => {
    console.log(showTutorInfo);
    console.log(room);
    return (
        <div className={`chatting-tutor-intro  ${showTutorInfo ? "show" : "hide"}`}>
            <ul>
                <li className="profile-tutor-img">
                    <div className="profile-img big">
                        {/* profileImg: "이미지경로" -> room.profileImg */}
                        <img
                            src={`${process.env.REACT_APP_API_SERVER}/${room.profileImg}`}
                            alt=""
                        />
                    </div>
                </li>
                <li className="profile-name">{room.name}</li>
                <li className="profile-email">{room.email}</li>
                <li className="profile-score">
                    평점: ⭐<span>{room.avgRating}</span>
                </li>
                <li className="profile-price">
                    1회 가격: <span>{room.price}</span>
                </li>
                <li className="mobile-tutor-introduce">
                    <div>
                        <div className="profile-img big">
                            <img
                                src={`${process.env.REACT_APP_API_SERVER}/${room.profileImg}`}
                                alt=""
                            />
                        </div>
                    </div>
                    <p className="mobile-profile-name">{room.name}</p>
                    <p className="mobile-profile-email">{room.email}</p>
                    <p className="mobile-profile-score">
                        평점: ⭐<span>4.8</span>
                    </p>
                    <p className="mobile-profile-price">
                        1회 가격: <span>1000 원</span>
                    </p>
                </li>
                <li className="profile-introduce">
                    <p>강사 소개</p>
                    <div>{room.intro}</div>
                </li>
            </ul>
        </div>
    );
};

export default ChattingTutorIntroductor;
