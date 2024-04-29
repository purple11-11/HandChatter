const { session } = require("passport");
const socketIO = require("socket.io");
const { Message } = require("../models");

function socketHandler(server) {
    // server: app.js에서 http 기반 서버 전달받을 예정
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000", // react server와 통신하기 위함
        },
    });
    const nickInfo = {};
    io.on("connection", (socket) => {
        socket.on("send", async (msg) => {
            console.log("client에서 보낸 메시지>>", msg);
            try {
                // 메시지를 데이터베이스에 저장
                // 학생 로그인 상태
                if (req.session.stu_idx) {
                    const newMessage = await Message.create({
                        stu_idx: req.session.stu_idx,
                        tutor_idx: tutorIdx, // client에서 받아옴
                        content: msg, // 예시로 content 속성에 메시지를 저장합니다.
                    });
                }
                // 강사 로그인 상태
                if (req.session.tutor_idx) {
                    const newMessage = await Message.create({
                        stu_idx: stuIdx, // client에서 받아옴
                        tutor_idx: req.session.tutor_idx,
                        content: msg, // 예시로 content 속성에 메시지를 저장합니다.
                    });
                }

                console.log("새로운 메시지가 데이터베이스에 저장되었습니다:", newMessage);
            } catch (error) {
                console.error("메시지 저장 중 오류 발생:", error);
            }
        });
        socket.on("disconnect", () => {
            // 클라이언트 연결 해제
        });
    });
}

module.exports = socketHandler;
