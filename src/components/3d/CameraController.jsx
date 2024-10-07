// import { useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useRef } from 'react';

// export function CameraController({ avatarPosition, avatarRotation }) {
//   const { camera } = useThree();
//   const cameraOffset = useRef(new THREE.Vector3(0, 2, 5));

//   useFrame(() => {
//     // Calculate direction based on avatar's rotation
//     const avatarDirection = new THREE.Vector3(0, 0, -1).applyEuler(avatarRotation);

//     // Set camera position behind the avatar
//     const cameraPosition = avatarPosition.clone()
//       .add(avatarDirection.multiplyScalar(cameraOffset.current.z))
//       .add(new THREE.Vector3(0, cameraOffset.current.y, 0)); // Adjust height

//     // Smooth transition
//     camera.position.lerp(cameraPosition, 0.1);
//     camera.lookAt(avatarPosition.x, avatarPosition.y + 1, avatarPosition.z);
//   });

//   return null;
// }











// import { useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useRef } from 'react';

// export function CameraController({ avatarPosition, avatarRotation }) {
//   const { camera } = useThree();
//   const cameraOffset = useRef(new THREE.Vector3(0, 2, 5)); // Adjust the offset as needed

//   useFrame(() => {
//     // Calculate the direction in which the avatar is facing
//     const avatarDirection = new THREE.Vector3(0, 0, -1).applyEuler(avatarRotation);

//     // Position the camera behind the avatar with a constant offset
//     const cameraPosition = avatarPosition.clone().add(avatarDirection.multiplyScalar(cameraOffset.current.z));

//     // Adjust vertical and horizontal offset if needed
//     cameraPosition.y += cameraOffset.current.y;
//     cameraPosition.x += cameraOffset.current.x;

//     camera.position.lerp(cameraPosition, 0.1); // Adjust the lerp factor for smoother camera movement
//     camera.lookAt(avatarPosition);
//   });

//   return null;
// }









import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

export function CameraController({ avatarPosition, avatarRotation }) {
  const { camera } = useThree();
  const cameraOffset = useRef(new THREE.Vector3(0, 1, 3));
  // const cameraOffset = useRef(new THREE.Vector3(0, 1, 1.2));

  useFrame(() => {
    // Calculate the direction in which the avatar is facing
    const avatarDirection = new THREE.Vector3(0, 0, -1).applyEuler(avatarRotation);
    
    // Position the camera behind the avatar
    const cameraPosition = avatarPosition.clone()
      .add(avatarDirection.multiplyScalar(cameraOffset.current.z))  // Move the camera behind the avatar
      .add(new THREE.Vector3(0, cameraOffset.current.y, 0)); // Adjust vertical position

    camera.position.lerp(cameraPosition, 0.4);
    camera.lookAt(avatarPosition.x, avatarPosition.y + 1, avatarPosition.z);
  });

  return null;
}










// import { useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useRef } from 'react';

// export function CameraController({ avatarPosition, avatarRotation }) {
//   const { camera } = useThree();
//   const cameraOffset = useRef(new THREE.Vector3(0, 2, 5)); // Set the desired offset from the avatar

//   useFrame(() => {
//     // Calculate the forward direction the avatar is facing
//     const forwardDirection = new THREE.Vector3(0, 0, -1).applyEuler(avatarRotation); // Forward direction

//     // Calculate the camera's position on the imaginary circle behind the avatar
//     const cameraPosition = avatarPosition.clone()
//       .add(forwardDirection.clone().multiplyScalar(-cameraOffset.current.z)) // Offset behind the avatar
//       .add(new THREE.Vector3(0, cameraOffset.current.y, 0)); // Adjust vertical position

//     // Smoothly interpolate the camera's position to follow the avatar
//     camera.position.lerp(cameraPosition, 0.1);

//     // Make the camera look at the avatar's position to keep the avatar centered
//     camera.lookAt(avatarPosition.x, avatarPosition.y + 1, avatarPosition.z);
//   });

//   return null;
// }





// import { useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { CapsuleCollider, RigidBody } from '@react-three/rapier';
// import { Avatar } from '../avatars/Avatar';
// import { useRef } from 'react';
// import { Vector3 } from 'three';


// export function CameraController({ avatarPosition, avatarRotation }) {
// 	// console.log("Position:", avatarPosition, "Rotation:", -avatarRotation.y);
// 	const { camera } = useThree();
// 	const cameraOffset = useRef(new THREE.Vector3(0, 2, 5));
  
// 	useFrame(() => {
// 	  const avatarDirection = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), avatarRotation.y);
// 	  const cameraPosition = avatarPosition.clone().add(avatarDirection.multiplyScalar(2).add(new THREE.Vector3(0, 1, 0)));
  
// 	  camera.position.lerp(cameraPosition, 0);
// 	  camera.lookAt(avatarPosition.x, avatarPosition.y + 1, avatarPosition.z);
// 	});
  
// 	return null;
// }


