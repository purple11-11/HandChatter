import React, { useEffect, useRef, useState } from "react";
import * as io from "socket.io-client";

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

  
    
    const setVideoTracks = async () => { //
      try {
        console.log("abcd", navigator.mediaDevices)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        // 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한다.
        if (!(pcRef.current && socketRef.current)) return;
        stream.getTracks().forEach((track) => {
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
        });

        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (!socketRef.current) return;
            console.log("onicecandidate");
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
    // 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한 후에 room에 접속했다고 Signaling Server에 알린다.
    // 왜냐하면 offer or answer을 주고받을 때의 RTCSessionDescription에 해당 video, audio track에 대한 정보가 담겨 있기 때문에 
    // 순서를 어기면 상대방의 MediaStream을 받을 수 없음

        };
        console.log("sfjkdfhkjhfkj", socketRef.current);
        socketRef.current.emit("join_room", {
          room: "1234",
        });
      } catch (e) {
        console.error(e);
      }
    };

    // 상대방에게 offer signal 전달
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

    // 상대방의 Offer를 받고, 이에 대한 Answer를 생성하여 Signaling Server로 전송하는 함수
    const createAnswer = async (sdp: RTCSessionDescription) => {
      if (!(pcRef.current && socketRef.current)) return;
      try {
        // 원격 설명을 설정
        console.log("bbbbbbb")
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer set remote description success");

        // Answer SDP를 생성
        const mySdp = await pcRef.current.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        console.log("create answer");

        // 로컬 설명을 설정
        await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));

        // Answer SDP를 Signaling Server로 전송
        socketRef.current.emit("answer", mySdp);

        // 이벤트 핸들러를 사용하여 원격 트랙을 받아와서 remoteVideoRef에 연결
        pcRef.current.ontrack = (event) => { 
          // ontrack 이벤트 핸들러는 상대방의 비디오 트랙을 받아와서 remoteVideoRef에 연결
          // 상대방의 비디오가 "remoteVideoRef에 랜더링"
          console.log("Received remote track");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
  
    useEffect(() => {
      socketRef.current = io.connect(SOCKET_SERVER_URL);
      pcRef.current = new RTCPeerConnection(pc_config);

      socketRef.current.on("all_users", (allUsers: Array<{ id: string }>) => {
        console.log("allUsers", allUsers)
        if (allUsers.length > 0) {
          createOffer();
        }
      });
      /* 위에 주석을 해제하고 실행 시키면 메모장에 있는 에러문들이 뜸
      console.log에는 candidate: sLCSnCWcz4NhlBOFAAAr 이렇게 많은 글이 반복해서 나옴
      */

      socketRef.current.on("getOffer", (sdp: RTCSessionDescription) => {
        pcRef2.current = new RTCPeerConnection(pc_config);
        console.log("get offer");
        pcRef2.current.createOffer();
        createAnswer(sdp);
      });

      socketRef.current.on("getAnswer", (sdp: RTCSessionDescription) => {
        console.log("get answer");
        if (!pcRef.current) return;
        console.log("aaaaaaaa")
        pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socketRef.current.on(
        "getCandidate",
        async (candidate: RTCIceCandidateInit) => {
          if (!pcRef.current) return;
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("candidate add success");
        }
      );
      console.log(navigator.mediaDevices)
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

    // Button
    const MicMute = () => {};
    const CamMute = () => {};
    const ChattIngress = () => {};
    const ChattExit = () => {};

    // 본인과 상대방의 video 렌더링
    return (
      <div>
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: "black",
          }}
          muted
          ref={localVideoRef}
          autoPlay
        />
        <video
          id="remotevideo"
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: "black",
          }}
          ref={remoteVideoRef}
          autoPlay
        /> <br/>
          <button onClick={MicMute}>마이크 음소거</button>
          <button onClick={CamMute}>카메라 끄기</button>
          <button onClick={ChattIngress}>채팅 켜기</button>
          <button onClick={ChattExit}>나가기</button>
      </div>
    );
  };

  export default Webcam;
