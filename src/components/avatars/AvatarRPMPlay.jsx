import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useInput } from '../../hooks/useInput'; // Ensure this hook handles arrow keys
import { CameraController } from '../3d/CameraController'; // Ensure this component follows the avatar correctly

const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';
const idleAnimSrc = 'animations/Idle.fbx';
const walkAnimSrc = 'animations/Walking.fbx';
const runAnimSrc = 'animations/Running.fbx';
const jumpAnimSrc = 'animations/Jump.fbx';

export default function AvatarRPMPlay() {
  const avatarRef = useRef();
  const rigidBodyRef = useRef();

  // Load the GLTF model
  const { scene } = useGLTF(modelSrc);

  // Load animations using useFBX
  const idleAnimation = useFBX(idleAnimSrc);
  const walkAnimation = useFBX(walkAnimSrc);
  const runAnimation = useFBX(runAnimSrc);
  const jumpAnimation = useFBX(jumpAnimSrc);

  // Rename the animation clips for easier reference
  idleAnimation.animations[0].name = 'idle';
  walkAnimation.animations[0].name = 'walking';
  runAnimation.animations[0].name = 'running';
  jumpAnimation.animations[0].name = 'jump';

  // Use useAnimations hook to get the actions and mixer
  const { actions, mixer } = useAnimations(
    [
      idleAnimation.animations[0],
      walkAnimation.animations[0],
      runAnimation.animations[0],
      jumpAnimation.animations[0],
    ],
    avatarRef
  );

  // Get input state from the useInput hook
  const input = useInput();

  const moveSpeed = 2; // Movement speed units per second
  const rotationSpeed = Math.PI / 2; // 90 degrees per second
  const jumpHeight = 2; // Maximum height of the jump
  const groundY = 1; // Ground level Y position

  // Refs to manage position and rotation without causing re-renders
  const avatarPosition = useRef(new THREE.Vector3(0, groundY, 0));
  const avatarRotation = useRef(new THREE.Euler(0, 0, 0));

  // Refs to manage jump state
  const isJumping = useRef(false);
  const jumpStartTime = useRef(0);
  const jumpDuration = useRef(0.5); // Will be set based on animation duration
  const prevJump = useRef(false); // To detect jump initiation

  // Set jumpDuration based on animation's duration
  useEffect(() => {
    const jumpAction = actions['jump'];
    if (jumpAction) {
      jumpDuration.current = jumpAction.getClip().duration;
    }
  }, [actions]);

  // Set up animations based on input
  useEffect(() => {
    const playAction = (name) => {
      const action = actions[name];
      if (action) {
        // Fade out all actions except the one to play
        Object.keys(actions).forEach((key) => {
          if (actions[key] !== action) {
            actions[key].fadeOut(0.2);
          }
        });
        // Fade in the selected action
        action.reset().fadeIn(0.2).play();
      }
    };

    if (input.forward || input.backward) {
      if (input.shift) {
        playAction('running'); // Run when shift is pressed
      } else {
        playAction('walking'); // Walk when moving normally
      }
    } else if (input.jump) {
      playAction('jump'); // Jump when spacebar is pressed
    } else {
      playAction('idle'); // Idle when no movement
    }
  }, [input, actions]);

  // Apply movement, rotation, and jumping using Rapier's kinematicPosition
  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;

    if (rb) {
      // Update the animation mixer
      mixer.update(delta);

      let rotationChanged = false;

      // Handle rotation based on input.left and input.right
      if (input.left || input.right) {
        const rotationDirection = input.left ? 1 : -1; // Left: positive rotation, Right: negative rotation
        const rotationAmount = rotationSpeed * delta * rotationDirection;

        // Update the avatar's rotation state
        avatarRotation.current.y += rotationAmount;
        rotationChanged = true;
      }

      // Calculate forward movement based on current rotation
      const forward = new THREE.Vector3(0, 0, 1).applyEuler(avatarRotation.current).normalize();

      // Determine movement direction
      let moveDirection = new THREE.Vector3();

      if (input.forward) moveDirection.add(forward);
      if (input.backward) moveDirection.sub(forward);

      if (moveDirection.length() > 0) {
        moveDirection.normalize().multiplyScalar(moveSpeed * delta);
        avatarPosition.current.add(moveDirection);
      }

      // Apply rotation if it has changed
      if (rotationChanged) {
        const quaternion = new THREE.Quaternion().setFromEuler(avatarRotation.current);
        rb.setNextKinematicRotation(quaternion, true);
      }

      // Handle Jump Initiation
      if (input.jump && !prevJump.current && !isJumping.current) {
        isJumping.current = true;
        jumpStartTime.current = state.clock.elapsedTime;
        // Play jump animation
        actions['jump']?.reset().fadeIn(0.2).play();
      }

      // Update the previous jump state
      prevJump.current = input.jump;

      // Handle Jump Animation and Y-Position
      if (isJumping.current) {
        const elapsed = state.clock.elapsedTime - jumpStartTime.current;
        if (elapsed < jumpDuration.current) {
          const t = elapsed / jumpDuration.current; // Progress from 0 to 1
          const jumpY = Math.sin(t * Math.PI) * jumpHeight; // Sine curve for smooth jump
          avatarPosition.current.y = groundY + jumpY;
        } else {
          // Jump has completed
          avatarPosition.current.y = groundY;
          isJumping.current = false;
        }
      } else {
        // Ensure the avatar stays on the ground
        avatarPosition.current.y = groundY;
      }

      // Apply the updated position to the RigidBody
      rb.setNextKinematicTranslation(avatarPosition.current, true);
    }

    // Ensure the model's Y-position remains zero to prevent conflicting Y movements
    if (avatarRef.current) {
      avatarRef.current.position.y = 0;
    }
  });

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        type="kinematicPosition" // Kinematic for manual control
        colliders={false}
        position={avatarPosition.current.toArray()}
        rotation={avatarRotation.current}
        gravityScale={0} // Disable gravity
      >
        {/* Add a cuboid collider to represent the humanoid shape */}
        <CuboidCollider args={[0.2, 0.5, 0.2]} />

        <primitive
          ref={avatarRef}
          object={scene}
          scale={0.5}
          position={[0, 0, 0]} // Ensure model's Y position is zero relative to RigidBody
          // Removed rotation to prevent double rotation
        />
      </RigidBody>

      {/* Integrate the CameraController to follow the avatar */}
      <CameraController
        avatarPosition={avatarPosition.current}
        avatarRotation={avatarRotation.current}
        avatarRef={avatarRef}
      />
    </>
  );
}

