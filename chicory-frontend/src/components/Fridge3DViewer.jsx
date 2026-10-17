import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// 모바일 및 PC 브라우저에서 동일한 폰트 로드를 보장하는 웹폰트
const KOREAN_FONT_URL = "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff";

function CameraController({ isOpen, controlsRef }) {
    useFrame((state, delta) => {
        // 문이 열릴 때와 닫힐 때 카메라 구도 전환
        const targetZ = isOpen ? 4.6 : 3.5;
        const targetY = isOpen ? -0.05 : 0.05;

        state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4.0, delta);
        state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 4.0, delta);

        if (controlsRef.current) {
            const targetLookY = isOpen ? -0.15 : -0.1;
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
            <RoundedBox args={[0.22, 0.16, 0.22]} radius={0.04} smoothness={4}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </RoundedBox>
            <Suspense fallback={null}>
                <Text
                    font={KOREAN_FONT_URL}
                    position={[0, 0.16, 0]}
                    fontSize={0.08}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.009}
                    outlineColor="#000000"
                >
                    {item.name}
                </Text>
            </Suspense>
        </group>
    );
}

// 🚪 실제 작동하는 3D 냉장고 컴포넌트
function AnimatedRefrigerator({ isOpen }) {
    const doorGroupRef = useRef();

    // 프레임마다 문이 열고 닫히는 회전 애니메이션 계산 (회전축 고정)
    useFrame((state, delta) => {
        if (doorGroupRef.current) {
            // 문이 열릴 때 각도: 약 -110도 (라디안값: -1.9), 닫힐 때 각도: 0도
            const targetRotationY = isOpen ? -1.9 : 0;
            doorGroupRef.current.rotation.y = THREE.MathUtils.damp(
                doorGroupRef.current.rotation.y,
                targetRotationY,
                4.5,
                delta
            );
        }
    });

    return (
        <group position={[0, -0.2, 0]}>
            {/* 1. 냉장고 본체 (어두운 외관 / 밝은 내부 조화) */}
            <mesh position={[0, 0, -0.2]}>
                <boxGeometry args={[1.22, 1.8, 0.8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.15} roughness={0.3} />
            </mesh>

            {/* 2. 냉장고 내부 캐비닛 홈 (밝은 화이트) */}
            <mesh position={[0, 0, 0.15]}>
                <boxGeometry args={[1.08, 1.66, 0.1]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.1} />
            </mesh>

            {/* 내부 측면 마감 벽 */}
            <mesh position={[-0.55, 0, 0]}>
                <boxGeometry args={[0.08, 1.66, 0.4]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            <mesh position={[0.55, 0, 0]}>
                <boxGeometry args={[0.08, 1.66, 0.4]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>

            {/* 3. 3단 선반 (유리 / 메탈 투명 느낌) */}
            <mesh position={[0, 0.25, 0.05]}>
                <boxGeometry args={[1.06, 0.02, 0.48]} />
                <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.12, 0.05]}>
                <boxGeometry args={[1.06, 0.02, 0.48]} />
                <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.55, 0.05]}>
                <boxGeometry args={[1.06, 0.02, 0.48]} />
                <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} roughness={0.1} />
            </mesh>

            {/* 4. 작동하는 냉장고 문 (Door) - 회전축인 왼쪽 모서리[x: -0.6]를 기준으로 회전시킴 */}
            <group ref={doorGroupRef} position={[-0.6, 0, 0.2]}>
                {/* 회전축 기준 오른쪽으로 0.6 offset을 두어 문짝을 위치시킴 */}
                <group position={[0.6, 0, 0.04]}>
                    {/* 문짝 전면 본체 (세련된 비스포크 글래스 화이트) */}
                    <mesh>
                        <boxGeometry args={[1.18, 1.76, 0.08]} />
                        <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.1} />
                    </mesh>

                    {/* 문 내부 마감 */}
                    <mesh position={[0, 0, -0.041]}>
                        <boxGeometry args={[1.14, 1.72, 0.005]} />
                        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
                    </mesh>

                    {/* 문 손잡이 (그레이 메탈 바) */}
                    <mesh position={[0.52, 0, 0.05]}>
                        <boxGeometry args={[0.03, 0.4, 0.02]} />
                        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}

function RefrigeratorScene({ ingredients, isOpen, onRemoveIngredient }) {
    const getColor = (name = '') => {
        if (name.includes('돼지') || name.includes('고기') || name.includes('삼겹') || name.includes('닭')) return '#f87171';
        if (name.includes('김치') || name.includes('찌개') || name.includes('양념')) return '#ef4444';
        if (name.includes('대파') || name.includes('양파') || name.includes('채소') || name.includes('상추')) return '#34d399';
        if (name.includes('계란') || name.includes('달걀') || name.includes('두부') || name.includes('치즈')) return '#fbbf24';
        if (name.includes('감자') || name.includes('마늘') || name.includes('무')) return '#e2e8f0';
        return '#60a5fa';
    };

    const shelves = [0.25, -0.12, -0.55];

    return (
        <group position={[0, 0, 0]}>
            {/* 3D 라이팅 보강 (어두운 공간 없이 화사하게) */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 6, 4]} intensity={1.8} castShadow />
            <pointLight position={[0, 0.4, 0.7]} intensity={1.2} color="#ffffff" />
            <pointLight position={[0, -0.3, 0.7]} intensity={0.8} color="#ffffff" />

            {/* 냉장고 문 & 본체 애니메이션 */}
            <Suspense fallback={null}>
                <AnimatedRefrigerator isOpen={isOpen} />
            </Suspense>

            {/* 선반 위 식재료 배치 */}
            {ingredients.map((item, idx) => {
                const shelfIndex = idx % 3;
                const yPos = shelves[shelfIndex];
                const colIndex = Math.floor(idx / 3) % 3;
                const xPos = colIndex === 0 ? -0.28 : colIndex === 1 ? 0.0 : 0.28;
                const depthLevel = Math.floor(idx / 9);
                const zPos = 0.12 - depthLevel * 0.16;

                return (
                    <group
                        key={item.id || `${item.name}-${idx}`}
                        position={[xPos, yPos + 0.1, zPos]}
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
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#020617', // 고급스러운 다크 배경색
            borderRadius: '16px'
        }}>
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0.05, 3.5], fov: 40 }}
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
                    target={[0, -0.1, 0]}
                    enableDamping
                    dampingFactor={0.06}
                    minDistance={1.0}
                    maxDistance={6.0}
                />
            </Canvas>
        </div>
    );
}