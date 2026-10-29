# 🌱 치커리 (Chicory)
> **스마트 냉장고 식재료 소비기한 관리 & 보유 식재료 맞춤형 레시피 추천·공유 플랫폼**

---

### 💡 1. 기획 의도 및 배경

| 항목 | 내용 |
| :--- | :--- |
| **냉장고 속 낭비 방지** | 보관한 지 오래되어 버려지는 식재료 폐기물을 줄이고, 소비기한 임박 상태를 시각화하여 계획적인 소비를 유도합니다. |
| **"오늘 뭐 먹지?" 고민 해결** | 새로 장을 보지 않고도 현재 냉장고에 보관 중인 재료만으로 즉시 조리할 수 있는 최적의 레시피를 일치율 순으로 매칭합니다. |
| **자취생·1인 가구 커뮤니티** | 소량 규격화된 식자재 활용 꿀팁과 혼밥 맞춤형 대체 재료 노하우를 자유롭게 공유할 수 있는 공간을 제공합니다. |

---
<section id="tech-stack">
  <h3>🛠 2. 사용 기술 (Tech Stack)</h3>

  <h4>Backend &amp; Security</h4>
  <p>
    <img src="https://img.shields.io/badge/Java_17-007396?style=flat-square&logo=openjdk&logoColor=white" alt="Java 17" />
    <img src="https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot 3.x" />
    <img src="https://img.shields.io/badge/Spring_Security_6-6DB33F?style=flat-square&logo=springsecurity&logoColor=white" alt="Spring Security 6" />
    <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
    <img src="https://img.shields.io/badge/Gradle-02303A?style=flat-square&logo=gradle&logoColor=white" alt="Gradle" />
  </p>

  <h4>Database &amp; ORM</h4>
  <p>
    <img src="https://img.shields.io/badge/MySQL_8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL 8.0" />
    <img src="https://img.shields.io/badge/Spring_Data_JPA-59666C?style=flat-square&logo=hibernate&logoColor=white" alt="Spring Data JPA" />
    <img src="https://img.shields.io/badge/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white" alt="Hibernate" />
    <img src="https://img.shields.io/badge/Querydsl-007ACC?style=flat-square&logo=curseforge&logoColor=white" alt="Querydsl" />
  </p>

  <h4>Frontend &amp; 3D Interactive</h4>
  <p>
    <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/React_Three_Fiber-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="React Three Fiber" />
    <img src="https://img.shields.io/badge/@react--three/drei-000000?style=flat-square&logo=three.js&logoColor=white" alt="React Three Drei" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios" />
    <img src="https://img.shields.io/badge/Lucide_React-F05032?style=flat-square&logo=feather&logoColor=white" alt="Lucide React" />
  </p>

  <h4>AI &amp; External Open API</h4>
  <p>
    <img src="https://img.shields.io/badge/Google_Gemini_Vision_API-8E75C2?style=flat-square&logo=googlegemini&logoColor=white" alt="Google Gemini Vision API" />
    <img src="https://img.shields.io/badge/Kakao_Open_API-FFCD00?style=flat-square&logo=kakao&logoColor=black" alt="Kakao Open API" />
    <img src="https://img.shields.io/badge/IoT_Edge_REST_Webhook-02569B?style=flat-square&logo=googlecloud&logoColor=white" alt="IoT Edge REST Webhook" />
  </p>

  <h4>DevOps &amp; Tools</h4>
  <p>
    <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git" />
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" />
    <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white" alt="AWS EC2" />
  </p>
</section>

---

### ⏱ 3. 제작 기간 (총 5주 Sprint)

| 주차 | 단계 | 주요 작업 내용 |
| :---: | :--- | :--- |
| **1주차** | **기획 및 도메인 모델링** | 요구사항 정의, DB 설계(ERD), RESTful API 엔드포인트 규격 수립 |
| **1주차** | **인증 및 기본 백엔드 구축** | Spring Security & JWT 기반 무상태 인증 체계, 식재료/냉장고 CRUD 개발 |
| **2주차** | **핵심 알고리즘 & 동적 쿼리** | 식재료 일치율(Match Rate) 추천 알고리즘 설계, Querydsl 다중 조건 검색 구현 |
| **2주차** | **React 프론트엔드 연동** | 냉장/냉동 수납 인터랙티브 UI, Axios 인터셉터 연동 및 무한 스크롤 구현 |
| **2주차** | **배포 및 통합 테스트** | Docker 컨테이너라이징, AWS EC2 배포 및 피드백 기반 디버깅 |
| **3주차** | **관리 화면 Link** | https://chicoryworld.duckdns.org |
| **3주차** | **냉장고 Link** | https://chicoryworld.duckdns.org/fridge|



---

### 🚀 4. 핵심 기술 구현 사항

- **보유 식재료 매칭 기반 레시피 추천**
  - 등록된 냉장고 재고와 레시피 필요 재료를 교차 대조하여 일치율(Match Rate) 순으로 요리를 추천
- **Querydsl 다중 조건 동적 쿼리 최적화**
  - 카테고리, 난이도, 복수 재료 태그(AND/OR) 조건을 `BooleanBuilder`로 동적 바인딩하여 불필요한 다중 쿼리 호출 방지
 
#### 1. 🧊 냉장고 비주얼
> **3D 모델링을 통한 인터랙티브 냉장고 시각화**
<p align="center">
  <img src="https://github.com/user-attachments/assets/4a387a95-e1d1-4714-b294-095eb3c9b3d3" width="60%" alt="냉장고 비주얼" />
</p>

---

#### 2. 📋 메뉴 및 재료 관리
> **기본 메뉴 추가 및 냉장고 재료 잔여량 관리**
<p align="center">
  <img src="https://github.com/user-attachments/assets/bac4bba9-84c3-494a-b158-ade42da87bc8" width="60%" alt="메뉴 및 재료 관리" />
</p>

---

#### 3. 🔍 AI 음식 판정 및 영양소 분석
> **AI 비전 기반 식재료 판정 및 영양소 심층 분석**
<p align="center">
  <img src="https://github.com/user-attachments/assets/6dc06aad-04c3-4576-a692-3059fe5da6a2" width="60%" alt="AI 영양소 분석" />
</p>

---

#### 4. 📊 분석 결과 시각화
> **AI 기반 음식 분석 결과 및 식단 피드백 출력**
<p align="center">
  <img src="https://github.com/user-attachments/assets/5d3d3b3a-7bdf-4d03-856a-c108a168d05e" width="60%" alt="분석 결과 출력" />
</p>

---

#### 5. 💬 카카오톡 연동 자동 재료 등록
> **카카오톡 구매 메시지 파싱을 통한 냉장고 식재료 자동 추가**
<p align="center">
  <img src="https://github.com/user-attachments/assets/5013d0f6-93a9-48ad-aa2f-c046afae3951" width="60%" alt="메시징 연동" />
</p>
