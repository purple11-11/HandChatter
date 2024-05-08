import React, { useEffect, useState } from "react";
import { ChatRoom } from "../types/interface";
import ChattingList from "./Chatting/ChattingList";
import ChattingForOne from "./Chatting/ChattingForOne";
import ChattingTutorIntroductor from "./Chatting/ChattingTutorIntroductor";
import axios, { all } from "axios";
import { useInfoStore } from "../store/store";

// 메인 채팅 컴포넌트
const Chatting: React.FC = () => {
    // 강사인덱스(해당 강사와의 채팅방), 학생인덱스(해당 학생과의 채팅방) 선택값 담는 채팅방 선택 state
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    // 상대방(강사) 정보 들어있는 배열, 상대방이 학생일 때(강사로그인)는 인덱스만 넣어주기
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    // {
    //      id(idx): 1, name: "상대방1", email: "example1@example.com",
    //      intro: "안녕하세요! 상대방1입니다.", profileImg: "이미지경로"
    //      price: 가격, avgRating: 평점
    // }
    // 추가 채팅방 데이터...

    const isLogin = useInfoStore((state) => state.isLogin);
    const userInfo = useInfoStore((state) => state.userInfo);
    const tutorIdx = useInfoStore((state) => state.tutorIdx);
    const dmToTutor = useInfoStore((state) => state.dmToTutor);
    const stu_idx = userInfo?.stu_idx;
    const tutor_idx = userInfo?.tutor_idx;

    // roomid -> tutorIdx(강사인덱스)
    const handleRoomClick = (roomId: number) => {
        setSelectedRoom(roomId); // 선택된 채팅방 변경
    };

    // 채팅리스트(자식) 컴포넌트에 넘겨줄 콜백 함수(allRoom에서 room.id 삭제 수행할)
    const deleteRoom = (roomId: number) => {
        // 해당 값을 제외한 새로운 배열을 생성
        setChatRooms((prevChatRooms) => prevChatRooms.filter((room) => room.id !== roomId));
        // db에서 삭제
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

    // 채팅방 셋팅
    useEffect(() => {
        if (isLogin) {
            // 학생 로그인일 때
            if (stu_idx) {
                // 해당 학생 인덱스로 메세지에 있는 강사들 인덱스 수집
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { stuIdx: stu_idx },
                    })
                    .then((res) => {
                        // 강사들 인덱스로 강사들 정보 조회
                        axios
                            .get(`${process.env.REACT_APP_API_SERVER}/api/chatInfo`, {
                                params: {
                                    tutorsIdx: res.data.tutorsIdx,
                                },
                            })
                            .then((res) => {
                                // chatRooms에 강사들 정보 넣기
                                setChatRooms(res.data.chatTutorsInfo);
                            })
                            .catch((error) => {
                                if (error.response && error.response.status === 404) {
                                    // 요청이 실패하고 404 오류인 경우, 빈 배열을 채팅방 정보로 설정합니다.
                                    setChatRooms([]);
                                } else {
                                    // 다른 오류 처리
                                    console.error("An error occurred:", error);
                                }
                            });
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            // 요청이 실패하고 404 오류인 경우, 빈 배열을 채팅방 정보로 설정합니다.
                            setChatRooms([]);
                        } else {
                            // 다른 오류 처리
                            console.error("An error occurred:", error);
                        }
                    });
            }

            // 강사 로그인일 떄
            else if (tutor_idx) {
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { tutorIdx: tutor_idx },
                    })
                    .then((res) => {
                        // 강사들 인덱스로 강사들 정보 조회
                        axios
                            .get(`${process.env.REACT_APP_API_SERVER}/api/chatInfo`, {
                                params: {
                                    studentsIdx: res.data.studentsIdx,
                                },
                            })
                            .then((res) => {
                                // chatRooms에 강사들 정보 넣기
                                setChatRooms(res.data.chatStudentsInfo || []);
                            })
                            .catch((error) => {
                                if (error.response && error.response.status === 404) {
                                    // 요청이 실패하고 404 오류인 경우, 빈 배열을 채팅방 정보로 설정합니다.
                                    setChatRooms([]);
                                } else {
                                    // 다른 오류 처리
                                    console.error("An error occurred:", error);
                                }
                            });
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            // 요청이 실패하고 404 오류인 경우, 빈 배열을 채팅방 정보로 설정합니다.
                            setChatRooms([]);
                        } else {
                            // 다른 오류 처리
                            console.error("An error occurred:", error);
                        }
                    });
            }
        }
    }, [isLogin, userInfo]);

    useEffect(() => {
        // 채팅방 목록이 업데이트되었으므로 ChattingList를 다시 렌더링합니다.
        // dm보내기로 넘겨받아온 강사인덱스 추가 (단, 이미 존재하는 인덱스라면 추가 x)
        if (isLogin && stu_idx && tutorIdx) {
            if (!chatRooms.some((room) => room.id === Number(tutorIdx))) {
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/chatInfo`, {
                        params: { tutorsIdx: [tutorIdx] },
                    })
                    .then((res) => {
                        console.log("res >>", res.data.chatTutorsInfo[0]);
                        // 이전 채팅방 정보와 새로운 채팅방 정보를 병합하여 새로운 배열을 생성합니다.
                        setChatRooms((prevChatRooms) => [
                            ...prevChatRooms,
                            res.data.chatTutorsInfo[0],
                        ]);
                        dmToTutor("");
                        console.log("chat Rooms >> ", chatRooms);
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
