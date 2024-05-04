import { ChatRoom } from "../../types/interface";

const ChattingList: React.FC<{ rooms: ChatRoom[]; onRoomClick: (roomId: number) => void }> = ({
    rooms,
    onRoomClick,
}) => {
    const handleClick = (roomId: number) => {
        onRoomClick(roomId); // 클릭한 채팅방의 ID를 부모 컴포넌트에 전달
    };

    const handleLeaveRoom = (roomId: number) => {
        // 채팅방 나가기 동작 수행
        console.log("채팅방 나가기:", roomId);
        // 이 부분에 채팅방 나가기 로직 추가
    };

    return (
        <div>
            <h2>채팅방 목록</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.id} onClick={() => handleClick(room.id)}>
                        {room.name}
                        <button onClick={() => handleLeaveRoom(room.id)}>나가기</button>{" "}
                        {/* 나가기 버튼 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChattingList;
