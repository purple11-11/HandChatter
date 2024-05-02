import React, { useEffect, useRef, useState } from "react";
import * as io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Tutor} from "../types/interface";


  const pc_config = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
  const SOCKET_SERVER_URL = "http://localhost:8080";



  const Webcam = () => {
    const [tutorIndex, setTutorIndex] = useState<number>(1); // 예시로 초기값 1로 설정

    const socketRef = useRef<SocketIOClient.Socket>();
    const pcRef = useRef<RTCPeerConnection>();
    const pcRef2 = useRef<RTCPeerConnection>();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMicMuted, setIsMicMuted] = useState(false); // 마이크 음소거 상태를 저장하는 상태 변수
    const [isCameraOn, setIsCameraOn] = useState(false); // 화면 켜고 끄기 상태를 저장하는 상태 변수
    const [showModal, setShowModal] = useState(false); // 모달 상태를 저장하는 상태 변수
    const [rating, setRating] = useState(0); // 별점을 저장하는 상태 변수
    const [review, setReview] = useState(""); // 후기를 저장하는 상태 변수

    const navigate = useNavigate()
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
          room: "0001",
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
          track.enabled = !track.enabled;
        });
      }
    }
    // 카메라 상태 변경 후 버튼 
    setIsCameraOn((prev) => !prev);
  };

  // 모달이 열릴 때 호출되는 함수
  const closeModal = () => {
    setShowModal(false);
  };

  const sendReview = async () => {
    console.log("별점:", rating);
    console.log("후기:", review);
      
    try {
      // 후기와 별점이 입력되었는지 확인
      if (!review || !rating) {
        console.log("후기와 별점을 모두 입력하세요.");
        return;
      }
      const url = `${process.env.REACT_APP_API_SERVER}/api/reviews`;
      const response = await axios.post(url, {
        content: review, 
        rating: rating,
        tutor_idx: tutorIndex, 
      });
  
      // 서버로부터의 응답 확인
      if (response.status === 200) {
        console.log("후기 작성 성공");
        navigate('/mypage'); // 후기 작성 성공 시 마이페이지로 이동
      } else {
        console.log("서버에서 응답을 받을 수 없습니다.");
      }
    } catch (error) {
      console.error("후기 전송 중 오류 발생:", error);
    }
  };
      


    const MemoIngress = () => {};

    const ChattExit = () => {
      setShowModal(true); 
    };

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
        <button onClick={MemoIngress}>채팅 켜기</button>
        <button onClick={ChattExit}>나가기</button>

        {showModal && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#ffffdd", padding: 20, borderRadius: 10 }}>
              <h2>강의 후기 작성하기</h2>
              <h4>강사님의 강의가 도움이 되셨나요? 후기를 작성해주세요</h4>
              <div>
                <span> 별점: </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)} style={{ cursor: "pointer", color: star <= rating ? "orange" : "gray" }}>★</span>
                ))}
              </div>
              <textarea value={review} onChange={(e) => setReview(e.target.value)}  />
              <button onClick={closeModal}>뒤로가기</button>
              <button onClick={sendReview}>보내기</button>

            </div>
          </div>
        )}
      </div>

  );
};
export default Webcam;