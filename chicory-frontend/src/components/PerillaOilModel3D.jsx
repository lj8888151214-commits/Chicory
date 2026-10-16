import React, { useRef } from 'react';
import { useGLTF, Text, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Vite 번들러 import (src/assets/models/perilla_oil.glb 기준)
import perillaOilModelUrl from '../assets/models/perilla_oil.glb';

export default function PerillaOilModel3D({
  position = [0, 0, 0],
  scale = 0.02, // 병/패키지 크기에 따라 0.015 ~ 0.03 사이로 조절
  label = "들기름",
  quantity = 1,
  unit = "개"
}) {
  const { scene } = useGLTF(perillaOilModelUrl);
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
    }
  });

  return (
    <group ref={modelRef} position={position}>
      {/* 3D 실물 모델 중심 정렬 */}
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
        position={[0, 0.24, 0]}
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

useGLTF.preload(perillaOilModelUrl);