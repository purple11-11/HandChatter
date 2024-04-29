// 각 채팅방 컴포넌트
import { ChatRoom } from "../../types/interface";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080", {
    autoConnect: false,
});

const ChattingForOne: React.FC<{ room: ChatRoom }> = ({ room }) => {
    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };
    useEffect(() => {
        initSocketConnect();
    }, []);

    const [messages, setMessages] = useState<string[]>([]); // 메시지를 저장하는 상태
    const [newMessage, setNewMessage] = useState<string>(""); // 사용자가 입력한 새로운 메시지

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages([...messages, newMessage]); // 새로운 메시지를 메시지 목록에 추가
            socket.emit("send", newMessage);

            setNewMessage(""); // 입력 필드 초기화
        }
    };

    return (
        <div>
            <h2>{room.name}</h2>
            <p>이메일: {room.email}</p>
            <p>소개: {room.intro}</p>
            {/* 채팅 메시지 표시 */}
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            {/* 메시지 입력 필드와 전송 버튼 */}
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChattingForOne;
