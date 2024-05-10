import { ChatRoom, Message } from "../../types/interface";
import { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useInfoStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_SERVER, {
    autoConnect: false,
});

const ChattingForOne: React.FC<{
    room: ChatRoom;
    setShowTutorInfo: (value: boolean) => void;
    showTutorInfo: boolean;
}> = ({ room, setShowTutorInfo, showTutorInfo }) => {
    const [messages, setMessages] = useState<Message[]>([]); 
    const [newMessage, setNewMessage] = useState<string>("");
    const [other, setOther] = useState<string>(""); 

    const userInfo = useInfoStore((state) => state.userInfo);
    const stu_idx = userInfo?.stu_idx;
    const tutor_idx = userInfo?.tutor_idx;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

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
        if (tutor_idx) {
            socket.emit("join", { role: "tutor", idx: tutor_idx, other: room.id });
            socket.on("other", (other: string) => {
                setOther(other);
            });
        }
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
                if (stu_idx) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_SERVER}/api/messages`,
                        {
                            params: {
                                stuIdx: stu_idx,
                                tutorIdx: room.id,
                            },
                        }
                    );
                    const reqMessages = response.data.messages;
                    const contents: Message[] = reqMessages.map((msg: Message) => {
                        if (msg.sender === "tutor") {
                            msg.sender = "other";
                        } else if (msg.sender === "student") {
                            msg.sender = "me";
                        }
                        return { content: msg.content, sender: msg.sender };
                    });
                    setMessages(contents);
                }

                if (tutor_idx) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_SERVER}/api/messages`,
                        {
                            params: {
                                tutorIdx: tutor_idx,
                                stuIdx: room.id,
                            },
                        }
                    );
                    const reqMessages = response.data.messages;
                    const contents: Message[] = reqMessages.map((msg: Message) => {
                        if (msg.sender === "student") {
                            msg.sender = "other";
                        } else if (msg.sender === "tutor") {
                            msg.sender = "me";
                        }
                        return { content: msg.content, sender: msg.sender };
                    });
                    setMessages(contents);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [room.id, stu_idx, tutor_idx, other]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages([...messages, { content: newMessage, sender: "me" }]);

            if (stu_idx) {
                socket.emit("send", {
                    msg: newMessage,
                    stuIdx: stu_idx,
                    tutorIdx: room.id,
                    sender: "student",
                    receiver: "tutor",
                });
            }
            else if (tutor_idx) {
                socket.emit("send", {
                    msg: newMessage,
                    stuIdx: room.id,
                    tutorIdx: tutor_idx,
                    sender: "tutor",
                    receiver: "student",
                });
            }

            setNewMessage(""); 
        }
    };
    const addMessage = useCallback(
        (data: any) => {
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
    });

    const handleEnterClass = () => {
        try {
            if (!userInfo?.tutor_idx) {
                navigate(`/class/${room.id}`);
            } else {
                navigate(`/class/${userInfo?.tutor_idx}`);
            }
        } catch (error) {
            alert("튜터와 학생 간의 화상 및 채팅 통신이 불가능합니다.");
        }
    };

    return (
        <div className="chatting-for-one">
            <ul>
                <li className="btn-hide">
                    <button onClick={() => setShowTutorInfo(!showTutorInfo)}>강사정보</button>
                </li>
                <li>{room.name}</li>
                <li>
                    <button onClick={() => handleEnterClass()}>
                        <Link to={`/class/${userInfo?.tutor_idx ? userInfo.tutor_idx : room.id}`}>
                            수업하기
                        </Link>
                    </button>
                </li>
            </ul>
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
