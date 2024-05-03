// 각 채팅방 컴포넌트
import { ChatRoom } from "../../types/interface";
import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useInfoStore } from "../../store/store";

const socket = io("http://localhost:8080", {
    autoConnect: false,
});

const ChattingForOne: React.FC<{ room: ChatRoom }> = ({ room }) => {
    // 로그인 상황(학생, 강사)마다 다르게 셋팅
    const [messages, setMessages] = useState<string[]>([]); // 메시지를 저장하는 상태
    const [newMessage, setNewMessage] = useState<string>(""); // 사용자가 입력한 새로운 메시지
    const [other, setOther] = useState<string>(""); // 채팅 중인 상대방 소켓 저장

    const userInfo = useInfoStore((state) => state.userInfo);
    const stu_idx = userInfo?.stu_idx;
    const tutor_idx = userInfo?.tutor_idx;
    const authority = userInfo?.authority;

    const initSocketConnect = async () => {
        if (!socket.connected) socket.connect();
        // 로그인 상황(강사 or 학생)에 따라 emit 다르게 작동
        // 튜터로 로그인한 경우
        if (tutor_idx) {
            // 권한이 있는 강사
            // if (authority === 1) {
            socket.emit("join", { role: "tutor", idx: tutor_idx });
            // } else {
            // 권한 없는 (채팅 불가) 강사
            // 채팅방 접근 불가능하게끔 처리
            //     alert("강사 권한이 없어 채팅이 불가합니다.");
            // }
        }
        // 학생으로 로그인한 경우
        if (stu_idx) socket.emit("join", { role: "student", idx: stu_idx });
    };

    useEffect(() => {
        initSocketConnect();
        // 채팅 중인 상대방 소켓 아이디 저장하는 이벤트
        socket.on("other", (other: string) => {
            setOther(other);
        });

        const fetchData = async () => {
            try {
                // 이전 메세지 내역 세팅
                // 학생일 때
                if (stu_idx) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_SERVER}/api/messages`,
                        {
                            params: {
                                // 학생(로그인)일 때 stuIdx -> 로그인 정보 인덱스
                                stuIdx: stu_idx,
                                tutorIdx: room.id, // room.id -> 강사 인덱스
                            },
                        }
                    );
                    const messages = response.data.messages;
                    const contents: string[] = messages.map((msg: any) => msg.content);
                    // 응답 데이터를 상태로 설정
                    setMessages(contents);
                }

                // 강사일 때
                if (tutor_idx) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_SERVER}/api/messages`,
                        {
                            params: {
                                // 강사(로그인)일 때 tutorIdx -> 로그인 정보 인덱스
                                tutorIdx: tutor_idx,
                                stuIdx: room.id, // room.id -> 학생 인덱스
                            },
                        }
                    );
                    const messages = response.data.messages;
                    const contents: string[] = messages.map((msg: any) => msg.content);
                    // 응답 데이터를 상태로 설정
                    setMessages(contents);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // // 데이터 가져오기 함수 호출
        fetchData();
    }, [room.id, stu_idx, tutor_idx, other]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages([...messages, newMessage]);
            // 권한여부(로그인된 사용자가 학생인지 강사인지 판별) 조건문
            // 학생 로그인
            if (stu_idx) {
                socket.emit("send", {
                    msg: newMessage,
                    stuIdx: stu_idx,
                    tutorIdx: room.id,
                    sender: "student",
                    receiver: "tutor",
                });
                console.log("stu_idx", stu_idx);
            }
            // 강사 로그인
            else if (tutor_idx) {
                socket.emit("send", {
                    msg: newMessage,
                    stuIdx: room.id,
                    tutorIdx: tutor_idx,
                    sender: "tutor",
                    receiver: "student",
                });
            }

            setNewMessage(""); // 입력 필드 초기화
        }
    };
    const addMessage = useCallback(
        (msg: string) => {
            // 서버에서 받아온 소켓아이디와 위에서 저장한 채팅중인 소켓아이디와 같을 때

            // 메세지 추가 아니면 추가 안되게
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
