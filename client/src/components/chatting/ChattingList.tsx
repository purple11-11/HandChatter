import { ChatRoom } from "../../types/interface";
import { useRef, useEffect } from "react";
const ChattingList: React.FC<{
    rooms: ChatRoom[];
    onRoomClick: (roomId: number) => void;
    deleteRoom: (roomId: number) => void;
}> = ({ rooms, onRoomClick, deleteRoom }) => {
    const handleClick = (roomId: number) => {
        onRoomClick(roomId); // 클릭한 채팅방의 ID를 부모 컴포넌트에 전달
    };

    const handleLeaveRoom = (roomId: number) => {
        // 채팅방 나가기 동작 수행
        // console.log("채팅방 나가기:", roomId);
        // deleteRoom 함수를 호출하여 해당 채팅방을 나가는 동작 수행
        deleteRoom(roomId);
    };

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollLeft = listRef.current.scrollWidth;
        }
    }, [rooms]);

    return (
        <>
            <ul ref={listRef}>
                {rooms.map((room) => (
                    <li key={room.id} onClick={() => handleClick(room.id)}>
                        <div className="profile-img middle">
                            <img src="" alt="" />
                        </div>
                        <div className="room-info">
                            <p>{room.name}</p>
                            <p>{room.email}</p>
                        </div>
                        <button onClick={() => handleLeaveRoom(room.id)}>나가기</button>{" "}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChattingList;
