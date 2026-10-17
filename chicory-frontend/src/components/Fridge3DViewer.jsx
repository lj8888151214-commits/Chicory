import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// 💡 실제 3D 모델 파일들이 있는 경우 주석을 해제하여 연결
// import FridgeModel3D from './FridgeModel3D';
// import OnionModel3D from './OnionModel3D';
// import KimchiModel3D from './KimchiModel3D';

// 모바일 웹킷에서 한글 텍스트 렌더링 실패를 방지하는 CDN 폰트
const KOREAN_FONT_URL = "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff";

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

// 식재료 3D 큐브 + 안정화된 한글 텍스트
function Ingredient3D({ item, color }) {
    return (
        <group>
            <RoundedBox args={[0.2, 0.15, 0.2]} radius={0.03} smoothness={4}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </RoundedBox>
            <Suspense fallback={null}>
                <Text
                    font={KOREAN_FONT_URL}
                    position={[0, 0.14, 0]}
                    fontSize={0.075}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.008}
                    outlineColor="#000000"
                >
                    {item.name}
                </Text>
            </Suspense>
        </group>
    );
}

// 흰색 베스포크 스타일 냉장고 본체 (모바일/PC 동일한 색상 및 라이팅 보장)
function FallbackFridge({ isOpen }) {
    return (
        <group position={[0, -0.2, 0]}>
            {/* 냉장고 본체 외형 (PC와 동일한 밝은 아이보리/화이트) */}
            <mesh position={[0, 0, -0.2]}>
                <boxGeometry args={[1.2, 1.8, 0.8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.2} />
            </mesh>

            {/* 냉장고 내부 캐비닛 홈 */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[1.1, 1.6, 0.7]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.1} />
            </mesh>

            {/* 내부 선반 3단 (깔끔한 밝은 선반) */}
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[1.08, 0.02, 0.6]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[1.08, 0.02, 0.6]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, -0.66, 0]}>
                <boxGeometry args={[1.08, 0.02, 0.6]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.8} />
            </mesh>
        </group>
    );
}

function RefrigeratorScene({ ingredients, isOpen, onRemoveIngredient }) {
    const getColor = (name = '') => {
        if (name.includes('돼지') || name.includes('고기') || name.includes('삼겹')) return '#ff7675';
        if (name.includes('김치')) return '#d63031';
        if (name.includes('대파') || name.includes('양파') || name.includes('채소')) return '#00b894';
        if (name.includes('계란') || name.includes('달걀') || name.includes('두부')) return '#fdcb6e';
        if (name.includes('감자') || name.includes('마늘')) return '#dfe6e9';
        return '#0984e3';
    };

    const shelves = [0.25, -0.12, -0.66];

    return (
        <group position={[0, 0, 0]}>
            {/* 모바일 화면에서도 어둡지 않게 라이팅 대폭 보강 */}
            <ambientLight intensity={1.8} />
            <directionalLight position={[3, 5, 4]} intensity={2.0} />
            <pointLight position={[0, 0.5, 0.9]} intensity={1.5} color="#ffffff" />
            <pointLight position={[0, -0.3, 0.7]} intensity={1.0} color="#ffffff" />

            <Suspense fallback={null}>
                <FallbackFridge isOpen={isOpen} />
            </Suspense>

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
                        <Ingredient3D item={item} color={getColor(item.name || '')} />
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
                // 모바일 Retina 스크린에 최적화된 dpr 및 WebGL 옵션 설정
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
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