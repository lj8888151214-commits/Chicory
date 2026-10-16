import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function NutritionCamTab({ onRewardPoints }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionResult, setNutritionResult] = useState(null);
  // 'environment': 후면(음식 촬영용), 'user': 전면(셀카)
  const [facingMode, setFacingMode] = useState('environment');

  const startCamera = async (mode = facingMode) => {
    // 기존 활성 스트림 정리
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode } // 💡 후면/전면 카메라 모드 지정
        },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraOn(true);
    } catch (err) {
      alert('카메라 접근 권한 오류: ' + err.message);
    }
  };

  useEffect(() => {
    if (isCameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error("비디오 재생 오류:", e));
    }
  }, [isCameraOn]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // 🔄 전면 <-> 후면 전환 토글
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    setAnalyzing(true);
    setNutritionResult(null);

    try {
      const res = await axios.post('/api/iot/fridge/analyze-food-vision', {
        image: canvas.toDataURL('image/jpeg', 0.85)
      });
      const data = res.data;
      if (data.retryRequired) {
        alert(data.statusMessage || 'AI 서버가 혼잡하여 재인식이 필요합니다.');
        return;
      }
      setNutritionResult(data);
      if (onRewardPoints) onRewardPoints(data.rewardPoints || 50);
    } catch (err) {
      alert('AI 분석 실패: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1a202c' }}>📹 AI 음식 인식 & 영양 분석</h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
          웹캠으로 조리된 음식을 비추면 비전 AI가 칼로리와 탄·단·지를 자동 판독합니다.
        </p>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '260px',
        backgroundColor: '#1a202c',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraOn ? 'block' : 'none' }}
        />

        {!isCameraOn && (
          <div style={{ textAlign: 'center', color: '#a0aec0' }}>
            <div style={{ fontSize: '42px', marginBottom: '8px' }}>📷</div>
            <div style={{ fontSize: '13px' }}>카메라가 꺼져 있습니다.</div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        {!isCameraOn ? (
          <button
            onClick={() => startCamera(facingMode)}
            style={{ flex: 1, padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
          >
            ▶ 카메라 시작하기
          </button>
        ) : (
          <>
            <button
              onClick={captureAndAnalyze}
              disabled={analyzing}
              style={{ flex: 2, padding: '12px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              {analyzing ? '🔍 AI 판독 중...' : '📸 AI 영양 분석 실행'}
            </button>
            <button
              type="button"
              onClick={toggleFacingMode}
              title="전면/후면 전환"
              style={{ padding: '12px 14px', backgroundColor: '#4a5568', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
            >
              🔄
            </button>
            <button
              onClick={stopCamera}
              style={{ flex: 1, padding: '12px', backgroundColor: '#718096', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              ⏹ 정지
            </button>
          </>
        )}
      </div>

      {nutritionResult && (
        <div style={{ backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, color: '#22543d', fontSize: '16px' }}>🍲 {nutritionResult.foodName}</h4>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#276749', backgroundColor: '#c6f6d5', padding: '3px 8px', borderRadius: '10px' }}>
              +{nutritionResult.rewardPoints}P 적립!
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center', margin: '12px 0' }}>
            <div style={{ backgroundColor: '#fff', padding: '8px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#718096' }}>칼로리</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e53e3e' }}>{nutritionResult.calories} kcal</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '8px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#718096' }}>탄수화물</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3182ce' }}>{nutritionResult.carbs}g</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '8px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#718096' }}>단백질</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#38a169' }}>{nutritionResult.protein}g</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '8px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#718096' }}>지방</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d69e2e' }}>{nutritionResult.fat}g</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#2d3748', lineHeight: '1.5' }}>
            💡 <strong>비전 AI 코멘트:</strong> {nutritionResult.aiReview}
          </div>
        </div>
      )}
    </div>
  );
}
