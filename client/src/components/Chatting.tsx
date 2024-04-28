import React, { useState } from "react";
import { ChatRoom } from "../types/interface";
import ChattingList from "./chatting/ChattingList";
import ChattingForOne from "./chatting/ChattingForOne";
import ChattingTutorIntroductor from "./chatting/ChattingTutorIntroductor";

// 예시로 하드코딩된 데이터
const dummyChatRooms: ChatRoom[] = [
    { id: 1, name: "상대방1", email: "example1@example.com", intro: "안녕하세요! 상대방1입니다." },
    { id: 2, name: "상대방2", email: "example2@example.com", intro: "안녕하세요! 상대방2입니다." },
    // 추가 채팅방 데이터...
];

// 메인 채팅 컴포넌트
const Chatting: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    const handleRoomClick = (roomId: number) => {
        setSelectedRoom(roomId); // 선택된 채팅방 변경
    };

    const room =
        selectedRoom !== null ? dummyChatRooms.find((room) => room.id === selectedRoom) : null;

    return (
        <div>
            <h1>카카오톡처럼 채팅</h1>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <ChattingList rooms={dummyChatRooms} onRoomClick={handleRoomClick} />
                </div>
                <div style={{ flex: 2 }}>
                    {room ? (
                        <>
                            <ChattingForOne room={room} />
                            <ChattingTutorIntroductor room={room} />
                        </>
                    ) : (
                        <p>채팅방을 선택하세요.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chatting;
