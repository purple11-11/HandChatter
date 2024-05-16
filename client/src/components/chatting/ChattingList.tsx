import { ChatRoom } from "../../types/interface";
import { useRef, useEffect } from "react";
const ChattingList: React.FC<{
    rooms: ChatRoom[];
    onRoomClick: (roomId: number) => void;
    deleteRoom: (roomId: number) => void;
}> = ({ rooms, onRoomClick, deleteRoom }) => {
    const handleClick = (roomId: number) => {
        onRoomClick(roomId); 
    };

    const handleLeaveRoom = (roomId: number) => {
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
                            <img
                                src={`${process.env.REACT_APP_API_SERVER}/${room.profileImg}`}
                                alt=""
                            />
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
