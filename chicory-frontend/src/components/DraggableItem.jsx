import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DraggableItem({
  children,
  initialPosition,
  item,
  onRemove,
  setControlsEnabled
}) {
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const { camera, raycaster, gl } = useThree();

  // 드래그 계산을 위한 가상 수평/수직 평면
  const dragPlane = new THREE.Plane();
  const planeIntersect = new THREE.Vector3();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setControlsEnabled(false); // 드래그 중에는 OrbitControls 카메라 회전 중지

    // 클릭된 물체의 위치를 지나는 카메라 정면 수직 평면 생성
    const normal = new THREE.Vector3();
    camera.getWorldDirection(normal).negate();
    dragPlane.setFromNormalAndCoplanarPoint(normal, groupRef.current.position);

    // 포인터 캡처
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.stopPropagation();

    // 마우스 포인터 좌표를 3D 월드 좌표로 변환
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
      groupRef.current.position.copy(planeIntersect);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    setControlsEnabled(true); // 드래그 종료 시 OrbitControls 재활성화

    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const curPos = groupRef.current.position;

    // [빼내기 판정] 냉장고 바깥(앞으로 0.45 이상 당기거나 좌우/위아래 경계를 크게 벗어남)
    const isOutFridge =
      curPos.z > 0.45 || Math.abs(curPos.x) > 0.55 || curPos.y < -0.9 || curPos.y > 0.5;

    if (isOutFridge) {
      if (window.confirm(`[${item.name}] 재료를 냉장고에서 꺼내 사용(삭제)하시겠습니까?`)) {
        onRemove(item.id || item.name);
        return;
      }
    }

    // 선반 내부 정리: 가장 가까운 선반 높이로 스냅(Snap) 안착
    const shelves = [0.25, -0.12, -0.66];
    const closestShelf = shelves.reduce((prev, curr) =>
      Math.abs(curr - curPos.y) < Math.abs(prev - curPos.y) ? curr : prev
    );

    // 선반 내부 경계 제한
    groupRef.current.position.x = THREE.MathUtils.clamp(curPos.x, -0.32, 0.32);
    groupRef.current.position.y = closestShelf + 0.04;
    groupRef.current.position.z = THREE.MathUtils.clamp(curPos.z, -0.25, 0.15);
  };

  return (
    <group
      ref={groupRef}
      position={initialPosition}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      cursor={isDragging ? 'grabbing' : 'grab'}
    >
      {children}
    </group>
  );
}