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
        <div className={`${styles.speech} ${chat.type}`}>
            {chat.type === "other" && <span className="nickname">{chat.name}</span>}
            <span className="msg-box">{chat.content}</span>
        </div>
    );
};

export default WebSpeech;
