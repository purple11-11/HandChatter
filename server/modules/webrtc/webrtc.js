const socketIO = require("socket.io");

const users = {};
const socketToRoom = {};
const maximum = 2;

function socketWebRTC(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
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

      const usersInThisRoom = users[data.room].filter(
        (user) => user.id !== socket.id
      );
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
    
    socket.on("disconnect", () => {
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
      });
  
    // 화상채팅 1:1 채팅창
    socket.on("send", (msgData) => {
      msgData = { nick: msgData.nick, msg: msgData.msg };    
      const {msg, nick} = msgData; 
        io.emit("message", {
          nick: nick, 
          msg: msg,
        });
    });
    });
  }

module.exports = socketWebRTC;