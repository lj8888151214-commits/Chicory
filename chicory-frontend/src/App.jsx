import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserApp from './UserApp';
import FridgeDevice from './FridgeDevice';
import Fridge3DViewer from './components/Fridge3DViewer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 사용자 대시보드 */}
        <Route path="/" element={<UserApp />} />

        {/* 냉장고 IoT 디바이스 화면 */}
        <Route path="/fridge" element={<FridgeDevice />} />

        {/* 3D 뷰어 단독 화면 */}
        <Route path="/fridge-3d" element={<Fridge3DViewer />} />

        {/* 없는 경로는 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}