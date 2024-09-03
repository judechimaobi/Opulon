import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGraph } from '@react-three/fiber';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';



function useAnimationLoader(animations, ref) {
  const [loaded, setLoaded] = useState(false);
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions && Object.keys(actions).length === animations.length) {
      console.log("Animations loaded:", Object.keys(actions));
      setLoaded(true);
    }
  }, []);

  return { actions, loaded };
}

export function OldMan({ position, rotation, input, updateTransform }) {
  const { forward, backward, left, right, shift, jump } = input;
  const currentAction = useRef("");
  const avatarRef = useRef();
  
  const { scene } = useGLTF('models/oldMan.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // Load animations at the top level
  const idleAnimation = useFBX("animations/Idle.fbx");
  const walkingAnimation = useFBX("animations/Walking.fbx");
  const runningAnimation = useFBX("animations/running.fbx");
  const slowRunAnimation = useFBX("animations/Slow run.fbx");
  const jumpAnimation = useFBX("animations/Jump.fbx");
  const walkBackwardAnimation = useFBX("animations/Walking Backward.fbx");

  // Assign names to animations
  idleAnimation.animations[0].name = "idle";
  walkingAnimation.animations[0].name = "walking";
  runningAnimation.animations[0].name = "running";
  slowRunAnimation.animations[0].name = "slowRun";
  jumpAnimation.animations[0].name = "jump";
  walkBackwardAnimation.animations[0].name = "walkBackward";




  const { actions, loaded } = useAnimationLoader([
    idleAnimation.animations[0],
    walkingAnimation.animations[0],
    runningAnimation.animations[0],
    slowRunAnimation.animations[0],
    jumpAnimation.animations[0],
    walkBackwardAnimation.animations[0]
  ], avatarRef);

  useEffect(() => {
    if (loaded && actions.idle) {
      console.log("Attempting to play idle animation");
      actions.idle.reset().fadeIn(0.2).play();
      currentAction.current = "idle";
      console.log("Idle animation should be playing now");
    }
  }, [loaded]);

  useEffect(() => {
    if (nodes && nodes.Armature) {
      console.log("Skeleton loaded");
    } else {
      console.log("Skeleton not found");
    }
  }, [nodes]);

  useEffect(() => {
    if (loaded && actions.idle) {
      console.log("Idle animation details:", actions.idle);
      console.log("Is idle animation attached to model?", actions.idle.getRoot() === nodes.Armature);
    }
  }, [loaded, nodes]);
  
  // useEffect(() => {
  //   if (avatarRef.current) {
  //     console.log("Avatar transform:", avatarRef.current.matrix.elements);
  //   }
  // }, [avatarRef.current]);
  useEffect(() => {
    if (actions.idle) {
      actions.running.play();
      console.log(actions.running.play());
      currentAction.current = "idle";
    } else {
      console.warn("Idle animation not found");
    }
  }, [loaded]);

  useFrame((state, delta) => {
    if (avatarRef.current) {
      const speed = shift ? 0.2 : 0.07;
      const rotationSpeed = 0.05;
      let newPosition = new THREE.Vector3(position.x, position.y, position.z);
      let newRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);

      if (forward) newPosition.z -= speed * Math.cos(newRotation.y);
      if (backward) newPosition.z += speed * Math.cos(newRotation.y);
      if (left) newRotation.y += rotationSpeed;
      if (right) newRotation.y -= rotationSpeed;

      if (forward) newPosition.x -= speed * Math.sin(newRotation.y);
      if (backward) newPosition.x += speed * Math.sin(newRotation.y);

      avatarRef.current.position.copy(newPosition);
      avatarRef.current.rotation.copy(newRotation);

      updateTransform(newPosition, newRotation);

      // Handle animations
      let newAction = "idle";
      if (forward || backward || left || right) {
        newAction = shift ? "running" : "walking";
      } else if (jump) {
        newAction = "jump";
      }

      if (newAction !== currentAction.current && actions[newAction]) {
        const nextActionToPlay = actions[newAction];
        const current = actions[currentAction.current];
        if (current) {
          current.fadeOut(0.2);
        }
        if (nextActionToPlay) {
          nextActionToPlay.reset().fadeIn(0.2).play();
          currentAction.current = newAction;
        }
      }
    }
  });

  
  // const { scene } = useGLTF('models/oldMan.glb')
  // const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  // const { nodes, materials } = useGraph(clone)
  return (
    <group object={nodes.Armature} ref={avatarRef} position={position} rotation={rotation} dispose={null} >
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Beard" geometry={nodes.Wolf3D_Beard.geometry} material={materials.Wolf3D_Beard} skeleton={nodes.Wolf3D_Beard.skeleton} morphTargetDictionary={nodes.Wolf3D_Beard.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Beard.morphTargetInfluences} />
    </group>
  )
}

useGLTF.preload('models/oldMan.glb')
