import React, { useEffect, useRef, useState } from "react";
import * as io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

  /* Client에서 사용할 변수들
  pc_config: RTCPeerConnection을 생성할 때의 config
  socket: Signaling Server와 통신할 socket
  pc: RTCPeerConnetion
  localVideoRef: 본인의 video, audio를 재생할 video 태그의 ref
  remoteVideoRef: 상대방의 video, audio를 재생할 video 태그의 ref
  */
 
  const pc_config = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
  const SOCKET_SERVER_URL = "http://localhost:8080";



  const Webcam = () => {
    const socketRef = useRef<SocketIOClient.Socket>();
    const pcRef = useRef<RTCPeerConnection>();
    const pcRef2 = useRef<RTCPeerConnection>();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMicMuted, setIsMicMuted] = useState(false); // 마이크 음소거 상태를 저장하는 상태 변수
    const [isCameraOn, setIsCameraOn] = useState(false); // 화면 켜고 끄기 상태를 저장하는 상태 변수
    const setVideoTracks = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: !isMicMuted,
        });
  
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  
        if (!(pcRef.current && socketRef.current)) return;
        stream.getTracks().forEach((track) => {
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
        });
  
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (!socketRef.current) return;
            socketRef.current.emit("candidate", e.candidate);
          }
        };
  
        pcRef.current.oniceconnectionstatechange = (e) => {
          console.log(e);
        };
  
        pcRef.current.ontrack = (ev) => {
          console.log("add remotetrack success");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
          }
        };
  
        socketRef.current.emit("join_room", {
          room: "1234",
        });
      } catch (e) {
        console.error(e);
      }
    };
  
    const createOffer = async () => {
      console.log("create offer");
      if (!(pcRef.current && socketRef.current)) return;
      try {
        const sdp = await pcRef.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
        socketRef.current.emit("offer", sdp);
      } catch (error) {
        console.error(error);
      }
    };
  
    const createAnswer = async (sdp: RTCSessionDescription) => {
      if (!(pcRef.current && socketRef.current)) return;
      try {
        console.log("bbbbbbb");
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
        console.log("answer set remote description success");
  
        const mySdp = await pcRef.current.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        console.log("create answer");
  
        await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
  
        socketRef.current.emit("answer", mySdp);
  
        pcRef.current.ontrack = (event) => {
          console.log("Received remote track");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
      } catch (e) {
        console.error(e);
      }
    };
    
    useEffect(() => {
      socketRef.current = io.connect(SOCKET_SERVER_URL);
      pcRef.current = new RTCPeerConnection(pc_config);
  
      socketRef.current.on("all_users", (allUsers: Array<{ id: string }>) => {
        console.log("allUsers", allUsers);
        if (allUsers.length > 0) {
          createOffer();
        }
      });
  
      socketRef.current.on("getOffer", (sdp: RTCSessionDescription) => {
        pcRef2.current = new RTCPeerConnection(pc_config);
        console.log("get offer");
        pcRef2.current.createOffer();
        createAnswer(sdp);
      });
  
      socketRef.current.on("getAnswer", (sdp: RTCSessionDescription) => {
        console.log("get answer");
        if (!pcRef.current) return;
        console.log("aaaaaaaa");
        pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      });
  
      socketRef.current.on("getCandidate", async (candidate: RTCIceCandidateInit) => {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("candidate add success");
      });
  
      console.log(navigator.mediaDevices);
      setVideoTracks();
  
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        if (pcRef.current) {
          pcRef.current.close();
        }
      };
    }, []);
  
   // MicMute : 음성 켜고 끄기
   const MicMute = () => {
    setIsMicMuted((prev) => !prev);

    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = !isMicMuted;
        });
      }
    }
  };

  const micText = isMicMuted ? "마이크 켜기" : "마이크 끄기";

  // CamMute : 영상 켜고 끄기
const CamMute = () => {
  if (localVideoRef.current) {
    const stream = localVideoRef.current.srcObject as MediaStream;
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled; // 카메라 상태를 반전시킴
      });
    }
  }
  // 카메라 상태 변경 후 버튼 
  setIsCameraOn((prev) => !prev);
};

const ChattIngress = () => {};
const ChattExit = () => {};

return (
  <div style={{ position: "relative" }}>
    <div style={{ position: "relative", width: 240, height: 240 }}>
      <video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "#727272",
        }}
        muted
        ref={localVideoRef}
        autoPlay
      />
      <div style={{ position: "absolute", bottom: 0, right: 0 }}>
        <div className="mic_icon" onClick={MicMute}>
          <FontAwesomeIcon icon={isMicMuted ? faMicrophoneSlash : faMicrophone} />
        </div>
      </div>
    </div>
    <video
      id="remotevideo"
      style={{
        width: 240,
        height: 240,
        margin: 5,
        backgroundColor: "#a2c579",
      }}
      ref={remoteVideoRef}
      autoPlay
    /> <br/>
    
    <button onClick={MicMute}>
      {micText}
    </button> 
    <button onClick={CamMute}>카메라 {isCameraOn ? '켜기' : '끄기'}</button>
    <button onClick={ChattIngress}>채팅 켜기</button>
    <button onClick={ChattExit}>나가기</button>
  </div>
  );
};

export default Webcam;