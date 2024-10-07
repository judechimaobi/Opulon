import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

import AvatarRPMPlay from '../avatars/AvatarRPMPlay';
import { Bifrost } from '../avatars/Bifrost';
import { City1 } from '../avatars/City1';
import { CameraController } from './CameraController.jsx';
import { useInput } from '../../hooks/useInput';

import { useSocket } from '../uicomponents/SocketProvider';
import BackgroundImage from './BackgroundImage.jsx';


function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </RigidBody>
  );
}

function Scene({ connectionState }) {
  const [avatarPosition, setAvatarPosition] = useState(new THREE.Vector3(0, 2, 0));
  const [avatarRotation, setAvatarRotation] = useState(new THREE.Euler(0, 0, 0));

  const rigidBodyRef = useRef();

  const { players = {}, updateAvatar } = useSocket();
  const input = useInput();

  const updateAvatarTransform = (newPosition, newRotation) => {
    setAvatarPosition(newPosition);
    setAvatarRotation(newRotation);
  };

  return (
    <>
      <ambientLight intensity={2.7} color="white" />

      {connectionState === 'verified' ? (
        <RigidBody type="fixed">
          <City1 />
          <Ground />
        </RigidBody>
      ) : (
        <RigidBody type="fixed">
          <CuboidCollider args={[50, 1, 50]} position={[0, -0.5, 0]} />
          <Bifrost />
        </RigidBody>
      )}
      <AvatarRPMPlay rigidBodyRef={rigidBodyRef} />
      <OrbitControls />
    </>
  );
}

const Experience = ({ connectionState }) => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
      <Suspense>
        <Physics>
          <Scene connectionState={connectionState} />
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default Experience;






























// import React, { useRef, useEffect, useState } from 'react';
// import { extend, Canvas, useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { OrbitControls, Sphere, Html, useGLTF, useAnimations, Environment, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
// import { useSocket } from '../uicomponents/SocketProvider';
// import { useControls } from 'leva';
// // import { City1 } from './City1';
// import { Physics, RigidBody } from '@react-three/rapier';
// import { CameraController } from './CameraController.jsx';

// import { useInput } from '../..//hooks/useInput';


// import { Avatar } from '../avatars/Avatar';
// import AvatarRPMPlay from '../avatars/AvatarRPMPlay';

// import { Bifrost } from '../avatars/Bifrost.jsx';
// import { ManInSuit } from '../avatars/ManInSuit';
// import { BoyModel } from '../avatars/BoyModel';
// import { OldMan } from '../avatars/OldMan.jsx';
// import { City1 } from '../avatars/City1.jsx';
// import { CoolMan } from '../avatars/CoolMan.jsx';






// function Scene({ connectionState }) {
//   const [avatarPosition, setAvatarPosition] = useState(new THREE.Vector3(0, 0.41, 0));
//   const [avatarRotation, setAvatarRotation] = useState(new THREE.Euler(0, 0, 0));

//   const { players, updateAvatar } = useSocket(); // Get players and updateAvatar from context
//   const avatarPositionRef = useRef(new THREE.Vector3(0, 0.41, 0));
//   const avatarRotationRef = useRef(new THREE.Euler(0, 0, 0));
//   const input = useInput();

//   const updateAvatarTransform = (newPosition, newRotation) => {
//     setAvatarPosition(newPosition);
//     setAvatarRotation(newRotation);
//     // avatarPositionRef.current = newPosition;
//     // avatarRotationRef.current = newRotation;
//     // console.log("Rotation: ",avatarRotationRef.current);

//     updateAvatar(newPosition, newRotation);
//   };
//   // {console.log(Object.values(players))}

//   return (
//     <>
//       <ambientLight intensity={2.7} color="white" />
//       <AvatarRPMPlay
//         position={avatarPosition}
//         rotation={avatarRotation}
//         input={input}
//         updateTransform={updateAvatarTransform}
//       />

//        {/* Render other players' avatars */}
       
//        {Object.values(players || {}).map((player) => (
//        <AvatarRPMPlay
//           key={player.id}
//           position={new THREE.Vector3(player.position.x, player.position.y, player.position.z)}
//           rotation={new THREE.Euler(player.rotation.x, player.rotation.y, player.rotation.z)}
//           input={{}} // No input for other players
//           updateTransform={updateAvatarTransform}
//         />
//       ))}

//       {/* <Avatar position={avatarPosition} rotation={avatarRotation} input={input} updateTransform={updateAvatarTransform} /> */}
//       {/* <RigidBody type='fixed' position-y={0} colliders='trimesh'> */}
//       {connectionState === 'disconnected' && (<Bifrost />)}
//       {connectionState === 'connected' && (<City1 />)}
//       {/* </RigidBody> */}
//       <OrbitControls />
//       {/* <orthographicCamera position={[0,10,0]} /> */}
//       <CameraController avatarPosition={avatarPosition} avatarRotation={avatarRotation} />
//     </>
//   );
// }

// const Experience = ({ connectionState }) => {
  

//   return (
//     <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
//       <Physics>
//         <Scene connectionState={connectionState} />
//       </Physics>
//     </Canvas>
//   );
// };

// export default Experience;
