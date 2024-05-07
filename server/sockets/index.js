const { session } = require("passport");
const socketIO = require("socket.io");
const { Message } = require("../models");

function socketHandler(server) {
    // server: app.js에서 http 기반 서버 전달받을 예정
    const io = socketIO(server, {
        cors: {
            origin: true, // react server와 통신하기 위함
        },
    });

    // 튜터와 학생의 소켓 ID를 저장할 객체
    const tutorSockets = {};
    const studentSockets = {};

    // WebRTC (1)
    const users = {};
    const socketToRoom = {};
    const maximum = 2;
    // WebRTC (1)end

    io.on("connection", (socket) => {
        // 소켓 연결이 이루어졌을 때
        console.log("새로운 소켓이 연결되었습니다:", socket.id);
        socket.on("join", (data) => {
            console.log("새로운 학생 추가");
            // 클라이언트가 튜터인지 학생인지에 따라 소켓 ID를 저장
            const { role, idx, other } = data;
            if (role === "tutor") {
                tutorSockets[idx] = socket.id;
                // 상대방 소켓 존재하면 보내주기
                if (studentSockets[other]) socket.emit("other", studentSockets[other]);
            } else if (role === "student") {
                studentSockets[idx] = socket.id;
                console.log("otherIndex >> ", other);
                console.log("otherSocket >> ", tutorSockets[other]);
                console.log(tutorSockets);
                if (tutorSockets[other]) console.log("otherSocket >> ", tutorSockets[other]);
                socket.emit("other", tutorSockets[other]);
            }
            // console.log(studentSockets);
        });

        socket.on("send", async (data) => {
            const { msg, stuIdx, tutorIdx, sender, receiver } = data;
            try {
                // 메시지를 데이터베이스에 저장
                const newMessage = await Message.create({
                    stu_idx: stuIdx,
                    tutor_idx: tutorIdx,
                    content: msg, // 예시로 content 속성에 메시지를 저장합니다.
                    sender,
                    receiver,
                });
                console.log("새로운 메시지가 데이터베이스에 저장되었습니다:");
            } catch (error) {
                console.error("메시지 저장 중 오류 발생:", error);
            }

            // console.log("total", tutorSockets);
            // console.log("tutorIdx", tutorIdx);
            // console.log(tutorSockets[tutorIdx]); // undef
            // console.log("-------");
            // 특정 튜터나 학생에게 메시지 전송
            if (sender === "tutor" && studentSockets[stuIdx]) {
                io.to(studentSockets[stuIdx]).emit("message", { msg: msg, socketId: socket.id });
            } else if (sender === "student" && tutorSockets[tutorIdx]) {
                io.to(tutorSockets[tutorIdx]).emit("message", { msg: msg, socketId: socket.id });
            }
        });

        // WebRTC (2)
        socket.on("join_room", (data) => {
            if (users[data.room]) {
                const length = users[data.room].length;
                if (length === maximum) {
                    socket.to(socket.id).emit("room_full");
                    return;
                }
                users[data.room].push({ id: socket.id });
            } else {
                users[data.room] = [{ id: socket.id }];
            }
            socketToRoom[socket.id] = data.room;
            socket.join(data.room);

            const usersInThisRoom = users[data.room].filter((user) => user.id !== socket.id);
            io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
        });

        socket.on("offer", (sdp) => {
            socket.broadcast.emit("getOffer", sdp);
        });

        socket.on("answer", (sdp) => {
            socket.broadcast.emit("getAnswer", sdp);
        });

        socket.on("candidate", (candidate) => {
            socket.broadcast.emit("getCandidate", candidate);
        });
        //WebRTC (2)end

        socket.on("disconnect", () => {
            // 클라이언트 연결 해제 시 소켓 ID를 관리하는 배열에서 제거
            console.log("소켓이 연결 해제되었습니다:", socket.id);

            // tutorSockets에서 제거
            const tutorIndex = Object.values(tutorSockets).indexOf(socket.id);
            if (tutorIndex !== -1) {
                delete tutorSockets[tutorIndex];
            }

            // studentSockets에서 제거
            const studentIndex = Object.values(studentSockets).indexOf(socket.id);
            if (studentIndex !== -1) {
                delete studentSockets[studentIndex];
            }

            //WebRTC (3)
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter((user) => user.id !== socket.id);
                users[roomID] = room;
                if (room.length === 0) {
                    delete users[roomID];
                    return;
                }
            }
            socket.broadcast.to(room).emit("user_exit", { id: socket.id });
            //WebRTC (3)end
        });

        ///WebRTC (4)
<<<<<<< Updated upstream
        socket.on("sendRTC", (msgData) => {
            msgData = { nick: msgData.nick, msg: msgData.msg };    
            const {msg, nick} = msgData; 
              io.emit("messageRTC", {
                nick: nick, 
=======
        socket.on("send", (msgData) => {
            msgData = { nick: msgData.nick, msg: msgData.msg };
            const { msg, nick } = msgData;
            io.emit("message", {
                nick: nick,
>>>>>>> Stashed changes
                msg: msg,
            });
        });
        //WebRTC (4)end
    });
}

module.exports = socketHandler;
