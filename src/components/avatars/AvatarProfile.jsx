import React, { useState, useEffect } from 'react';
import { extend } from '@react-three/fiber';
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { Avatar } from "@readyplayerme/visage";
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';

const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';

export default function AvatarProfile() {
  
  // const animationSrc = useFBX("animations/Idle.fbx");
  const animationSrc = "animations/Idle.fbx";
  extend({ Avatar });
  const [avatarUrl, setAvatarUrl] = useState(modelSrc);

  useEffect(() => {
    if (sessionStorage.getItem("avatarUrl")) {
      setAvatarUrl(sessionStorage.getItem("avatarUrl"));
    }
  }, [])

  // console.log(avatarUrl);
  return (
      <>
        <Avatar modelSrc={avatarUrl} animationSrc />
      </>
  );
}