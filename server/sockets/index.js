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
    const nickInfo = [];
    io.on("connection", (socket) => {
        nickInfo.push(socket.id);
        socket.on("send", async (data) => {
            const { msg, stuIdx, tutorIdx } = data;
            console.log("client에서 보낸 메시지>>", msg);
            // dm
            // (1) io.to(socket.id).emit(~~)
            // 특정 소켓아이디에게만 전달(나 포함 x)
            io.to(socket.id).emit("message", msg);
            // (2) socket.emit()
            // 나에게만 메세지 보내기
            socket.emit("message", msg);

            try {
                // 메시지를 데이터베이스에 저장
                const newMessage = await Message.create({
                    stu_idx: stuIdx,
                    tutor_idx: tutorIdx,
                    content: msg, // 예시로 content 속성에 메시지를 저장합니다.
                });
                console.log("새로운 메시지가 데이터베이스에 저장되었습니다:");
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
