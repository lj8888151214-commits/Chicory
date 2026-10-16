import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserApp from './UserApp';
import FridgeDevice from './FridgeDevice';
import Fridge3DViewer from './components/Fridge3DViewer'; // 1. 임포트 추가

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserApp />} />
        <Route path="/fridge" element={<FridgeDevice />} />
        {/* 2. 아래 라우트 한 줄 추가 */}
        <Route path="/fridge-3d" element={<Fridge3DViewer />} />
      </Routes>
    </BrowserRouter>
  );
}