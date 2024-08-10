import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, useGLTF, useAnimations, Environment, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { Avatar } from './Avatar';
import { useControls } from 'leva';
import { City1 } from './City1';
import { Physics, RigidBody } from '@react-three/rapier';
import { CharacterController } from './CharacterController';

const Experience = ({ connected }) => {
  // const { animation } = useControls({
  //   animation: {
  //     value: "idle",
  //     options: ["walking", "running", "walkBackward", "slowRun", "jump"]
  //   }
  // });
  
  return (
    <Canvas shadows camera={{ position: [-22,3,90], fov: 30 }}>
      
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.3}
        // minAzimuthAngle={-Math.PI / 4}
        // maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 1.96}
      />
      
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      > 
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
        />
      </directionalLight>

      <ambientLight intensity={0.5} /> 
      {/* <pointLight position={[3, 0, 17]} intensity={20} color={'orange'} /> */}
      {/* <directionalLight position={[0, 10, 5]} intensity={0.5} color={'yellow'}  /> */}
      
      
      {/* <Physics debug> */}
        {/* <CharacterController /> */}
        <group position-y={0}>
          <Avatar />
        </group>
        {/* <RigidBody type='fixed' colliders='trimesh'> */}
          <City1 />
        {/* </RigidBody> */}
      {/* </Physics> */}
    </Canvas>
  );
};

export default Experience;







































// import CameraZoom from './CameraZoom';
// import sunTexture from '../assets/images/sun.jpg';
// import mercuryTexture from '../assets/images/mercury.jpg';
// import venusTexture from '../assets/images/venus.jpg';
// import earthTexture from '../assets/images/earth2.jpg';
// import marsTexture from '../assets/images/mars.jpg';
// import jupiterTexture from '../assets/images/jupiter.jpg';
// import saturnTexture from '../assets/images/saturn.jpg';
// import neptuneTexture from '../assets/images/neptune.jpg';
// import uranusTexture from '../assets/images/uranus.jpg';
// import plutoTexture from '../assets/images/pluto.jpg';
// import { cameraFar } from 'three/examples/jsm/nodes/Nodes.js';

// const AddModel = ({ url, scale, position, rotation }) => {
//   const { scene, animations } = useGLTF(url);
//   const { actions, names} = useAnimations(animations, scene);
//   const modelRef = useRef();

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (!modelRef.current) return;
//       switch (event.key) {
//         case 'ArrowUp':
//           modelRef.current.translateZ(0.1);
//           if (actions.walk) actions[0].play();
//           break;
//         case 'ArrowDown':
//           modelRef.current.translateZ(-0.1);
//           if (actions.walk) actions.walk.play();
//           break;
//         case 'ArrowLeft':
//           modelRef.current.translateX(0.1);
//           if (actions.walk) actions.walk.play();
//           break;
//         case 'ArrowRight':
//           modelRef.current.translateX(-0.1);
//           if (actions.walk) actions.walk.play();
//           break;
//         default:
//           break;
//       }
//     };

//     const handleKeyUp = (event) => {
//       if (actions.walk) actions.walk.stop();
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [actions]);

//   return (
//     <primitive ref={modelRef} object={scene} scale={scale} position={position} rotation={rotation} dispose={null} />
//   );
// };
// const CameraZoom = ({ connected }) => {
//   const cameraRef = useRef();

//   console.log(connected);

//   useFrame(({ clock }) => {
//     if (cameraRef.current) {
//       // Example animation: make the camera orbit around the origin
//       const time = clock.getElapsedTime();
//       cameraRef.current.position.x = Math.sin(time) * 20;
//       cameraRef.current.position.z = Math.cos(time) * 20;
//       cameraRef.current.lookAt(0, 0, 0);
//     }
//   });

//   return <perspectiveCamera ref={cameraRef} position={[0, 0, 20]} />;
// };
// const Camera = React.forwardRef(({ position, ...props }, ref) => {
//   // const { camera } = useThree();
//   // const cameraRef = ref || camera;
//   const cameraRef = useRef();
//   useFrame(() => {
//     if (cameraRef.current) {
//       // cameraRef.current.position.translateZ(0.3); // Adjust offset as needed
//       cameraRef.current.position.copy(position).add(new Vector3(0, 5, 10)); // Adjust offset as needed
//       cameraRef.current.lookAt(position);
//     }
//   });
//   return <perspectiveCamera ref={cameraRef} {...props} />;
// });

// const Planet = ({ position, radius, speed, texture }) => {
//   const ref = useRef();
//   const textureMap = useLoader(TextureLoader, texture);

//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime() * speed;
//     ref.current.position.x = radius * Math.cos(t);
//     ref.current.position.z = radius * Math.sin(t);
//     ref.current.rotation.y = clock.getElapsedTime();
//   });

//   return (
//     <Sphere ref={ref} args={[0.5, 32, 32]} position={position}>
//       <meshStandardMaterial map={textureMap} />
//     </Sphere>
//   );
// };
// const sunMap = useLoader(TextureLoader, sunTexture);
  // const cameraRef = useRef();
  // console.log(cameraRef.current)
{/* <PostwarCity /> */}
      {/* <AddModel url={'/models/postwar_city/scene.gltf'} position={[0, 0, 0]} /> */}

      {/* <Sphere position={[0, 10, 0]} args={[2, 62, 62]}>
        <meshStandardMaterial attach="material" metalness={3} map={sunMap} />
      </Sphere>
      <Planet position={[3, 10, 0]} radius={4} speed={0.2} texture={mercuryTexture} />
      <Planet position={[5, 10, 0]} radius={7} speed={0.5} texture={venusTexture} />
      <Planet position={[7, 10, 0]} radius={10} speed={0.4} texture={earthTexture} />
      <Planet position={[11, 10, 0]} radius={13} speed={0.2} texture={marsTexture} />
      <Planet position={[2, 10, 0]} radius={15} speed={0.3} texture={jupiterTexture} />
      <Planet position={[13, 10, 0]} radius={18} speed={0.1} texture={saturnTexture} />
      <Planet position={[13, 10, 0]} radius={20} speed={0.2} texture={uranusTexture} />
      <Planet position={[8, 10, 0]} radius={22} speed={0.3} texture={neptuneTexture} />
      <Planet position={[17, 10, 0]} radius={24} speed={0.7} texture={plutoTexture} /> */}