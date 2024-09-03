import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

export function CameraController({ avatarPosition, avatarRotation }) {
  const { camera } = useThree();
  const cameraOffset = useRef(new THREE.Vector3(0, 2, 5));

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
// 	  const cameraPosition = avatarPosition.clone().add(avatarDirection.multiplyScalar(-3).add(new THREE.Vector3(0, 2, 0)));
  
// 	  camera.position.lerp(cameraPosition, 0.4);
// 	  camera.lookAt(avatarPosition.x, avatarPosition.y + 1, avatarPosition.z);
// 	});
  
// 	return null;
// }




// export const CharacterController = () => {
// 	const container = useRef();
// 	const character = useRef();
// 	const cameraTarget = useRef();
// 	const cameraPosition = useRef();

// 	const cameraWorldPosition = useRef(new Vector3())
// 	const cameraLookAtWorldPosition = useRef(new Vector3())
// 	const cameraLookAt = useRef(new Vector3())

// 	useFrame(({camera}) => {
// 		cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
// 		camera.position.lerp(cameraWorldPosition.current);

// 		if (cameraTarget.current) {
// 			cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
// 			cameraLookAt.current.lerp(cameraLookAtWorldPosition.current);

// 			camera.lookAt(cameraLookAt.current);
// 		}
// 	});

//     return (
// 			<RigidBody colliders={false} lockRotations>
// 				<group ref={container}>
// 					<group ref={cameraTarget} position-z={1.5} />
// 					<group ref={cameraPosition} position-y={4} position-z={-4} />
// 					<group ref={character}>
// 						<Avatar />
// 					</group>
// 				</group>
// 				<CapsuleCollider args={[0.08, 0.15 ]} />
// 			</RigidBody>
//     )
// }