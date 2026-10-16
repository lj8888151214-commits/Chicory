import React from 'react';

export default function MyPageTab({ myPoints }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: '#1a202c' }}>📊 사용자 정보 & 챌린지</h3>

      <div style={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', color: '#718096' }}>누적 적립 포인트</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#805ad5', marginTop: '4px' }}>
          {myPoints.toLocaleString()} P
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2d3748', marginBottom: '8px' }}>🌱 환경 보호 기여도</div>
        <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', lineHeight: '1.6' }}>
          직접 등록 및 관리한 식재료를 기반으로 맞춤 레시피를 소비하여 잔여 음식물 폐기를 줄이고 있습니다.
        </p>
      </div>
    </div>
  );
}