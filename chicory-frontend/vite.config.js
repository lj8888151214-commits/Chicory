import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 1. 빌드 결과물을 백엔드 static 폴더로 바로 내보냄
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true // 빌드할 때 기존 static 폴더 내용 정리
  }, // <-- 여기에 쉼표(,) 필수
  // 2. 3D 모델 (.glb, .gltf) 확장자를 정적 에셋으로 명시적 등록
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});