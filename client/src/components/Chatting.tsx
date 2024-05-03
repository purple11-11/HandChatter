import React, { useEffect, useState } from "react";
import { ChatRoom } from "../types/interface";
import ChattingList from "./Chatting/ChattingList";
import ChattingForOne from "./Chatting/ChattingForOne";
import ChattingTutorIntroductor from "./Chatting/ChattingTutorIntroductor";
import axios from "axios";

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
    // 채팅방 셋팅
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_SERVER}/api/userInfo`).then((res) => {
            // console.log(res.data.studentInfo[0].authority);
            // 학생일 때
            if (res.data.studentInfo[0]) {
                const { stu_idx } = res.data.studentInfo[0];
                // 해당 학생 인덱스로 메세지에 있는 강사들 인덱스 수집
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { stuIdx: stu_idx },
                    })
                    .then((res) => {
                        // setAllRoom에 강사들 인덱스 넣기
                        // console.log("res.data.tutorsIdx >>", res.data.tutorsIdx);
                        setAllRoom(res.data.tutorsIdx);
                        console.log(res.data.tutorsIdx);
                        // 강사들 인덱스로 강사들 정보 조회
                        axios
                            .get(`${process.env.REACT_APP_API_SERVER}/api/chatTutors`, {
                                params: {
                                    tutorsIdx: res.data.tutorsIdx,
                                },
                            })
                            .then((res) => {
                                // chatRooms에 강사들 정보 넣기
                                setChatRooms(res.data.chatTutorsInfo);
                                console.log("chatRooms >>", chatRooms);
                            });
                    });
            }
            // 강사일 때
            else if (res.data.tutorInfo[0]) {
                const { tutor_idx } = res.data.tutorInfo[0];
                axios
                    .get(`${process.env.REACT_APP_API_SERVER}/api/messages`, {
                        params: { tutorIdx: tutor_idx },
                    })
                    .then((res) => {
                        // setAllRoom에 학생들 인덱스 넣기
                        // console.log("res.data.studentsIdx >>", res.data.studentsIdx);
                        setAllRoom(res.data.studentsIdx);
                        // 학생인덱스들 chatRooms에 넣기
                        setChatRooms(
                            res.data.studentsIdx.map((idx: number) => {
                                return { id: idx };
                            })
                        );
                    });
            }
        });
    }, []);

    useEffect(() => {
        // 채팅방 목록이 업데이트되었으므로 ChattingList를 다시 렌더링합니다.
    }, [chatRooms]);

    // 아래 코드는 추후에 dm보내기로 채팅방 생성 코드 작성
    // allRoom은 인덱스로 채팅방 추가 및 삭제하는 채팅방 관리 state
    // useEffect(() => {
    //     // allRoom 상태가 업데이트될 때마다 실행됨
    //     // console.log("allRoom >>", allRoom);
    // }, [allRoom]);

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
