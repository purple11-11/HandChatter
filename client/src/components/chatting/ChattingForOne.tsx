// 각 채팅방 컴포넌트
import { ChatRoom, Message } from "../../types/interface";
import { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useInfoStore } from "../../store/store";
import { Link } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_SERVER, {
    autoConnect: false,
});

const ChattingForOne: React.FC<{
    room: ChatRoom;
    setShowTutorInfo: (value: boolean) => void;
    showTutorInfo: boolean;
}> = ({ room, setShowTutorInfo, showTutorInfo }) => {
    // 로그인 상황(학생, 강사)마다 다르게 셋팅
    const [messages, setMessages] = useState<Message[]>([]); // 메시지를 저장하는 상태
    const [newMessage, setNewMessage] = useState<string>(""); // 사용자가 입력한 새로운 메시지
    const [other, setOther] = useState<string>(""); // 채팅 중인 상대방 소켓 저장

    const userInfo = useInfoStore((state) => state.userInfo);
    const stu_idx = userInfo?.stu_idx;
    const tutor_idx = userInfo?.tutor_idx;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };

    const initSocketConnect = async () => {
        if (!socket.connected) socket.connect();
        // 로그인 상황(강사 or 학생)에 따라 emit 다르게 작동
        // 채팅 중인 상대방 소켓 아이디 저장하는 이벤트
        // room.id(강사 인덱스)를 소켓 연결시 서버로 보내주고
        // 그 소켓이 존재하면 서버에서 소켓 아이디를 보내줘서 other state에 저장
        // 튜터로 로그인한 경우
        if (tutor_idx) {
            socket.emit("join", { role: "tutor", idx: tutor_idx, other: room.id });
            // 상대방 소켓이 접속 중이여만 other이벤트 작동
            socket.on("other", (other: string) => {
                setOther(other);
            });
        }
        // 학생으로 로그인한 경우
        if (stu_idx) {
            socket.emit("join", { role: "student", idx: stu_idx, other: room.id });
            socket.on("other", (other: string) => {
                setOther(other);
            });
        }
    };

    useEffect(() => {
        initSocketConnect();

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
                    const reqMessages = response.data.messages;
                    const contents: Message[] = reqMessages.map((msg: Message) => {
                        // 상대방 css 지정
                        if (msg.sender === "tutor") {
                            console.log("상대(강사)가 보낸 메시지:: >> ", msg.content);
                            msg.sender = "other";
                        } else if (msg.sender === "student") {
                            console.log("내(학생) 보낸 메시지:: >> ", msg.content);
                            msg.sender = "me";
                        }
                        return { content: msg.content, sender: msg.sender };
                    });
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
                    const reqMessages = response.data.messages;
                    const contents: Message[] = reqMessages.map((msg: Message) => {
                        // 상대방 css 지정
                        if (msg.sender === "student") {
                            console.log("상대(학생)이 보낸 메시지:: >> ", msg.content);
                            msg.sender = "other";
                        } else if (msg.sender === "tutor") {
                            console.log("내(강사)가 보낸 메시지 ::>>", msg.content);
                            msg.sender = "me";
                        }
                        return { content: msg.content, sender: msg.sender };
                    });
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
            setMessages([...messages, { content: newMessage, sender: "me" }]);

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
        (data: any) => {
            // 메세지 추가 아니면 추가 안되게
            // 서버에서 받아온 소켓아이디와 위에서 저장한 채팅중인 소켓아이디와 같을 때
            // other state가 비어있지 않으면 상대방이 소켓 접속 중
            // other state의 값과 서버에서 보낸 소켓id가 같으면
            // 화면에 추가 및 표시 (addMessage)
            // console.log("other >> ", other);
            // console.log("서버에서보낸 socketId >>", data.socketId);
            // console.log("other과 상대방 소켓이 같은가? >>", other === data.socketId);
            if (other === data.socketId) {
                const newMessages = [...messages, { content: data.msg, sender: "other" }];
                setMessages(newMessages);
            }
        },

        [messages, other]
    );
    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };
    useEffect(() => {
        socket.on("message", addMessage);
    }, [addMessage]);
    useEffect(() => {
        console.log("messages", messages);
    });
    console.log(showTutorInfo);
    return (
        <div className="chatting-for-one">
            <ul>
                <li className="btn-hide">
                    <button onClick={() => setShowTutorInfo(!showTutorInfo)}>강사정보</button>
                </li>
                <li>{room.name}</li>
                <li>
                    <button>
                        <Link to="/class">수업하기</Link>
                    </button>
                </li>
            </ul>
            {/* 채팅 메시지 표시 */}
            <div className="chatting-content" style={{ overflowY: "auto", maxHeight: "800px" }}>
                {messages.map((message, index) => (
                    <div key={index} className="one-chat">
                        {message.sender === "me" ? (
                            <span className={message.sender}>{message.content}</span>
                        ) : (
                            <span className="you">{message.content}</span>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {/* 메시지 입력 필드와 전송 버튼 */}
            <div className="chatting-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지 입력..."
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChattingForOne;
