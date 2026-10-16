import React, { useState } from 'react';
import axios from 'axios';

export default function RecipeTab({
  urgentItems,
  recommendedRecipes,
  recipeLoading,
  fetchRecommendedRecipes
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    cookingTime: '20분',
    difficulty: '보통',
    ingredients: [''],
    steps: ['']
  });

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRecipe,
        ingredients: newRecipe.ingredients.filter(i => i.trim() !== ''),
        steps: newRecipe.steps.filter(s => s.trim() !== '')
      };
      // http://localhost:8080 제거 -> 상대 경로 사용
      await axios.post('/api/recipes', payload);
      alert('레시피가 등록되었습니다!');
      setIsFormOpen(false);
      setNewRecipe({
        title: '',
        description: '',
        cookingTime: '20분',
        difficulty: '보통',
        ingredients: [''],
        steps: ['']
      });
      fetchRecommendedRecipes();
    } catch (err) {
      console.error(err);
      alert('레시피 등록 실패: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '17px', color: '#1a202c' }}>🍳 식재료 맞춤 레시피</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#718096' }}>
            현재 보관 중인 <b>{urgentItems.length}개</b>의 재료 기반 추천 요리
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          style={{
            padding: '6px 10px',
            backgroundColor: isFormOpen ? '#718096' : '#dd6b20',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isFormOpen ? '닫기' : '+ 레시피 등록'}
        </button>
      </div>

      {/* 보유 재료 칩 */}
      <div style={{ backgroundColor: '#ebf8ff', padding: '8px 12px', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b6cb0' }}>내 재료:</span>
        {urgentItems.length === 0 ? (
          <span style={{ fontSize: '12px', color: '#718096' }}>재료가 없습니다. [냉장고 관리]에서 추가해 주세요!</span>
        ) : (
          urgentItems.map(item => (
            <span key={item.id} style={{ fontSize: '11px', backgroundColor: '#bee3f8', color: '#2b6cb0', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
              {item.name}
            </span>
          ))
        )}
      </div>

      {/* 새 레시피 작성 폼 */}
      {isFormOpen && (
        <form onSubmit={handleCreateRecipe} style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9c4221' }}>새 레시피 작성</h4>
          <input
            type="text"
            placeholder="요리 이름 (예: 김치볶음밥)"
            value={newRecipe.title}
            onChange={e => setNewRecipe({ ...newRecipe, title: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0' }}
          />
          <input
            type="text"
            placeholder="간단 소개글"
            value={newRecipe.description}
            onChange={e => setNewRecipe({ ...newRecipe, description: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="조리시간 (예: 15분)"
              value={newRecipe.cookingTime}
              onChange={e => setNewRecipe({ ...newRecipe, cookingTime: e.target.value })}
              style={{ flex: 1, padding: '8px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0' }}
            />
            <select
              value={newRecipe.difficulty}
              onChange={e => setNewRecipe({ ...newRecipe, difficulty: e.target.value })}
              style={{ width: '90px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
            >
              <option value="쉬움">쉬움</option>
              <option value="보통">보통</option>
              <option value="어려움">어려움</option>
            </select>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px' }}>필요 재료</div>
            {newRecipe.ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <input
                  type="text"
                  placeholder="예: 김치, 계란"
                  value={ing}
                  onChange={e => {
                    const updated = [...newRecipe.ingredients];
                    updated[idx] = e.target.value;
                    setNewRecipe({ ...newRecipe, ingredients: updated });
                  }}
                  style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                />
                <button
                  type="button"
                  onClick={() => setNewRecipe({ ...newRecipe, ingredients: newRecipe.ingredients.filter((_, i) => i !== idx) })}
                  style={{ border: 'none', background: '#e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
                >-</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ''] })}
              style={{ fontSize: '11px', background: 'none', border: 'none', color: '#dd6b20', cursor: 'pointer', fontWeight: 'bold' }}
            >+ 재료 항목 추가</button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px' }}>조리 순서</div>
            {newRecipe.steps.map((st, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', lineHeight: '28px' }}>{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="조리 과정 입력"
                  value={st}
                  onChange={e => {
                    const updated = [...newRecipe.steps];
                    updated[idx] = e.target.value;
                    setNewRecipe({ ...newRecipe, steps: updated });
                  }}
                  style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                />
                <button
                  type="button"
                  onClick={() => setNewRecipe({ ...newRecipe, steps: newRecipe.steps.filter((_, i) => i !== idx) })}
                  style={{ border: 'none', background: '#e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
                >-</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setNewRecipe({ ...newRecipe, steps: [...newRecipe.steps, ''] })}
              style={{ fontSize: '11px', background: 'none', border: 'none', color: '#dd6b20', cursor: 'pointer', fontWeight: 'bold' }}
            >+ 순서 추가</button>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '10px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            저장하기
          </button>
        </form>
      )}

      {/* 추천 레시피 카드 목록 */}
      {recipeLoading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#718096', fontSize: '13px' }}>
          🔍 냉장고 재료 매칭 분석 중...
        </div>
      ) : recommendedRecipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#a0aec0', backgroundColor: '#f7fafc', borderRadius: '12px', fontSize: '13px' }}>
          현재 재료와 일치하는 레시피가 없습니다.<br />
          <b>[🧊 냉장고 관리]</b>에서 재료를 추가하거나 <b>[+ 레시피 등록]</b>을 해보세요!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recommendedRecipes.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRecipeDetail(selectedRecipeDetail?.id === r.id ? null : r)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#2d3748' }}>🍽 {r.title}</h4>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: (r.matchPercentage || 0) >= 70 ? '#c6f6d5' : '#feebc8',
                  color: (r.matchPercentage || 0) >= 70 ? '#22543d' : '#9c4221'
                }}>
                  재료 {r.matchPercentage || 0}% 일치
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '12px', color: '#718096' }}>
                <span>⏱ {r.cookingTime}</span>
                <span>·</span>
                <span>난이도: {r.difficulty}</span>
              </div>

              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <span style={{ color: '#2f855a', fontWeight: 'bold' }}>보유: </span>
                <span style={{ color: '#4a5568' }}>
                  {Array.isArray(r.matchedIngredients) ? r.matchedIngredients.join(', ') : (r.matchedIngredients || '없음')}
                </span>
              </div>

              {r.missingIngredients && r.missingIngredients.length > 0 && (
                <div style={{ marginTop: '4px', fontSize: '12px' }}>
                  <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>부족: </span>
                  <span style={{ color: '#718096' }}>
                    {Array.isArray(r.missingIngredients) ? r.missingIngredients.join(', ') : r.missingIngredients}
                  </span>
                </div>
              )}

              {selectedRecipeDetail?.id === r.id && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d3748', marginBottom: '6px' }}>📖 조리 순서:</div>
                  <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#4a5568', lineHeight: '1.6' }}>
                    {r.steps && r.steps.length > 0 ? (
                      r.steps.map((st, i) => <li key={i}>{st}</li>)
                    ) : (
                      <li>조리 순서 정보가 없습니다.</li>
                    )}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}