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

### 🛠 2. 사용 기술 (Tech Stack)

#### Backend & Security
<p>
  <img src="https://img.shields.io/badge/Java_17-007396?style=flat-square&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white"/>
</p>

#### Database & ORM
<p>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Data_JPA-59666C?style=flat-square&logo=hibernate&logoColor=white"/>
  <img src="https://img.shields.io/badge/Querydsl-007ACC?style=flat-square&logo=curseforge&logoColor=white"/>
</p>

#### Frontend
<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/HTML5/CSS3-E34F26?style=flat-square&logo=html5&logoColor=white"/>
</p>

#### DevOps & Tools
<p>
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white"/>
</p>

---

### ⏱ 3. 제작 기간 (총 5주 Sprint)

| 주차 | 단계 | 주요 작업 내용 |
| :---: | :--- | :--- |
| **1주차** | **기획 및 도메인 모델링** | 요구사항 정의, DB 설계(ERD), RESTful API 엔드포인트 규격 수립 |
| **2주차** | **인증 및 기본 백엔드 구축** | Spring Security & JWT 기반 무상태 인증 체계, 식재료/냉장고 CRUD 개발 |
| **3주차** | **핵심 알고리즘 & 동적 쿼리** | 식재료 일치율(Match Rate) 추천 알고리즘 설계, Querydsl 다중 조건 검색 구현 |
| **4주차** | **React 프론트엔드 연동** | 냉장/냉동 수납 인터랙티브 UI, Axios 인터셉터 연동 및 무한 스크롤 구현 |
| **5주차** | **배포 및 통합 테스트** | Docker 컨테이너라이징, AWS EC2 배포 및 피드백 기반 디버깅 |

---

### 🚀 4. 핵심 기술 구현 사항

- **보유 식재료 매칭 기반 레시피 추천**
  - 등록된 냉장고 재고와 레시피 필요 재료를 교차 대조하여 일치율(Match Rate) 순으로 요리를 추천
- **Querydsl 다중 조건 동적 쿼리 최적화**
  - 카테고리, 난이도, 복수 재료 태그(AND/OR) 조건을 `BooleanBuilder`로 동적 바인딩하여 불필요한 다중 쿼리 호출 방지
- **No-Offset 페이징을 통한 성능 개선**
  - 대용량 레시피 목록 조회 시 `OFFSET` 탐색 비용을 줄이기 위해 직전 ID 기준 커서 방식(Slice) 적용
- **D-Day 소비기한 시각화**
  - 냉장/냉동/실온 보관 유형별 임박 상태(위험/주의/안전) 자동 계산 및 직관적 반응형 카드 UI 제공
