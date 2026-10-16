import React, { useState } from 'react';
import axios from 'axios';

export default function RecipeForm({ onRecipeCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    cookingTime: '20분',
    difficulty: '보통',
    imageUrl: '',
    ingredients: [''],
    steps: ['']
  });

  const handleArrayChange = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayItem = (field) => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.filter(item => item.trim() !== ''),
        steps: form.steps.filter(item => item.trim() !== '')
      };
      await axios.post('/api/recipes', payload);
      alert('레시피가 등록되었습니다!');
      if (onRecipeCreated) onRecipeCreated();
    } catch (err) {
      console.error(err);
      alert('등록 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '650px', margin: '20px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '12px' }}>
      <h2>🍳 새 레시피 작성</h2>

      <div style={{ marginBottom: '12px' }}>
        <label>제목</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          placeholder="예: 초간단 김치찌개"
          required
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>소개글</label>
        <textarea
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
          placeholder="레시피에 대한 한 줄 설명"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <label>조리 시간</label>
          <input
            type="text"
            value={form.cookingTime}
            onChange={e => setForm({...form, cookingTime: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>난이도</label>
          <select
            value={form.difficulty}
            onChange={e => setForm({...form, difficulty: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="쉬움">쉬움</option>
            <option value="보통">보통</option>
            <option value="어려움">어려움</option>
          </select>
        </div>
      </div>

      {/* 식재료 동적 목록 */}
      <div style={{ marginBottom: '16px' }}>
        <label><b>필요 식재료</b> (매칭 검색에 활용됩니다)</label>
        {form.ingredients.map((ing, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <input
              type="text"
              value={ing}
              placeholder="예: 돼지고기, 김치, 두부, 대파"
              onChange={e => handleArrayChange('ingredients', idx, e.target.value)}
              style={{ flex: 1, padding: '6px' }}
            />
            <button type="button" onClick={() => removeArrayItem('ingredients', idx)}>삭제</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('ingredients')} style={{ marginTop: '6px' }}>+ 재료 추가</button>
      </div>

      {/* 조리 순서 동적 목록 */}
      <div style={{ marginBottom: '16px' }}>
        <label><b>조리 단계</b></label>
        {form.steps.map((st, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span style={{ lineHeight: '32px' }}>{idx + 1}.</span>
            <input
              type="text"
              value={st}
              placeholder="조리 과정을 순서대로 입력하세요"
              onChange={e => handleArrayChange('steps', idx, e.target.value)}
              style={{ flex: 1, padding: '6px' }}
            />
            <button type="button" onClick={() => removeArrayItem('steps', idx)}>삭제</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('steps')} style={{ marginTop: '6px' }}>+ 순서 추가</button>
      </div>

      <button type="submit" style={{ width: '100%', padding: '12px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
        레시피 등록 완료
      </button>
    </form>
  );
}