// Preload assets for optimization
useGLTF.preload(modelSrc);
useFBX.preload(idleAnimSrc);
useFBX.preload(walkAnimSrc);
useFBX.preload(runAnimSrc);
useFBX.preload(jumpAnimSrc);



























// import React, { useRef, useEffect, useState } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
// import { RigidBody, CuboidCollider } from '@react-three/rapier';

// const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';

// export default function AvatarRPMPlay({ input, updateTransform }) {
//   const avatarRef = useRef();
//   const rbRef = useRef(); // This will hold the RigidBody API instance

//   const [avatarPosition, setAvatarPosition] = useState(new THREE.Vector3(0, 2, 0)); // Initialize with THREE.Vector3
//   const [avatarRotation, setAvatarRotation] = useState(new THREE.Euler(0, 0, 0)); // Initialize with THREE.Euler

//   const velocityRef = useRef([0, 0, 0]); // Rapier expects arrays for velocities
//   const currentAction = useRef("idle");

//   // Load the avatar model and animations
//   const { scene } = useGLTF(modelSrc);
//   const idleAnimation = useFBX("animations/Idle.fbx");
//   const walkingAnimation = useFBX("animations/Walking.fbx");
//   const runningAnimation = useFBX("animations/Running.fbx");
//   const jumpAnimation = useFBX("animations/Jump.fbx");

//   idleAnimation.animations[0].name = "idle";
//   walkingAnimation.animations[0].name = "walking";
//   runningAnimation.animations[0].name = "running";
//   jumpAnimation.animations[0].name = "jump";

//   const { actions, mixer } = useAnimations(
//     [
//       idleAnimation.animations[0],
//       walkingAnimation.animations[0],
//       runningAnimation.animations[0],
//       jumpAnimation.animations[0],
//     ],
//     avatarRef
//   );

