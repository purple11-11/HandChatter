import React, { useEffect, useState } from "react";
import { ChatRoom } from "../types/interface";
import ChattingList from "./Chatting/ChattingList";
import ChattingForOne from "./Chatting/ChattingForOne";
import ChattingTutorIntroductor from "./Chatting/ChattingTutorIntroductor";
import axios, { all } from "axios";
import { useInfoStore } from "../store/store";

const Chatting: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const isLogin = useInfoStore((state) => state.isLogin);
    const userInfo = useInfoStore((state) => state.userInfo);
    const tutorIdx = useInfoStore((state) => state.tutorIdx);
    const dmToTutor = useInfoStore((state) => state.dmToTutor);
    const stu_idx = userInfo?.stu_idx;
    const tutor_idx = userInfo?.tutor_idx;

    const handleRoomClick = (roomId: number) => {
        setSelectedRoom(roomId); 
    };

    const deleteRoom = (roomId: number) => {
        setChatRooms((prevChatRooms) => prevChatRooms.filter((room) => room.id !== roomId));
        if (isLogin) {
            if (stu_idx) {
                axios.delete(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                    params: { stuIdx: stu_idx, tutorIdx: roomId },
                });
            }
            if (tutor_idx) {
                axios.delete(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                    params: { stuIdx: roomId, tutorIdx: tutor_idx },
                });
            }
        }
    };

    useEffect(() => {
        if (isLogin) {
            if (stu_idx) {
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { stuIdx: stu_idx },
                    })
                    .then((res) => {
                        axios
                            .get(`${process.env.REACT_APP_API_SERVER}/api/chatInfo`, {
                                params: {
                                    tutorsIdx: res.data.tutorsIdx,
                                },
                            })
                            .then((res) => {
                                setChatRooms(res.data.chatTutorsInfo);
                            })
                            .catch((error) => {
                                if (error.response && error.response.status === 404) {
                                    setChatRooms([]);
                                } else {
                                    console.error("An error occurred:", error);
                                }
                            });
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            setChatRooms([]);
                        } else {
                            console.error("An error occurred:", error);
                        }
                    });
            }

            else if (tutor_idx) {
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { tutorIdx: tutor_idx },
                    })
                    .then((res) => {
                        axios
                            .get(`${process.env.REACT_APP_API_SERVER}/api/chatInfo`, {
                                params: {
                                    studentsIdx: res.data.studentsIdx,
                                },
                            })
                            .then((res) => {
                                setChatRooms(res.data.chatStudentsInfo || []);
                            })
                            .catch((error) => {
                                if (error.response && error.response.status === 404) {
                                    setChatRooms([]);
                                } else {
                                    console.error("An error occurred:", error);
                                }
                            });
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            setChatRooms([]);
                        } else {
                            console.error("An error occurred:", error);
                        }
                    });
            }
        }
    }, [isLogin, userInfo]);

    useEffect(() => {
        if (isLogin && stu_idx && tutorIdx) {
            if (!chatRooms.some((room) => room.id === Number(tutorIdx))) {
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/chatInfo`, {
                        params: { tutorsIdx: [tutorIdx] },
                    })
                    .then((res) => {
                        setChatRooms((prevChatRooms) => [
                            ...prevChatRooms,
                            res.data.chatTutorsInfo[0],
                        ]);
                        dmToTutor("");
                    })
                    .catch((error) => {
                        console.error("An error occurred:", error);
                    });
            }
        }
    }, [isLogin, stu_idx, tutorIdx]);

    const room = selectedRoom !== null ? chatRooms.find((room) => room.id === selectedRoom) : null;
    const [showTutorInfo, setShowTutorInfo] = useState(false);
    return (
        <div className="chatting">
            <div className="chatting-container">
                <div className="chatting-list">
                    <ChattingList
                        rooms={chatRooms}
                        onRoomClick={handleRoomClick}
                        deleteRoom={deleteRoom}
                    />
                </div>
                <div className="chatting-room">
                    {room ? (
                        <>
                            <ChattingForOne
                                room={room}
                                setShowTutorInfo={setShowTutorInfo}
                                showTutorInfo={showTutorInfo}
                            />
                            {!userInfo?.tutor_idx ? (
                                <ChattingTutorIntroductor
                                    room={room}
                                    showTutorInfo={showTutorInfo}
                                />
                            ) : (
                                <div className="chatting-tutor-intro">
                                    <textarea name="" id=""></textarea>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="chatting-for-one no-chatting">채팅방이 없습니다.</div>
                            <div className="chatting-tutor-intro no-chatting">
                                강사와의 채팅이 없습니다.
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chatting;
