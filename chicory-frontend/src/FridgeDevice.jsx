import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DoorOpen,
  DoorClosed,
  ThermometerSnowflake,
  Wifi,
  Cpu,
  RefreshCw,
  Bell
} from 'lucide-react';
import Fridge3DViewer from './components/Fridge3DViewer';

export default function FridgeDevice() {
  const [doorState, setDoorState] = useState('CLOSE');
  const [bufferText, setBufferText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [ingredients, setIngredients] = useState([]);

  const prevCountRef = useRef(0);
  const [purchaseAlert, setPurchaseAlert] = useState(null);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/iot/fridge/ingredients');
      const list = res.data || [];
      setIngredients(list);
    } catch (err) {
      console.error("식재료 목록 로드 실패:", err);
    }
  };

  useEffect(() => {
    if (prevCountRef.current > 0 && ingredients.length > prevCountRef.current) {
      const newItem = ingredients[ingredients.length - 1];
      setPurchaseAlert(`💬 카카오톡 알림: [${newItem.name}] 입고 완료!`);
      setDoorState('OPEN');

      setTimeout(() => {
        setPurchaseAlert(null);
      }, 4000);
    }
    prevCountRef.current = ingredients.length;
  }, [ingredients]);

  useEffect(() => {
    fetchIngredients();
    const clockTimer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const pollTimer = setInterval(fetchIngredients, 2000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(pollTimer);
    };
  }, []);

  const toggleDoor = async () => {
    const nextState = doorState === 'OPEN' ? 'CLOSE' : 'OPEN';

    if (nextState === 'OPEN') {
      fetchIngredients();
    }

    const payload = {
      deviceId: "bespoke_smart_fridge_01",
      deviceType: "REFRIGERATOR",
      eventType: "DOOR_EVENT",
      properties: {
        doorState: nextState,
        targetTempFridge: 2.0
      },
      timestamp: new Date().toISOString()
    };

    setBufferText(JSON.stringify(payload, null, 2));

    try {
      await axios.post('http://localhost:8080/api/iot/fridge/event', payload);
      setDoorState(nextState);
    } catch (err) {
      console.error("전송 에러:", err);
    }
  };

  const isOpen = doorState === 'OPEN';

  return (
    <div style={{
      width: '380px',
      background: 'linear-gradient(145deg, #181920 0%, #0d0e12 100%)',
      borderRadius: '24px',
      padding: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
      boxSizing: 'border-box',
      position: 'relative'
    }}>

      {/* 알림 팝업 배너 */}
      <AnimatePresence>
        {purchaseAlert && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '12px',
              left: '16px',
              right: '16px',
              backgroundColor: '#fee500',
              color: '#191919',
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Bell size={14} />
            <span>{purchaseAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. 상단 상태 표시줄 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ThermometerSnowflake size={16} color="#00e5ff" />
          <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#e2e8f0' }}>BESPOKE 3D EDGE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
          <span>{currentTime}</span>
          <Wifi size={13} color="#10b981" />
        </div>
      </div>

      {/* 2. 3D 냉장고 뷰어 영역 (높이를 360px로 확장) */}
      <div style={{
        position: 'relative',
        height: '360px',
        backgroundColor: '#0a0a0d',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <Fridge3DViewer isOpen={isOpen} />
        </div>
      </div>

      {/* 보관 재료 요약 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
        <span>보관 중인 재료: <strong style={{ color: '#38bdf8' }}>{ingredients.length}종</strong></span>
        <button
          onClick={fetchIngredients}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
        >
          <RefreshCw size={11} /> 재료 새로고침
        </button>
      </div>

      {/* 3. 문 열림/닫힘 토글 버튼 */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleDoor}
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '10px',
          fontSize: '13px',
          fontWeight: '700',
          background: isOpen
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: isOpen ? 'none' : '0 8px 16px -4px rgba(239, 68, 68, 0.4)'
        }}
      >
        {isOpen ? <DoorClosed size={16} /> : <DoorOpen size={16} />}
        {isOpen ? '냉장고 문 닫기 (CLOSE)' : '냉장고 문 열기 (OPEN)'}
      </motion.button>

      {/* 4. IoT 전송 원시 버퍼 (작게 축소) */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b' }}>
            <Cpu size={11} />
            <span>Edge Buffer</span>
          </div>
          <span style={{ fontSize: '9px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Active
          </span>
        </div>

        <pre style={{
          background: '#090a0f',
          padding: '8px 10px',
          borderRadius: '8px',
          fontSize: '9.5px',
          color: '#38bdf8',
          margin: 0,
          border: '1px solid rgba(255,255,255,0.06)',
          overflowX: 'auto',
          maxHeight: '52px',
          lineHeight: '1.25',
          fontFamily: 'monospace'
        }}>
          {bufferText || '// 도어 토글 시 페이로드가 전송됩니다.'}
        </pre>
      </div>

    </div>
  );
}