//   useEffect(() => {
//     if (actions.idle) {
//       actions.idle.setDuration(2).reset().play();
//       actions.idle.clampWhenFinished = true;
//     }
//   }, [actions]);

//   useFrame((state, delta) => {
//     if (mixer) mixer.update(delta);

//     const rb = rbRef.current; // RigidBody reference from the ref
//     if (rb) {
//       const { forward, backward, left, right, jump, shift } = input || {};
//       const speed = shift ? 10 : 5;
//       const rotationSpeed = 1.5;

//       // Handle forward/backward movement using linear velocity
//       const linVel = rb.linvel(); // Get current linear velocity
//       if (forward) velocityRef.current[2] = -speed;
//       if (backward) velocityRef.current[2] = speed;
//       if (!forward && !backward) velocityRef.current[2] = 0;

//       // Handle rotation using angular velocity
//       const angVel = rb.angvel(); // Get current angular velocity
//       if (left) angVel.y = rotationSpeed;
//       if (right) angVel.y = -rotationSpeed;
//       if (!left && !right) angVel.y = 0;

//       // Set the velocities on the rigid body
//       rb.setLinvel(velocityRef.current, true); // true: direct velocity application
//       rb.setAngvel(angVel, true); // true: direct angular velocity application

//       // Apply jumping force if jump is true
//       if (jump) {
//         rb.applyImpulse({ x: 0, y: 5, z: 0 }, true); // Upward impulse
//       }

//       // Get the translation (position) and rotation as arrays from the physics engine
//       const newPosition = rb.translation(); // [x, y, z]
//       const newRotation = rb.rotation(); // quaternion [x, y, z, w]

//       // Check if newPosition or newRotation are valid
//       if (newPosition && newRotation) {
//         // Ensure proper conversion to THREE.Vector3
//         const vectorPosition = new THREE.Vector3().fromArray(newPosition);
//         // Ensure proper conversion to THREE.Euler from quaternion
//         const quaternion = new THREE.Quaternion().fromArray(newRotation);
//         const eulerRotation = new THREE.Euler().setFromQuaternion(quaternion);

//         // Update the avatar's position and rotation states
//         setAvatarPosition(vectorPosition);
//         setAvatarRotation(eulerRotation);

//         // Update the parent component with new position and rotation
//         updateTransform(vectorPosition, eulerRotation);
//       }
//     }
//   });

//   return (
//     <group ref={avatarRef} dispose={null}>
//       <RigidBody
//         ref={rbRef} // Reference to the rigid body instance
//         colliders="cuboid"
//         gravityScale={1}
//         friction={1}
//         restitution={0.1}
//         linearDamping={0.5}
//         angularDamping={0.5}
//         lockRotations={false}
//       >
//         <CuboidCollider args={[0.3, 1.7, 0.3]} />
//         <primitive object={scene} />
//       </RigidBody>
//     </group>
//   );
// }































// import React, { useRef, useEffect } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
// import { RigidBody, CuboidCollider } from '@react-three/rapier';

// const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';

// export default function AvatarRPMPlay({ input, updateTransform, rotation, position }) {
//   const forward = input?.forward || false;
//   const backward = input?.backward || false;
//   const left = input?.left || false;
//   const right = input?.right || false;
//   const jump = input?.jump || false;
//   const shift = input?.shift || false;
  
//   // const { forward, backward, left, right, shift, jump } = input;


//   const avatarRef = useRef();
//   const avatarAnimationRef = useRef();
//   const currentAction = useRef("idle");

//   // Load the avatar model and animations
//   const { scene } = useGLTF(modelSrc);
//   const idleAnimation = useFBX("animations/Idle.fbx");
//   const walkingAnimation = useFBX("animations/Walking.fbx");
//   const runningAnimation = useFBX("animations/Running.fbx");
//   const jumpAnimation = useFBX("animations/Jump.fbx");

//   // Assign names to animations
//   idleAnimation.animations[0].name = "idle";
//   walkingAnimation.animations[0].name = "walking";
//   runningAnimation.animations[0].name = "running";
//   jumpAnimation.animations[0].name = "jump";

//   const { actions, mixer } = useAnimations(
//     [
//       idleAnimation.animations[0],
//       walkingAnimation.animations[0],
//       runningAnimation.animations[0],
//       jumpAnimation.animations[0],
//     ],
//     avatarAnimationRef
//   );

