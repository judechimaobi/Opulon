import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Peer } from "peerjs";
import "./VideoChat.css";
import ringtone from '../../assets/audio/ringing-incoming.mp3';

const incomingCallSfx = () => {
  const audio = new Audio(ringtone);
  audio.play();
};

const VideoChat = ({ socket, roomId }) => {
  const [myPeerId, setMyPeerId] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [remotePeerId, setRemotePeerId] = useState(null);

  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const myPeerRef = useRef();
  const socketRef = useRef();
  const userStreamRef = useRef();
  const callRef = useRef();
  




  // RUN IMMEDIATELY
  useEffect(() => {
    setRemotePeerId(roomId);
    socketRef.current = io('/');
    // socketRef.current = socket;
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
        setRemotePeerId(userId);
      });

      // socket.on('user_list', (userList) => {
      //   setRemotePeerId(roomId); // This should be done when the current user logs in
      // })
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
      incomingCallSfx(); // Play the ringing sound
    }
  }, [incomingCall]);
  
  const connectToNewUser = () => {
    if (remotePeerId) {
      alert(remotePeerId);
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
    <div className='videoContainer'>
      <div id="video-grid">
        <video className='video' ref={myVideoRef} autoPlay playsInline />
        {callAccepted && <video ref={remoteVideoRef} autoPlay playsInline />}
      </div>
      {!callAccepted && (
        // <button className='callBt' onClick={connectToNewUser} disabled={!remotePeerId}>
        <button className='callBt' onClick={connectToNewUser}>
          Connect User
        </button>
      )}
      {callAccepted && <button onClick={endCall}>End Call</button>}
  
      {incomingCall && !callAccepted && (
        <div className="incoming-call-popup">
          <h3>Incoming Call</h3>
          <video className='video' ref={remoteVideoRef} autoPlay playsInline />
          <button onClick={acceptCall}>Accept Call</button>
        </div>
      )}
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
