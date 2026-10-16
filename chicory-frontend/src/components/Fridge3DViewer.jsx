import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import SaltModel3D from './SaltModel3D';
import OnionModel3D from './OnionModel3D';
import KimchiModel3D from './KimchiModel3D';
import PerillaOilModel3D from './PerillaOilModel3D';
import GarlicModel3D from './GarlicModel3D';
import MushroomModel3D from './MushroomModel3D';
import FridgeModel3D from './FridgeModel3D';
import DraggableItem from './DraggableItem'; // 위에서 생성한 컴포넌트 임포트

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

function RefrigeratorScene({ ingredients, isOpen, onRemoveIngredient, setControlsEnabled }) {
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
    const itemName = (item.name || '').trim();
    if (itemName.includes('소금')) return <SaltModel3D scale={0.015} label={item.name} />;
    if (itemName.includes('양파')) return <OnionModel3D scale={0.20} label={item.name} />;
    if (itemName.includes('김치')) return <KimchiModel3D scale={0.32} label={item.name} />;
    if (itemName.includes('들기름') || itemName.includes('기름')) return <PerillaOilModel3D scale={0.14} label={item.name} />;
    if (itemName.includes('마늘')) return <GarlicModel3D scale={0.20} label={item.name} />;
    if (itemName.includes('버섯') || itemName.toLowerCase().includes('mushroom')) return <MushroomModel3D scale={0.20} label={item.name} />;

    return <Ingredient3D item={item} color={getColor(item.name || '')} />;
  };

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <pointLight position={[0, 0.5, 0.8]} intensity={1.2} color="#ffffff" />

      <Suspense fallback={null}>
        <FridgeModel3D isOpen={isOpen} position={[0, -0.9, -0.1]} scale={0.6} />
      </Suspense>

      {/* 식재료 드래그 앤 드롭 렌더링 */}
      {ingredients.map((item, idx) => {
        const shelfIndex = idx % 3;
        const yPos = shelves[shelfIndex];
        const colIndex = Math.floor(idx / 3) % 3;
        const xPos = colIndex === 0 ? -0.26 : colIndex === 1 ? 0.0 : 0.26;
        const depthLevel = Math.floor(idx / 9);
        const zPos = 0.06 - depthLevel * 0.16;

        return (
          <DraggableItem
            key={item.id || `${item.name}-${idx}`}
            item={item}
            initialPosition={[xPos, yPos + 0.03, zPos]}
            onRemove={onRemoveIngredient}
            setControlsEnabled={setControlsEnabled}
          >
            <Suspense fallback={null}>
              {renderModel(item)}
            </Suspense>
          </DraggableItem>
        );
      })}
    </group>
  );
}

export default function Fridge3DViewer({ isOpen = true }) {
  const [ingredients, setIngredients] = useState([]);
  const [controlsEnabled, setControlsEnabled] = useState(true); // 드래그 중 카메라 회전 방지
  const controlsRef = useRef();

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/iot/fridge/ingredients');
      setIngredients(res.data || []);
    } catch (err) {
      console.error("식재료 로드 실패:", err);
    }
  };

  // 식재료 빼내기(삭제) 핸들러
  const handleRemoveIngredient = async (targetId) => {
    try {
      // 백엔드 삭제 API 호출 (기존 엔드포인트 규격에 맞게 조정 가능)
      await axios.delete(`http://localhost:8080/api/iot/fridge/ingredients/${targetId}`);
      // 즉시 UI 반영
      setIngredients((prev) => prev.filter((it) => (it.id || it.name) !== targetId));
    } catch (err) {
      console.warn("삭제 API 미지원 또는 실패 -> UI에서만 임시 제거:", err);
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
          setControlsEnabled={setControlsEnabled}
        />

        <OrbitControls
          ref={controlsRef}
          enabled={controlsEnabled} // 드래그 시 카메라 고정
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