import { useState, useEffect } from 'react';
import axios from 'axios';

import FridgeStatusPanel from './components/FridgeStatusPanel';
import RecipeTab from './components/RecipeTab';
import FridgeTab from './components/FridgeTab';
import NutritionCamTab from './components/NutritionCamTab';
import MyPageTab from './components/MyPageTab';

const MENU_TABS = [
  { id: 'recipe', label: '🍳 추천 레시피', activeColor: '#dd6b20' },
  { id: 'fridge', label: '🧊 냉장고 관리', activeColor: '#3182ce' },
  { id: 'nutrition', label: '📹 AI 캠 분석', activeColor: '#38a169' },
  { id: 'mypage', label: '📊 마이페이지', activeColor: '#805ad5' },
];

export default function UserApp() {
  const [activeTab, setActiveTab] = useState('recipe');
  const [doorStatus, setDoorStatus] = useState('닫힘 🔴');
  const [aiPrompt, setAiPrompt] = useState('냉장고 문 열림 신호를 대기하고 있습니다...');

  const [fridgeStatus, setFridgeStatus] = useState({
    isOpen: false,
    doorState: 'CLOSE',
    currentTemp: 2.0,
    totalQuantity: 0,
    coolingLoad: 'NORMAL'
  });

  const [urgentItems, setUrgentItems] = useState([]);
  const [consumeMessage, setConsumeMessage] = useState('');
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [myPoints, setMyPoints] = useState(120);

  // 로컬스토리지 도어 센서 이벤트 수신
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'fridge_iot_event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const isOpen = data.eventType === 'OPEN';
          setDoorStatus(isOpen ? '열림 🟢' : '닫힘 🔴');
          setFridgeStatus(prev => ({
            ...prev,
            isOpen,
            doorState: isOpen ? 'OPEN' : 'CLOSE'
          }));
          setAiPrompt(isOpen ? (data.promptMessage || '냉장고 문이 열렸습니다!') : '냉장고 문이 닫혔습니다.');
          if (data.urgentIngredients?.length > 0) {
            setUrgentItems(data.urgentIngredients);
          }
        } catch (err) {
          console.error('이벤트 파싱 오류:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 초기 식재료 불러오기 및 IoT 상태 폴링
  useEffect(() => {
    fetchFridgeIngredients();
    fetchFridgeStatus();

    const interval = setInterval(fetchFridgeStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchFridgeIngredients = async () => {
    try {
      const res = await axios.get('/api/iot/fridge/ingredients');
      setUrgentItems(res.data || []);
    } catch (err) {
      console.error('식재료 DB 조회 실패:', err);
    }
  };

  const fetchFridgeStatus = async () => {
    try {
      const res = await axios.get('/api/iot/fridge/status');
      setFridgeStatus(res.data);
      if (res.data?.doorState) {
        setDoorStatus(res.data.doorState === 'OPEN' ? '열림 🟢' : '닫힘 🔴');
      }
    } catch (err) {
      // status API 미응답 시 기본값 유지
    }
  };

  // 재료 변경 시 추천 레시피 갱신
  useEffect(() => {
    if (activeTab === 'recipe') {
      fetchRecommendedRecipes();
    }
  }, [activeTab, urgentItems]);

  const fetchRecommendedRecipes = async () => {
    if (urgentItems.length === 0) {
      setRecommendedRecipes([]);
      return;
    }

    setRecipeLoading(true);
    try {
      const ingNames = urgentItems.map(i => i.name).join(',');
      const res = await axios.get('/api/recipes/recommend', {
        params: { ingredients: ingNames }
      });
      setRecommendedRecipes(res.data || []);
    } catch (err) {
      console.error('레시피 추천 조회 실패:', err);
    } finally {
      setRecipeLoading(false);
    }
  };

  // 식재료 직접 등록 핸들러
  const handleAddIngredient = async (newIngredient) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const payload = {
      name: newIngredient.name.trim(),
      quantity: parseInt(newIngredient.quantity, 10) || 1,
      unit: newIngredient.unit || '개',
      purchaseDate: today.toISOString().split('T')[0],
      expireDate: nextWeek.toISOString().split('T')[0]
    };

    try {
      const res = await axios.post('/api/iot/fridge/ingredients', payload);
      setUrgentItems(prev => [res.data, ...prev]);
      setConsumeMessage(`✅ '${res.data.name}' 재료가 DB에 추가되었습니다!`);
      fetchFridgeStatus();
    } catch (err) {
      alert('식재료 등록 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  // 퀵 태그 추가 핸들러
  const handleQuickAdd = async (itemName) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const payload = {
      name: itemName,
      quantity: 1,
      unit: (itemName === '돼지고기' || itemName === '삼겹살' || itemName === '김치') ? 'g' : '개',
      purchaseDate: today.toISOString().split('T')[0],
      expireDate: nextWeek.toISOString().split('T')[0]
    };

    try {
      const res = await axios.post('/api/iot/fridge/ingredients', payload);
      setUrgentItems(prev => [res.data, ...prev]);
      setConsumeMessage(`✅ '${itemName}' 재료가 DB에 추가되었습니다.`);
      fetchFridgeStatus();
    } catch (err) {
      alert('재료 추가 실패: ' + err.message);
    }
  };

  // 식재료 삭제 핸들러
  const handleDeleteIngredient = async (id, name) => {
    try {
      await axios.delete(`/api/iot/fridge/ingredients/${id}`);
      setUrgentItems(prev => prev.filter(i => i.id !== id));
      setConsumeMessage(`🗑 '${name}' 재료를 DB에서 삭제했습니다.`);
      fetchFridgeStatus();
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  // 식재료 소진 핸들러
  const handleConsume = async (item, amount) => {
    try {
      const res = await axios.post(`/api/iot/fridge/consume?ingredientId=${item.id}&amount=${amount}`);
      setConsumeMessage(`✅ '${item.name}' ${amount}${item.unit} 사용 완료!`);

      if (res.data?.isConsumed) {
        setUrgentItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        setUrgentItems(prev =>
          prev.map(i => i.id === item.id ? { ...i, quantity: res.data.remaining } : i)
        );
      }
      fetchFridgeStatus();
    } catch (err) {
      alert('차감 실패: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '16px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

        {/* 상단 헤더 & 포인트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#2d3748' }}>Chicory Food IoT</h2>
          <span style={{ fontSize: '13px', fontWeight: 'bold', backgroundColor: '#feebc8', color: '#c05621', padding: '6px 12px', borderRadius: '14px' }}>
            💰 {myPoints} P
          </span>
        </div>

        {/* 실시간 IoT 도어 & 온도 패널 컴포넌트 */}
        <FridgeStatusPanel
          fridgeStatus={fridgeStatus}
          aiPrompt={aiPrompt}
          urgentItemsCount={urgentItems.length}
        />

        {/* 상단 탭 네비게이션 버튼 */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
          {MENU_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: activeTab === tab.id ? tab.activeColor : '#edf2f7',
                color: activeTab === tab.id ? '#fff' : '#4a5568',
                fontWeight: 'bold',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭별 컴포넌트 렌더링 */}
        {activeTab === 'recipe' && (
          <RecipeTab
            urgentItems={urgentItems}
            recommendedRecipes={recommendedRecipes}
            recipeLoading={recipeLoading}
            fetchRecommendedRecipes={fetchRecommendedRecipes}
          />
        )}

        {activeTab === 'fridge' && (
          <FridgeTab
            doorStatus={doorStatus}
            urgentItems={urgentItems}
            consumeMessage={consumeMessage}
            onAddIngredient={handleAddIngredient}
            onQuickAdd={handleQuickAdd}
            onConsume={handleConsume}
            onDelete={handleDeleteIngredient}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionCamTab
            onRewardPoints={(points) => setMyPoints(prev => prev + points)}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPageTab myPoints={myPoints} />
        )}

      </div>
    </div>
  );
}