//   useEffect(() => {
//     if (actions.idle) {
//       actions.idle.setDuration(2).reset().play();
//       actions.idle.clampWhenFinished = true;
//     }

//     // Object.keys(actions).forEach((key) => {
//     //   actions[key].setLoop(THREE.LoopRepeat);
//     //   actions[key].clampWhenFinished = true;
//     //   actions[key].play();
//     // });
//   }, [actions]);



//   // Determine which action to play
//   let newAction = "idle";
//   if (jump) {
//     newAction = "jump";
//     console.log(newAction);
//   } else if (forward || backward) {
//     newAction = shift ? "running" : "walking";
//     console.log(newAction);
//   } else {
//     newAction = "idle";
//     console.log(newAction);
//   }
  
//   useFrame((state, delta) => {
//     if (mixer) mixer.update(delta);

//     if (avatarRef.current) {
//       // const newPosition = new THREE.Vector3();
//       // const newRotation = new THREE.Quaternion();
      
//       // // Get the current world position and rotation
//       // avatarRef.current.getWorldPosition(newPosition);
//       // avatarRef.current.getWorldQuaternion(newRotation);

//       // // Convert quaternion to euler for rotation consistency
//       // const eulerRotation = new THREE.Euler().setFromQuaternion(newRotation);

//       // updateTransform(newPosition, eulerRotation);

      

      
//       const speed = shift ? 0.2 : 0.07;
//       const rotationSpeed = 0.05;
//       // let newPosition = new THREE.Vector3(position.x, position.y, position.z);
//       // let newRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);

//       let newPosition = avatarRef.current.position.clone(); // Start with the current position
//       let newRotation = avatarRef.current.rotation.clone(); // Start with the current rotation

//       if (forward) newPosition.z += speed * Math.cos(newRotation.y);
//       if (backward) newPosition.z -= speed * Math.cos(newRotation.y);
//       if (left) newRotation.y += rotationSpeed;
//       if (right) newRotation.y -= rotationSpeed;

//       if (forward) newPosition.x += speed * Math.sin(newRotation.y);
//       if (backward) newPosition.x -= speed * Math.sin(newRotation.y);

//       avatarRef.current.position.copy(newPosition);
//       avatarRef.current.rotation.copy(newRotation);
      
//       updateTransform(newPosition, newRotation);



//       if (newAction !== currentAction.current && actions[newAction]) {
//         const current = actions[currentAction.current];
//         // if (current) {
//         //   current.stop(); // Stop the current animation
//         // }

//         const nextActionToPlay = actions[newAction];
//         nextActionToPlay.setDuration(2).reset().fadeIn(0.2).play();
//         nextActionToPlay.clampWhenFinished = true;
//         nextActionToPlay.setLoop(THREE.LoopRepeat, Infinity);
//         currentAction.current = newAction;
//       }

//       // Apply root motion directly from animation
//       const deltaPosition = new THREE.Vector3();
//       const deltaRotation = new THREE.Euler();

//       // Use delta position and rotation for animations with root motion
//       avatarRef.current.position.add(deltaPosition);

//       // Correct way to update the rotation
//       avatarRef.current.rotation.x = newRotation.x;
//       avatarRef.current.rotation.y = newRotation.y;
//       avatarRef.current.rotation.z = newRotation.z;

//       // Update the avatar's new position and rotation back to parent
//       updateTransform(avatarRef.current.position, avatarRef.current.rotation);
//     }
//   });

//   return (
//     <group ref={avatarRef} dispose={null}>
//         <RigidBody
//           gravityScale={1}
//           friction={1}
//           restitution={0.1}
//           linearDamping={0.5}
//           angularDamping={0.5}
//           lockRotations={false}
//         > 
//         <CuboidCollider args={[0.3, 1.7, 0.3]} /> {/* Adjust collider size as needed */}
//         <primitive 
//           ref={avatarAnimationRef}
//           object={scene} 
//           position={position} 
//           rotation={rotation}  
//         />
//       </RigidBody>
//     </group>
//   );
// }




































































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
//       <primitive object={scene} ref={avatarAnimationRef} dispose={null} />
//     </group>
//   );
// }
























