import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';

const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';

export default function AvatarRPMPlay({ input, updateTransform, rotation, position }) {
  const { forward, backward, left, right, shift, jump } = input;
  const avatarRef = useRef();
  const avatarAnimationRef = useRef();
  const currentAction = useRef("idle");

  // Load the avatar model and animations
  const { scene } = useGLTF(modelSrc);
  const idleAnimation = useFBX("animations/Idle.fbx");
  const walkingAnimation = useFBX("animations/Walking.fbx");
  const runningAnimation = useFBX("animations/Running.fbx");
  const jumpAnimation = useFBX("animations/Jump.fbx");

  // Assign names to animations
  idleAnimation.animations[0].name = "idle";
  walkingAnimation.animations[0].name = "walking";
  runningAnimation.animations[0].name = "running";
  jumpAnimation.animations[0].name = "jump";

  const { actions, mixer } = useAnimations(
    [
      idleAnimation.animations[0],
      walkingAnimation.animations[0],
      runningAnimation.animations[0],
      jumpAnimation.animations[0],
    ],
    avatarAnimationRef
  );

  useEffect(() => {
    if (actions.idle) {
      actions.idle.setDuration(2).reset().play();
      actions.idle.clampWhenFinished = true;
    }

    // Object.keys(actions).forEach((key) => {
    //   actions[key].setLoop(THREE.LoopRepeat);
    //   actions[key].clampWhenFinished = true;
    //   actions[key].play();
    // });
  }, [actions]);



  // Determine which action to play
  let newAction = "idle";
  if (jump) {
    newAction = "jump";
    console.log(newAction);
  } else if (forward || backward) {
    newAction = shift ? "running" : "walking";
    console.log(newAction);
  } else {
    newAction = "idle";
    console.log(newAction);
  }
  
  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);

    if (avatarRef.current) {
      // const newPosition = new THREE.Vector3();
      // const newRotation = new THREE.Quaternion();
      
      // // Get the current world position and rotation
      // avatarRef.current.getWorldPosition(newPosition);
      // avatarRef.current.getWorldQuaternion(newRotation);

      // // Convert quaternion to euler for rotation consistency
      // const eulerRotation = new THREE.Euler().setFromQuaternion(newRotation);

      // updateTransform(newPosition, eulerRotation);

      

      
      const speed = shift ? 0.2 : 0.08;
      const rotationSpeed = 0.05;
      // let newPosition = new THREE.Vector3(position.x, position.y, position.z);
      // let newRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);

      let newPosition = avatarRef.current.position.clone(); // Start with the current position
      let newRotation = avatarRef.current.rotation.clone(); // Start with the current rotation

      if (forward) newPosition.z += speed * Math.cos(newRotation.y);
      if (backward) newPosition.z -= speed * Math.cos(newRotation.y);
      if (left) newRotation.y += rotationSpeed;
      if (right) newRotation.y -= rotationSpeed;

      if (forward) newPosition.x += speed * Math.sin(newRotation.y);
      if (backward) newPosition.x -= speed * Math.sin(newRotation.y);

      avatarRef.current.position.copy(newPosition);
      avatarRef.current.rotation.copy(newRotation);
      
      updateTransform(newPosition, newRotation);



      if (newAction !== currentAction.current && actions[newAction]) {
        const current = actions[currentAction.current];
        // if (current) {
        //   current.stop(); // Stop the current animation
        // }

        const nextActionToPlay = actions[newAction];
        nextActionToPlay.setDuration(2).reset().fadeIn(0.2).play();
        nextActionToPlay.clampWhenFinished = true;
        nextActionToPlay.setLoop(THREE.LoopRepeat, Infinity);
        currentAction.current = newAction;
      }

      // Apply root motion directly from animation
      const deltaPosition = new THREE.Vector3();
      const deltaRotation = new THREE.Euler();

      // Use delta position and rotation for animations with root motion
      avatarRef.current.position.add(deltaPosition);

      // Correct way to update the rotation
      avatarRef.current.rotation.x = newRotation.x;
      avatarRef.current.rotation.y = newRotation.y;
      avatarRef.current.rotation.z = newRotation.z;

      // Update the avatar's new position and rotation back to parent
      updateTransform(avatarRef.current.position, avatarRef.current.rotation);
    }
  });

  return (
    <group ref={avatarRef} dispose={null}>
      <primitive 
        ref={avatarAnimationRef}
        object={scene} 
        position={position} 
        rotation={rotation}  
        />
    </group>
  );
}











