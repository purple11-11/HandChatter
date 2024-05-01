// 각 채팅방 컴포넌트
import { ChatRoom } from "../../types/interface";
import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080", {
    autoConnect: false,
});

const ChattingForOne: React.FC<{ room: ChatRoom }> = ({ room }) => {
    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
        // 로그인 상황(강사 or 학생)에 따라 emit 다르게 작동
        // 튜터로 로그인한 경우
        // socket.emit("join", { role: "tutor", idx: 1 });
        // 학생으로 로그인한 경우
        socket.emit("join", { role: "student", idx: 1 });
    };
    useEffect(() => {
        initSocketConnect();
        // const fetchData = async () => {
        //     try {
        //         // Axios를 사용하여 데이터를 가져옴
        //         const response = await axios.get("/api/messages", {
        //             params: {
        //                 stuIdx: 1,
        //                 tutorIdx: 1,
        //                 sender: "student",
        //             },
        //         });
        //         // 응답 데이터를 상태로 설정
        //         setMessages(response.data);
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //     }
        // };

        // // 데이터 가져오기 함수 호출
        // fetchData();
    }, []);

    // 메세지를 string배열이 아닌 { 강사 or 학생 인덱스: idx, msg } 형태로 담아야
    // 채팅방 내용을 따로보여줄때 해당 강사 or 학생과의 메시지들만 보여줄 수 있음
    // 로그인 상황(학생, 강사)마다 다르게 셋팅
    const [messages, setMessages] = useState<string[]>([]); // { idx: idx, msg: msg } 형태로 메시지를 저장하는 상태
    const [newMessage, setNewMessage] = useState<string>(""); // 사용자가 입력한 새로운 메시지

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages([...messages, newMessage]);
            // 권한여부(로그인된 사용자가 학생인지 강사인지 판별) 조건문
            // if (authority === 0)
            socket.emit("send", {
                msg: newMessage,
                stuIdx: 1,
                tutorIdx: 1,
                sender: "student",
                receiver: "tutor",
            });
            // else {
            //      socket.emit("send", { msg: newMessage, stuIdx: 1, tutorIdx: 1, sender: "tutor", receiver: "student" });
            // }

            setNewMessage(""); // 입력 필드 초기화
        }
    };
    const addMessage = useCallback(
        (msg: string) => {
            const newMessages = [...messages, msg];

            setMessages(newMessages);
        },
        [messages]
    );
    useEffect(() => {
        socket.on("message", addMessage);
    }, [addMessage]);

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
