import {useCallback, useEffect, useMemo, useRef, useState,} from "react";
import io from "socket.io-client";
import WebSpeech from "./WebSpeech";
import styles from "./WebCam.module.scss"
import { useInfoStore } from "../../store/store"; // Importing the store
  
  const socket = io.connect("http://localhost:8080", {
  autoConnect: false,
});


export default function WebChatting ({}) {
  const userInfo = useInfoStore((state) => state.userInfo);
  console.log(userInfo?.nickname);

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
        //상대방:''
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



  console.log('chatList',chatList)
  return (
    <section>
        <div className={`${styles.chatBox}`}>
          <header className={`${styles.webchatheader}`}>1:1 화상 수업방</header>
          <div className = {`${styles.chat_box}`}>              
            {/* <WebSpeech chat={{type:'me',content:'test content', isDm:false, name:'aaaa'}} /> */}
              {chatList.map((chat, i) => {
              return <WebSpeech key={i} chat={chat} />;
              })}
            </div>
          <form
            className={`${styles.msg_form}`}
            id="msg_form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="메세지 입력"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <button className={`${styles.button}`}>전송</button>
          </form>
        </div>
    </section>
  );
};

