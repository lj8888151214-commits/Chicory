import React, { useRef } from 'react';
import { useGLTF, Text, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Vite 번들러 import (src/assets/models/onion.glb 기준)
import onionModelUrl from '../assets/models/onion.glb';

export default function OnionModel3D({
  position = [0, 0, 0],
  scale = 0.02, // 양파 모델 크기에 맞춰 미세 조정 가능
  label = "양파",
  quantity = 1,
  unit = "개"
}) {
  const { scene } = useGLTF(onionModelUrl);
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.25;
    }
  });

  return (
    <group ref={modelRef} position={position}>
      {/* 3D 실물 양파 모델 */}
      <Center top>
        <primitive
          object={scene.clone()}
          scale={scale}
          castShadow
          receiveShadow
        />
      </Center>

      {/* 식재료 이름 라벨 */}
      <Text
        position={[0, 0.22, 0]}
        fontSize={0.11}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* 수량 라벨 */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.09}
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

useGLTF.preload(onionModelUrl);