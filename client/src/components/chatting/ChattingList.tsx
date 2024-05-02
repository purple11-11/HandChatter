import { useEffect } from "react";
import { ChatRoom } from "../../types/interface";

const ChattingList: React.FC<{ rooms: ChatRoom[]; onRoomClick: (roomId: number) => void }> = ({
    rooms,
    onRoomClick,
}) => {
    const handleClick = (roomId: number) => {
        onRoomClick(roomId); // 클릭한 채팅방의 ID를 부모 컴포넌트에 전달
    };

    return (
        <div>
            <h2>채팅방 목록</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.id} onClick={() => handleClick(room.id)}>
                        {room.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChattingList;
