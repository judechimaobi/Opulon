
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

import { Avatar } from './components/avatars/Avatar';
import { BoyModel } from './components/avatars/BoyModel';
import { City1 } from './components/avatars/City1.jsx';
import { OldMan } from './components/avatars/OldMan.jsx';

import { useInput } from './hooks/useInput';

import ProfileCircle from './components/uicomponents/ProfileCircle.jsx';
import ProfileNav from './components/uicomponents/ProfileNav.jsx';




function CameraController({ avatarPosition, avatarRotation }) {
  const { camera } = useThree();
  const cameraOffset = useRef(new THREE.Vector3(0, 2, 5));

  useFrame(() => {
    const avatarDirection = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), avatarRotation.y);
    const cameraPosition = avatarPosition.clone().add(avatarDirection.multiplyScalar(-5).add(new THREE.Vector3(0, 2, 0)));

    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(avatarPosition.x, avatarPosition.y + 1, avatarPosition.z);
  });

  return null;
}

function Scene() {
  const [avatarPosition, setAvatarPosition] = useState(new THREE.Vector3(0, 0.41, 0));
  const [avatarRotation, setAvatarRotation] = useState(new THREE.Euler(0, Math.PI, 0));
  const input = useInput();

  const updateAvatarTransform = (newPosition, newRotation) => {
    setAvatarPosition(newPosition);
    setAvatarRotation(newRotation);
  };

  return (
    <>
      <ambientLight intensity={0.7} />
			<Avatar position={avatarPosition} rotation={avatarRotation} input={input} updateTransform={updateAvatarTransform} />
			<City1 />
      <CameraController avatarPosition={avatarPosition} avatarRotation={avatarRotation} />
    </>
  );
}

const socket = io();
function App() {
  const [showProfileNav, setShowProfileNav] = useState(false);
  const audioRefs = useRef([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then(stream => {
              console.log('Local stream:', stream);
                const peer = new SimplePeer({ initiator: true, trickle: false, stream });

                peer.on('signal', data => {
                  console.log('Sending signal data:', data);
                    socket.emit('voice', data);
                });

                peer.on('stream', remoteStream => {
                  console.log('Received remote stream:', remoteStream);
                    const audio = new Audio();
                    audioRefs.current.push(audio);
                    audio.srcObject = remoteStream;
                    audio.play();
                });

                socket.on('voice', data => {
                  console.log('Received signal data:', data);
                    peer.signal(data);
                });
            })
            .catch(err => console.error('Failed to get local stream:', err));
    }, []);

  return (
    <>
      {showProfileNav && <ProfileNav />}
      <ProfileCircle profileImage={"logo.png"} lifeBarColor={"#377dff"} showProfileNav={showProfileNav} setShowProfileNav={setShowProfileNav} />
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Scene />
      </Canvas>
      
    </>
  );
}

export default App;