// import React, { useState, useEffect, useRef } from 'react';
// import { extend, useFrame } from '@react-three/fiber';
// import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
// import { Avatar } from "@readyplayerme/visage";
// import * as THREE from 'three';
// import { useAnimations, useFBX, useGLTF } from '@react-three/drei';

// const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';

// export default function AvatarRPMPlay({ input, position, rotation, updateTransform }) {
//   const { forward, backward, left, right, shift, jump } = input;
//   extend({ Avatar });

//   const [avatarUrl, setAvatarUrl] = useState(modelSrc);
//   const avatarRef = useRef();
//   const avatarAnimationRef = useRef();
//   const currentAction = useRef("idle");
//   const previousAction = useRef(null); // Track previous action to avoid redundant transitions

//   // Load the avatar model and animations
//   const { scene } = useGLTF(avatarUrl);
//   const idleAnimation = useFBX("animations/Idle.fbx");
//   const walkingAnimation = useFBX("animations/Walking.fbx");
//   const runningAnimation = useFBX("animations/Running.fbx");
//   const jumpAnimation = useFBX("animations/Jump.fbx");

//   // Assign names to animations
//   idleAnimation.animations[0].name = "idle";
//   walkingAnimation.animations[0].name = "walking";
//   runningAnimation.animations[0].name = "running";
//   jumpAnimation.animations[0].name = "jump";

//   const { actions, mixer } = useAnimations([
//     idleAnimation.animations[0],
//     walkingAnimation.animations[0],
//     runningAnimation.animations[0],
//     jumpAnimation.animations[0],
//   ], avatarAnimationRef);

//   useEffect(() => {
//     if (sessionStorage.getItem("avatarUrl")) {
//       setAvatarUrl(sessionStorage.getItem("avatarUrl"));
//     }
// 		if (actions.idle) {
// 			actions.idle.setLoop(THREE.LoopRepeat, Infinity);
// 			actions.idle.reset().play();
// 		}
//   }, []);

//   useEffect(() => {
//     if (actions.idle) {
//       // Play the idle animation initially
//       actions.idle.reset().play();
//     }
//   }, [actions]);

//   useFrame(() => {
		
//     const speed = shift ? 0.2 : 0.08;
//     const rotationSpeed = 0.05;
//     let newPosition = new THREE.Vector3(position.x, position.y, position.z);
//     let newRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);

//     if (forward) newPosition.z -= speed * Math.cos(newRotation.y);
//     if (backward) newPosition.z += speed * Math.cos(newRotation.y);
//     if (left) newRotation.y += rotationSpeed;
//     if (right) newRotation.y -= rotationSpeed;

//     if (forward) newPosition.x -= speed * Math.sin(newRotation.y);
//     if (backward) newPosition.x += speed * Math.sin(newRotation.y);

//     avatarRef.current.position.copy(newPosition);
//     avatarRef.current.rotation.copy(newRotation);
    
//     updateTransform(newPosition, newRotation);

//     // Determine which action to play
//     let newAction = "idle";
//     if (jump) {
//       newAction = "jump";
//     } else if (forward || backward || left || right) {
//       newAction = shift ? "running" : "walking";
//     }

//     // Only switch actions if the new action is different and the new action exists
//     if (newAction !== currentAction.current && actions[newAction]) {

//       // Play the new action
//       const nextActionToPlay = actions[newAction];
//       nextActionToPlay.reset().fadeIn(0.2).play();
      
//       // Update the current action
//       previousAction.current = currentAction.current;
//       currentAction.current = newAction;
//     }
//   });

//   // Animation loop to update mixer
//   useFrame((state, delta) => {
//     if (mixer) mixer.update(delta);
//   });

//   return (
//     <group ref={avatarRef} dispose={null}>
//       <primitive object={scene} ref={avatarAnimationRef} dispose={null} position={position} rotation={rotation} />
//     </group>
//   );
// }
























