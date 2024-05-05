import React, { useEffect, useState } from "react";
import { ChatRoom } from "../types/interface";
import ChattingList from "./Chatting/ChattingList";
import ChattingForOne from "./Chatting/ChattingForOne";
import ChattingTutorIntroductor from "./Chatting/ChattingTutorIntroductor";
import axios from "axios";
import { useInfoStore } from "../store/store";

// 예시로 하드코딩된 데이터
// 상대방(강사) 정보 들어있는 배열, 상대방이 학생일 때(강사로그인)는 인덱스만 넣어주기
// let chatRooms: ChatRoom[] = [
// { id(idx): 1, name: "상대방1", email: "example1@example.com", intro: "안녕하세요! 상대방1입니다." },
// { id(idx): 2, name: "상대방2", email: "example2@example.com", intro: "안녕하세요! 상대방2입니다." },
// 추가 채팅방 데이터...
// ];

// 메인 채팅 컴포넌트
const Chatting: React.FC = (props?) => {
    // 강사 상세(dm보내기)에서 props로 받아온 강사인덱스 넣어주기 -> 학생이 dm보내기로 채팅방 생성
    // 즉 모든 강사들과의 채팅방을 보기위한 state
    // 추후 채팅방 삭제시 이 state 배열에서 해당 강사인덱스 삭제해야함
    const [allRoom, setAllRoom] = useState<number[]>([]);
    // 강사인덱스(해당 강사와의 채팅방), 학생인덱스(해당 학생과의 채팅방) 선택값 담는 채팅방 선택 state
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    // 예시로 하드코딩된 데이터
    // 상대방(강사) 정보 들어있는 배열, 상대방이 학생일 때(강사로그인)는 인덱스만 넣어주기
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    // { id(idx): 1, name: "상대방1", email: "example1@example.com", intro: "안녕하세요! 상대방1입니다." },
    // { id(idx): 2, name: "상대방2", email: "example2@example.com", intro: "안녕하세요! 상대방2입니다." },
    // 추가 채팅방 데이터...

    // roomid -> tutorIdx(강사인덱스)
    const handleRoomClick = (roomId: number) => {
        setSelectedRoom(roomId); // 선택된 채팅방 변경
    };

    const isLogin = useInfoStore((state) => state.isLogin);
    const userInfo = useInfoStore((state) => state.userInfo);

    // 채팅방 셋팅
    useEffect(() => {
        if (isLogin) {
            const stu_idx = userInfo?.stu_idx;
            const tutor_idx = userInfo?.tutor_idx;
            // 학생 로그인일 때
            if (stu_idx) {
                // 해당 학생 인덱스로 메세지에 있는 강사들 인덱스 수집
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { stuIdx: stu_idx },
                    })
                    .then((res) => {
                        // setAllRoom에 강사들 인덱스 넣기
                        setAllRoom(res.data.tutorsIdx);

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
                                console.log("chatRooms >>", chatRooms);
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
                        // setAllRoom에 학생들 인덱스 넣기
                        setAllRoom(res.data.studentsIdx);

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
    }, []);

    useEffect(() => {
        // 채팅방 목록이 업데이트되었으므로 ChattingList를 다시 렌더링합니다.
    }, [chatRooms]);

    // 아래 코드는 추후에 dm보내기로 채팅방 생성 코드 작성
    // allRoom은 인덱스로 채팅방 추가 및 삭제하는 채팅방 관리 state
    useEffect(() => {
        // allRoom 상태가 업데이트될 때마다 실행됨
        // console.log("allRoom >>", allRoom);
    }, [allRoom]);

    const room = selectedRoom !== null ? chatRooms.find((room) => room.id === selectedRoom) : null;

    return (
        <div>
            <h1>카카오톡처럼 채팅</h1>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <ChattingList rooms={chatRooms} onRoomClick={handleRoomClick} />
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
