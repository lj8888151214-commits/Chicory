import React, { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import fridgeModelUrl from '../assets/models/fridge.glb';

export default function FridgeModel3D({
  isOpen = false,
  position = [0, -0.6, -0.2],
  scale = 1.0
}) {
  const { scene } = useGLTF(fridgeModelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const doorRef = useRef();

  useEffect(() => {
    if (!clonedScene) return;
    const door = clonedScene.getObjectByName('Environment_Fridge_Door');
    if (door) {
      doorRef.current = door;
    }
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (doorRef.current) {
      // 📌 한 바퀴 이상 헛돌지 않도록 2π(360도) 주기 정규화 적용
      // -11.2566 rad와 100% 동일한 위치 (열림)
      const openAngle = -6.2866;

      // -9.37 rad와 100% 동일한 위치 (닫힘, 약 180도 반대편 전면)
      const closeAngle = -4.087; // 또는 +3.196

      const targetAngle = isOpen ? openAngle : closeAngle;

      doorRef.current.rotation.y = THREE.MathUtils.damp(
        doorRef.current.rotation.y,
        targetAngle,
        6,
        delta
      );
    }
  });

  return (
    <group position={position}>
      <primitive
        object={clonedScene}
        scale={scale}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(fridgeModelUrl);