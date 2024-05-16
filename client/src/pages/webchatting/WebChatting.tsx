import {useCallback, useEffect, useMemo, useRef, useState,} from "react";
import io from "socket.io-client";
import { useInfoStore } from "../../store/store"; 

  const socket = io.connect("http://localhost:8080", {
  autoConnect: false,
});


export default function WebChatting ({}) {
  const userInfo = useInfoStore((state) => state.userInfo);

  const [msgInput, setMsgInput] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);

  useEffect(() => {
    const initSocketConnect = () => {
      if (!socket.connected) socket.connect();
    };
    initSocketConnect(); 
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msgInput.trim() === "") return setMsgInput("");

    // 메시지 전송
    const sendData = {
        nick: userInfo?.nickname,
        msg: msgInput,
    };
    socket.emit("send", sendData);
     setMsgInput("");
};

const addChatList = useCallback(
  (messageData: { nick: string, msg: string }) => {
    const type = messageData.nick === userInfo?.nickname ? "me" : "other";
    const newChatList = [
      ...chatList,
      { type: type, name: messageData.nick, content: messageData.msg },
    ];
    setChatList(newChatList);
  },
  [userInfo?.nickname, chatList]
);

useEffect(() => {
  socket.on("message", addChatList);
}, [addChatList]);
  return (
    <></>
  );
};