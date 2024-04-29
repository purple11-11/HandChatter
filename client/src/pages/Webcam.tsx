import React, { useEffect, useRef } from "react";
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
  //const SOCKET_SERVER_URL = "http://localhost:8080";
  const SOCKET_SERVER_URL = "http://localhost:3000/api/class";



  const Webcam = () => {
    const socketRef = useRef<SocketIOClient.Socket>();

    const pcRef = useRef<RTCPeerConnection>();
    const pcRef2 = useRef<RTCPeerConnection>();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);  
  
    
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

    const createAnswer = async (sdp: RTCSessionDescription) => {
      if (!(pcRef.current && socketRef.current)) return;
      try {
        console.log("bbbbbbb")
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer set remote description success");
        const mySdp = await pcRef.current.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        console.log("create answer");
        await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
        socketRef.current.emit("answer", mySdp);
      } catch (e) {
        console.error(e);
      }
    };

    useEffect(() => {
      socketRef.current = io.connect(SOCKET_SERVER_URL);
      pcRef.current = new RTCPeerConnection(pc_config);

      socketRef.current.on("all_users", (allUsers: Array<{ id: string }>) => {
        if (allUsers.length > 0) {
          createOffer();
        }
      });

      socketRef.current.on("getOffer", (sdp: RTCSessionDescription) => {
        console.log("get offer");
        createAnswer(sdp);
      });

      socketRef.current.on("getAnswer", (sdp: RTCSessionDescription) => {
        pcRef2.current = new RTCPeerConnection(pc_config);
        console.log("get answer");
        if (!pcRef2.current) return;
        console.log("aaaaaaaa")
        pcRef2.current.setRemoteDescription(new RTCSessionDescription(sdp));
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
        />
      </div>
    );
  };

  export default Webcam;

