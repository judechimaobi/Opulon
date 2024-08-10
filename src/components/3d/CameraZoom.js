import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const CameraZoom = ({ connected }) => {
  const { camera } = useThree();
  const initialPosition = useRef(camera.position.clone());

  useEffect(() => {
    if (connected) {
      camera.position.set(initialPosition.current.x, initialPosition.current.y, 10);
    }
  }, [connected, camera]);

  useFrame(() => {
    if (connected && camera.position.z > 5) {
      camera.position.z -= 0.1;
    }
  });

  return null;
};

export default CameraZoom;
