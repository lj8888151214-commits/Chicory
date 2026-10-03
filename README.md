<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>치커리(Chicory) - 스마트 냉장고 & 레시피 플랫폼</title>
  <style>
    :root {
      --primary: #2e7d32;
      --primary-light: #e8f5e9;
      --primary-dark: #1b5e20;
      --text-main: #212121;
      --text-muted: #666666;
      --bg-gray: #f9fbf9;
      --card-bg: #ffffff;
      --border-color: #e0e0e0;
      --accent: #ff9800;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
    }

    body {
      background-color: var(--bg-gray);
      color: var(--text-main);
      line-height: 1.6;
    }

    header {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: #ffffff;
      text-align: center;
      padding: 60px 20px 40px;
    }

    header h1 {
      font-size: 2.4rem;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    header p {
      font-size: 1.15rem;
      opacity: 0.9;
      max-width: 680px;
      margin: 0 auto;
    }

    .container {
      max-width: 960px;
      margin: -25px auto 60px;
      padding: 0 20px;
    }

    .card {
      background-color: var(--card-bg);
      border-radius: 14px;
      padding: 36px 32px;
      margin-bottom: 28px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border-color);
    }

    .card-title {
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid var(--primary-light);
      padding-bottom: 10px;
    }

    /* 1. 기획 의도 */
    .reason-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 18px;
    }

    .reason-item {
      background-color: var(--primary-light);
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid var(--primary);
    }

    .reason-item h4 {
      margin-bottom: 8px;
      color: var(--primary-dark);
      font-size: 1.05rem;
    }

    .reason-item p {
      font-size: 0.93rem;
      color: var(--text-main);
    }

    /* 2. 사용 기술 */
    .tech-group {
      margin-bottom: 16px;
    }

    .tech-group h4 {
      font-size: 1rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .badge-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 6px;
      background: #f1f3f5;
      color: #333333;
    }

    .badge.backend { background: #e3f2fd; color: #1565c0; }
    .badge.frontend { background: #fff3e0; color: #e65100; }
    .badge.db { background: #ede7f6; color: #4527a0; }
    .badge.infra { background: #fbe9e7; color: #d84315; }

    /* 3. 제작 기간 */
    .timeline {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
      margin-top: 15px;
    }

    .timeline-step {
      border: 1px solid var(--border-color);
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      background-color: #fafafa;
    }

    .timeline-step .week {
      font-weight: bold;
      color: var(--primary);
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .timeline-step .task {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .timeline-step .desc {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* 4. 핵심 기능 */
    .features-list {
      list-style: none;
    }

    .features-list li {
      position: relative;
      padding-left: 26px;
      margin-bottom: 14px;
      font-size: 0.98rem;
    }

    .features-list li::before {
      content: "✔";
      position: absolute;
      left: 0;
      top: 0;
      color: var(--primary);
      font-weight: bold;
    }

    footer {
      text-align: center;
      padding: 30px 20px;
      color: var(--text-muted);
      font-size: 0.88rem;
    }
  </style>
</head>
<body>

  <header>
    <h1>🌱 치커리 (Chicory)</h1>
    <p>스마트 냉장고 식재료 소비기한 관리 & 보유 식재료 맞춤형 레시피 공유 플랫폼</p>
  </header>

  <div class="container">
    
    <!-- 1. 만든 이유 -->
    <section class="card">
      <h2 class="card-title">💡 1. 기획 의도 및 배경</h2>
      <div class="reason-grid">
        <div class="reason-item">
          <h4>냉장고 속 낭비 방지</h4>
          <p>보관한 지 오래되어 버려지는 식재료 폐기물을 줄이고, 소비기한 임박 상태를 시각화하여 계획적인 소비를 유도합니다.</p>
        </div>
        <div class="reason-item">
          <h4>"오늘 뭐 먹지?" 고민 해결</h4>
          <p>새로 장을 보지 않고도 현재 냉장고에 보관 중인 재료만으로 즉시 조리할 수 있는 최적의 레시피를 일치율 순으로 매칭합니다.</p>
        </div>
        <div class="reason-item">
          <h4>자취생·1인 가구 커뮤니티</h4>
          <p>소량 규격화된 식자재 활용 꿀팁과 혼밥 맞춤형 대체 재료 노하우를 자유롭게 공유할 수 있는 공간을 제공합니다.</p>
        </div>
      </div>
    </section>

    <!-- 2. 사용 기술 -->
    <section class="card">
      <h2 class="card-title">🛠 2. 사용 기술 (Tech Stack)</h2>
      
      <div class="tech-group">
        <h4>Backend Core & Security</h4>
        <div class="badge-wrap">
          <span class="badge backend">Java 17</span>
          <span class="badge backend">Spring Boot 3.x</span>
          <span class="badge backend">Spring Security</span>
          <span class="badge backend">JWT (JSON Web Token)</span>
        </div>
      </div>

      <div class="tech-group">
        <h4>Database & ORM</h4>
        <div class="badge-wrap">
          <span class="badge db">MySQL</span>
          <span class="badge db">Spring Data JPA (Hibernate)</span>
          <span class="badge db">Querydsl (동적 검색 & 태그 필터링)</span>
        </div>
      </div>

      <div class="tech-group">
        <h4>Frontend Interface</h4>
        <div class="badge-wrap">
          <span class="badge frontend">React</span>
          <span class="badge frontend">JavaScript (ES6+)</span>
          <span class="badge frontend">Axios (인터셉터 토큰 주입)</span>
          <span class="badge frontend">HTML5 / CSS3 (모바일 반응형)</span>
        </div>
      </div>

      <div class="tech-group">
        <h4>Infrastructure & DevOps</h4>
        <div class="badge-wrap">
          <span class="badge infra">Git / GitHub</span>
          <span class="badge infra">Docker</span>
          <span class="badge infra">AWS EC2</span>
        </div>
      </div>
    </section>

    <!-- 3. 제작 기간 및 일정 -->
    <section class="card">
      <h2 class="card-title">⏱ 3. 제작 기간 (총 4~5주 설계)</h2>
      <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 10px;">
        1인 풀스택 개발 및 기획부터 클라우드 배포까지 전 과정을 완주한 표준 스프린트 일정입니다.
      </p>
      <div class="timeline">
        <div class="timeline-step">
          <div class="week">1주차</div>
          <div class="task">기획 및 설계</div>
          <div class="desc">도메인 분석, ERD 모델링, RESTful API 규격 명세</div>
        </div>
        <div class="timeline-step">
          <div class="week">2주차</div>
          <div class="task">백엔드 기반 구축</div>
          <div class="desc">Spring Security, JWT 인증 체계, 식재료/냉장고 CRUD</div>
        </div>
        <div class="timeline-step">
          <div class="week">3주차</div>
          <div class="task">핵심 알고리즘 & Querydsl</div>
          <div class="desc">재료 일치율 추천 알고리즘, 복합 태그 동적 검색 최적화</div>
        </div>
        <div class="timeline-step">
          <div class="week">4주차</div>
          <div class="task">React 연동 및 트러블슈팅</div>
          <div class="desc">반응형 카드 수납 UI, 무한 스크롤, Axios 에러 핸들링</div>
        </div>
        <div class="timeline-step">
          <div class="week">5주차</div>
          <div class="task">배포 및 최적화</div>
          <div class="desc">Docker 컨테이너라이징, AWS EC2 배포 및 피드백 수정</div>
        </div>
      </div>
    </section>

    <!-- 4. 핵심 구현 포인트 -->
    <section class="card">
      <h2 class="card-title">🚀 4. 핵심 기술적 구현 사항</h2>
      <ul class="features-list">
        <li>
          <strong>보유 식재료 매칭 기반 레시피 추천</strong>: 등록된 냉장고 재고와 레시피 필요 재료를 교차 대조하여 일치율(Match Rate) 순으로 요리를 추천
        </li>
        <li>
          <strong>Querydsl 다중 조건 동적 쿼리</strong>: 카테고리, 난이도, 복수 재료 태그(AND/OR) 조건을 `BooleanBuilder`로 동적 바인딩하여 쿼리 성능 최적화
        </li>
        <li>
          <strong>No-Offset 페이징을 통한 성능 개선</strong>: 대용량 레시피 목록 조회 시 `OFFSET` 탐색 비용을 줄이기 위해 직전 ID 기준 커서 방식(Slice) 적용
        </li>
        <li>
          <strong>D-Day 소비기한 시각화</strong>: 냉장/냉동/실온 보관 유형별 임박 상태(위험/주의/안전) 자동 계산 및 직관적 반응형 카드 UI 제공
        </li>
      </ul>
    </section>

  </div>

  <footer>
    <p>© Chicory Project. Designed & Developed by 이재웅</p>
  </footer>

</body>
</html>
