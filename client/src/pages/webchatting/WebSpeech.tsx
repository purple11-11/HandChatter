import React from "react";
import styles from "./WebCam.module.scss";
interface SpeechProps {
    chat: {
        type: string;
        content: string;
        isDm: boolean;
        name: string;
    };
}

const WebSpeech: React.FC<SpeechProps> = ({ chat }) => {
    return (
        <div className={`${styles.speech} ${chat.type === "me" ? styles.me : styles.other}`}>
            {chat.type === "other" && <span className={`${styles.nickname}`}>{chat.name}</span>}
            <span className="msg-box">{chat.content}</span>
        </div>
    );
};

export default WebSpeech;
