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


export function CoolMan({ position, rotation, input, updateTransform }) {
  const { forward, backward, left, right, shift, jump } = input;
  const currentAction = useRef("");
  const avatarRef = useRef();
  
  const { scene } = useGLTF('models/cool_man.glb');
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
  return (
    <group object={nodes.Armature} ref={avatarRef} position={position} rotation={rotation} dispose={null} >
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.966}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="Armature_178">
                <group name="GLTF_created_0">
                  <primitive object={nodes.GLTF_created_0_rootJoint} />
                  <group name="Object_11_168" />
                  <group name="Object_13_169" />
                  <group name="Object_15_170" />
                  <group name="Object_17_171" />
                  <group name="Object_19_172" />
                  <group name="Object_21_173" />
                  <group name="Object_23_174" />
                  <group name="Object_25_175" />
                  <group name="Object_7_176" />
                  <group name="Object_9_177" />
                  <skinnedMesh name="Object_7" geometry={nodes.Object_7.geometry} material={materials['Wolf3D_Skin.003']} skeleton={nodes.Object_7.skeleton} />
                  <skinnedMesh name="Object_9" geometry={nodes.Object_9.geometry} material={materials['Wolf3D_Teeth.003']} skeleton={nodes.Object_9.skeleton} />
                  <skinnedMesh name="Object_11" geometry={nodes.Object_11.geometry} material={materials['Wolf3D_Body.003']} skeleton={nodes.Object_11.skeleton} />
                  <skinnedMesh name="Object_13" geometry={nodes.Object_13.geometry} material={materials['Wolf3D_Outfit_Bottom.003']} skeleton={nodes.Object_13.skeleton} />
                  <skinnedMesh name="Object_15" geometry={nodes.Object_15.geometry} material={materials['Wolf3D_Outfit_Footwear.003']} skeleton={nodes.Object_15.skeleton} />
                  <skinnedMesh name="Object_17" geometry={nodes.Object_17.geometry} material={materials['Wolf3D_Outfit_Top.003']} skeleton={nodes.Object_17.skeleton} />
                  <skinnedMesh name="Object_19" geometry={nodes.Object_19.geometry} material={materials['Wolf3D_Hair.003']} skeleton={nodes.Object_19.skeleton} />
                  <skinnedMesh name="Object_21" geometry={nodes.Object_21.geometry} material={materials['Wolf3D_Glasses.003']} skeleton={nodes.Object_21.skeleton} />
                  <skinnedMesh name="Object_23" geometry={nodes.Object_23.geometry} material={materials['Wolf3D_Eye.003']} skeleton={nodes.Object_23.skeleton} />
                  <skinnedMesh name="Object_25" geometry={nodes.Object_25.geometry} material={materials['Wolf3D_Eye.003']} skeleton={nodes.Object_25.skeleton} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/cool_man.glb')
