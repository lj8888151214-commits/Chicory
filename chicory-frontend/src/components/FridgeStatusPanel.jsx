import React from 'react';

export default function FridgeStatusPanel({ fridgeStatus, aiPrompt, urgentItemsCount }) {
  return (
    <div style={{
      background: fridgeStatus.isOpen ? '#fff1f0' : '#f6ffed',
      border: `2px solid ${fridgeStatus.isOpen ? '#ff4d4f' : '#52c41a'}`,
      borderRadius: '14px',
      padding: '14px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#2d3748' }}>
          {fridgeStatus.isOpen ? '🚪 냉장고 문 열림 🟢' : '🔒 냉장고 문 닫힘 🔴'}
        </span>
        <span style={{
          fontSize: '11px',
          fontWeight: 'bold',
          padding: '3px 8px',
          borderRadius: '12px',
          backgroundColor: fridgeStatus.isOpen ? '#ff4d4f' : '#52c41a',
          color: '#fff'
        }}>
          {fridgeStatus.isOpen ? 'OPEN' : 'CLOSE'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
        <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #edf2f7' }}>
          <div style={{ fontSize: '11px', color: '#718096' }}>내부 실측 온도</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: fridgeStatus.currentTemp > 3.5 ? '#d4380d' : '#096dd9' }}>
            {fridgeStatus.currentTemp} °C
          </div>
          <span style={{ fontSize: '10px', color: '#a0aec0' }}>목표 2.0°C</span>
        </div>

        <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #edf2f7' }}>
          <div style={{ fontSize: '11px', color: '#718096' }}>보관 식재료 부하</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748' }}>
            {urgentItemsCount}종
          </div>
          <span style={{ fontSize: '10px', color: fridgeStatus.coolingLoad === 'HIGH' ? '#cf1322' : '#389e0d' }}>
            부하도: {fridgeStatus.coolingLoad || 'NORMAL'}
          </span>
        </div>
      </div>

      {fridgeStatus.isOpen && (
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#cf1322', fontWeight: 'bold', textAlign: 'center' }}>
          ⚠️ {aiPrompt}
        </p>
      )}
    </div>
  );
}