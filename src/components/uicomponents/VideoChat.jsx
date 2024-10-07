import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Peer } from "peerjs";
import "./VideoChat.css";
import ringtone from '../../assets/audio/ringing-incoming.mp3';






const VideoChat = ({ socket, roomId }) => {
  // console.log("Socke ID:", socket.id);
  // console.log("Video Chat Room ID:", roomId);

  const [myPeerId, setMyPeerId] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [ringingStatus, setRingingStatus] = useState(false);

  // const [remoteUserId, setRemoteUserId] = useState(null);

  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const myPeerRef = useRef();
  const socketRef = useRef();
  const userStreamRef = useRef();
  const callRef = useRef();
  


  // const incomingCallSfx = (ringingStatus) => {
    // if (ringingStatus == true) {
    //   const audio = new Audio(ringtone);
    //   audio.loop = true;
    //   audio.play();
    // } else {
    //   audio.pause();
    //   audio.currentTime = 0;
    // }
  // };

  // RUN IMMEDIATELY
  useEffect(() => {
    // setRemotePeerId(roomId); // This should be the ID of the other/remote user not the id of the caller
    socketRef.current = io('/');
    // socketRef.current = socket;

    // myPeerRef.current = new Peer(sessionStorage.getItem('pubKey'));
    myPeerRef.current = new Peer();

    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    }).then(stream => {
      userStreamRef.current = stream;
      myVideoRef.current.srcObject = stream;
      myVideoRef.current.muted = true;

      myPeerRef.current.on('call', call => {
        setIncomingCall(true);
        callRef.current = call;

        call.on('stream', userVideoStream => {
          remoteVideoRef.current.srcObject = userVideoStream;
        });
      });

      socketRef.current.on('user_login', userId => {
        alert('Remote user connected:', userId);
        console.log('Remote user connected:', userId);
        // setRemotePeerId(userId);
      });

      // socket.on('user_list', (userList) => {
      //   setRemotePeerId(roomId); // This should be done when the current user logs in
      // })
    }).catch(error => {
      if (error.name === 'NotReadableError') {
        console.error("The device is already in use by another application or browser tab.");
        alert("The camera or microphone is already in use.");
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        console.error("Permission to use the device was denied.");
        alert("Permission denied to use the camera/microphone.");
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        console.error("No camera/microphone device found.");
        alert("No camera or microphone found on this device.");
      } else {
        console.error("Error accessing media devices:", error);
        alert("Unable to access the camera/microphone.");
      }
    });



    myPeerRef.current.on('open', id => {
      setMyPeerId(id);
      socketRef.current.emit('join-room', roomId, id);
    });

    return () => {
      socketRef.current.disconnect();
      myPeerRef.current.destroy();
    };
  }, [roomId]);

  useEffect(() => {
    if (incomingCall) {
      const audio = new Audio(ringtone);
      audio.loop = true;
      audio.play();
    }
  }, [incomingCall]);
  
  const connectToNewUser = (remotePeerId) => {
    // console.log(myPeerId);

    if (remotePeerId) {
      // console.log("remotePeerId: ", remotePeerId);
      const call = myPeerRef.current.call(remotePeerId, userStreamRef.current);
      call.on('stream', userVideoStream => {
        remoteVideoRef.current.srcObject = userVideoStream;
      });
      callRef.current = call;
    } else {
      console.log("RemotePeerID not set: ", remotePeerId);
    }
  };

  const acceptCall = () => {
    if (callRef.current) {
      callRef.current.answer(userStreamRef.current);
      callRef.current.on('stream', userVideoStream => {
        remoteVideoRef.current.srcObject = userVideoStream;
      });
      setCallAccepted(true);
      setIncomingCall(false);
      setRingingStatus(false);

      const audio = new Audio(ringtone);
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const endCall = () => {
    if (callRef.current) {
      callRef.current.close();
      remoteVideoRef.current.srcObject = null;
      setCallAccepted(false);
    }
  };


  // alert(remotePeerId);

  return (
    <div className='outerContainer'>
      <div className='videoContainer'>
        <div className='video-grid'>
          <div className='my-video-col'>
            <video className='video' ref={myVideoRef} autoPlay playsInline />
            <span className='peerIdMsg'>
              {myPeerId ? `${myPeerId}` : 'Peer ID not set!'}
            </span>
            <button className='showIdBtn' onClick={() => console.log("myPeerId: ", myPeerId)}>
              Show ID
            </button>
          </div>
          <div className='incoming-video-col'>
            {incomingCall && !callAccepted && (
              <div className="incoming-call-popup">
                <h3>Incoming Call</h3>
                <video className='video' ref={remoteVideoRef} autoPlay playsInline />
                <button onClick={acceptCall}>Accept Call</button>
              </div>
            )}
            {callAccepted && <video className='video' ref={remoteVideoRef} autoPlay playsInline />}
            {!callAccepted && (
              <>
                <video className='video' ref={remoteVideoRef} autoPlay playsInline />
                <input 
                  type='text' 
                  className='idInput'
                  placeholder='enter user gaming tag...'
                  onChange={(event) => setRemotePeerId(event.target.value)} 
                  value={remotePeerId}
                />
                <button className='startCallBtn' onClick={() => connectToNewUser(remotePeerId)}>Start call</button>  
              </>
            )}
          </div>
        </div>

        
        {/* {callAccepted && <button onClick={endCall}>End Call</button>} */}
      </div>
      {callAccepted && <button className='endCallBtn' onClick={endCall}>End Call</button>}

    </div>
  );
};

export default VideoChat;










//   return (
//     <div>
//       <button className='callBtn' onClick={handleCallClick} disabled={!userConnected}>
//         Connect User
//       </button>
//       <div className="videoContainer" ref={videoGridRef}>
//             <video className="video" ref={myVideoRef} autoPlay playsInline />
//         </div>
//     </div>
//   );
// };

// export default VideoChat;
