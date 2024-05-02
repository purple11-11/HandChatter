// 각 채팅방 컴포넌트
import { ChatRoom } from "../../types/interface";
import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080", {
    autoConnect: false,
});

const ChattingForOne: React.FC<{ room: ChatRoom }> = ({ room }) => {
    const initSocketConnect = async () => {
        if (!socket.connected) socket.connect();
        // const userInfo = await axios.get("/api/userInfo");
        // 로그인 상황(강사 or 학생)에 따라 emit 다르게 작동
        // 튜터로 로그인한 경우
        // console.log("userInfo >>", userInfo);
        // if (userInfo.authority === 1) socket.emit("join", { role: "tutor", idx: 1 });
        // 학생으로 로그인한 경우
        socket.emit("join", { role: "student", idx: 1 });
    };
    useEffect(() => {
        initSocketConnect();
        const fetchData = async () => {
            try {
                // 이전 메세지 내역 세팅
                // 학생일 때 (로그인 정보의 권한여부[authority]가 0일 떄)
                const response = await axios.get(
                    `${process.env.REACT_APP_API_SERVER}/api/messages`,
                    {
                        params: {
                            // 학생(로그인)일 때 stuIdx -> 로그인 정보 인덱스
                            stuIdx: 1,
                            tutorIdx: room.id, // room.id -> 강사 인덱스
                        },
                    }
                );
                const messages = response.data.messages;
                const contents: string[] = messages.map((msg: any) => msg.content);
                // 응답 데이터를 상태로 설정
                setMessages(contents);

                // 강사일 때 (로그인 정보의 권한여부[authority]가 1일 떄)
                // const response = await axios.get(
                //     `${process.env.REACT_APP_API_SERVER}/api/messages`,
                //     {
                //         params: {
                //             // 학생(로그인)일 때 stuIdx -> 로그인 정보 인덱스
                //             stuIdx: 1,
                //             tutorIdx: room.id, // room.id -> 강사 인덱스
                //         },
                //     }
                // );
                // const messages = response.data.messages;
                // const contents: string[] = messages.map((msg: any) => msg.content);
                // // 응답 데이터를 상태로 설정
                // setMessages(contents);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // // 데이터 가져오기 함수 호출
        fetchData();
    }, []);

    // 로그인 상황(학생, 강사)마다 다르게 셋팅
    const [messages, setMessages] = useState<string[]>([]); // 메시지를 저장하는 상태
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
            //     socket.emit("send", {
            //         msg: newMessage,
            //         stuIdx: 1,
            //         tutorIdx: 1,
            //         sender: "tutor",
            //         receiver: "student",
            //     });
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
