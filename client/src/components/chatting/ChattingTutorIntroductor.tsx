// 채팅방에 있는 상대방 정보 컴포넌트
import { ChatRoom } from "../../types/interface";
const ChattingTutorIntroductor: React.FC<{ room: ChatRoom }> = ({ room }) => {
    return (
        <div>
            <h2>상대방 정보</h2>
            <p>이름: {room.name}</p>
            <p>이메일: {room.email}</p>
            <p>소개: {room.intro}</p>
        </div>
    );
};

export default ChattingTutorIntroductor;
