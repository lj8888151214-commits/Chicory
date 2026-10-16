import React, { useRef } from 'react';
import { useGLTF, Text, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import saltModelUrl from '../assets/models/salt.glb';

export default function SaltModel3D({
  position = [0, 0, 0],
  scale = 0.022,
  label = "소금",
  quantity = 1,
  unit = "개"
}) {
  const { scene } = useGLTF(saltModelUrl);
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group ref={modelRef} position={position}>
      {/* 3D 실물 모델 */}
      <Center top>
        <primitive
          object={scene.clone()}
          scale={scale}
          castShadow
          receiveShadow
        />
      </Center>

      {/* 1. 식재료 이름 라벨 (일반 큐브와 동일한 fontSize={0.11} 적용) */}
      <Text
        position={[0, 0.22, 0]} // 👈 모델 바로 머리 위 높이로 조정
        fontSize={0.11}         // 👈 0.2 -> 0.11로 축소
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* 2. 수량 라벨 (일반 큐브와 동일한 fontSize={0.09} 적용) */}
      <Text
        position={[0, -0.2, 0]} // 👈 모델 하단으로 높이 조정
        fontSize={0.09}         // 👈 0.16 -> 0.09로 축소
        color="#ffd166"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >

      </Text>
    </group>
  );
}

useGLTF.preload(saltModelUrl);