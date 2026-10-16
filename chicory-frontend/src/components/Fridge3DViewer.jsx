import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function CameraController({ isOpen, controlsRef }) {
  useFrame((state, delta) => {
    const targetZ = isOpen ? 4.8 : 2.6;
    const targetY = isOpen ? -0.1 : 0.22;

    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 4.5, delta);

    if (controlsRef.current) {
      const targetLookY = isOpen ? -0.12 : -0.25;
      controlsRef.current.target.set(0, targetLookY, 0);
      controlsRef.current.update();
    }
  });
  return null;
}

function Ingredient3D({ item, color }) {
  return (
    <group>
      <RoundedBox args={[0.2, 0.15, 0.2]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      <Text
        position={[0, 0.13, 0]}
        fontSize={0.075}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {item.name}
      </Text>
    </group>
  );
}

function FallbackFridge({ isOpen }) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* 냉장고 본체 프레임 */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[1.2, 1.8, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} transparent opacity={0.65} />
      </mesh>
      {/* 선반 3단 */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.6]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.6]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.6]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function RefrigeratorScene({ ingredients, isOpen, onRemoveIngredient }) {
  const getColor = (name = '') => {
    if (name.includes('돼지') || name.includes('고기') || name.includes('삼겹')) return '#ff6b6b';
    if (name.includes('김치')) return '#ee5253';
    if (name.includes('대파') || name.includes('양파') || name.includes('채소')) return '#1dd1a1';
    if (name.includes('계란') || name.includes('달걀') || name.includes('두부')) return '#feca57';
    if (name.includes('감자') || name.includes('마늘')) return '#c8d6e5';
    return '#54a0ff';
  };

  const shelves = [0.25, -0.12, -0.66];

  const renderModel = (item) => {
    return <Ingredient3D item={item} color={getColor(item.name || '')} />;
  };

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <pointLight position={[0, 0.5, 0.8]} intensity={1.2} color="#ffffff" />

      <Suspense fallback={null}>
        <FallbackFridge isOpen={isOpen} />
      </Suspense>

      {/* DraggableItem 대신 Three.js 표준 group 태그로 배치 */}
      {ingredients.map((item, idx) => {
        const shelfIndex = idx % 3;
        const yPos = shelves[shelfIndex];
        const colIndex = Math.floor(idx / 3) % 3;
        const xPos = colIndex === 0 ? -0.26 : colIndex === 1 ? 0.0 : 0.26;
        const depthLevel = Math.floor(idx / 9);
        const zPos = 0.06 - depthLevel * 0.16;

        return (
          <group
            key={item.id || `${item.name}-${idx}`}
            position={[xPos, yPos + 0.03, zPos]}
            onClick={() => onRemoveIngredient && onRemoveIngredient(item.id || item.name)}
          >
            <Suspense fallback={null}>
              {renderModel(item)}
            </Suspense>
          </group>
        );
      })}
    </group>
  );
}

export default function Fridge3DViewer({ isOpen = true }) {
  const [ingredients, setIngredients] = useState([]);
  const controlsRef = useRef();

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('/api/iot/fridge/ingredients');
      setIngredients(res.data || []);
    } catch (err) {
      console.error("식재료 로드 실패:", err);
    }
  };

  const handleRemoveIngredient = async (targetId) => {
    try {
      await axios.delete(`/api/iot/fridge/ingredients/${targetId}`);
      setIngredients((prev) => prev.filter((it) => (it.id || it.name) !== targetId));
    } catch (err) {
      console.warn("삭제 API 미지원 또는 실패 -> UI 임시 반영:", err);
      setIngredients((prev) => prev.filter((it) => (it.id || it.name) !== targetId));
    }
  };

  useEffect(() => {
    fetchIngredients();
    const timer = setInterval(fetchIngredients, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0.22, 4.8], fov: 38 }}
        style={{ width: '100%', height: '100%' }}
      >
        <CameraController isOpen={isOpen} controlsRef={controlsRef} />
        <RefrigeratorScene
          ingredients={ingredients}
          isOpen={isOpen}
          onRemoveIngredient={handleRemoveIngredient}
        />

        <OrbitControls
          ref={controlsRef}
          target={[0, -0.25, 0]}
          enableDamping
          dampingFactor={0.05}
          minDistance={1.0}
          maxDistance={8.0}
        />
      </Canvas>
    </div>
  );
}