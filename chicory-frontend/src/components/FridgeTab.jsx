import React, { useState } from 'react';

const QUICK_ITEMS = ['김치', '돼지고기', '대파', '양파', '계란', '두부', '마늘', '감자'];

export default function FridgeTab({
  doorStatus,
  urgentItems,
  consumeMessage,
  onAddIngredient,
  onQuickAdd,
  onConsume,
  onDelete
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: 1, unit: '개' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddIngredient(newIngredient);
    setNewIngredient({ name: '', quantity: 1, unit: '개' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#2d3748' }}>📱 Chicory 냉장고 관리</h3>
        <span style={{
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '4px 10px',
          borderRadius: '16px',
          backgroundColor: doorStatus.includes('열림') ? '#c6f6d5' : '#fed7d7',
          color: doorStatus.includes('열림') ? '#22543d' : '#742a2a'
        }}>
          {doorStatus}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>
          총 보관 식재료: {urgentItems.length}종
        </span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '6px 12px',
            backgroundColor: showAddForm ? '#718096' : '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {showAddForm ? '입력 닫기' : '+ 식재료 직접 추가'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2b6cb0', marginBottom: '8px' }}>
            🛒 새 식재료 등록
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="식재료명 (예: 감자, 양파)"
              value={newIngredient.name}
              onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
              required
              style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px' }}
            />
            <input
              type="number"
              min="1"
              placeholder="수량"
              value={newIngredient.quantity}
              onChange={e => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
              style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px' }}
            />
            <select
              value={newIngredient.unit}
              onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              style={{ width: '65px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px' }}
            >
              <option value="개">개</option>
              <option value="g">g</option>
              <option value="대">대</option>
              <option value="모">모</option>
              <option value="팩">팩</option>
            </select>
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '8px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
          >
            냉장고에 넣기
          </button>
        </form>
      )}

      {/* 퀵 추가 태그 */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#718096', marginBottom: '6px' }}>⚡ 빠른 재료 추가 (클릭 시 즉시 등록):</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {QUICK_ITEMS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onQuickAdd(name)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: '#edf2f7',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              +{name}
            </button>
          ))}
        </div>
      </div>

      {consumeMessage && (
        <div style={{ padding: '8px 12px', backgroundColor: '#f0fff4', color: '#2f855a', borderRadius: '8px', marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          {consumeMessage}
        </div>
      )}

      {/* 보관 식재료 목록 */}
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4a5568' }}>📦 현재 보관 중인 재료</h4>
        {urgentItems.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#a0aec0', backgroundColor: '#f7fafc', borderRadius: '10px', fontSize: '13px' }}>
            보관 중인 식재료가 없습니다. 상단의 '+ 식재료 직접 추가' 버튼으로 재료를 등록해 주세요.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {urgentItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#f7fafc',
                  border: '1px solid #edf2f7',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#2d3748' }}>{item.name}</span>
                  <span style={{ marginLeft: '6px', color: '#718096', fontSize: '12px' }}>
                    잔여: {item.quantity}{item.unit}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onConsume(item, item.unit === 'g' ? 100 : 1)}
                    style={{
                      backgroundColor: '#319795',
                      color: 'white',
                      border: 'none',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  >
                    {item.unit === 'g' ? '100g 소비' : '1개 소비'}
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.name)}
                    style={{
                      backgroundColor: '#e2e8f0',
                      color: '#718096',
                      border: 'none',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}