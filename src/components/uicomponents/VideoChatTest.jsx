// src/components/VideoChat.js
import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';

const VideoChat = () => {
    const [peerId, setPeerId] = useState('');
    const [peer, setPeer] = useState(null);
    const [call, setCall] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [callerVideo, setCallerVideo] = useState(false);

    const myVideoRef = useRef();
    const otherVideoRef = useRef();
    const myPeerIdRef = useRef();

    useEffect(() => {
        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            setPeerId(id);
            myPeerIdRef.current = id;
        });

        newPeer.on('call', (incomingCall) => {
            setCall(incomingCall);
            setIncomingCall(true);
        });

        setPeer(newPeer);

        return () => {
            newPeer.destroy();
        };
    }, []);

    const connectToPeer = (remotePeerId) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            myVideoRef.current.srcObject = stream;
            const newCall = peer.call(remotePeerId, stream);
            newCall.on('stream', (remoteStream) => {
                otherVideoRef.current.srcObject = remoteStream;
            });
            setCall(newCall);
        });
    };

    const acceptCall = () => {
        setIncomingCall(false);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            myVideoRef.current.srcObject = stream;
            call.answer(stream);
            call.on('stream', (remoteStream) => {
                otherVideoRef.current.srcObject = remoteStream;
            });
        });
    };

    const endCall = () => {
        call.close();
        setCall(null);
        setIncomingCall(false);
    };

    return (
        <div>
            <h2>PeerJS Video Chat</h2>
            <div>
                <h3>Your ID: {peerId}</h3>
                <input type="text" placeholder="Enter peer ID to connect" ref={myPeerIdRef} />
                <button onClick={() => connectToPeer(myPeerIdRef.current.value)}>Connect User</button>
            </div>

            <div>
                <video ref={myVideoRef} autoPlay muted />
                <video ref={otherVideoRef} autoPlay />
            </div>

            {incomingCall && (
                <div>
                    <h4>Incoming Call...</h4>
                    <audio autoPlay loop>
                        <source src="../../assets/audio/ringing-incoming.mp3" type="audio/mp3" />
                    </audio>
                    <button onClick={acceptCall}>Accept Call</button>
                </div>
            )}

            {call && <button onClick={endCall}>End Call</button>}
        </div>
    );
};

export default VideoChat;
